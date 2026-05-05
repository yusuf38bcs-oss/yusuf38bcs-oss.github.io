import os
import xml.etree.ElementTree as ET
from datetime import datetime
import re

# --- Configuration ---
POSTS_DIR = "_posts"
ATOM_FILE = "feed.atom" # Make sure this matches your file's name exactly

def clean_title(title):
    """Converts a title into a URL-friendly filename."""
    # Convert to lowercase and replace non-alphanumeric characters with hyphens
    safe_title = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
    # Provide a fallback if the title is empty after cleaning
    return safe_title if safe_title else "untitled-post"

def convert_atom_to_jekyll():
    print(f"Starting conversion of {ATOM_FILE}...")
    
    # Create the _posts directory if it doesn't exist
    os.makedirs(POSTS_DIR, exist_ok=True)

    # Parse the Atom XML file
    try:
        tree = ET.parse(ATOM_FILE)
        root = tree.getroot()
    except FileNotFoundError:
        print(f"Error: Could not find '{ATOM_FILE}'. Please ensure it is in the same folder as this script.")
        return
    except ET.ParseError:
        print(f"Error: '{ATOM_FILE}' is not a valid XML/Atom file.")
        return

    # Define the Atom namespace to properly search the XML
    ns = {'atom': 'http://www.w3.org/2005/Atom'}

    count = 0
    # Loop through every <entry> tag in the feed
    for entry in root.findall('atom:entry', ns):
        
        # 1. Extract Title
        title_element = entry.find('atom:title', ns)
        title = title_element.text if title_element is not None and title_element.text else "Untitled"
        
        # 2. Extract Date
        published_element = entry.find('atom:published', ns)
        if published_element is None:
            # If there is no publish date, it might be a settings file or draft, skip it
            continue 
        
        pub_date_str = published_element.text
        # Extract just the YYYY-MM-DD part for the filename
        try:
            pub_date_obj = datetime.strptime(pub_date_str[:10], "%Y-%m-%d")
            jekyll_date = pub_date_obj.strftime("%Y-%m-%d")
        except ValueError:
            print(f"Skipping post '{title}': Invalid date format.")
            continue
        
        # 3. Create Filename
        filename = f"{jekyll_date}-{clean_title(title)}.md"
        filepath = os.path.join(POSTS_DIR, filename)
        
        # 4. Extract Content (This contains your Blogger HTML)
        content_element = entry.find('atom:content', ns)
        content = content_element.text if content_element is not None and content_element.text else ""
        
        # 5. Extract Categories/Tags
        tags = []
        for category in entry.findall('atom:category', ns):
            term = category.get('term')
            # Blogger uses specific schema URLs for internal tagging; we only want your actual text tags
            if term and not term.startswith("http://"):
                tags.append(term)
                
        # 6. Write the File
        with open(filepath, "w", encoding="utf-8") as f:
            # Write the YAML Front Matter
            f.write("---\n")
            f.write("layout: single\n")
            f.write("author_profile: true\n")
            f.write("sidebar:\n")
            f.write("  nav: \"synaptic_nav\"\n")
            # Escape quotes in titles to prevent YAML parsing errors
            f.write(f"title: \"{title.replace('\"', '''')}\"\n")
            f.write(f"date: {pub_date_str}\n")
            
            if tags:
                f.write("categories:\n")
                for tag in tags:
                    f.write(f"  - {tag}\n")
                    
            f.write("---\n\n")
            
            # Write the actual blog content below the front matter
            f.write(content)
            
        count += 1
        print(f"Created: {filename}")

    print(f"\nSuccess! Converted {count} posts into the '{POSTS_DIR}' folder.")

# Run the function
if __name__ == "__main__":
    convert_atom_to_jekyll()
