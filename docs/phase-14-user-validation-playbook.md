# Phase 14 - First User Validation Playbook

## Objective

Validate whether first-time users understand POC Intelligence, perceive value,
and want to return.

This playbook is documentation only. It does not change code, UI, APIs or data
access.

## Part 1 - Product Hypotheses

### H1 - Users understand the dashboard within 5 minutes

Success criteria:

- The user can explain what the product is without help.
- The user can identify that the dashboard reflects Futures Lab research
  observations.
- The user can distinguish rankings, changes and historical evidence.

### H2 - Users find Intelligence Brief valuable

Success criteria:

- The user says the brief helps them understand the current state quickly.
- The user can describe at least one item in the brief without prompting.
- The user wants the brief to remain at the top of the page.

### H3 - Users understand What Changed without explanation

Success criteria:

- The user can describe the change cards in their own words.
- The user can tell whether scanner leadership, research activity or ghost
  feedback changed.
- The user does not ask what the section is for after a short glance.

### H4 - Users perceive Setup Memory as useful

Success criteria:

- The user sees the section as evidence of accumulated research history.
- The user can identify a recurring setup or pattern they care about.
- The user considers the section useful for weekly review, not only first-day
  curiosity.

### H5 - Users perceive Ghost Tracking as unique

Success criteria:

- The user understands that the section is post-evaluation feedback, not
  signals.
- The user sees it as different from a normal scanner or ranking view.
- The user believes it adds something they would not get from TradingView or a
  generic market scanner.

## Part 2 - 5-Minute Demo Script

1. Open the dashboard and name the product plainly: this is a research
   observatory for Futures Lab.
2. Point to `Intelligence Brief` and summarize it as the current state in a few
   lines.
3. Move to `What Changed` and explain that it shows what shifted since the
   previous review window.
4. Open `Market Rankings` and show the top ranked market plus the ranking score.
5. Close by saying the dashboard is a readable front page for Futures Lab
   observations, not a trading signal feed.

Demo objective:

- Get the user to understand the product category.
- Show the current state.
- Show change awareness.
- Show a concrete ranking example.

## Part 3 - 15-Minute Demo Script

1. Start with the same 5-minute overview.
2. Walk through `Recent Decisions` and explain that it is a log of recent
   research activity.
3. Show `Setup Memory` and explain that it captures recurring setups with
   historical evidence.
4. Show `Ghost Tracking` and explain that it summarizes rejected opportunities
   and their post-evaluation outcomes.
5. Connect the sections:
   - Rankings show what is active now.
   - Change Awareness shows what changed.
   - Recent Decisions show what the lab evaluated.
   - Setup Memory shows what has repeated historically.
   - Ghost Tracking shows what rejection logic learned.
6. End by asking which section they would open first on a daily basis and why.

Demo objective:

- Show how the observatory pieces fit together.
- Make the product feel like a research workflow, not a set of disconnected
  cards.
- Find out whether the deeper sections matter enough for repeat usage.

## Part 4 - User Interview Questions

### Understanding

1. What do you think this product is?
2. What do you think it is meant to help you do?
3. Which section did you understand first?
4. Which section needed the most explanation?

### Perceived Value

5. What felt immediately useful?
6. What felt interesting but not yet useful?
7. What would make this worth opening again tomorrow?
8. What would make it worth opening again next week?

### Trust

9. What makes you trust or not trust the information here?
10. Which labels or numbers feel clear, and which feel ambiguous?
11. What would you want to verify before relying on this daily?

### Usefulness

12. Which section would you use most often?
13. Which section would you ignore?
14. What information is missing for your workflow?
15. What would you remove if the dashboard had to get simpler?

### Return Intent

16. What would make you return tomorrow?
17. What would make you return weekly instead of daily?
18. What would make you stop using this product?

## Part 5 - Observation Checklist

- First section the user looks at.
- Time until the user explains the product in their own words.
- Sections the user points to without prompting.
- Sections the user hesitates on.
- Questions the user asks about labels, scores or terms.
- Sections the user revisits after the first pass.
- Whether the user treats the dashboard as research, signal, reporting or
  something else.
- Whether the user asks for charts, execution, alerts or direct recommendations.
- Whether the user calls out any section as unique or differentiated.

## Part 6 - Product Metrics

Recommended lightweight metrics for manual or qualitative tracking:

| Metric | What it captures | Why it matters |
| --- | --- | --- |
| Section engagement | Which sections the user opens, revisits or discusses | Shows where value concentrates |
| First-click section | Where attention goes first | Validates information hierarchy |
| Perceived usefulness | User-rated usefulness per section | Separates curiosity from utility |
| Understanding score | Can the user explain the product back correctly | Measures onboarding clarity |
| Return intent | Whether the user expects to come back tomorrow or next week | Measures retention potential |
| Most discussed section | Which section triggers the most conversation | Identifies the product anchor |

No analytics implementation is required for this phase.

## Part 7 - Validation Outcomes

### Intelligence Brief

- Positive signal: user summarizes the lab state in one sentence and wants it
  at the top.
- Neutral signal: user reads it but still asks what it means in practice.
- Negative signal: user skips it or calls it generic.

### What Changed

- Positive signal: user understands the comparison quickly and points to at
  least one changed item.
- Neutral signal: user understands some cards but not the window logic.
- Negative signal: user says it is confusing or too abstract.

### Market Rankings

- Positive signal: user uses it as the starting point for daily review.
- Neutral signal: user likes the ranking but wants more context before trusting
  it.
- Negative signal: user treats it like a signal feed or finds the score unclear.

### Scanner Context

- Positive signal: user says it explains the ranking in useful terms.
- Neutral signal: user likes it but does not revisit it often.
- Negative signal: user ignores it or says it is too dense.

### Recent Decisions

- Positive signal: user sees it as a clear activity log.
- Neutral signal: user understands the section but does not know how to use it.
- Negative signal: user cannot tell why it matters.

### Setup Memory

- Positive signal: user sees historical evidence and asks to compare setups.
- Neutral signal: user understands the concept but not the metric labels.
- Negative signal: user finds it too technical or too abstract.

### Ghost Tracking

- Positive signal: user calls it distinctive and useful research feedback.
- Neutral signal: user understands it but wants simpler labels.
- Negative signal: user reads it as an odd or irrelevant section.

## Part 8 - Next-Stage Decision Framework

### Continue Current Roadmap

Choose this if:

- Users understand the dashboard category.
- At least two sections are consistently valued.
- Users ask for more depth rather than a different product.

### Simplify Product

Choose this if:

- Users understand the product only after repeated explanation.
- Several sections are ignored or considered redundant.
- The dashboard feels too wide for the value it provides.

### Reposition Product

Choose this if:

- Users value the product, but not as a market observatory.
- The strongest feedback points toward audit, research or memory, not ranking.
- The language users use matches a different category than the current one.

### Focus on Specific Sections

Choose this if:

- One or two sections clearly dominate attention and value.
- The rest of the dashboard is useful but secondary.
- The product should become narrower before it becomes deeper.

## Running Rule

After each session, record:

- The user's first description of the product.
- The section they trusted most.
- The section they ignored.
- Whether they asked to come back.
- The single biggest confusion point.
- The single strongest value signal.

## Success Criterion

A founder should be able to run a 5-minute demo, a 15-minute demo and a
structured feedback session without improvisation.
