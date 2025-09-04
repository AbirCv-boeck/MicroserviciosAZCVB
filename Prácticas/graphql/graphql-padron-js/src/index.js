// index.js
require("reflect-metadata");
const { DataSource } = require("typeorm");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema/typeDefs");
const Mesa = require("./entity/Mesa");
const Padron = require("./entity/Padron");

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "123azc",
  database: "graphql_practica",
  synchronize: true,
  logging: false,
  entities: [Mesa, Padron]
});

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Conectado a la base de datos");

    // Importamos resolvers después de inicializar la BD
    const resolvers = require("./schema/resolvers");

    const app = express();
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    app.listen(4000, () => {
      console.log(`🚀Servidor listo en http://localhost:4000${server.graphqlPath}`);
    });
  } catch (err) {
    console.error("❌ Error al iniciar el servidor:", err);
  }
}

startServer();

module.exports = { AppDataSource };
