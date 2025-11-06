import mongoose from "mongoose";

const vehiculoSchema = new mongoose.Schema({
  placa: { type: String, required: true, unique: true },
  tipo: { type: String, enum: ["camion", "furgon", "moto"], required: true },
  capacidad: { type: Number, required: true }, // en kilos
  estado: { type: String, enum: ["disponible", "en ruta", "mantenimiento"], default: "disponible" }
}, { timestamps: true });

export const Vehiculo = mongoose.model("Vehiculo", vehiculoSchema);
