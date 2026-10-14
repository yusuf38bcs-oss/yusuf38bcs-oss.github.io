#!/usr/bin/env python3
"""Require the homepage body class as a token, accepting additional classes."""
from html.parser import HTMLParser
from pathlib import Path
import sys

class HomepageBody(HTMLParser):
    def __init__(self):
        super().__init__()
        self.bodies = []
    def handle_starttag(self, tag, attrs):
        if tag == "body":
            self.bodies.append(dict(attrs).get("class", "").split())

def validate(html):
    parser = HomepageBody()
    parser.feed(html)
    return len(parser.bodies) == 1 and "lbfl-home-v3" in parser.bodies[0]

if __name__ == "__main__":
    if not validate(Path(sys.argv[1]).read_text(encoding="utf-8")):
        raise SystemExit("Homepage v3 body root missing")
    print("Homepage v3 body class token: PASS")
