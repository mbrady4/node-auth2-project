const knex = require("knex");
const config = require("../knexfile");

const db = knex(config.development);

module.exports = {
  getAll,
  insert,
  findBy,
};

function getAll() {
  return db("users");
}

async function insert(user) {
  try {
    const [id] = await db("users").insert(user, "id");

    return findBy(id);
  } catch (error) {
    throw error;
  }
}

function findBy(filter) {
  return db("users").where(filter).first();
}

