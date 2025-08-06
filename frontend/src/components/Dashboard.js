import React, { useState } from "react";
import axios from "axios";
import ReportTable from "./ReportTable";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState([]);
  
  const [error, setError] = useState("");
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("https://mediakart-1.onrender.com/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setReport(response.data.data);
      setError("");
    } catch (err) {
      setError("Failed to upload file");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2 className="mb-4 text-center">Admin Dashboard</h2>

        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        <div className="d-flex gap-2 mb-4">
          <button className="btn btn-success" onClick={handleFileUpload} disabled={!file ? true : false}>
            Upload CSV
          </button>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}

        <ReportTable data={report}/>
      </div>
    </div>
  );
}

export default Dashboard;
