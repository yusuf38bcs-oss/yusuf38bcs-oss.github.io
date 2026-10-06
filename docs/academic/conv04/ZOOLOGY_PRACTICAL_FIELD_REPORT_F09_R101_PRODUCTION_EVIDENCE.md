# R101 Field Report production evidence

Status: BLOCKED until R101 merge.

After merge, certify only when:

1. the R101 merge SHA is authenticated as current `main`;
2. immutable Pages deployment is bound to that exact main SHA;
3. canonical production route `/biology/higher-zoology-tree/practical/field-report/` serves the merged learner source;
4. the preservation validator passes from exact main;
5. production contains the protected Field Report identity and 17-mark report structure;
6. no gateway/shared-runtime/sibling Practical regression is detected.

A pre-merge preview cannot satisfy this production-parity record.
