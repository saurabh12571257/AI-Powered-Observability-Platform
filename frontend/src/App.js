import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

import Dashboard from "./components/Dashboard";
import {
  ALL_FILTER_VALUE,
  SEVERITY_PRIORITY,
  filterLogs,
  getLogFilterOptions,
  hasActiveLogFilters,
} from "./utils/logFilters";

const socket = io("/");

function getIncidentTimestamp(incident) {
  const value = incident?.createdAt || incident?.updatedAt;
  const parsed = value ? new Date(value).getTime() : Number.NaN;
  return Number.isNaN(parsed) ? 0 : parsed;
}

function App() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLevelFilter, setActiveLevelFilter] = useState(ALL_FILTER_VALUE);
  const [activeServiceFilter, setActiveServiceFilter] = useState(ALL_FILTER_VALUE);
  const [activeSeverityFilter, setActiveSeverityFilter] = useState(ALL_FILTER_VALUE);
  const [analysisPanelOpen, setAnalysisPanelOpen] = useState(false);
  const [latestIncident, setLatestIncident] = useState(null);
  const [incidentLoading, setIncidentLoading] = useState(true);
  const [incidentError, setIncidentError] = useState("");

  useEffect(() => {
    axios
      .get("/api/logs", {
        params: {
          limit: 100,
        },
      })
      .then((res) => {
        setLogs(res.data.logs || []);
      })
      .catch((err) => {
        console.error("Error fetching logs:", err);
      });

    axios
      .get("/api/incidents", {
        params: {
          limit: 1,
        },
      })
      .then((res) => {
        const [incident] = res.data.incidents || [];
        setLatestIncident(incident || null);
      })
      .catch((error) => {
        console.error("Error fetching incidents:", error);
        setIncidentError("Could not load the latest incident.");
      })
      .finally(() => {
        setIncidentLoading(false);
      });
  }, []);

  useEffect(() => {
    socket.on("new-log", (log) => {
      setLogs((prev) => [log, ...prev]);
    });

    socket.on("incident-updated", (incident) => {
      setLatestIncident((prev) => {
        if (!prev || prev._id === incident._id) {
          return incident;
        }

        return getIncidentTimestamp(incident) >= getIncidentTimestamp(prev) ? incident : prev;
      });

      setIncidentLoading(false);
      setIncidentError("");
    });

    return () => {
      socket.off("new-log");
      socket.off("incident-updated");
    };
  }, []);

  const levelOptions = getLogFilterOptions(logs, "level");
  const serviceOptions = getLogFilterOptions(logs, "service");
  const severityOptions = getLogFilterOptions(logs, "severity", SEVERITY_PRIORITY);

  useEffect(() => {
    if (
      activeLevelFilter !== ALL_FILTER_VALUE &&
      !levelOptions.some((option) => option.value === activeLevelFilter)
    ) {
      setActiveLevelFilter(ALL_FILTER_VALUE);
    }
  }, [activeLevelFilter, levelOptions]);

  useEffect(() => {
    if (
      activeServiceFilter !== ALL_FILTER_VALUE &&
      !serviceOptions.some((option) => option.value === activeServiceFilter)
    ) {
      setActiveServiceFilter(ALL_FILTER_VALUE);
    }
  }, [activeServiceFilter, serviceOptions]);

  useEffect(() => {
    if (
      activeSeverityFilter !== ALL_FILTER_VALUE &&
      !severityOptions.some((option) => option.value === activeSeverityFilter)
    ) {
      setActiveSeverityFilter(ALL_FILTER_VALUE);
    }
  }, [activeSeverityFilter, severityOptions]);

  const filters = {
    searchTerm,
    level: activeLevelFilter,
    service: activeServiceFilter,
    severity: activeSeverityFilter,
  };

  const filteredLogs = filterLogs(logs, filters);
  const hasActiveFilters = hasActiveLogFilters(filters);

  const handleResetView = () => {
    setSearchTerm("");
    setActiveLevelFilter(ALL_FILTER_VALUE);
    setActiveServiceFilter(ALL_FILTER_VALUE);
    setActiveSeverityFilter(ALL_FILTER_VALUE);
  };

  const handleAlertClick = () => {
    setAnalysisPanelOpen(true);
  };

  const handleCloseAlert = () => {
    setAnalysisPanelOpen(false);
  };

  return (
    <Dashboard
      logs={filteredLogs}
      allLogs={logs}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      activeLevelFilter={activeLevelFilter}
      onLevelFilterChange={setActiveLevelFilter}
      levelOptions={levelOptions}
      activeServiceFilter={activeServiceFilter}
      onServiceFilterChange={setActiveServiceFilter}
      serviceOptions={serviceOptions}
      activeSeverityFilter={activeSeverityFilter}
      onSeverityFilterChange={setActiveSeverityFilter}
      severityOptions={severityOptions}
      visibleLogCount={filteredLogs.length}
      totalLogCount={logs.length}
      hasActiveFilters={hasActiveFilters}
      onResetView={handleResetView}
      latestIncident={latestIncident}
      incidentLoading={incidentLoading}
      incidentError={incidentError}
      analysisPanelOpen={analysisPanelOpen}
      onAlertClick={handleAlertClick}
      onCloseAlert={handleCloseAlert}
    />
  );
}

export default App;
