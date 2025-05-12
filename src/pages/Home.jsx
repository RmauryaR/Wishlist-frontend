import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get(
          "http://wishlist-backend-2-aoy9.onrender.com/api/products/all"
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };

    fetchAllProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const uploaderMatch = product.addedBy?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const priceMatch = product.price.toString().includes(searchTerm);
    return nameMatch || uploaderMatch || priceMatch;
  });

  const handleSearchClick = () => {
    // This doesn't need to do anything now since filtering is live,
    // but it's kept for UI consistency if you'd like to add behavior later.
  };

  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to My Wishlist</h1>
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, uploader, or price..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button" onClick={handleSearchClick}>
            Search
          </button>
        </div>
      </header>

      <div className="product-grid">
        {filteredProducts.map((p) => (
          <div key={p._id} className="product-card">
            <img
              src={p.image || "https://via.placeholder.com/150"}
              alt={p.name}
              className="product-image"
            />
            <h2 className="product-name">{p.name}</h2>
            <p className="product-price">₹{p.price}</p>
            <p className="product-owner">
              Added by: {p.addedBy?.name || "Unknown"}
            </p>
          </div>
        ))}
      </div>
      <Header />
    </div>
  );
}
