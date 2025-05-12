import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Modal from "./modal";
import "./wishlist.css";

export default function WishlistDetails() {
  const { id } = useParams(); // wishlistId
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", image: "", price: "" });
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoize fetchProducts with useCallback to prevent unnecessary re-renders
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://wishlist-backend-2-aoy9.onrender.com/api/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  }, [id, token]); // Dependencies are id and token

  useEffect(() => {
    fetchProducts(); // Call the memoized function
  }, [fetchProducts]); // Dependency on the memoized fetchProducts function

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/products/${editingProductId}`,
          { name: form.name, image: form.image, price: form.price },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Product updated!");
      } else {
        await axios.post(
          "http://localhost:5000/api/products",
          { ...form, wishlistId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Product added!");
      }

      setForm({ name: "", image: "", price: "" });
      setIsEditing(false);
      setEditingProductId(null);
      fetchProducts();
      setIsModalOpen(false); // Close the modal after submission
    } catch (err) {
      setMessage("Error submitting product");
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const handleEditClick = (product) => {
    setForm({
      name: product.name,
      image: product.image,
      price: product.price,
    });
    setIsEditing(true);
    setEditingProductId(product._id);
    setIsModalOpen(true); // Open modal in edit mode
  };

  const handleAddClick = () => {
    setForm({ name: "", image: "", price: "" });
    setIsEditing(false);
    setIsModalOpen(true); // Open modal in add mode
  };

  return (
    <div className="full-screen">
      <h2 className="title">Wishlist Items</h2>

      <button onClick={handleAddClick} className="submit-btn">
        Add Product
      </button>

      {message && <p className="message">{message}</p>}

      <div className="product-grid">
        {products.map((p) => (
          <div key={p._id} className="product-card">
            <img
              src={p.image || "https://via.placeholder.com/150"}
              alt={p.name}
              className="product-image"
            />
            <h3 className="product-name">{p.name}</h3>
            <p className="product-price">₹{p.price}</p>
            <div className="card-actions">
              <button
                onClick={() => handleDelete(p._id)}
                className="card-button delete"
              >
                Delete
              </button>
              <button
                onClick={() => handleEditClick(p)}
                className="card-button"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAdd}
        product={form}
        isEditing={isEditing}
        onChange={handleChange}
      />
    </div>
  );
}
