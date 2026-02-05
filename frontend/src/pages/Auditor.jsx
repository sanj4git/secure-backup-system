import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Auditor() {

  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {

    const res = await API.get("/logs");

    setLogs(res.data.logs);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (

    <>
      <Navbar />

      <div className="container">

        <h2>Audit Logs</h2>

        {logs.map((l) => (

          <div key={l._id} className="fileBox">
            {l.action}
          </div>

        ))}

      </div>

    </>
  );
}