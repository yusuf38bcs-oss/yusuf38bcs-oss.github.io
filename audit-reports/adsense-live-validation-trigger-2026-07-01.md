# AdSense Live Validation Trigger

Date: 2026-07-01
Purpose: Trigger a fresh production build after duplicate/thin-content cleanup while AdSense review is under way.

Public output impact: None. The audit-reports directory is excluded from Jekyll output in _config.yml.

Validation targets:
- Homepage should render the latest hero: Where Biology Meets Life.
- Biology hub should remove the duplicate underscore Measures of Central Tendency collection node.
- Old underscore URL should render a noindex redirect to the canonical hyphen URL.
- Legal footer routes should remain available.
