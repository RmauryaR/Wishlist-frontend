import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        My Wishlist
      </Link>

      <div className="nav-links">
        {token && <Link to="/dashboard">Dashboard</Link>}
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

//=======================================================================================================
