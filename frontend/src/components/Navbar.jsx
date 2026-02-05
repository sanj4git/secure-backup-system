import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    navigate("/");
  };

  return (
    <div style={{
      background: "#111",
      color: "white",
      padding: "12px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>

      <h3 style={{ margin: 0 }}>
        Secure Backup System
      </h3>

      <div>
        <span style={{ marginRight: "20px" }}>
          Role: {role}
        </span>

        <button
          onClick={handleLogout}
          style={{
            background: "white",
            color: "black",
            padding: "6px 12px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

    </div>
  );
}