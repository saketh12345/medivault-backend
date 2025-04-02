const connectDB = require('./config');

connectDB();


require("./db"); // Import the database connection file

const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Hello, Backend is Running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
