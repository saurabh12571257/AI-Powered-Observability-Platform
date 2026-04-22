export const ALL_FILTER_VALUE = "all";

export const SEVERITY_PRIORITY = {
  high: 0,
  medium: 1,
  low: 2,
};

const SEARCH_FIELDS = ["message", "service", "level", "severity"];

const normalizeValue = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
};

const compareFilterValues = (left, right, priorityMap = {}) => {
  const leftPriority = priorityMap[left];
  const rightPriority = priorityMap[right];

  if (leftPriority !== undefined || rightPriority !== undefined) {
    if (leftPriority === undefined) {
      return 1;
    }

    if (rightPriority === undefined) {
      return -1;
    }

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }
  }

  return left.localeCompare(right);
};

const hasFilterValue = (value) => {
  const normalized = normalizeValue(value);
  return normalized !== "" && normalized !== ALL_FILTER_VALUE;
};

export const getLogFilterOptions = (logs, field, priorityMap = {}) => {
  const uniqueValues = new Map();

  logs.forEach((log) => {
    const rawValue = typeof log?.[field] === "string" ? log[field].trim() : "";
    const normalizedValue = normalizeValue(rawValue);

    if (!normalizedValue || uniqueValues.has(normalizedValue)) {
      return;
    }

    uniqueValues.set(normalizedValue, {
      value: normalizedValue,
      label: rawValue,
    });
  });

  return Array.from(uniqueValues.values()).sort((left, right) =>
    compareFilterValues(left.value, right.value, priorityMap)
  );
};

export const filterLogs = (
  logs,
  {
    searchTerm = "",
    level = ALL_FILTER_VALUE,
    service = ALL_FILTER_VALUE,
    severity = ALL_FILTER_VALUE,
  } = {}
) => {
  const query = normalizeValue(searchTerm);
  const normalizedLevel = normalizeValue(level);
  const normalizedService = normalizeValue(service);
  const normalizedSeverity = normalizeValue(severity);

  return logs.filter((log) => {
    if (hasFilterValue(normalizedLevel) && normalizeValue(log.level) !== normalizedLevel) {
      return false;
    }

    if (hasFilterValue(normalizedService) && normalizeValue(log.service) !== normalizedService) {
      return false;
    }

    if (hasFilterValue(normalizedSeverity) && normalizeValue(log.severity) !== normalizedSeverity) {
      return false;
    }

    if (!query) {
      return true;
    }

    return SEARCH_FIELDS.some((field) => normalizeValue(log?.[field]).includes(query));
  });
};

export const hasActiveLogFilters = ({
  searchTerm = "",
  level = ALL_FILTER_VALUE,
  service = ALL_FILTER_VALUE,
  severity = ALL_FILTER_VALUE,
} = {}) =>
  Boolean(normalizeValue(searchTerm)) ||
  [level, service, severity].some((value) => hasFilterValue(value));
