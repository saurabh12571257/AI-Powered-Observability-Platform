import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

import Dashboard from "./components/Dashboard";

const socket = io("/");

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get("/api/logs")
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

  return <Dashboard logs={logs} />;
}

export default App;