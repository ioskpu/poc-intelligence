# Phase 17 - First User Feedback System

## Objective

Create a repeatable process for collecting structured user feedback from public
demo sessions.

This phase defines the operating framework. It does not add UI, backend logic
or analytics.

## Interview Framework

### 5-Minute Session

Purpose:

- test immediate comprehension
- test whether the user can describe the product category
- identify the first section that earns attention

Flow:

1. Open the landing page or dashboard.
2. Ask the user to describe what they think the product is.
3. Ask which part they would open first and why.
4. Ask what feels most useful right away.
5. Ask whether they would return tomorrow.

Questions:

- What do you think this product is?
- What do you think it helps you do?
- Which section do you trust first?
- What feels immediately useful?
- Would you come back tomorrow?

Success signals:

- the user can explain the product in plain language
- the user identifies one section as useful without prompting
- the user expresses either curiosity or repeat intent

### 15-Minute Session

Purpose:

- test deeper comprehension
- identify which sections support retention
- determine whether the product feels differentiated

Flow:

1. Run the same opening as the 5-minute session.
2. Walk through `What Changed`.
3. Walk through `Recent Decisions`.
4. Walk through `Setup Memory`.
5. Walk through `Ghost Tracking`.
6. Ask which section matters most for weekly review.
7. Ask what would need to change for the product to feel indispensable.

Questions:

- Which section was easiest to understand?
- Which section needed the most explanation?
- Which section feels most credible?
- Which section feels least useful?
- What would make you open this weekly?
- What would make you stop using it?

Success signals:

- the user can connect sections into a coherent workflow
- at least one deeper section is seen as useful
- the user can articulate a reason to return weekly

## Feedback Collection Rules

- Record exact user phrasing when possible.
- Distinguish between curiosity and actual utility.
- Note when the user asks for signals, charts, execution or alerts.
- Avoid coaching the user into positive responses.
- Preserve uncertainty rather than forcing a conclusion.

## Prioritization Model

Incoming feedback should be tagged with one of four priority levels.

### Critical

- product misunderstanding that blocks usage
- severe trust issue
- repeated confusion across multiple users
- feedback that implies the product category is wrong

### High

- a commonly used section is unclear or missing key context
- a section is consistently described as valuable but incomplete
- feedback that materially affects retention

### Medium

- wording confusion that does not block understanding
- requests that improve clarity or workflow but do not change the product
- section-specific improvements with moderate impact

### Low

- cosmetic preferences
- one-off suggestions
- feedback that does not affect comprehension or retention

## Product Learning Log

Use a structured log after every session.

| Field | Meaning |
| --- | --- |
| Observation | The actual user statement or behavior |
| Frequency | How often this appears across sessions |
| Severity | Critical, High, Medium or Low |
| Potential action | What change might address the issue |
| Status | Open, Under review, Accepted, Rejected or Implemented |

Suggested entry format:

- Observation: user did not understand `What Changed`
- Frequency: 3 of 5 sessions
- Severity: High
- Potential action: simplify the section title and add a one-line comparison cue
- Status: Open

## Validation Criteria

### Successful Validation

- Most users can explain the product after a short walkthrough.
- At least one or two sections consistently create clear value.
- Users can identify a reason to return tomorrow or next week.
- The product category is not repeatedly misunderstood.

### Inconclusive Validation

- Users understand the product only after heavy explanation.
- Feedback is mixed and no section clearly dominates.
- The sessions produce useful notes but no clear direction.
- The value signal is present, but not strong enough to decide.

### Failed Validation

- Users cannot explain the product category.
- The product is consistently confused with a trading signal feed or scanner.
- No section is perceived as useful.
- Users show no return intent after explanation.

## Operating Notes

- Keep notes short and literal.
- Prefer repeated patterns over isolated opinions.
- The goal is to learn what users actually value, not to confirm the roadmap.

