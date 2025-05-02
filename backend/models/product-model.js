import mongoose from "mongoose";

const mobileSchema = new mongoose.Schema({
  modelName: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  ram: {
    type: String,
  },
  storage: {
    type: String,
  },
  battery: {
    type: String,
  },
  processor: {
    type: String,
  },
  camera: {
    type: String,
  },
  displaySize: {
    type: String,
  },
  os: {
    type: String,
  },
  images: {
    type: [String],
    validate: {
      validator: function (val) {
        return val.length === 5;
      },
      message: "Exactly 5 images are required.",
    },
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  discount: {
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const mobileModel = mongoose.model("mobile_products", mobileSchema);

export default mobileModel;
