# Product Positioning and Retention Analysis

## Executive Summary

POC Intelligence is strongest as a research observatory for Futures Lab. It is
not a trading platform, charting tool or signal service. Its current value is
making an automated research lab readable: what it is watching, what it recently
evaluated, what recurring setups it remembers and what it learned from rejected
opportunities.

The best primary users today are systematic traders, quant researchers and small
research teams. The product is weaker for users who mainly want charting,
execution or direct buy/sell instructions.

Recommended direction: Research Observatory.

Recommended Phase 11: Daily Intelligence Brief.

## Part 1 - Current Product Inventory

### Market Rankings

- Purpose: shows currently ranked markets from Futures Lab scanner output.
- User value: gives a fast starting point for market investigation.
- Information density: MEDIUM.
- Potential confusion: users may interpret high scores as trade signals.
- Retention value: HIGH, because rankings can change with each scanner run.

### Scanner Context

- Purpose: explains ranked markets with ranking reason, direction, regime,
  volatility, trend strength and funding context.
- User value: makes rankings less black-box.
- Information density: MEDIUM to HIGH.
- Potential confusion: direction and regime hints may look like
  recommendations.
- Retention value: HIGH, because users can see why rankings changed.

### Freshness Indicators

- Purpose: shows whether scanner, decision and observation data are recent.
- User value: protects users from trusting stale intelligence.
- Information density: LOW.
- Potential confusion: users may not know what each freshness category means.
- Retention value: MEDIUM, because freshness builds trust but is not the core
  reason to return.

### Recent Decisions

- Purpose: shows recent Futures Lab research decisions and reasons.
- User value: creates an activity feed for what the lab has evaluated.
- Information density: MEDIUM.
- Potential confusion: the word decision can imply action or advice.
- Retention value: HIGH, because recent activity is naturally repeatable.

### Setup Memory

- Purpose: shows historical observations for recurring setup patterns.
- User value: helps users see which setups have accumulated evidence.
- Information density: HIGH.
- Potential confusion: historical health may be mistaken for prediction.
- Retention value: MEDIUM, with stronger weekly and long-term value.

### Ghost Tracking

- Purpose: shows post-evaluation feedback from rejected opportunities.
- User value: reveals whether rejection logic appears effective.
- Information density: HIGH.
- Potential confusion: hypothetical outcomes may be misunderstood as executable
  results.
- Retention value: MEDIUM to HIGH, especially for research review.

## Part 2 - User Personas

### Persona A - Discretionary Trader

- Goals: find active markets quickly and decide where to perform manual chart
  review.
- Frustrations: black-box signals, too many quant terms and lack of chart-level
  confirmation.
- Why they would use POC Intelligence: as a pre-filter before opening charts.
- Most relevant sections: Market Rankings, Scanner Context, Freshness.
- Irrelevant or weaker sections: Setup Memory and Ghost Tracking unless
  simplified into plain-language summaries.

### Persona B - Systematic Trader

- Goals: monitor a repeatable research process and inspect whether rules behave
  as expected.
- Frustrations: raw logs are hard to read and signal dashboards hide process
  quality.
- Why they would use POC Intelligence: to inspect ranking, evaluation,
  rejection and memory behavior in one place.
- Most relevant sections: Recent Decisions, Setup Memory, Ghost Tracking,
  Market Rankings.
- Irrelevant or weaker sections: mock or unsupported opportunity panels.

### Persona C - Quant Researcher

- Goals: understand model behavior, evaluate rejection logic and identify new
  research questions.
- Frustrations: simplistic dashboards hide nuance, while notebooks are slow for
  daily operational review.
- Why they would use POC Intelligence: as a live research observability layer.
- Most relevant sections: Ghost Tracking, Setup Memory, Recent Decisions,
  Scanner Context.
- Irrelevant or weaker sections: rankings without change tracking or research
  context.

### Persona D - Small Fund / Prop Desk

- Goals: monitor research health, support team review and inspect process
  quality without trade execution access.
- Frustrations: fragmented research tooling and black-box products.
- Why they would use POC Intelligence: to review lab behavior in a shared,
  readable dashboard.
- Most relevant sections: Freshness, Recent Decisions, Setup Memory, Ghost
  Tracking.
- Irrelevant or weaker sections: retail-style signal feed surfaces.

## Part 3 - Value Proposition

POC Intelligence provides a readable interface over an automated market research
lab. Its value is research transparency, not prediction.

Current unique value:

- Current market ranking with explanation.
- Freshness indicators for trust.
- Recent lab activity without backend access.
- Historical setup memory from accumulated Futures Lab observations.
- Rejected-opportunity feedback through ghost tracking.

The product matters when a user wants to understand what Futures Lab is seeing,
why it is seeing it and what it has learned.

## Part 4 - Competitive Positioning

### TradingView Workflows

- Stronger: POC Intelligence shows lab memory, rejected opportunity feedback and
  decision context.
- Weaker: it lacks chart interaction, drawing tools, alerts and execution.

### Market Scanners

- Stronger: it combines ranking, explanation, freshness, memory and rejection
  feedback.
- Weaker: it has fewer filters, fewer user controls and less generality.

### Generic Signal Dashboards

- Stronger: it exposes process quality instead of hiding behind signals.
- Weaker: users seeking simple buy/sell instructions may not understand it.

### Quant Research Notebooks

- Stronger: easier to read daily and accessible to non-coders.
- Weaker: less flexible for deep exploratory analysis.

## Part 5 - Retention Analysis

Why a user would return tomorrow:

- See which markets ranked highest after the latest scanner run.
- See what Futures Lab evaluated since the last visit.
- Confirm whether data is fresh.
- Notice whether rejection feedback changed.

Why a user would return next week:

- Review setup memory health.
- Inspect ghost tracking over broader samples.
- Compare recent lab behavior against prior observations.
- Choose deeper research questions.

Why a user would stop using the product:

- Rankings feel static or stale.
- The dashboard does not explain what changed.
- Setup keys and ghost metrics remain too dense.
- The user expected execution, charting or direct signals.
- Mock sections remain mixed with real intelligence too long.

| Section | Daily Value | Weekly Value | Long-Term Value |
| --- | --- | --- | --- |
| Market Rankings | HIGH | MEDIUM | MEDIUM |
| Scanner Context | HIGH | MEDIUM | MEDIUM |
| Freshness Indicators | MEDIUM | LOW | MEDIUM |
| Recent Decisions | HIGH | HIGH | MEDIUM |
| Setup Memory | MEDIUM | HIGH | HIGH |
| Ghost Tracking | MEDIUM | HIGH | HIGH |

## Part 6 - Product Direction Options

### Option A - Market Intelligence Dashboard

- Strengths: clear daily workflow and easy positioning.
- Weaknesses: risks becoming a generic scanner.
- Monetization potential: MEDIUM.
- Engineering complexity: LOW to MEDIUM.
- Strategic fit with Futures Lab: MEDIUM.

### Option B - Research Observatory

- Strengths: best match for rankings, decisions, setup memory and ghost
  tracking.
- Weaknesses: requires careful UX to avoid overwhelming users.
- Monetization potential: MEDIUM to HIGH for systematic traders and research
  teams.
- Engineering complexity: MEDIUM.
- Strategic fit with Futures Lab: HIGH.

### Option C - Decision Audit Platform

- Strengths: strong for governance, traceability and team review.
- Weaknesses: too narrow as the primary product today.
- Monetization potential: MEDIUM for teams.
- Engineering complexity: MEDIUM to HIGH.
- Strategic fit with Futures Lab: HIGH as a layer, not the whole product.

### Option D - Market Discovery Engine

- Strengths: strong daily hook and easy user story.
- Weaknesses: may hide the deeper learning assets that make the product
  distinct.
- Monetization potential: MEDIUM.
- Engineering complexity: MEDIUM.
- Strategic fit with Futures Lab: MEDIUM.

## Part 7 - Recommended Direction

Primary recommendation: Research Observatory.

Target user:
Systematic traders, quant researchers and small research teams.

Core problem solved:
Futures Lab produces useful intelligence, but raw backend state is too dense for
daily product use. POC Intelligence makes that research state legible.

Daily use case:
Open the dashboard, see what changed, verify freshness, review current rankings,
scan recent decisions and inspect whether setup memory or ghost tracking reveals
important feedback.

Why users return:
The product can become the daily readout of a living research system. Rankings
change, decisions accumulate, setup memory evolves and ghost tracking reveals
whether rejected opportunities mattered.

Why competitors are weaker:
Charting tools do not show lab memory. Scanners do not show rejection learning.
Signal dashboards hide process quality. Notebooks are too manual for daily
monitoring.

What should not be built:

- Trade execution.
- Buy/sell recommendation language.
- Billing before retention is proven.
- Authentication before a real user workflow exists.
- Complex charting before summaries and change tracking.
- New scoring systems while existing Futures Lab data remains under-explained.
- Deep raw-payload drilldowns before the top-level story is clear.

## Part 8 - Phase 11 Recommendation

Recommended Phase 11: Daily Intelligence Brief.

Objective:
Create a compact dashboard-first summary that answers what changed since the
last meaningful lab update.

Why this is the right next phase:

- The product now has multiple useful surfaces competing for attention.
- Retention depends on users quickly seeing what is new.
- A brief can connect rankings, decisions, setup memory and ghost tracking
  without new intelligence systems.
- It improves first-time comprehension and repeat usage.

Scope:

- Top-ranked market summary.
- Latest lab decision summary.
- Setup memory highlight.
- Ghost tracking highlight.
- Freshness status.
- Explicit no-financial-advice framing.

Rules:

- Use existing data only.
- No new backend endpoints.
- No new scores.
- No prediction language.
- No alerts yet.

Success criteria:

- A returning user can answer "what changed since I last checked?" in under 30
  seconds.
- A first-time user can understand that POC Intelligence is a research
  observatory, not a trading platform.

## Final Conclusion

POC Intelligence should not become a charting platform, broker interface or
signal service. Its strongest path is to become the readable daily layer for
Futures Lab research activity.

The retention loop is:

Fresh scanner state -> recent lab activity -> accumulated setup memory -> ghost
tracking feedback -> next research question.

The next product work should make that loop obvious.
