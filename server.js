const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;

// Receive and perse json file
app.use(express.json);

// Setup path for static css file
app.use("/", express.static(path.join(__dirname, "public")));

// Root routes
app.use("/", require("./routes/root"));

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

app.listen(PORT, () => console.log(`Server running on port ${PORT} `));
