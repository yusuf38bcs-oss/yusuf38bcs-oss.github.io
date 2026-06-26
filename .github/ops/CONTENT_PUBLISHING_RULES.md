# Content Publishing Rules

These rules govern educational content, MCQ content, Bangla routes, learner reflection, health boundaries, and AdSense-safe publishing.

## 1. Platform Identity Rule

Every major content decision should support the platform equation:

```text
Biology = Academic Theory
Life = Practical Application
Learning = The Bridge
```

The platform should help learners move from information to understanding, from memorization to application, and from passive reading to critical thinking.

## 2. Minimum Page Quality Rule

A publishable educational page should include most of these:

- Concept overview.
- Why this matters.
- LOLO: Learning Objectives and Learning Outcomes.
- LALA: Learning Activities and Learning Applications.
- Diagram, table, flowchart, or structured summary where useful.
- Synaptic Bridge.
- Critical-thinking questions.
- Internal links to related learning paths.
- References or verification sources for technical claims.

Do not publish pages that are only:

- A title and a paragraph.
- A list of links without learning context.
- MCQs without explanation.
- Raw copied textbook text.
- Raw AI output.
- Broken Markdown or unrendered code.

## 3. LOLO Rule

LOLO must not be decorative. It must guide the learner.

Learning Objectives should define what the learner will study.
Learning Outcomes should define what the learner will be able to do after the lesson.

Good outcomes use measurable verbs:

```text
identify, explain, compare, classify, analyze, evaluate, construct, justify, apply
```

## 4. LALA Rule

LALA should connect the lesson to learning practice and real-life application.

Learning Activities may include:

- Drawing a flowchart.
- Making a comparison table.
- Writing a short analysis.
- Solving MCQs.
- Creating a concept map.
- Explaining a mechanism in steps.

Learning Applications should connect the concept to:

- Health awareness.
- Behaviour.
- Ecology.
- Public health.
- Ethics.
- Leadership.
- Research thinking.
- Data interpretation.

## 5. MCQ and Quiz Rule

Every MCQ must provide learning value.

Required structure:

```text
Question
Options
Correct answer
Short explanation
Validity logic
```

Validity logic should answer:

```text
Why is the correct option correct?
Why is the common distractor less valid?
Which concept does this test?
```

## 6. Health and Behaviour Safety Rule

Content about physiology, disease, nutrition, hormones, mental state, depression, personality, behaviour, Multiple Intelligences, or cognitive graph must be educational only.

Required boundary language where needed:

```text
This content is for educational understanding and reflective learning. It is not medical, psychological, diagnostic, or treatment advice.
```

Never advise self-medication.
For symptoms, disease suspicion, seizure, depression, self-harm risk, serious distress, or clinical concern, advise qualified professional support.

## 7. Socratic 4.0 and Cognitive Graph Rule

Socratic 4.0, Multiple Intelligences reflection, personality-pattern reflection, and Cognitive Graph outputs are:

- Reflective.
- Educational.
- Learner-centred.
- Non-clinical.
- Individual self-tracking only.

They must not be used to:

- Publicly label learners.
- Rank learners.
- Diagnose learners.
- Shame learners.
- Compare private learner profiles publicly.
- Send individual reflective answers to advertising or analytics systems.

## 8. Bangla Content Rule

Native Bangla pages must be manually reviewed.

Do not rely on automatic translation as final academic content.

If a native Bangla version is incomplete, the language switcher should route to the safe Bangla gateway `/bn/`, not to a broken `/bn/<page>/` route.

Bangla educational pages should keep technical English terms where academically useful, with Bangla explanation.

## 9. Diagram and Flowchart Rule

Use diagrams when they improve concept clarity.

Acceptable forms:

- HTML diagram cards.
- Flowchart blocks.
- Tables.
- Step maps.
- Concept maps.
- Lifecycle diagrams.

Avoid raw Mermaid blocks unless Mermaid rendering is confirmed. If Mermaid prints as text, replace it with HTML/CSS diagram blocks.

## 10. Faith and Science Bridge Rule

Faith-informed reflection may be included as Synaptic Bridge or ethical reflection.

Rules:

- Keep academic Biology explanation first.
- Do not present faith reflection as laboratory evidence.
- Connect faith reflection to responsibility, humility, health, cleanliness, discipline, and ethical action.
- Avoid attacking communities or creating derogatory content.

## 11. Public Comments Rule

Do not enable open public comments before AdSense approval.

Use safe alternatives:

- Learner Reflection Prompt.
- Discussion Prompt.
- Contact page.
- Future moderated comments only.

If comments are enabled after approval, they must be moderated and protected against spam, abusive content, medical misinformation, and policy-risk user-generated content.

## 12. Pre-Publish Checklist

Before publishing a lesson:

```text
[ ] Correct collection/path selected.
[ ] Front matter valid.
[ ] One visible H1 only.
[ ] No raw Markdown artifacts visible.
[ ] LOLO/LALA included where appropriate.
[ ] MCQs include explanation and validity logic.
[ ] Health/psychology disclaimer included where needed.
[ ] Internal links work.
[ ] Mobile design acceptable.
[ ] References added for technical or health claims.
[ ] Page checked live after deployment.
```
