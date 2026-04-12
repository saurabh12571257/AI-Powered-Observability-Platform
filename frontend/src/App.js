import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

import Dashboard from "./components/Dashboard";

const socket = io("/");

function getIncidentTimestamp(incident) {
  const value = incident?.createdAt || incident?.updatedAt;
  const parsed = value ? new Date(value).getTime() : Number.NaN;
  return Number.isNaN(parsed) ? 0 : parsed;
}

function App() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [analysisPanelOpen, setAnalysisPanelOpen] = useState(false);
  const [latestIncident, setLatestIncident] = useState(null);
  const [incidentLoading, setIncidentLoading] = useState(true);
  const [incidentError, setIncidentError] = useState("");

  useEffect(() => {
    axios.get("/api/logs", {
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

    axios.get("/api/incidents", {
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

  const levelOptions = Array.from(new Set(logs.map((log) => log.level).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    if (activeFilter !== "all" && !levelOptions.includes(activeFilter)) {
      setActiveFilter("all");
    }
  }, [activeFilter, levelOptions]);

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = activeFilter === "all" ? true : log.level === activeFilter;

    if (!matchesFilter) {
      return false;
    }

    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return [log.message, log.service, log.level, log.severity]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });

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
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      filterOptions={levelOptions}
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
