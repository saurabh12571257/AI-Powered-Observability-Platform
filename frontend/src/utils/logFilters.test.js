import {
  ALL_FILTER_VALUE,
  SEVERITY_PRIORITY,
  filterLogs,
  getLogFilterOptions,
  hasActiveLogFilters,
} from "./logFilters";

const logs = [
  {
    service: "Checkout",
    level: "error",
    severity: "high",
    message: "Database connection timeout",
  },
  {
    service: "Payments",
    level: "warn",
    severity: "medium",
    message: "Retrying webhook delivery",
  },
  {
    service: "checkout",
    level: "info",
    severity: "low",
    message: "Request completed successfully",
  },
];

describe("logFilters", () => {
  test("builds case-insensitive filter options with readable labels", () => {
    expect(getLogFilterOptions(logs, "service")).toEqual([
      { value: "checkout", label: "Checkout" },
      { value: "payments", label: "Payments" },
    ]);
  });

  test("applies custom severity ordering", () => {
    expect(getLogFilterOptions(logs, "severity", SEVERITY_PRIORITY)).toEqual([
      { value: "high", label: "high" },
      { value: "medium", label: "medium" },
      { value: "low", label: "low" },
    ]);
  });

  test("combines search, level, service, and severity filters", () => {
    expect(
      filterLogs(logs, {
        searchTerm: "database",
        level: "error",
        service: "checkout",
        severity: "high",
      })
    ).toEqual([logs[0]]);
  });

  test("treats the default filter state as inactive", () => {
    expect(
      hasActiveLogFilters({
        searchTerm: "",
        level: ALL_FILTER_VALUE,
        service: ALL_FILTER_VALUE,
        severity: ALL_FILTER_VALUE,
      })
    ).toBe(false);
  });

  test("detects active search or filter values", () => {
    expect(
      hasActiveLogFilters({
        searchTerm: "timeout",
        level: ALL_FILTER_VALUE,
        service: ALL_FILTER_VALUE,
        severity: ALL_FILTER_VALUE,
      })
    ).toBe(true);
  });
});
