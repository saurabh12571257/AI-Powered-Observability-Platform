import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

import Dashboard from "./components/Dashboard";

const socket = io("/");
const ERROR_BURST_SIZE = 5;
const ERROR_BURST_WINDOW_MS = 4000;

function getLogTimestamp(log) {
  const value = log.createdAt || log["@timestamp"];
  const parsed = value ? new Date(value).getTime() : Number.NaN;
  return Number.isNaN(parsed) ? 0 : parsed;
}

function detectErrorBurst(logs) {
  const orderedLogs = [...logs].sort((a, b) => getLogTimestamp(a) - getLogTimestamp(b));

  for (let index = 0; index <= orderedLogs.length - ERROR_BURST_SIZE; index += 1) {
    const candidate = orderedLogs.slice(index, index + ERROR_BURST_SIZE);

    if (candidate.some((log) => log.level !== "error")) {
      continue;
    }

    const firstTime = getLogTimestamp(candidate[0]);
    const lastTime = getLogTimestamp(candidate[candidate.length - 1]);

    if (firstTime && lastTime && lastTime - firstTime <= ERROR_BURST_WINDOW_MS) {
      return candidate;
    }
  }

  return null;
}

function App() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [analysisPanelOpen, setAnalysisPanelOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [burstSignature, setBurstSignature] = useState("");
  const [burstLogs, setBurstLogs] = useState([]);

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
  }, []);

  useEffect(() => {
    socket.on("new-log", (log) => {
      console.log("New log:", log);

      setLogs((prev) => [log, ...prev]);
    });

    return () => {
      socket.off("new-log");
    };
  }, []);

  useEffect(() => {
    const detectedBurst = detectErrorBurst(logs);

    if (!detectedBurst) {
      return;
    }

    const signature = detectedBurst
      .map((log) => `${log.service}-${log.message}-${getLogTimestamp(log)}`)
      .join("|");

    if (signature === burstSignature) {
      return;
    }

    setBurstSignature(signature);
    setBurstLogs(detectedBurst);
    setAiAnalysis("");
    setAnalysisError("");
  }, [logs, burstSignature]);

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = activeFilter === "all" ? true : log.level === activeFilter;

    if (!matchesFilter) {
      return false;
    }

    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return [log.message, log.service, log.level]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });

  const handleAlertClick = async () => {
    setAnalysisPanelOpen(true);

    if (burstLogs.length === 0 || aiAnalysis || analysisLoading) {
      return;
    }

    setAnalysisLoading(true);
    setAnalysisError("");

    try {
      const response = await axios.post("/api/logs/ai-analysis", {
        logs: burstLogs,
      });
      setAiAnalysis(response.data.insight || "No AI analysis returned.");
    } catch (error) {
      console.error("Error fetching AI analysis:", error);
      setAnalysisError("Could not fetch AI analysis for this error burst.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAnalysisPanelOpen(false);
  };

  return (
    <Dashboard
      logs={filteredLogs}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      alertActive={burstLogs.length === ERROR_BURST_SIZE}
      analysisPanelOpen={analysisPanelOpen}
      aiAnalysis={aiAnalysis}
      analysisLoading={analysisLoading}
      analysisError={analysisError}
      onAlertClick={handleAlertClick}
      onCloseAlert={handleCloseAlert}
    />
  );
}

export default App;
