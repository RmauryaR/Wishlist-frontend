import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./dashboard.css";

export default function Dashboard() {
  const [wishlists, setWishlists] = useState([]);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  
  const token = localStorage.getItem("token");

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get("https://wishlist-backend-2-aoy9.onrender.com/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(res.data.name); // assuming `name` is returned
    } catch (err) {
      console.error("Error fetching user info", err);
    }
  };

  fetchUser();
  fetchWishlists();
}, [fetchWishlists, token]);

  const fetchWishlists = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://wishlist-backend-2-aoy9.onrender.com/api/wishlists",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWishlists(res.data);
    } catch (err) {
      console.error("Failed to fetch wishlists", err);
    }
  }, [token]);

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://wishlist-backend-2-aoy9.onrender.com/api/wishlists",
        { title: category, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategory("");
      setMessage("Wishlist created!");
      fetchWishlists();
    } catch (err) {
      setMessage("Error creating wishlist");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this wishlist?"))
      return;
    try {
      await axios.delete(`https://wishlist-backend-2-aoy9.onrender.com/api/wishlists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Wishlist deleted!");
      fetchWishlists();
    } catch (err) {
      console.error("Failed to delete wishlist", err);
      setMessage("Error deleting wishlist");
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">{userName ? `${userName}'s Dashboard` : "User's Dashboard"}</h2>

      <form onSubmit={handleCreate} className="dashboard-form">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="dashboard-select"
          required
        >
          <option value="">Select Wishlist Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothes">Clothes</option>
          <option value="Beauty Products">Beauty Products</option>
          <option value="Shoes">Shoes</option>
          <option value="Smartphones">Smartphones</option>
          <option value="Home & Kitchen">Home & Kitchen</option>
          <option value="Other">Other</option>
        </select>

        <button type="submit" className="dashboard-btn">
          Create Wishlist
        </button>
      </form>

      {message && <p className="dashboard-message">{message}</p>}

      <ul className="wishlist-list">
        {wishlists.map((list) => (
          <li key={list._id} className="wishlist-item">
            <Link to={`/wishlist/${list._id}`} className="wishlist-link">
              {list.title}
            </Link>
            <button
              onClick={() => handleDelete(list._id)}
              className="delete-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
