<<<<<<< HEAD
﻿# frozen_string_literal: true
=======
# frozen_string_literal: true

# ==========================================================================
# KNOWLEDGE GRAPH VALIDATOR — Phase 3 Production
# Aborts Jekyll build if neural topology is broken.
# ==========================================================================
>>>>>>> 45e74c6f6e7214893574e310e721e7baf13225fe

Jekyll::Hooks.register :site, :post_read do |site|
  nodes = Array(site.data['neural_nodes'])
  edges = Array(site.data['neural_edges'])
<<<<<<< HEAD
=======

  # ── Normalization ─────────────────────────────────────────────────────
>>>>>>> 45e74c6f6e7214893574e310e721e7baf13225fe
  node_map = {}
  node_ids = Set.new

  nodes.each do |n|
    id = n['id']
<<<<<<< HEAD
    Jekyll.logger.abort_with "KnowledgeGraph:", "Node missing required 'id' field" unless id
    Jekyll.logger.abort_with "KnowledgeGraph:", "Duplicate node_id: #{id}" if node_ids.include?(id)
=======
    unless id
      Jekyll.logger.abort_with "KnowledgeGraph:", "Node missing required 'id' field"
    end
    if node_ids.include?(id)
      Jekyll.logger.abort_with "KnowledgeGraph:", "Duplicate node_id detected: #{id}"
    end
>>>>>>> 45e74c6f6e7214893574e310e721e7baf13225fe
    node_ids << id
    node_map[id] = n
  end

<<<<<<< HEAD
  edges.each_with_index do |edge, idx|
    src, tgt = edge['source'], edge['target']
    Jekyll.logger.abort_with "KnowledgeGraph:", "Edge #{idx} missing source/target" unless src && tgt
    Jekyll.logger.abort_with "KnowledgeGraph:", "Edge #{idx} missing source: #{src}" unless node_ids.include?(src)
    Jekyll.logger.abort_with "KnowledgeGraph:", "Edge #{idx} missing target: #{tgt}" unless node_ids.include?(tgt)
  end

  nodes.each do |n|
    Array(n['prerequisites']).each { |p| Jekyll.logger.abort_with "KnowledgeGraph:", "Node #{n['id']} missing prerequisite: #{p}" unless node_ids.include?(p) }
    Array(n['connects_to']).each    { |c| Jekyll.logger.abort_with "KnowledgeGraph:", "Node #{n['id']} missing connection: #{c}" unless node_ids.include?(c) }
  end

  referenced = Set.new
  edges.each { |e| referenced << e['source']; referenced << e['target'] }
=======
  # ── Missing Edge Validation ───────────────────────────────────────────
  edges.each_with_index do |edge, idx|
    src = edge['source']
    tgt = edge['target']

    unless src && tgt
      Jekyll.logger.abort_with "KnowledgeGraph:", "Edge #{idx} missing source/target"
    end
    unless node_ids.include?(src)
      Jekyll.logger.abort_with "KnowledgeGraph:", "Edge #{idx} references missing source: #{src}"
    end
    unless node_ids.include?(tgt)
      Jekyll.logger.abort_with "KnowledgeGraph:", "Edge #{idx} references missing target: #{tgt}"
    end
  end

  # ── Frontmatter Cross-Reference Validation ────────────────────────────
  nodes.each do |n|
    id = n['id']
    Array(n['prerequisites']).each do |prereq|
      unless node_ids.include?(prereq)
        Jekyll.logger.abort_with "KnowledgeGraph:", "Node #{id} has missing prerequisite: #{prereq}"
      end
    end
    Array(n['connects_to']).each do |conn|
      unless node_ids.include?(conn)
        Jekyll.logger.abort_with "KnowledgeGraph:", "Node #{id} has missing connection: #{conn}"
      end
    end
  end

  # ── Orphan Node Detection ─────────────────────────────────────────────
  referenced = Set.new
  edges.each do |e|
    referenced << e['source']
    referenced << e['target']
  end
>>>>>>> 45e74c6f6e7214893574e310e721e7baf13225fe
  nodes.each do |n|
    Array(n['prerequisites']).each { |p| referenced << p }
    Array(n['connects_to']).each    { |c| referenced << c }
  end
<<<<<<< HEAD
  orphans = node_ids - referenced
  orphans.reject! { |id| node_map[id] && node_map[id]['entry'] == true }
  unless orphans.empty?
    Jekyll.logger.warn "KnowledgeGraph:", "Orphan nodes: #{orphans.to_a.join(', ')} — add 'entry: true' to suppress"
  end

  visiting, visited = Set.new, Set.new
  detect_cycle = lambda do |nid, path|
    return true if visiting.include?(nid)
    return false if visited.include?(nid)
    visiting << nid
    node_map[nid] && Array(node_map[nid]['prerequisites']).each { |prereq|
=======

  orphans = node_ids - referenced
  unless orphans.empty?
    # Allow explicitly tagged entry nodes to be orphans
    orphans.reject! { |id| node_map[id] && node_map[id]['entry'] == true }
    unless orphans.empty?
      Jekyll.logger.warn "KnowledgeGraph:", "Orphan nodes detected (no edges): #{orphans.to_a.join(', ')}"
      Jekyll.logger.warn "KnowledgeGraph:", "Tag with 'entry: true' to suppress, or add edges."
    end
  end

  # ── Circular Reference Detection (Prerequisite DAG) ───────────────────
  visiting = Set.new
  visited  = Set.new
  cycle_path = []

  detect_cycle = lambda do |nid, path|
    return true if visiting.include?(nid)
    return false if visited.include?(nid)

    visiting << nid
    node = node_map[nid]
    return false unless node

    Array(node['prerequisites']).each do |prereq|
>>>>>>> 45e74c6f6e7214893574e310e721e7baf13225fe
      if detect_cycle.call(prereq, path)
        path.unshift(nid)
        return true
      end
<<<<<<< HEAD
    }
=======
    end

>>>>>>> 45e74c6f6e7214893574e310e721e7baf13225fe
    visiting.delete(nid)
    visited << nid
    false
  end

  nodes.each do |n|
    next if visited.include?(n['id'])
    path = []
    if detect_cycle.call(n['id'], path)
<<<<<<< HEAD
      Jekyll.logger.abort_with "KnowledgeGraph:", "Circular prerequisite: #{path.join(' → ')}"
=======
      Jekyll.logger.abort_with "KnowledgeGraph:", "Circular prerequisite detected: #{path.join(' → ')}"
>>>>>>> 45e74c6f6e7214893574e310e721e7baf13225fe
    end
  end

  Jekyll.logger.info "KnowledgeGraph:", "Validated #{nodes.length} nodes, #{edges.length} edges. Topology clean."
<<<<<<< HEAD
end
=======
end
>>>>>>> 45e74c6f6e7214893574e310e721e7baf13225fe
