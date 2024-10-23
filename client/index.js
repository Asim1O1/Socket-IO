import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Creating a chat app!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
