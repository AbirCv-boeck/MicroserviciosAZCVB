const { getRepository } = require("typeorm");
const Libro = require("../entity/libro");
const Prestamo = require("../entity/prestamo");

const resolvers = {
  Query: {
    // Obtener todos los libros con historial de préstamos
    getLibros: async () => {
      return await getRepository(Libro).find({ relations: ["prestamos"] });
    },

    // Obtener todos los préstamos con el libro asociado
    getPrestamos: async () => {
      return await getRepository(Prestamo).find({ relations: ["libro"] });
    },

    // Obtener préstamo por ID
    getPrestamoById: async (_, { id }) => {
      return await getRepository(Prestamo).findOne({
        where: { id },
        relations: ["libro"]
      });
    }
  },

  Mutation: {
    // Crear un libro
    createLibro: async (_, { titulo, autor, isbn, anio_publicacion }) => {
      const repo = getRepository(Libro);
      const libro = repo.create({ titulo, autor, isbn, anio_publicacion });
      return await repo.save(libro);
    },

    // Registrar un préstamo
    createPrestamo: async (_, { usuario, fecha_prestamo, fecha_devolucion, libroId }) => {
      const repoPrestamo = getRepository(Prestamo);
      const repoLibro = getRepository(Libro);

      const libro = await repoLibro.findOne({ where: { id: libroId } });
      if (!libro) throw new Error("Libro no encontrado");

      const prestamo = repoPrestamo.create({
        usuario,
        fecha_prestamo,
        fecha_devolucion,
        libro
      });

      return await repoPrestamo.save(prestamo);
    }
  }
};

module.exports = resolvers;
