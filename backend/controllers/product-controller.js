import mongoose from "mongoose";

import mobileModel from "../models/product-model.js";

// Add color section
export const createProduct = async (req, res) => {
  try {
    const {
      modelName,
      brand,
      description,
      price,
      ram,
      storage,
      battery,
      processor,
      camera,
      displaySize,
      os,
      images,
      stock,
      discount,
    } = req.body;

    // Validate images (exactly 5)
    if (!images || !Array.isArray(images) || images.length !== 5) {
      return res
        .status(400)
        .json({ message: "Exactly 5 images must be provided." });
    }

    // Normalize model name and brand
    const normalizedModelName = modelName.trim().toLowerCase();
    const normalizedBrand = brand.trim().toLowerCase();

    //  Check for duplicate (case-insensitive)
    const existingProduct = await mobileModel.findOne({
      modelName: { $regex: `^${normalizedModelName}$`, $options: "i" },
      brand: { $regex: `^${normalizedBrand}$`, $options: "i" },
    });

    if (existingProduct) {
      return res.status(409).json({
        message: "Product already exists with the same model name and brand.",
      });
    }

    //  Create new product
    const newMobile = new mobileModel({
      modelName: modelName.trim(),
      brand: brand.trim(),
      description,
      price,
      ram,
      storage,
      battery,
      processor,
      camera,
      displaySize,
      os,
      images,
      stock,
      discount,
    });

    await newMobile.save();

    res.status(201).json({
      message: "Mobile product added successfully.",
      product: newMobile,
    });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// get products
export const getProducts = async (req, res) => {
  try {
    const products = await mobileModel.find();

    res.status(200).json({
      message: "All products found",
      products: products,
    });
  } catch (error) {
    console.error("Products not found", error);

    res.status(500).json({
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

// get product by id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await mobileModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product found", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete product
export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await mobileModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update product
export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      modelName,
      brand,
      description,
      price,
      ram,
      storage,
      battery,
      processor,
      camera,
      displaySize,
      os,
      images,
      stock,
      discount,
      showOnSite,
      showLabel,
    } = req.body;

    // Validate images (if provided)
    if (images && (!Array.isArray(images) || images.length !== 5)) {
      return res
        .status(400)
        .json({ message: "Exactly 5 images must be provided." });
    }

    //  Build update object dynamically
    const updateData = {
      ...(modelName && { modelName: modelName.trim() }),
      ...(brand && { brand: brand.trim() }),
      ...(description && { description }),
      ...(price && { price: Number(price) }),
      ...(ram && { ram }),
      ...(storage && { storage }),
      ...(battery && { battery }),
      ...(processor && { processor }),
      ...(camera && { camera }),
      ...(displaySize && { displaySize }),
      ...(os && { os }),
      ...(images && { images }),
      ...(stock && { stock: Number(stock) }),
      ...(discount && {
        discount: { percentage: Number(discount.percentage) || 0 },
      }),
      ...(showOnSite !== undefined && { showOnSite }),
      ...(showLabel !== undefined && { showLabel }),
    };

    const updatedProduct = await mobileModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// Allow to show product on site
export const toggleProductShowOnSite = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await mobileModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.showOnSite = !product.showOnSite;
    await product.save();

    res.status(200).json({
      message: "Visibility toggled",
      showOnSite: product.showOnSite,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to toggle visibility", error: err });
  }
};

// Allow to add a label "New Launch"
export const toggleAddlabel = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await mobileModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.showLabel = !product.showLabel;
    await product.save();

    res
      .status(200)
      .json({ message: "Label Added", showLabel: product.showLabel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to toggle launch", error: error });
  }
};
