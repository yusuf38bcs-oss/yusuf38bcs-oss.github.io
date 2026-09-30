#!/usr/bin/env python3
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONTRACT = ROOT / "_data" / "academic" / "course_contract_v1.json"
REPORT = ROOT / "academic-course-contract-report.json"
SHA40 = re.compile(r"^[0-9a-f]{40}$")

errors = []
warnings = []

def fail(message):
    errors.append(message)

def require(condition, message):
    if not condition:
        fail(message)

def load_contract():
    try:
        return json.loads(CONTRACT.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"Cannot parse {CONTRACT.relative_to(ROOT)}: {exc}")
        return {}

def discover_gateways(contract):
    discovered = set()
    discovery = contract.get("gateway_discovery", {})
    for pattern in discovery.get("patterns", []):
        for path in ROOT.glob(pattern):
            if path.is_file():
                discovered.add(path.relative_to(ROOT).as_posix())
    for item in discovery.get("explicit_files", []):
        path = ROOT / item
        if path.is_file():
            discovered.add(item)
        else:
            fail(f"Explicit gateway file does not exist: {item}")
    return discovered

def check_cycles(graph):
    visiting = set()
    visited = set()
    def walk(node, trail):
        if node in visiting:
            fail("Prerequisite cycle: " + " -> ".join(trail + [node]))
            return
        if node in visited:
            return
        visiting.add(node)
        for nxt in graph.get(node, []):
            walk(nxt, trail + [node])
        visiting.remove(node)
        visited.add(node)
    for node in graph:
        walk(node, [])

def main():
    contract = load_contract()
    require(contract.get("schema") == "lbfl-academic-course-contract-v1", "Unexpected contract schema")
    require(contract.get("version") == "CONV-00B-1.0.0", "Unexpected CONV-00B contract version")
    base = contract.get("authorized_base_sha", "")
    require(bool(SHA40.fullmatch(base)), "authorized_base_sha must be a lowercase 40-character SHA")

    pathways = contract.get("pathways")
    require(isinstance(pathways, list) and pathways, "pathways must be a non-empty list")
    if not isinstance(pathways, list):
        pathways = []

    ids = {}
    canonical_routes = {}
    gateway_files = {}
    module_routes = {}
    module_route_refs = {}
    strict_count = 0
    progressive_count = 0
    module_count = 0

    required = {
        "course_id", "title", "academic_level", "pathway_kind", "canonical_route",
        "gateway_files", "authority", "status", "enforcement", "prerequisites",
        "assessment", "legacy_routes"
    }

    for course in pathways:
        if not isinstance(course, dict):
            fail("Each pathway must be an object")
            continue
        cid = course.get("course_id", "<missing>")
        missing = sorted(required - set(course))
        if missing:
            fail(f"{cid}: missing fields: {', '.join(missing)}")
        if cid in ids:
            fail(f"Duplicate course_id: {cid}")
        ids[cid] = course

        route = course.get("canonical_route", "")
        require(route.startswith("/") and route.endswith("/"), f"{cid}: canonical_route must start/end with /")
        if route in canonical_routes:
            fail(f"Duplicate canonical_route {route}: {canonical_routes[route]} and {cid}")
        canonical_routes[route] = cid

        enforcement = course.get("enforcement")
        status = course.get("status")
        require(enforcement in {"strict", "progressive"}, f"{cid}: invalid enforcement {enforcement!r}")
        require(status in {"governed", "convergence-pending"}, f"{cid}: invalid status {status!r}")
        require(isinstance(course.get("authority"), dict) and bool(course.get("authority", {}).get("label")), f"{cid}: authority label required")
        require(isinstance(course.get("assessment"), dict) and bool(course.get("assessment", {}).get("mode")), f"{cid}: assessment mode required")

        gf = course.get("gateway_files", [])
        require(isinstance(gf, list) and gf, f"{cid}: gateway_files must be non-empty")
        for item in gf if isinstance(gf, list) else []:
            p = ROOT / item
            require(p.is_file(), f"{cid}: gateway file missing: {item}")
            if item in gateway_files:
                fail(f"Gateway file registered twice: {item}")
            gateway_files[item] = cid

        legacy = course.get("legacy_routes", [])
        require(isinstance(legacy, list), f"{cid}: legacy_routes must be a list")
        for old in legacy if isinstance(legacy, list) else []:
            require(old.startswith("/") and old.endswith("/"), f"{cid}: invalid legacy route {old}")
            if old == route:
                fail(f"{cid}: legacy route duplicates canonical route")

        prereqs = course.get("prerequisites", [])
        require(isinstance(prereqs, list), f"{cid}: prerequisites must be a list")

        if enforcement == "strict":
            strict_count += 1
            require(status == "governed", f"{cid}: strict pathway must be governed")
            mods = course.get("modules")
            require(isinstance(mods, list) and mods, f"{cid}: strict pathway requires modules")
            if not isinstance(mods, list):
                mods = []
            orders = [m.get("order") for m in mods if isinstance(m, dict)]
            require(orders == list(range(1, len(mods) + 1)), f"{cid}: module orders must be contiguous from 1")
            local_ids = []
            for idx, mod in enumerate(mods):
                if not isinstance(mod, dict):
                    fail(f"{cid}: module {idx+1} must be an object")
                    continue
                for key in ("module_id", "order", "title", "source_file", "route", "previous", "next"):
                    if key not in mod:
                        fail(f"{cid}: module {idx+1} missing {key}")
                mid = mod.get("module_id")
                local_ids.append(mid)
                src = mod.get("source_file", "")
                require((ROOT / src).is_file(), f"{cid}/{mid}: module source missing: {src}")
                mroute = mod.get("route", "")
                require(mroute.startswith("/") and mroute.endswith("/"), f"{cid}/{mid}: invalid route {mroute}")
                if mroute in module_routes:
                    fail(f"Duplicate module route {mroute}: {module_routes[mroute]} and {cid}/{mid}")
                module_routes[mroute] = f"{cid}/{mid}"
                pathway_ref = mod.get("pathway_ref")
                if pathway_ref is not None:
                    require(pathway_ref in ids, f"{cid}/{mid}: unknown pathway_ref {pathway_ref}")
                    require(pathway_ref != cid, f"{cid}/{mid}: self pathway_ref is forbidden")
                    module_route_refs[mroute] = pathway_ref
                expected_prev = None if idx == 0 else mods[idx-1].get("module_id")
                expected_next = None if idx == len(mods)-1 else mods[idx+1].get("module_id")
                require(mod.get("previous") == expected_prev, f"{cid}/{mid}: previous must be {expected_prev!r}")
                require(mod.get("next") == expected_next, f"{cid}/{mid}: next must be {expected_next!r}")
                module_count += 1
            require(len(local_ids) == len(set(local_ids)), f"{cid}: duplicate module_id")
        else:
            progressive_count += 1
            require(status == "convergence-pending", f"{cid}: progressive pathway must be convergence-pending")
            require(bool(course.get("convergence_target")), f"{cid}: progressive pathway requires convergence_target")
            require(isinstance(course.get("convergence_wave"), int), f"{cid}: progressive pathway requires integer convergence_wave")

    for cid, course in ids.items():
        for prereq in course.get("prerequisites", []):
            require(prereq in ids, f"{cid}: unknown prerequisite {prereq}")
            require(prereq != cid, f"{cid}: self prerequisite is forbidden")

    graph = {cid: list(course.get("prerequisites", [])) for cid, course in ids.items()}
    check_cycles(graph)

    discovered = discover_gateways(contract)
    registered = set(gateway_files)
    for item in sorted(discovered - registered):
        fail(f"Unregistered academic gateway discovered: {item}")
    for item in sorted(registered - discovered):
        fail(f"Registered gateway is outside discovery contract or missing: {item}")

    canonical_set = set(canonical_routes)
    for route, owner in module_routes.items():
        if route in canonical_set:
            canonical_owner = canonical_routes[route]
            declared_ref = module_route_refs.get(route)
            if declared_ref != canonical_owner:
                fail(
                    f"Module route collides with canonical pathway route {route}: "
                    f"{owner} must declare pathway_ref={canonical_owner}"
                )

    report = {
        "schema": contract.get("schema"),
        "version": contract.get("version"),
        "authorized_base_sha": base,
        "pathways": len(pathways),
        "strict_pathways": strict_count,
        "progressive_pathways": progressive_count,
        "strict_modules": module_count,
        "discovered_gateways": len(discovered),
        "registered_gateways": len(registered),
        "warnings": warnings,
        "errors": errors,
        "result": "PASS" if not errors else "FAIL",
    }
    REPORT.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))

    if errors:
        return 1
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
