// // main
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// import "./productDetails.css";

// export default function ProductDetails() {
//   const { id } = useParams();
//   const [product, setProduct] = useState({});
//   const [selectedImage, setSelectedImage] = useState("");

//   useEffect(() => {
//     const getProduct = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/api/get-product/${id}`
//         );
//         setProduct(response.data.product);
//         setSelectedImage(response.data.product.images?.[0]);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     getProduct();
//   }, [id]);

//   console.log(product);

//   return (
//     <div>
//       {!product ? (
//         <p>Loading.....</p>
//       ) : (
//         <div className="product-container">
//           <div className="product-details-image-set">
//             <div className="other-images">
//               {product.images?.map((img, index) => (
//                 <img
//                   key={index}
//                   src={img}
//                   alt={`Image ${index + 1}`}
//                   onClick={() => setSelectedImage(img)}
//                   className={`thumbnail ${
//                     selectedImage === img ? "selected-thumbnail" : ""
//                   }`}
//                 />
//               ))}
//             </div>
//             <div className="product-details-center-section">
//               <img
//                 src={selectedImage}
//                 alt={product?.modelName}
//                 className="main-image"
//               />
//               <div className="product-buttons">
//                 <button className="cart-btn">
//                   <span>
//                     <i className="fa-solid fa-cart-shopping"></i>
//                   </span>
//                   ADD TO CART
//                 </button>
//                 <button className="buy-btn">
//                   <span>
//                     <i className="fa-solid fa-bolt-lightning"></i>
//                   </span>
//                   BUY NOW
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="product-details">
//             <h1>{product.modelName}</h1>
//             <p>{product.description}</p>

//             {product.discount?.percentage > 0 && (
//               <div className="price-details">
//                 <h2 className="discounted-price">
//                   ₹
//                   {product.price -
//                     (product.price * product.discount.percentage) / 100}
//                 </h2>
//                 <h4 className="original-price">₹{product.price}</h4>
//                 <h4 className="discount">{product.discount.percentage}% off</h4>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// // main

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import toast from "react-hot-toast";

import "./productDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [selectedImage, setSelectedImage] = useState("");
  const [inCart, setInCart] = useState(false);

  const userId = localStorage.getItem("User Id");

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/get-product/${id}`
        );
        setProduct(response.data.product);
        setSelectedImage(response.data.product.images?.[0]);
      } catch (error) {
        console.error(error);
      }
    };

    const checkInCart = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(
          `http://localhost:3000/api/is-in-cart/${userId}/${id}`
        );
        setInCart(response.data.inCart);
      } catch (error) {
        console.error(error);
      }
    };

    getProduct();
    checkInCart();
  }, [id, userId]);

  const handleCartToggle = async () => {
    if (!userId) {
      toast.error("Please log in to manage your cart.");
      return;
    }

    try {
      if (inCart) {
        await axios.post("http://localhost:3000/api/remove-from-cart", {
          userId,
          productId: product._id,
        });
        toast.success("Removed from cart");
        setInCart(false);
      } else {
        await axios.post("http://localhost:3000/api/add-to-cart", {
          userId,
          productId: product._id,
          productName: product.modelName,
          quantity: 1,
        });
        toast.success("Added to cart");
        setInCart(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handeleBuyMobile = async () => {
    toast.error("Product is currently not available");
  };

  console.log(product);

  return (
    <div>
      {!product ? (
        <p>Loading.....</p>
      ) : (
        <div className="product-container">
          <div className="product-details-image-set">
            <div className="other-images">
              {product.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Image ${index + 1}`}
                  onClick={() => setSelectedImage(img)}
                  className={`thumbnail ${
                    selectedImage === img ? "selected-thumbnail" : ""
                  }`}
                />
              ))}
            </div>
            <div className="product-details-center-section">
              <img
                src={selectedImage}
                alt={product?.modelName}
                className="main-image"
              />
              <div className="product-buttons">
                <button className="cart-btn" onClick={handleCartToggle}>
                  <span>
                    {inCart ? (
                      <i className="fa-solid fa-trash"></i>
                    ) : (
                      <i className="fa-solid fa-cart-shopping"></i>
                    )}
                  </span>
                  {inCart ? "REMOVE FROM CART" : "ADD TO CART"}
                </button>
                <button className="buy-btn" onClick={handeleBuyMobile}>
                  <span>
                    <i className="fa-solid fa-bolt-lightning"></i>
                  </span>
                  BUY NOW
                </button>
              </div>
            </div>
          </div>
          <div className="product-details">
            <h1>{product.modelName}</h1>
            <p>{product.description}</p>

            {product.discount?.percentage > 0 && (
              <div className="price-details">
                <h2 className="discounted-price">
                  ₹
                  {product.price -
                    (product.price * product.discount.percentage) / 100}
                </h2>
                <h3 className="original-price">₹{product.price}</h3>
                <h3 className="discount">
                  {/* <i className="fa-solid fa-arrow-down"></i>  */}
                  {product.discount.percentage}% off
                </h3>
              </div>
            )}
            <div>
              <h3>Key Features</h3>
              <ul className="product-key-features">
                <li>
                  <span>RAM</span> {product.ram}
                </li>
                <li>
                  <span>Storage</span> {product.storage}
                </li>
                <li>
                  <span>Processor</span> {product.processor}
                </li>
                <li>
                  <span>Display</span> {product.displaySize}
                </li>
                <li>
                  <span>OS</span> {product.os}
                </li>
                <li>
                  <span>Battery</span> {product.battery}
                </li>
                <li>
                  <span>Camera</span> {product.camera}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
    </div>
  );
}
