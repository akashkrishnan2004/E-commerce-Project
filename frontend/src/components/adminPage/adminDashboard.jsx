// Main
// import { useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";

// export default function AdminDashboard() {
//   const navigate = useNavigate();

//   // Admin check
//   useEffect(() => {
//     const isAdmin = localStorage.getItem("isAdmin");
//     if (isAdmin !== "true") {
//       navigate("/admin/login");
//     }
//   }, [navigate]);

//   //   Logout
//   const handleLogout = () => {
//     localStorage.removeItem("isAdmin");
//     navigate("/admin/login");
//   };

//   return (
//     <div>
//       <h1>AdminDashboard</h1>
//       <Link to="/admin/product-add">
//         <button>Produt Add</button>
//       </Link>
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// }
// Main

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import "./adminCss/adminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [products, setProducts] = useState([]);

  // Check admin auth
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/get-products");
      setProducts(res.data.products);
    } catch (error) {
      console.error("Failed to load products", error);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete a product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`http://localhost:3000/api/delete-product/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Delete failed");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  // Combine search + filter
  const filteredAndSearched = products.filter((product) => {
    const matchesBrand =
      !statusFilter ||
      product.brand.toLowerCase() === statusFilter.toLowerCase();

    const matchesSearch =
      product.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesBrand && matchesSearch;
  });

  return (
    <div className="admin-dashboard">
      {/* Top Nav */}
      <nav className="admin-dashboard-nav">
        <h1>Admin Dashboard</h1>
        <div className="admin-dashboard-buttons">
          <Link to="/admin/product-add">
            <button>Add Product</button>
          </Link>
          <Link to="/admin/app-reviews">
            <button>View App Reviews</button>
          </Link>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <nav className="admin-dashboard-nav2">
        <input
          type="search"
          placeholder="Search Mobiles"
          className="product-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Filter/Search */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-select-box"
        >
          <option value="">All</option>
          <option value="Apple">Apple</option>
          <option value="Samsung">Samsung</option>
          <option value="Oneplus">Oneplus</option>
          <option value="Oppo">Oppo</option>
          <option value="Realme">Realme</option>
          <option value="Vivo">Vivo</option>
          <option value="Nothing">Nothing</option>
        </select>
      </nav>

      {/* Product Grid */}
      <div>
        {filteredAndSearched.length === 0 ? (
          <p className="no-product">No products found.</p>
        ) : (
          <div className="product-grid">
            {filteredAndSearched.map((product) => (
              <div className="product-card" key={product._id}>
                <h3>{product.modelName}</h3>
                <div className="product-price-details">
                  <h4>₹ {product.price}</h4>
                  <h5>{product.discount.percentage}% Offer</h5>
                </div>
                <img src={product.images[0]} alt={product.modelName} />
                <div className="product-btns">
                  <Link to={`/admin/product-edit/${product._id}`}>
                    <button className="product-edit-btn">Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="product-delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
