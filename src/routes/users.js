const express = require("express");
const client = require('../database/db_unravel.js');


const router = express.Router();

//* - - - </> [Route to get the users] </> - - - *//
router.get("/users", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM tb_users");
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});



//* - - - </> [Route to get the users by ID] </> - - - *//
router.get("/users/:user_id", async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  try {
    const result = await client.query(
      "SELECT * FROM tb_users WHERE user_id = $1",
      [user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});



//* - - - </> [Route to delete the users by ID] </> - - - *//
router.delete("/users/:user_id", async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  try {
    const result = await client.query(
      "DELETE FROM tb_users WHERE user_id = $1 RETURNING *",
      [user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});



//* - - - </> [Route to toggle user_status by ID] </> - - - *//
router.put("/users/:user_id/toggle-status", async (req, res) => {
  const user_id = parseInt(req.params.user_id);

  try {
    // Primero, obtenemos el estado actual del usuario
    const currentStatusResult = await client.query(
      "SELECT user_status FROM tb_users WHERE user_id = $1",
      [user_id]
    );

    if (currentStatusResult.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Alternamos el valor de user_status
    const currentStatus = currentStatusResult.rows[0].user_status;
    const newStatus = !currentStatus;

    // Actualizamos el estado del usuario
    const result = await client.query(
      "UPDATE tb_users SET user_status = $1 WHERE user_id = $2 RETURNING *",
      [newStatus, user_id]
    );

    res.json({ message: "Estado del usuario alternado", user: result.rows[0] });
  } catch (err) {
    console.error("Error alternando el estado del usuario", err.stack);
    res.status(500).json({ error: "Error ejecutando la consulta" });
  }
});



//* - - - </> [Route to create the users] </> - - - *//
router.post("/users", async (req, res) => {
  const {
    user_name,
    user_lastname,
    user_email,
    user_phone,
    user_birthdate,
    user_status,
    user_type_id,
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO tb_users (
          user_name, user_lastname, user_email, user_phone,
          user_birthdate, user_status, user_type_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7
        ) RETURNING *`,
      [
        user_name,
        user_lastname,
        user_email,
        user_phone,
        user_birthdate,
        user_status,
        user_type_id,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});

// Route to update a user
router.put("/users/:user_id", async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  const {
    user_name,
    user_lastname,
    user_email,
    user_phone,
    user_birthdate,
    user_status,
    user_type_id,
  } = req.body;

  try {
    const result = await client.query(
      "UPDATE tb_users SET user_name = $1, user_lastname = $2, user_email = $3, user_phone = $4, user_birthdate = $5, user_status = $6, user_type_id = $7 WHERE user_id = $8 RETURNING *",
      [
        user_name,
        user_lastname,
        user_email,
        user_phone,
        user_birthdate,
        user_status,
        user_type_id,
        user_id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating user", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});



module.exports = router;
