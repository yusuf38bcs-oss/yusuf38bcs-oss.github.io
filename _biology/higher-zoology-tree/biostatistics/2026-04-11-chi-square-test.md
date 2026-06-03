---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "à¦•à¦¾à¦‡-à¦¬à¦°à§à¦— à¦ªà¦°à§€à¦•à§à¦·à¦¾ (Chi-square Test) "
date: 2026-04-11T09:53:00.007Z
categories:
  - Biostatistics

node_id: chi_square_test
---

<p></p><div class="separator" style="clear: both; text-align: center;"><a href="https://blogger.googleusercontent.com/img/a/AVvXsEgTCqRrk8TmLuAEgUkmepnqVKei-SCf2JxM7vEzGXV2niZWa9T2_di0OPAOWiKNOBEcMiPV7QSIbBG3YHUjYJ8ZTj2GBvnUKCeL2iYtlF2UmiZMcn350VUdbGYvt-zH0QMCvsWTDdZyYJHMXqVbxmshuVe99yAI1vT1KhPnjc3ShHt93UEY_GnbL7Y3dKU" style="margin-left: 1em; margin-right: 1em;"><img alt="" data-original-height="559" data-original-width="1024" height="175" src="https://blogger.googleusercontent.com/img/a/AVvXsEgTCqRrk8TmLuAEgUkmepnqVKei-SCf2JxM7vEzGXV2niZWa9T2_di0OPAOWiKNOBEcMiPV7QSIbBG3YHUjYJ8ZTj2GBvnUKCeL2iYtlF2UmiZMcn350VUdbGYvt-zH0QMCvsWTDdZyYJHMXqVbxmshuVe99yAI1vT1KhPnjc3ShHt93UEY_GnbL7Y3dKU" width="320" /></a></div><br />&nbsp;<p></p>
</meta>
</meta>
<link href="https://fonts.googleapis.com/css2?family=Tiro+Bangla&amp;family=Inter:wght@400;600;700&amp;display=swap" rel="stylesheet"></link>

<style>
    /* à¦¹à¦¿à¦°à§‹ à¦¸à§‡à¦•à¦¶à¦¨ à¦¸à§à¦Ÿà¦¾à¦‡à¦² */
    .feature-hero-junction {
        background: linear-gradient(135deg, rgba(22, 160, 133, 0.9) 0%, rgba(44, 62, 80, 0.8) 100%), 
                    url('https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=1200');
        background-size: cover;
        background-position: center;
        height: 380px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 40px;
        box-shadow: 0 10px 30px rgba(22, 160, 133, 0.2);
        border-bottom: 6px solid #16a085;
        overflow: hidden;
    }

    .hero-overlay {
        text-align: center;
        padding: 30px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        max-width: 85%;
    }

    .hero-main-title {
        color: #ffffff !important;
        font-size: 38px !important;
        font-weight: 900 !important;
        margin: 10px 0 !important;
        font-family: 'Tiro Bangla', serif;
    }

    .cyan-text { color: #00e5ff; }

    /* à¦®à§‡à¦‡à¦¨ à¦•à¦¨à§à¦Ÿà§‡à¦‡à¦¨à¦¾à¦° */
    .biology-lecture-container {
        font-family: 'Inter', 'Tiro Bangla', sans-serif;
        line-height: 1.8;
        color: #2c3e50;
        max-width: 850px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
    }

    h2 { color: #16a085; border-bottom: 2px solid #16a085; padding-bottom: 10px; margin-top: 30px; }

    .intro-box {
        padding: 25px;
        background-color: #f1f8f7;
        border-left: 5px solid #16a085;
        font-size: 1.1em;
        margin-bottom: 25px;
        border-radius: 0 10px 10px 0;
    }

    details {
        background: #f9f9f9;
        padding: 15px 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        margin-bottom: 15px;
        transition: all 0.3s ease;
    }

    details[open] { background: #fff; border-color: #16a085; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

    summary {
        font-weight: 700;
        cursor: pointer;
        color: #2c3e50;
        font-size: 1.15em;
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .formula-box {
        background: #f4f7f6;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        font-size: 1.3em;
        margin: 15px 0;
        border: 1px dashed #16a085;
    }

    .biostat-table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
    }

    .biostat-table th { background: #16a085; color: white; padding: 12px; }
    .biostat-table td { border: 1px solid #ddd; padding: 10px; text-align: center; }

    .tip-box {
        background-color: #e8f4fd;
        border: 1px solid #3498db;
        padding: 20px;
        border-radius: 10px;
        margin-top: 30px;
    }
</style>
<div class="biology-lecture-container">

    <div class="feature-hero-junction">
        <div class="hero-overlay">
            <h2 class="hero-main-title">à¦•à¦¾à¦‡-à¦¬à¦°à§à¦— à¦ªà¦°à§€à¦•à§à¦·à¦¾ <br /><span class="cyan-text">(Chi-square Test)</span></h2>
            <div style="background: #00e5ff; height: 3px; margin: 15px auto; width: 50px;"></div>
            <p style="color: #e0f7fa; font-size: 18px;">à¦—à§à¦¡à¦¨à§‡à¦¸ à¦…à¦« à¦«à¦¿à¦Ÿ à¦à¦¬à¦‚ à¦•à¦¨à§à¦Ÿà¦¿à¦¨à¦œà§‡à¦¨à§à¦¸à¦¿ à¦Ÿà§‡à¦¬à¦¿à¦² à¦¬à¦¿à¦¶à§à¦²à§‡à¦·à¦£</p>
        </div>
    </div>

    <div class="intro-box">
        à¦…à¦¨à¦¾à¦°à§à¦¸ à§ªà¦°à§à¦¥ à¦¬à¦°à§à¦·à§‡à¦° à¦œà§€à¦¬à¦ªà¦°à¦¿à¦¸à¦‚à¦–à§à¦¯à¦¾à¦¨ (Biostatistics) à¦•à§‹à¦°à§à¦¸à§‡ <strong>Chi-square (Ï‡Â²) test</strong> à¦à¦•à¦Ÿà¦¿ à¦…à¦¤à§à¦¯à¦¨à§à¦¤ à¦°à§‹à¦®à¦¾à¦žà§à¦šà¦•à¦° à¦¬à¦¿à¦·à§Ÿà¥¤ à¦¬à¦¿à¦¶à§‡à¦· à¦•à¦°à§‡ à¦¬à¦‚à¦¶à¦—à¦¤à¦¿à¦¬à¦¿à¦¦à§à¦¯à¦¾ à¦¬à¦¾ à¦œà§‡à¦¨à§‡à¦Ÿà¦¿à¦•à§à¦¸à§‡à¦° (Mendelian Genetics) à¦—à¦¬à§‡à¦·à¦£à¦¾à§Ÿ à¦à¦Ÿà¦¿ à¦…à¦ªà¦°à¦¿à¦¹à¦¾à¦°à§à¦¯à¥¤ à§§à§¯à§¦à§¦ à¦¸à¦¾à¦²à§‡ à¦•à¦¾à¦°à§à¦² à¦ªà¦¿à¦¯à¦¼à¦¾à¦°à¦¸à¦¨ à¦à¦‡ à¦ªà¦°à§€à¦•à§à¦·à¦¾à¦Ÿà¦¿ à¦‰à¦¦à§à¦­à¦¾à¦¬à¦¨ à¦•à¦°à§‡à¦¨à¥¤
    </div>

    

    <details open="">
        <summary>à§§. à¦—à§à¦¡à¦¨à§‡à¦¸ à¦…à¦« à¦«à¦¿à¦Ÿ (Goodness of Fit)</summary>
        <div style="padding-top: 15px;">
            <p>à¦à¦Ÿà¦¿ à¦¯à¦¾à¦šà¦¾à¦‡ à¦•à¦°à§‡ à¦¯à§‡, à¦†à¦®à¦¾à¦¦à§‡à¦° à¦¸à¦‚à¦—à§ƒà¦¹à§€à¦¤ à¦‰à¦ªà¦¾à¦¤à§à¦¤ à¦•à§‹à¦¨à§‹ à¦¨à¦¿à¦°à§à¦¦à¦¿à¦·à§à¦Ÿ à¦¤à¦¾à¦¤à§à¦¤à§à¦¬à¦¿à¦• à¦…à¦¨à§à¦ªà¦¾à¦¤à¦•à§‡ (à¦¯à§‡à¦®à¦¨- à¦®à§‡à¦¨à§à¦¡à§‡à¦²à§‡à¦° à§©:à§§ à¦…à¦¨à§à¦ªà¦¾à¦¤) à¦®à§‡à¦¨à§‡ à¦šà¦²à§‡ à¦•à¦¿ à¦¨à¦¾à¥¤</p>
            <div class="formula-box">
                Ï‡Â² = Î£ [ (O - E)Â² / E ]
            </div>
            <p>à¦à¦–à¦¾à¦¨à§‡, O = à¦ªà¦°à§à¦¯à¦¬à§‡à¦•à§à¦·à¦£à¦•à§ƒà¦¤ à¦®à¦¾à¦¨ à¦à¦¬à¦‚ E = à¦ªà§à¦°à¦¤à§à¦¯à¦¾à¦¶à¦¿à¦¤ à¦®à¦¾à¦¨à¥¤</p>
        </div>
    </details>

    <details>
        <summary>ðŸ“Š à¦—à¦¾à¦£à¦¿à¦¤à¦¿à¦• à¦‰à¦¦à¦¾à¦¹à¦°à¦£: à¦®à§‡à¦¨à§à¦¡à§‡à¦²à§‡à¦° à¦®à¦Ÿà¦°à¦¶à§à¦à¦Ÿà¦¿ à¦ªà¦°à§€à¦•à§à¦·à¦¾</summary>
        <div style="padding-top: 15px;">
            <p><strong>à¦¸à¦®à¦¸à§à¦¯à¦¾:</strong> à§ªà§¦à§¦à¦Ÿà¦¿ à¦—à¦¾à¦›à§‡à¦° à¦®à¦§à§à¦¯à§‡ à§©à§¦à§¦à¦Ÿà¦¿ à¦²à¦®à§à¦¬à¦¾ à¦à¦¬à¦‚ à§§à§¦à§¦à¦Ÿà¦¿ à¦–à¦¾à¦Ÿà§‹à¥¤ à¦à¦Ÿà¦¿ à¦•à¦¿ à§©:à§§ à¦…à¦¨à§à¦ªà¦¾à¦¤ à¦¸à¦®à¦°à§à¦¥à¦¨ à¦•à¦°à§‡?</p>
            <table class="biostat-table">
                <thead>
                    <tr>
                        <th>à¦¬à§ˆà¦¶à¦¿à¦·à§à¦Ÿà§à¦¯</th>
                        <th>O</th>
                        <th>E</th>
                        <th>(O-E)Â²/E</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>à¦²à¦®à§à¦¬à¦¾</td><td>à§©à§¦à§¦</td><td>à§©à§¦à§¦</td><td>à§¦</td></tr>
                    <tr><td>à¦–à¦¾à¦Ÿà§‹</td><td>à§§à§¦à§¦</td><td>à§§à§¦à§¦</td><td>à§¦</td></tr>
                </tbody>
                <tr style="background: #f1f8f7; font-weight: bold;">
                    <td colspan="3">à¦®à§‹à¦Ÿ Ï‡Â² à¦®à¦¾à¦¨</td>
                    <td>à§¦</td>
                </tr>
            </table>
            <p><strong>à¦¸à¦¿à¦¦à§à¦§à¦¾à¦¨à§à¦¤:</strong> à¦¯à§‡à¦¹à§‡à¦¤à§ à¦—à¦£à¦¨à¦¾à¦•à§ƒà¦¤ à¦®à¦¾à¦¨ (à§¦) à¦Ÿà§‡à¦¬à¦¿à¦² à¦®à¦¾à¦¨ (à§©.à§®à§ª) à¦à¦° à¦šà§‡à§Ÿà§‡ à¦›à§‹à¦Ÿ, à¦¤à¦¾à¦‡ à¦à¦Ÿà¦¿ à¦®à§‡à¦¨à§à¦¡à§‡à¦²à§‡à¦° à¦¤à¦¤à§à¦¤à§à¦¬à¦•à§‡ à¦¨à¦¿à¦–à§à¦à¦¤à¦­à¦¾à¦¬à§‡ à¦¸à¦®à¦°à§à¦¥à¦¨ à¦•à¦°à§‡à¥¤</p>
        </div>
    </details>

    

    <details>
        <summary>à§¨. à¦•à¦¨à§à¦Ÿà¦¿à¦¨à¦œà§‡à¦¨à§à¦¸à¦¿ à¦Ÿà§‡à¦¬à¦¿à¦² (Contingency Table)</summary>
        <div style="padding-top: 15px;">
            <p>à¦¯à¦–à¦¨ à¦¦à§à¦Ÿà¦¿ à¦¬à§ˆà¦¶à¦¿à¦·à§à¦Ÿà§à¦¯à§‡à¦° à¦®à¦§à§à¦¯à§‡ à¦•à§‹à¦¨à§‹ à¦¸à¦®à§à¦ªà¦°à§à¦• à¦†à¦›à§‡ à¦•à¦¿ à¦¨à¦¾ à¦¤à¦¾ à¦¯à¦¾à¦šà¦¾à¦‡ à¦•à¦°à¦¾ à¦¹à§Ÿ (à¦¯à§‡à¦®à¦¨- à¦§à§‚à¦®à¦ªà¦¾à¦¨ à¦à¦¬à¦‚ à¦«à§à¦¸à¦«à§à¦¸à§‡à¦° à¦•à§à¦¯à¦¾à¦¨à§à¦¸à¦¾à¦°à§‡à¦° à¦¸à¦®à§à¦ªà¦°à§à¦•), à¦¤à¦–à¦¨ à¦à¦Ÿà¦¿ à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¾ à¦¹à§Ÿà¥¤ à¦à¦•à§‡ <strong>Test of Independence</strong>-à¦“ à¦¬à¦²à¦¾ à¦¹à§Ÿà¥¤</p>
            <p><strong>à¦¸à§à¦¬à¦¾à¦§à§€à¦¨à¦¤à¦¾à¦° à¦®à¦¾à¦¤à§à¦°à¦¾ (df):</strong> df = (r - 1)(c - 1)</p>
            
        </div>
    </details>

    <details>
        <summary>âš ï¸ Chi-square à¦Ÿà§‡à¦¸à§à¦Ÿà§‡à¦° à¦¶à¦°à§à¦¤à¦¾à¦¬à¦²à§€</summary>
        <div style="padding-top: 15px;">
            <ul style="list-style-type: disc; padding-left: 20px;">
                <li>à¦®à§‹à¦Ÿ à¦¨à¦®à§à¦¨à¦¾ à¦¸à¦‚à¦–à§à¦¯à¦¾ (N) à¦…à¦¨à§à¦¤à¦¤ à§«à§¦ à¦¹à¦¤à§‡ à¦¹à¦¬à§‡à¥¤</li>
                <li>à¦•à§‹à¦¨à§‹ à¦¸à§‡à¦²à§‡à¦° à¦ªà§à¦°à¦¤à§à¦¯à¦¾à¦¶à¦¿à¦¤ à¦®à¦¾à¦¨ (E) à§«-à¦à¦° à¦•à¦® à¦¹à¦“à§Ÿà¦¾ à¦‰à¦šà¦¿à¦¤ à¦¨à§Ÿà¥¤</li>
                <li>à¦‰à¦ªà¦¾à¦¤à§à¦¤à¦—à§à¦²à§‹ à¦…à¦¬à¦¶à§à¦¯à¦‡ à¦—à¦£à¦¸à¦‚à¦–à§à¦¯à¦¾ (Frequency) à¦¹à¦¤à§‡ à¦¹à¦¬à§‡, à¦•à§‹à¦¨à§‹ à¦¶à¦¤à¦¾à¦‚à¦¶ à¦¨à§Ÿà¥¤</li>
            </ul>
        </div>
    </details>

    <div class="tip-box">
        <h4>ðŸ’¡ à¦¬à§à¦²à¦—à¦¾à¦° à¦Ÿà¦¿à¦ªà¦¸:</h4>
        <p>à¦†à¦ªà¦¨à¦¾à¦° à¦¶à¦¿à¦•à§à¦·à¦¾à¦°à§à¦¥à§€à¦¦à§‡à¦° à¦¬à§à¦à¦¿à§Ÿà§‡ à¦¦à§‡à¦¬à§‡à¦¨ à¦¯à§‡, <strong>Ï‡Â² à¦à¦° à¦®à¦¾à¦¨ à¦¯à¦¤ à¦•à¦® à¦¹à¦¬à§‡</strong>, Observed à¦à¦¬à¦‚ Expected à¦®à¦¾à¦¨à§‡à¦° à¦®à¦§à§à¦¯à§‡ à¦®à¦¿à¦² à¦¤à¦¤ à¦¬à§‡à¦¶à¦¿ à¦¹à¦¬à§‡à¥¤ à¦…à¦°à§à¦¥à¦¾à§Ž à¦¨à¦¾à¦¸à§à¦¤à¦¿à¦• à¦•à¦²à§à¦ªà¦¨à¦¾ à¦—à§à¦°à¦¹à¦£ à¦•à¦°à¦¾à¦° à¦¸à¦®à§à¦­à¦¾à¦¬à¦¨à¦¾ à¦¬à¦¾à§œà¦¬à§‡à¥¤</p>
    </div>

</div>

