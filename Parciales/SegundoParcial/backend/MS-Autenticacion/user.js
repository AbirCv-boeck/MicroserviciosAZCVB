import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  tableName: "usuarios",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 100,
    },
    correo: {
      type: "varchar",
      length: 100,
      unique: true,
    },
    password: {
      type: "varchar",
      length: 255,
    },
  },
});
