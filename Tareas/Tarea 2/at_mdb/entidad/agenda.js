const mongoose = require("mongoose");

const agendaSchema = new mongoose.Schema({
    nombres: { type: String, required: true, maxlength: 100 },
    apellidos: { type: String, required: true, maxlength: 100 },
    fecha_nacimiento: { type: Date, required: true },
    direccion: { type: String, maxlength: 255 },
    celular: { type: String, maxlength: 20 },
    correo: { type: String, maxlength: 100 }
});

// Exportamos el modelo
module.exports = mongoose.model("agenda", agendaSchema);
