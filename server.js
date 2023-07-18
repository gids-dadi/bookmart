require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOption = require("./config/corsOption");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnect.js");
const PORT = process.env.PORT || 3500;

// Import Routes
const authRoutes = require("./routes/auth.route");
const bookRoutes = require("./routes/book.route");
const cartRoutes = require("./routes/cart.route");
const orderRoutes = require("./routes/order.route");

// Database connect
connectDB();

// Event logger
app.use(logger);

// Enable cors
app.use(cors(corsOption));

// Receive and parse json request body
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Setup path for static css file
app.use("/", express.static(path.join(__dirname, "public")));

// Root routes
app.use("/", require("./routes/root"));
// Api endpoints
app.use("/api", authRoutes);
app.use("/api", bookRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);

// All other request routes
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not  found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connection to MongoDB is successful");
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
