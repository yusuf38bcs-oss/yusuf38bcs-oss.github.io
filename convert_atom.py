import os
import xml.etree.ElementTree as ET
from datetime import datetime
import re

# --- Configuration ---
POSTS_DIR = "_posts"
ATOM_FILE = "feed.atom" # Make sure this matches your file's name exactly

def clean_title(title):
    """Converts a title into a URL-friendly filename."""
    safe_title = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
    return safe_title if safe_title else "untitled-post"

def convert_atom_to_jekyll():
    print(f"Starting conversion of {ATOM_FILE}...")
    
    os.makedirs(POSTS_DIR, exist_ok=True)

    try:
        tree = ET.parse(ATOM_FILE)
        root = tree.getroot()
    except FileNotFoundError:
        print(f"Error: Could not find '{ATOM_FILE}'. Please ensure it is in the same folder as this script.")
        return
    except ET.ParseError:
        print(f"Error: '{ATOM_FILE}' is not a valid XML/Atom file.")
        return

    ns = {'atom': 'http://www.w3.org/2005/Atom'}
    count = 0

    for entry in root.findall('atom:entry', ns):
        
        title_element = entry.find('atom:title', ns)
        title = title_element.text if title_element is not None and title_element.text else "Untitled"
        
        published_element = entry.find('atom:published', ns)
        if published_element is None:
            continue 
        
        pub_date_str = published_element.text
        try:
            pub_date_obj = datetime.strptime(pub_date_str[:10], "%Y-%m-%d")
            jekyll_date = pub_date_obj.strftime("%Y-%m-%d")
        except ValueError:
            print(f"Skipping post '{title}': Invalid date format.")
            continue
        
        filename = f"{jekyll_date}-{clean_title(title)}.md"
        filepath = os.path.join(POSTS_DIR, filename)
        
        content_element = entry.find('atom:content', ns)
        content = content_element.text if content_element is not None and content_element.text else ""
        
        tags = []
        for category in entry.findall('atom:category', ns):
            term = category.get('term')
            if term and not term.startswith("http://"):
                tags.append(term)
                
        with open(filepath, "w", encoding="utf-8") as f:
            f.write("---\n")
            f.write("layout: single\n")
            f.write("author_profile: true\n")
            f.write("sidebar:\n")
            f.write("  nav: \"synaptic_nav\"\n")
            
            # --- THE FIX IS HERE ---
            # We safely remove quotes first, then write the line.
            safe_yaml_title = title.replace('"', '')
            f.write(f"title: \"{safe_yaml_title}\"\n")
            # -----------------------
            
            f.write(f"date: {pub_date_str}\n")
            
            if tags:
                f.write("categories:\n")
                for tag in tags:
                    f.write(f"  - {tag}\n")
                    
            f.write("---\n\n")
            f.write(content)
            
        count += 1
        print(f"Created: {filename}")

    print(f"\nSuccess! Converted {count} posts into the '{POSTS_DIR}' folder.")

if __name__ == "__main__":
    convert_atom_to_jekyll()