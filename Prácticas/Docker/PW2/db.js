const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://mongo:27017/todolistdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB conectado');
    } catch (err) {
        console.error('Error conectando a MongoDB:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
