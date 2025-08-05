import React, { useState } from "react";
import axios from "axios";

function ReportTable({ data}) {
  const [selectedWinners, setSelectedWinners] = useState([]);
  const [loadingEmail, setLoadingEmail] = useState("");
  const [showWinnerList,setShowWinnerList] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [error, setError] = useState("");
  const [winners, setWinners] = useState(0);

  const headers = data.length ? Object.keys(data[0]) : [];

  const handleWinnerClick = async (row) => {
    setLoadingEmail(row.email);
    try {
      const response = await axios.post("http://localhost:4000/api/save-winner", row);
      if (response.data.success) {
        setSelectedWinners((prev) => [...prev, row]);
      } else {
        alert(response.data.message || "Could not select winner.");
      }
    } catch (error) {
      console.error("Error saving winner:", error);
      alert("Error saving winner. Maybe already selected?");
    } finally {
      setLoadingEmail("");
    }
  };
  
    const handleSelectWinner = async () => {
      if(winners >= data.length) alert('Selected winner is not in list')
        try {
        const result = data.filter(user => !selectedWinners?.find(winner => winner.email === user.email));
        const selectedWinner = [...result].sort(() => 0.5 - Math.random()).slice(0, winners);
        const promise = selectedWinner.map(async(winner) => await axios.post("http://localhost:4000/api/save-winner", winner))
        await Promise.all(promise)
        setSelectedWinner([...selectedWinner, ...selectedWinners])
        setShowWinnerList(true);
      } catch (err) {
        setError("No more new winners or error");
      }
    };
    const handleChange = (e) => {
      const value = e.target.value;
      setWinners(parseInt(value))
     }

  return (
    <>
            {error && <div className="alert alert-danger">{error}</div>}
    
              {data.length > 0 ? (
      !showWinnerList ? (
        <>
        <input type="text"
                className="form-control"
                onChange={handleChange}/>
        <button className="btn btn-primary" onClick={handleSelectWinner}>
          Selected Winner List
        </button>
        </>
      ) : (
        <button className="btn btn-secondary" onClick={() => {
          setShowWinnerList(false);
          setSelectedWinner(null); 
        }}>
          Close Winner List
        </button>
      )
    ) : null}
    
    <div className="table-responsive mt-4">
      <table className="table table-bordered table-striped">
        <thead className="table-dark text-center">
        <tr>
        {headers.map((header, idx) => (
  <th key={idx}>
    {header.charAt(0).toUpperCase() + header.slice(1)}
  </th>
))}

    <th>Action</th> 
  </tr>
        </thead>
        <tbody className="text-center">
          {(Array.isArray(showWinnerList ? selectedWinner : data) 
  ? (showWinnerList ? selectedWinner : data) 
  : []
).map((row, idx) => {
            let isSelected = !!selectedWinners?.find(winner => winner.email === row.email);
            return (
              <tr key={idx}>
                {headers.map((header, hIdx) => (
                  <td key={hIdx}>{row[header]}</td>
                  
                ))}
                <td>
                  <button
                    className="btn btn-sm btn-success"
                    disabled={isSelected || loadingEmail === row.email || showWinnerList}
                    onClick={() => handleWinnerClick(row)}
                  >
                    {isSelected || showWinnerList ? "Selected" : loadingEmail === row.email ? "Selecting..." : "Winner"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </>

  );
}

export default ReportTable;
