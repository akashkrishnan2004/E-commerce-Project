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
router.put("/update-user/:id", user.updateUserProfile);

// Product Route
router.post("/create-product", product.createProduct); // create product
router.get("/get-products", product.getProducts); // get all products
router.get("/get-product/:id", product.getProductById); // get product by id
router.put("/update-product/:id", product.updateProductById); // update product
router.delete("/delete-product/:id", product.deleteProductById); // delete product
router.patch("/toggle-show-product/:id", product.toggleProductShowOnSite); // show or hide product

// Message Route
router.post("/contact", message.createMessage); // create message
router.get("/get-all-messages", message.getAllMessages); // get all messages
router.delete("/delete-message/:id", message.deleteMessage); // delete message
router.patch("/toggle-show-message/:id", message.toggleShowOnSite); // permission to show message on site

// Cart products Route
router.post("/add-to-cart", cart.addToCart); // add item to cart
router.get("/get-all", cart.getAllCartedProducts); // get all carted products
router.post("/remove-from-cart", cart.removeFromCart); // remove product from cart
router.get("/user-cart/:userId", cart.getUserCart); // get users carted products

router.get("/is-in-cart/:userId/:productId", cart.isInCart);
router.get("/get-cart-item/:userId/:productId", cart.getCartProductById);

export default router;
