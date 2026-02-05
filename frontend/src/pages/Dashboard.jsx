import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Dashboard() {

  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  // Fetch user's files
  const fetchFiles = async () => {
    const res = await API.get("/files/myfiles");
    setFiles(res.data.files);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Upload file
  const handleUpload = async (e) => {

    e.preventDefault();

    if (!file) return alert("Choose file first");

    const formData = new FormData();
    formData.append("file", file);

    await API.post("/files/upload", formData);

    alert("Backup uploaded securely");

    fetchFiles();
  };

  // Restore file
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

        <h2>User Dashboard</h2>

        {/* Upload Section */}

        <form onSubmit={handleUpload}>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button type="submit">
            Upload Backup
          </button>

        </form>

        <h3>My Backups</h3>

        {files.map((f) => (

          <div key={f._id} className="fileBox">

<div>
  <b>{f.filename}</b>
  <br />
  <small>
    Uploaded: {new Date(f.createdAt).toLocaleString()}
  </small>
</div>

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