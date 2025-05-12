import React from "react";
import "./modal.css";

const Modal = ({ isOpen, onClose, onSubmit, product, isEditing, onChange }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}>
          X
        </button>
        <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={onSubmit} className="modal-form">
          <input
            name="name"
            value={product.name}
            onChange={onChange}
            placeholder="Product Name"
            className="input"
          />
          <input
            name="image"
            value={product.image}
            onChange={onChange}
            placeholder="Image URL"
            className="input"
          />
          <input
            name="price"
            value={product.price}
            onChange={onChange}
            placeholder="Price"
            type="number"
            className="input"
          />
          <button
            type="submit"
            className="submit-btn"
            disabled={!product.name || !product.image || !product.price}
          >
            {isEditing ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
