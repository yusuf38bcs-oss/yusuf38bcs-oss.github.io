import os
import re
import html
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.abspath(__file__))
POSTS_DIR = os.path.join(ROOT, '_posts')
FEED_FILE = os.path.join(ROOT, 'feed.atom')

ns = {'atom': 'http://www.w3.org/2005/Atom', 'blogger': 'http://schemas.google.com/blogger/2018'}


def slugify_tag(term):
    term = term.strip().lower()
    term = re.sub(r"[^a-z0-9\s_-]", "", term)
    term = re.sub(r"[\s_]+", "-", term)
    return term.strip("-")


def clean_content(raw_html):
    if not raw_html:
        return ''
    text = raw_html.strip()
    text = html.unescape(text)

    # Strip full HTML document wrappers when present.
    lower = text.lower()
    if '<html' in lower and '</html>' in lower:
        body_match = re.search(r'(?s)<body[^>]*>(.*?)</body>', text, flags=re.IGNORECASE)
        if body_match:
            text = body_match.group(1).strip()
        else:
            html_match = re.search(r'(?s)<html[^>]*>(.*?)</html>', text, flags=re.IGNORECASE)
            if html_match:
                text = html_match.group(1).strip()
    elif '<body' in lower and '</body>' in lower:
        body_match = re.search(r'(?s)<body[^>]*>(.*?)</body>', text, flags=re.IGNORECASE)
        if body_match:
            text = body_match.group(1).strip()

    text = re.sub(r'(?s)<!doctype[^>]*>', '', text, flags=re.IGNORECASE).strip()
    return text


def sanitize_slug(slug):
    slug = slug.strip()
    slug = re.sub(r'\.html$', '', slug, flags=re.IGNORECASE)
    slug = re.sub(r'[<>:"/\\|?*]+', '-', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = slug.strip('-')
    return slug


def existing_slugs():
    slugs = set()
    for f in os.listdir(POSTS_DIR):
        if not f.endswith('.md'):
            continue
        basename = os.path.splitext(f)[0]
        basename = re.sub(r'^[0-9]{4}-[0-9]{2}-[0-9]{2}-', '', basename)
        slugs.add(basename)
    return slugs


def parse_feed():
    root = ET.parse(FEED_FILE).getroot()
    return root.findall('atom:entry', ns)


def yaml_escape(value):
    return value.replace('"', '\\"')


def build_post(entry):
    status_el = entry.find('blogger:status', ns)
    if status_el is None or status_el.text != 'LIVE':
        return None

    type_el = entry.find('blogger:type', ns)
    if type_el is not None and type_el.text == 'PAGE':
        return None

    trashed_el = entry.find('blogger:trashed', ns)
    if trashed_el is not None and trashed_el.text:
        return None

    filename_el = entry.find('blogger:filename', ns)
    if filename_el is None or not filename_el.text:
        return None

    m = re.match(r'^/(\d{4})/(\d{2})/(.+)\.html$', filename_el.text)
    if not m:
        return None

    published = entry.find('atom:published', ns)
    if published is not None and published.text:
        date = published.text[:10]
        published_time = published.text
    else:
        date = f'{m.group(1)}-{m.group(2)}'
        published_time = f'{date}T00:00:00Z'

    raw_slug = m.group(3)
    slug = sanitize_slug(raw_slug)
    if not slug:
        return None

    title_el = entry.find('atom:title', ns)
    title = title_el.text.strip() if title_el is not None and title_el.text else slug.replace('-', ' ').title()

    meta_desc = entry.find('blogger:metaDescription', ns)
    description = meta_desc.text.strip() if meta_desc is not None and meta_desc.text else title

    categories = []
    for c in entry.findall('atom:category', ns):
        term = c.attrib.get('term')
        if not term:
            continue
        cat = slugify_tag(term)
        if cat and cat not in categories:
            categories.append(cat)

    content_el = entry.find('atom:content', ns)
    raw_content = content_el.text if content_el is not None and content_el.text else ''
    content = clean_content(raw_content)

    return {
        'date': date,
        'published': published_time,
        'slug': slug,
        'title': title,
        'description': description,
        'categories': categories,
        'content': content,
    }


def build_front_matter(entry_data):
    lines = [
        '---',
        'layout: single',
        f'title: "{yaml_escape(entry_data["title"])}"',
        f'date: {entry_data["published"]}',
        f'description: "{yaml_escape(entry_data["description"])}"',
    ]
    if entry_data['categories']:
        lines.append('categories:')
        for cat in entry_data['categories']:
            lines.append(f'  - {cat}')
    lines.append('---')
    return '\n'.join(lines)


def write_post(entry_data):
    filename = f"{entry_data['date']}-{entry_data['slug']}.md"
    path = os.path.join(POSTS_DIR, filename)
    if os.path.exists(path):
        return False

    front_matter = build_front_matter(entry_data)
    body = entry_data['content'] or '<!-- restored from feed.atom -->'
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(front_matter)
        f.write('\n')
        f.write(body)
    return True


def main():
    existing = existing_slugs()
    entries = parse_feed()
    restored = 0
    missing = []

    for entry in entries:
        post = build_post(entry)
        if post is None:
            continue
        if post['slug'] in existing:
            continue
        missing.append(post)

    print(f'Found {len(missing)} missing live posts in feed.atom.')

    for post in missing:
        ok = write_post(post)
        if ok:
            restored += 1
            print(f'Wrote {_posts_rel(post)}')
        else:
            print(f'Skipped existing file for {post["slug"]}')

    print(f'Restored {restored} new posts.')


def _posts_rel(entry_data):
    return os.path.join('_posts', f"{entry_data['date']}-{entry_data['slug']}.md")


if __name__ == '__main__':
    main()
