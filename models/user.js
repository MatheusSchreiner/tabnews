import database from "infra/database";
import { ValidationError, NotFoundError } from "infra/errors";

async function create(userInputValues) {
  await validateUniqueUsernameAndEmail(
    userInputValues.username,
    userInputValues.email,
  );

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueUsernameAndEmail(username, email) {
    const result = await database.query({
      text: `
      SELECT 
        username, email
      FROM
        users
        WHERE
          LOWER(username) = LOWER($1)
        OR 
          LOWER(email) = LOWER($2)
      ;`,
      values: [username, email],
    });

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "O campo 'username' ou 'email' já cadastrado ou invalido",
        action: "Utilize outro 'username' ou 'email' para realizar o cadastro.",
      });
    }
  }

  async function runInsertQuery(userInputValues) {
    const result = await database.query({
      text: `
      INSERT INTO 
        users (username, email, password) 
      VALUES 
        ($1, $2, $3)
      RETURNING
        *
      ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });
    return result.rows[0];
  }
}

async function findOneByUsername(username) {
  const userFound = await runSelectQuery(username);

  return userFound;

  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        LIMIT
          1
        ;`,
      values: [username],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
      });
    }

    return results.rows[0];
  }
}

const user = {
  create,
  findOneByUsername,
};

export default user;
