require("dotenv").config();
const express=require("express");
const db=require("./config/db");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const constants=require("./constants");
const errorHandler=require("./middleware/errorHandler");
const app=express();
const port=process.env.PORT||constants.DEFAULT_PORT;
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: ['http://127.0.0.1:5501', 'http://localhost:5501'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use("/api/alumni",require("./routes/alumni_Routes"));
app.use("/api/users",require("./routes/user_Routes"));
app.use(errorHandler);

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

const startServer = async () => {
  await db();
  app.listen(port,()=>{
      console.log(`Server is running on port ${port}`);
  });
};

startServer();