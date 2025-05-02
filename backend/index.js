import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDb from "./connection.js";
import router from "./routes/router.js";
import adminRouter from "./routes/admin-router.js";

dotenv.config();
const app = express();

// middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// route
app.use("/api", router)
// admin route
app.use("/admin", adminRouter);
// app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static("uploads"));


connectDb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Server started on port ${PORT}`);
  }
});
