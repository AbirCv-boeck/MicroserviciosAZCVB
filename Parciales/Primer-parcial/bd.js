const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "123azc",
    database: "medico_db",
    synchronize: true,
    logging: false,
    entities: [__dirname + "/entity/*.js"],
});

module.exports = AppDataSource;
