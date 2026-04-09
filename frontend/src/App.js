import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:30007");

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:30007/api/logs")
      .then((res) => {
        setLogs(res.data.logs || []);
      });
  }, []);

  useEffect(() => {
    socket.on("new-log", (log) => {
      console.log("New log:", log);

      setLogs((prev) => [log, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Live Logs Dashboard</h1>

      

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Service</th>
            <th>Level</th>
            <th>Message</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody >
          {logs.map((log, index) => (
            <tr key={index} style={{
              color: log.level === "error" ? "red" : "green"
            }}>
              <td>{log.service}</td>
              <td>{log.level}</td>
              <td>{log.message}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;