import { connect } from "mongoose";

console.log(process.env.MONGO_URI);

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("database connected successfully");
  } catch (error) {
    console.log(error);
    res.statu(500).json(error);
  }
};

export default { connectDB };
