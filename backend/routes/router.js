import express from "express";

import * as user from "../controllers/user-controller.js";
import * as product from "../controllers/product-controller.js";
import * as message from "../controllers/message-controller.js";
import * as cart from "../controllers/cart-controller.js";

const router = express.Router();

// Register Route
router.post("/register", user.register);
router.post("/verify-otp", user.verifyOTP);
router.post("/resend-otp", user.resendOTP);
router.post("/login", user.login);
router.get("/get-users", user.getUsers);
router.get("/get-user/:id", user.getUser);
router.post("/send-otp", user.sendOTPForPasswordReset);
router.post("/reset-password", user.resetPassword);
// 
router.put("/update-user/:id", user.updateUserProfile);
// 


// Product
router.post("/create-product", product.createProduct);
router.get("/get-products", product.getProducts);
router.get("/get-product/:id", product.getProductById);
router.put("/update-product/:id", product.updateProductById);
router.delete("/delete-product/:id", product.deleteProductById);

// messages
router.post("/contact", message.createMessage);
router.get("/get-all-messages", message.getAllMessages);
router.delete("/delete-message/:id", message.deleteMessage);
router.patch("/toggle-show-message/:id", message.toggleShowOnSite);

// Cart products
router.post("/add-to-cart", cart.addToCart);
router.get("/get-all", cart.getAllCartedProducts);
router.post("/remove-from-cart", cart.removeFromCart);
router.get("/user-cart/:userId", cart.getUserCart);

router.get("/is-in-cart/:userId/:productId", cart.isInCart);
router.get("/get-cart-item/:userId/:productId", cart.getCartProductById);

export default router;
