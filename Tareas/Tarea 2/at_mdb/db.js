const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/agendaDB";

const AppDataSource = mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Conexión a MongoDB lista"))
.catch(err => console.error("Error de conexión:", err));

module.exports = AppDataSource;
