import Cart from "../models/cart-model.js";

// Add to cart
export const addToCart = async (req, res) => {
  const { userId, username, productId, productName, quantity } = req.body;
  try {
    let cartItem = await Cart.findOne({ userId, productId });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new Cart({
        userId,
        username,
        productId,
        productName,
        quantity,
      });
      await cartItem.save();
    }
    res.status(200).json({ message: "Added to cart", cartItem });
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart", err });
  }
};

// get all carted product
export const getAllCartedProducts = async (req, res) => {
  try {
    const cartedProducts = await Cart.find();
    res.status(200).json({ cartedProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    await Cart.findOneAndDelete({ userId, productId });
    res.status(200).json({ message: "Removed from cart" });
  } catch (err) {
    res.status(500).json({ message: "Error removing from cart", err });
  }
};

// Check it is in cart
export const isInCart = async (req, res) => {
  const { userId, productId } = req.params;
  try {
    const cartItem = await Cart.findOne({ userId, productId });
    res.status(200).json({ inCart: !!cartItem });
  } catch (err) {
    res.status(500).json({ message: "Error checking cart", err });
  }
};

export const getCartProductById = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cartItem = await Cart.findOne({ userId, productId }).populate(
      "productId"
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ cartItem });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart item", error: err });
  }
};

// get carted product by user
export const getUserCart = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Get all cart items for the user and populate the related product details
    const cartedItems = await Cart.find({ userId }).populate("productId");

    res.status(200).json({ cartedItems });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Failed to get cart items", error });
  }
};
