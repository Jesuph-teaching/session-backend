if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");

const v1Router = require("./routers/v1");

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST,
  DB_USER = process.env.MONGODB_USER,
  DB_PASSWORD = process.env.MONGODB_PASSWORD,
  DB_NAME = process.env.MONGODB_DATABASE;

const app = express();

app.use("/api/v1", v1Router);

app.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "not_found",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "internal_server_error",
  });
});

mongoose
  .connect(DB_HOST, {
    user: DB_USER,
    pass: DB_PASSWORD,
    dbName: DB_NAME,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  });
