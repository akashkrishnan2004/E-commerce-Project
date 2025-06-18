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
    required: true,
  },
  storage: {
    type: String,
    required: true,
  },
  battery: {
    type: String,
    required: true,
  },
  processor: {
    type: String,
    required: true,
  },
  camera: {
    type: String,
    required: true,
  },
  displaySize: {
    type: String,
    required: true,
  },
  os: {
    type: String,
    required: true,
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
    required: true,
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
  showOnSite: {
      type: Boolean,
      default: false,
    },
});

const mobileModel = mongoose.model("mobile_products", mobileSchema);

export default mobileModel;
