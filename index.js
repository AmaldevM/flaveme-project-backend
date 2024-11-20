const express = require("express");
const { apiRouter } = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connectDB } = require("./config/db");
const port = 4000;

const app = express();
app.use(express.json());

// mongodb connection
connectDB();

// to get req.cookies
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);




app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
