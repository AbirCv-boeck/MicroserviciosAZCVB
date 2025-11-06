import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import vehiculosRoutes from "./routes/vehiculos.js";

dotenv.config();
const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Error MongoDB:", err));


app.use("/vehiculos", vehiculosRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
