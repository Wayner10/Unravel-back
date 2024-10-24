const express = require("express");
const client = require('../../database/db_unravel.js');

const router = express.Router();

//* - - - </> [Route to get the place types] </> - - - *//
router.get("/place-types", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM tb_place_types ORDER BY place_type_id");
    res.status(200).json({ 
      status: "Place types successfully found", 
      results: result.rows.length, 
      data: result.rows 
    });
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});

//* - - - </> [Route to get place type by ID] </> - - - *//
router.get("/place-types/:place_type_id", async (req, res) => {
  const place_type_id = parseInt(req.params.place_type_id);
  
  try {
    const result = await client.query(
      "SELECT * FROM tb_place_types WHERE place_type_id = $1",
      [place_type_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Place type not found" });
    }

    res.status(200).json({
      status: "Place type successfully found",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});

//* - - - </> [Route to create a new place type] </> - - - *//
router.post("/place-types", async (req, res) => {
  const { place_type_desc } = req.body;

  try {
    const result = await client.query(
      "INSERT INTO tb_place_types (place_type_desc) VALUES ($1) RETURNING *",
      [place_type_desc]
    );
    
    res.status(201).json({
      status: "Place type successfully created",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});

//* - - - </> [Route to update a place type] </> - - - *//
router.put("/place-types/:place_type_id", async (req, res) => {
  const place_type_id = parseInt(req.params.place_type_id);
  const { place_type_desc } = req.body;

  try {
    const result = await client.query(
      "UPDATE tb_place_types SET place_type_desc = $1 WHERE place_type_id = $2 RETURNING *",
      [place_type_desc, place_type_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Place type not found" });
    }

    res.status(200).json({
      status: "Place type successfully updated",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});

//* - - - </> [Route to delete a place type (soft delete)] </> - - - *//
router.delete("/place-types/:place_type_id", async (req, res) => {
  const place_type_id = parseInt(req.params.place_type_id);

  try {
    const result = await client.query(
      "UPDATE tb_place_types SET place_type_status = NOT place_type_status WHERE place_type_id = $1 RETURNING *",
      [place_type_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Place type not found" });
    }

    res.status(200).json({
      status: "Place type successfully deactivated",
      data: result.rows[0]
    });
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});

module.exports = router;
