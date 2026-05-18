# Cloudflare Hello World → Custom Domain Setup

## 1. Add Your Domain to Cloudflare

Go to:

https://dash.cloudflare.com

Then:

- Add Site
- Enter:

learningbiologyforlife.org

- Choose Free Plan

---

# 2. Change Nameservers

Cloudflare will provide:

ns1.cloudflare.com
ns2.cloudflare.com

Go to your domain registrar and replace old nameservers.

---

# 3. Add GitHub Pages Custom Domain

GitHub Repository → Settings → Pages

Custom Domain:

learningbiologyforlife.org

Save.

Enable:

✔ Enforce HTTPS

---

# 4. Create CNAME File

Inside repository root:

CNAME

Content:

learningbiologyforlife.org

---

# 5. Cloudflare DNS Records

Add these DNS records:

Type: A
Name: @
Content: 185.199.108.153

Type: A
Name: @
Content: 185.199.109.153

Type: A
Name: @
Content: 185.199.110.153

Type: A
Name: @
Content: 185.199.111.153

Type: CNAME
Name: www
Content: yusuf38bcs-oss.github.io

Proxy Status:

DNS Only (gray cloud)

---

# 6. Cloudflare SSL Settings

SSL/TLS → Overview

Set:

Full

Then:

SSL/TLS → Edge Certificates

Enable:

✔ Always Use HTTPS
✔ Automatic HTTPS Rewrites
✔ Minimum TLS 1.2

---

# 7. Redirect WWW to Root Domain

Rules → Redirect Rules

Expression:

http.host eq "www.learningbiologyforlife.org"

Destination:

https://learningbiologyforlife.org/$1

Status:

301

---

# 8. Cache Optimization

Speed → Optimization

Enable:

✔ Auto Minify CSS
✔ Auto Minify JS
✔ Auto Minify HTML
✔ Brotli
✔ Early Hints

---

# 9. Security Recommendations

Security → Settings

Set:

Security Level: Medium

Enable:

✔ Bot Fight Mode
✔ Browser Integrity Check

---

# 10. Final Result

You will get:

https://learningbiologyforlife.org

Connected with:

- GitHub Pages
- Cloudflare CDN
- HTTPS
- DNS acceleration
- DDoS protection
- Edge caching
- AI-ready infrastructure
