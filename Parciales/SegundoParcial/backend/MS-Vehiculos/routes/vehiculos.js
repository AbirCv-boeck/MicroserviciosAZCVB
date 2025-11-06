import express from "express";
import { Vehiculo } from "../models/vehiculo.js";
import { verificarToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verificarToken);

router.get("/", async (req, res) => {
  const vehiculos = await Vehiculo.find();
  res.json(vehiculos);
});

router.get("/:id", async (req, res) => {
  const vehiculo = await Vehiculo.findById(req.params.id);
  if (!vehiculo) return res.status(404).json({ message: "Vehículo no encontrado" });
  res.json(vehiculo);
});


router.post("/", async (req, res) => {
  try {
    const vehiculo = new Vehiculo(req.body);
    await vehiculo.save();
    res.status(201).json(vehiculo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vehiculo) return res.status(404).json({ message: "Vehículo no encontrado" });
    res.json(vehiculo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findByIdAndDelete(req.params.id);
    if (!vehiculo) return res.status(404).json({ message: "Vehículo no encontrado" });
    res.json({ message: "Vehículo eliminado" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
