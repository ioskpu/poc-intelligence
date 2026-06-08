import type { ChangeAwareness, ChangeAwarenessItem } from "@/types/intelligence";
import {
  DECISION_CHANGE_SQL,
  GHOST_CHANGE_SQL,
  SCANNER_CHANGE_SQL,
} from "@/services/api/change-awareness-sql";
import { withFuturesLabDatabase } from "@/services/api/futures-lab-database";

type ScannerWindowRow = {
  current_leader_symbol: string | null;
  current_leader_score: string | null;
  current_long_count: string | null;
  current_short_count: string | null;
  baseline_leader_symbol: string | null;
  baseline_leader_score: string | null;
  baseline_long_count: string | null;
  baseline_short_count: string | null;
};

type DecisionWindowRow = {
  current_type: string | null;
  current_count: string | null;
  baseline_type: string | null;
  baseline_count: string | null;
};

type GhostWindowRow = {
  current_count: string | null;
  current_positive_rate: string | null;
  baseline_count: string | null;
  baseline_positive_rate: string | null;
};

const CURRENT_WINDOW = "Last 24 hours";
const BASELINE_WINDOW = "Previous 24 hours";

export async function getChangeAwareness(): Promise<ChangeAwareness> {
  return withFuturesLabDatabase(async (client) => {
    const scanner = await client.query<ScannerWindowRow>(SCANNER_CHANGE_SQL);
    const decisions = await client.query<DecisionWindowRow>(DECISION_CHANGE_SQL);
    const ghost = await client.query<GhostWindowRow>(GHOST_CHANGE_SQL);

    return {
      currentWindow: CURRENT_WINDOW,
      baselineWindow: BASELINE_WINDOW,
      items: [
        toLeaderChange(scanner.rows[0]),
        toBiasChange(scanner.rows[0]),
        toDecisionChange(decisions.rows[0]),
        toGhostChange(ghost.rows[0]),
      ],
    };
  });
}

function toLeaderChange(row?: ScannerWindowRow): ChangeAwarenessItem {
  const current = row?.current_leader_symbol;
  const baseline = row?.baseline_leader_symbol;
  const currentScore = readNumber(row?.current_leader_score);
  const baselineScore = readNumber(row?.baseline_leader_score);

  if (!current) {
    return {
      label: "Ranking leader",
      statement: "No current ranking leader is available.",
      detail: "Futures scanner data did not return a leader for the current window.",
    };
  }

  if (!baseline) {
    return {
      label: "Ranking leader",
      statement: `${current} leads the current scanner window.`,
      detail: "No baseline leader was available for the previous 24-hour window.",
    };
  }

  if (current !== baseline) {
    return {
      label: "Ranking leader",
      statement: `${current} replaced ${baseline} as the highest-ranked market.`,
      detail: formatScoreDetail(currentScore, baselineScore),
    };
  }

  return {
    label: "Ranking leader",
    statement: `${current} remains the highest-ranked market.`,
    detail: formatScoreDetail(currentScore, baselineScore),
  };
}

function toBiasChange(row?: ScannerWindowRow): ChangeAwarenessItem {
  const currentLong = readNumber(row?.current_long_count);
  const currentShort = readNumber(row?.current_short_count);
  const baselineLong = readNumber(row?.baseline_long_count);
  const baselineShort = readNumber(row?.baseline_short_count);
  const currentBias = dominantBias(currentLong, currentShort);
  const baselineBias = dominantBias(baselineLong, baselineShort);

  if (currentBias === "balanced") {
    return {
      label: "Directional bias",
      statement: "Recent scanner direction remains balanced.",
      detail: `Current window: ${formatCount(currentLong)} long-bias and ${formatCount(currentShort)} short-bias observations.`,
    };
  }

  if (currentBias !== baselineBias) {
    return {
      label: "Directional bias",
      statement: `${formatBias(currentBias)} represented a larger share of current scanner activity.`,
      detail: `Previous window was ${formatBias(baselineBias).toLowerCase()}.`,
    };
  }

  return {
    label: "Directional bias",
    statement: `${formatBias(currentBias)} remains the dominant scanner observation.`,
    detail: `Current window: ${formatCount(currentLong)} long-bias and ${formatCount(currentShort)} short-bias observations.`,
  };
}

function toDecisionChange(row?: DecisionWindowRow): ChangeAwarenessItem {
  const currentType = row?.current_type;
  const baselineType = row?.baseline_type;
  const currentCount = readNumber(row?.current_count);
  const baselineCount = readNumber(row?.baseline_count);

  if (!currentType) {
    return {
      label: "Research activity",
      statement: "No recent lab decision activity was found.",
      detail: "The current decision window did not return decision records.",
    };
  }

  if (currentType !== baselineType) {
    return {
      label: "Research activity",
      statement: `${humanize(currentType)} is the most common current lab decision type.`,
      detail: `Previous window leader: ${baselineType ? humanize(baselineType) : "none"}.`,
    };
  }

  const direction = currentCount >= baselineCount ? "increased or held" : "declined";

  return {
    label: "Research activity",
    statement: `${humanize(currentType)} activity ${direction} versus the previous window.`,
    detail: `Current: ${formatCount(currentCount)} records. Previous: ${formatCount(baselineCount)} records.`,
  };
}

function toGhostChange(row?: GhostWindowRow): ChangeAwarenessItem {
  const currentCount = readNumber(row?.current_count);
  const baselineCount = readNumber(row?.baseline_count);
  const currentRate = readNumber(row?.current_positive_rate);
  const baselineRate = readNumber(row?.baseline_positive_rate);

  if (currentCount === 0) {
    return {
      label: "Ghost tracking",
      statement: "No settled ghost tracking records appeared in the current window.",
      detail: `Previous window settled records: ${formatCount(baselineCount)}.`,
    };
  }

  const movement =
    currentRate > baselineRate
      ? "improved"
      : currentRate < baselineRate
        ? "declined"
        : "was unchanged";

  return {
    label: "Ghost tracking",
    statement: `Ghost tracking positive rate ${movement} relative to the previous window.`,
    detail: `Current: ${formatPercent(currentRate)} across ${formatCount(currentCount)} settled records. Previous: ${formatPercent(baselineRate)} across ${formatCount(baselineCount)} records.`,
  };
}

function dominantBias(longCount: number, shortCount: number) {
  if (longCount > shortCount) {
    return "long";
  }

  if (shortCount > longCount) {
    return "short";
  }

  return "balanced";
}

function formatBias(value: string) {
  if (value === "long") {
    return "Long-bias opportunities";
  }

  if (value === "short") {
    return "Short-bias opportunities";
  }

  return "Balanced activity";
}

function formatScoreDetail(current: number, baseline: number) {
  if (current === 0 && baseline === 0) {
    return "Score comparison is unavailable.";
  }

  const movement = current >= baseline ? "increased or held" : "decreased";

  return `Leader score ${movement}: current ${formatScore(current)}, previous ${formatScore(baseline)}.`;
}

function formatScore(value: number) {
  const score = value >= 0 && value <= 1 ? value * 100 : value;

  return Math.round(score).toString();
}

function humanize(value: string) {
  return value.replaceAll("_", " ");
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

function formatPercent(value: number) {
  return `${new Intl.NumberFormat("en", {
    maximumFractionDigits: 1,
  }).format(value * 100)}%`;
}

function readNumber(value: string | null | undefined) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}
