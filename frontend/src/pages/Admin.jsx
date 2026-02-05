import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Admin() {

  const [files, setFiles] = useState([]);

  const fetchAll = async () => {

    const res = await API.get("/files/all");

    setFiles(res.data.files);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleRestore = async (id, filename) => {

    const res = await API.get(`/files/restore/${id}`, {
      responseType: "blob"
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  };

  return (

    <>
      <Navbar />

      <div className="container">

        <h2>Admin Recovery Panel</h2>

        {files.map((f) => (

          <div key={f._id} className="fileBox">

            <span>
              {f.filename} — {f.ownerId.email}
            </span>

            <button
              onClick={() => handleRestore(f._id, f.filename)}
            >
              Restore
            </button>

          </div>

        ))}

      </div>

    </>
  );
}