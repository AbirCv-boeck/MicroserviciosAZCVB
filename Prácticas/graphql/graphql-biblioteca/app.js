require("reflect-metadata");
const { createConnection, getRepository } = require("typeorm");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./schema/typeDefs");
const Libro = require("./entity/Libro");
const Prestamo = require("./entity/Prestamo");

async function startServer() {
  try {
    // Conexión a la base de datos
    await createConnection({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "123azc",
      database: "graphql_practica",
      synchronize: true,
      logging: false,
      entities: [Libro, Prestamo]
    });
    console.log("✅ Conectado a la base de datos");

    const resolvers = require("./schema/resolvers");

    const app = express();
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    app.listen(4000, () => {
      console.log(`🚀 Servidor listo en http://localhost:4000${server.graphqlPath}`);
    });
  } catch (err) {
    console.error("❌ Error al iniciar el servidor:", err);
  }
}

startServer();
