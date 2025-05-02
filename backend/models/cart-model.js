import mongoose from "mongoose";
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mobile_products",
      required: true,
    },
    productName: {
      type: String,
      ref: "mobile_products",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;

// import mongoose from "mongoose";

// const cartSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     required: true,
//   },
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     default: 1,
//   },
// });

// export default mongoose.model("Cart", cartSchema);
