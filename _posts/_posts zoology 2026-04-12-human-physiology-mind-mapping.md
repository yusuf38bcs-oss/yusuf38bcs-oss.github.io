---
layout: single
author_profile: true
sidebar:
  nav: "synaptic_nav"
title: "Human Physiology: Mind Mapping "
date: 2026-04-12T18:28:03.779Z
categories:
  - Zoology
  - Human Physiology
---

<div class="separator" style="clear: both; text-align: center;"><a href="https://blogger.googleusercontent.com/img/a/AVvXsEhm2u5P-NQLJ8YdTtQsROaIuYLT5GBwtewjibWa5A-uF-c6_dyzeN4MWVzGxwOlyKXR71GlTHLuO1ftmjIdUNZM1G55Tp1A2Mk1weehHulyLGE4NpvGxhBV9lm_-_nlzqIbpGI81wIrrBWe_pXnWRTIzgo9bCu6yjuaWjVxOJ3iNAAexgeINptLQU4XE6g" style="margin-left: 1em; margin-right: 1em;"><img alt="" data-original-height="600" data-original-width="1200" height="160" src="https://blogger.googleusercontent.com/img/a/AVvXsEhm2u5P-NQLJ8YdTtQsROaIuYLT5GBwtewjibWa5A-uF-c6_dyzeN4MWVzGxwOlyKXR71GlTHLuO1ftmjIdUNZM1G55Tp1A2Mk1weehHulyLGE4NpvGxhBV9lm_-_nlzqIbpGI81wIrrBWe_pXnWRTIzgo9bCu6yjuaWjVxOJ3iNAAexgeINptLQU4XE6g" width="320" /></a></div><br />
<html lang="en">
<head>
    <meta charset="UTF-8"></meta>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"></meta>
    <title>Human Physiology Toggled Mind Map</title>
    <style>
        :root {
            --bg-color: #0f172a; /* Dark background like the image */
            --text-color: #f8fafc;
            --root-color: #c7d2fe; /* Light purple for root */
            --root-text: #312e81;
            --level1-color: #bae6fd; /* Light blue for main systems */
            --level1-text: #0c4a6e;
            --level2-color: #bbf7d0; /* Light green for sub-systems */
            --level2-text: #14532d;
            --leaf-color: #dcfce3; /* Paler green for final items */
            --leaf-text: #166534;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            justify-content: center;
            padding: 40px 20px;
            margin: 0;
            line-height: 1.6;
        }

        .mindmap-container {
            width: 100%;
            max-width: 800px;
            background: rgba(255, 255, 255, 0.05);
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        h2 {
            text-align: center;
            margin-top: 0;
            margin-bottom: 30px;
            color: var(--text-color);
            font-weight: 300;
            letter-spacing: 1px;
        }

        ul, #myUL {
            list-style-type: none;
            padding-left: 25px;
            margin: 0;
        }

        #myUL {
            padding-left: 0;
        }

        li {
            margin: 8px 0;
            position: relative;
        }

        /* The togglable nodes */
        .caret {
            cursor: pointer;
            user-select: none;
            display: inline-block;
            padding: 10px 16px;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            position: relative;
        }

        .caret::before {
            content: "\25B6";
            color: rgba(0,0,0,0.5);
            display: inline-block;
            margin-right: 8px;
            font-size: 12px;
            transition: transform 0.3s ease;
        }

        .caret-down::before {
            transform: rotate(90deg);
        }

        /* Colors for different hierarchy levels */
        .root > .caret {
            background-color: var(--root-color);
            color: var(--root-text);
            font-size: 1.2rem;
            width: 100%;
            box-sizing: border-box;
            text-align: center;
        }

        .system > .caret {
            background-color: var(--level1-color);
            color: var(--level1-text);
            font-size: 1.1rem;
        }

        .sub-system > .caret {
            background-color: var(--level2-color);
            color: var(--level2-text);
            font-size: 1rem;
        }

        /* The leaf nodes (no children) */
        .leaf {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 8px;
            background-color: var(--leaf-color);
            color: var(--leaf-text);
            font-size: 0.95rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
            margin-left: 20px;
        }

        /* Hover effects */
        .caret:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .leaf:hover { filter: brightness(1.05); }

        /* The nested lists (hidden by default) */
        .nested {
            display: none;
            padding-top: 5px;
            padding-bottom: 5px;
            border-left: 2px solid rgba(255,255,255,0.2);
            margin-left: 20px;
        }

        .active {
            display: block;
            animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }

    </style>
</head>
<body>

<div class="mindmap-container">
    <h2>Interactive Physiology Map</h2>
    <ul id="myUL">
        <li class="root">
            <span class="caret caret-down">Human Physiology</span>
            <ul class="nested active">
                
                <li class="system">
                    <span class="caret">Digestive System</span>
                    <ul class="nested">
                        <li class="sub-system">
                            <span class="caret">Alimentary Canal</span>
                            <ul class="nested">
                                <li><span class="leaf">Mouth and Oral Cavity</span></li>
                                <li><span class="leaf">Pharynx and Oesophagus</span></li>
                                <li><span class="leaf">Stomach</span></li>
                                <li><span class="leaf">Small Intestine</span></li>
                                <li><span class="leaf">Large Intestine</span></li>
                                <li><span class="leaf">Anus</span></li>
                            </ul>
                        </li>
                        <li class="sub-system">
                            <span class="caret">Digestive Glands</span>
                            <ul class="nested">
                                <li><span class="leaf">Salivary Glands</span></li>
                                <li><span class="leaf">Liver</span></li>
                                <li><span class="leaf">Pancreas</span></li>
                                <li><span class="leaf">Gastric Glands</span></li>
                                <li><span class="leaf">Intestinal Glands</span></li>
                            </ul>
                        </li>
                        <li class="sub-system">
                            <span class="caret">Nutritional disorders</span>
                            <ul class="nested">
                                <li><span class="leaf">Constipation</span></li>
                                <li><span class="leaf">Diarrhea</span></li>
                                <li><span class="leaf">Vomiting</span></li>
                            </ul>
                        </li>
                    </ul>
                </li>

                <li class="system">
                    <span class="caret">Blood Circulation</span>
                    <ul class="nested">
                        <li class="sub-system">
                            <span class="caret">Blood Components</span>
                            <ul class="nested">
                                <li><span class="leaf">Plasma</span></li>
                                <li><span class="leaf">Red Blood Cells</span></li>
                                <li><span class="leaf">White Blood Cells</span></li>
                                <li><span class="leaf">Platelets</span></li>
                            </ul>
                        </li>
                        <li class="sub-system">
                            <span class="caret">Heart Structure</span>
                            <ul class="nested">
                                <li><span class="leaf">Four chambers</span></li>
                                <li><span class="leaf">Pericardium</span></li>
                                <li><span class="leaf">Cardiac cycle</span></li>
                            </ul>
                        </li>
                        <li class="sub-system">
                            <span class="caret">Regulation</span>
                            <ul class="nested">
                                <li><span class="leaf">Sinoatrial node</span></li>
                                <li><span class="leaf">Atrioventricular node</span></li>
                                <li><span class="leaf">Bundle of His</span></li>
                                <li><span class="leaf">Purkinje Fibres</span></li>
                            </ul>
                        </li>
                        <li class="sub-system">
                            <span class="caret">Circulatory Types</span>
                            <ul class="nested">
                                <li><span class="leaf">Systemic Circulation</span></li>
                                <li><span class="leaf">Pulmonary Circulation</span></li>
                            </ul>
                        </li>
                    </ul>
                </li>

                <li class="system">
                    <span class="caret">Respiration</span>
                    <ul class="nested">
                        <li class="sub-system">
                            <span class="caret">Mechanism</span>
                            <ul class="nested">
                                <li><span class="leaf">Inspiration</span></li>
                                <li><span class="leaf">Expiration</span></li>
                            </ul>
                        </li>
                        <li class="sub-system">
                            <span class="caret">Gas Transport</span>
                            <ul class="nested">
                                <li><span class="leaf">Oxygen Transport</span></li>
                                <li><span class="leaf">Carbon dioxide transport</span></li>
                                <li><span class="leaf">Chloride shift</span></li>
                            </ul>
                        </li>
                        <li class="sub-system">
                            <span class="caret">Control</span>
                            <ul class="nested">
                                <li><span class="leaf">Neural Regulation</span></li>
                                <li><span class="leaf">Chemical Regulation</span></li>
                            </ul>
                        </li>
                    </ul>
                </li>

                <li class="system">
                    <span class="caret">Excretion</span>
                    <ul class="nested">
                        <li class="sub-system">
                            <span class="caret">Excretory System</span>
                            <ul class="nested">
                                <li><span class="leaf">Kidneys</span></li>
                                <li><span class="leaf">Ureters</span></li>
                                <li><span class="leaf">Urinary Bladder</span></li>
                                <li><span class="leaf">Urethra</span></li>
                            </ul>
                        </li>
                        <li class="sub-system">
                            <span class="caret">Urine Formation</span>
                            <ul class="nested">
                                <li><span class="leaf">Ultrafiltration</span></li>
                                <li><span class="leaf">Tubular Reabsorption</span></li>
                                <li><span class="leaf">Tubular Secretion</span></li>
                            </ul>
                        </li>
                        <li class="sub-system">
                            <span class="caret">Urea Cycle</span>
                            <ul class="nested">
                                <li><span class="leaf">Liver function</span></li>
                                <li><span class="leaf">Ornithine cycle</span></li>
                            </ul>
                        </li>
                    </ul>
                </li>

            </ul>
        </li>
    </ul>
</div>

<script>
    var toggler = document.getElementsByClassName("caret");
    var i;

    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
            // Toggle the nested list visibility
            this.parentElement.querySelector(".nested").classList.toggle("active");
            // Toggle the caret rotation
            this.classList.toggle("caret-down");
        });
    }
</script>

</body>
</html>