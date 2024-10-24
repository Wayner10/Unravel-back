const express = require("express");
const client = require('../database/db_unravel.js');


const router = express.Router();


//* - - - </> [Route to get the categories] </> - - - *//
router.get("/categories", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM tb_categories");
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});



//* - - - </> [Route to get the users by ID] </> - - - *//
router.get("/categories/:category_id", async (req, res) => {
  const category_id = parseInt(req.params.category_id);
  try {
    const result = await client.query(
      "SELECT * FROM tb_categories WHERE category_id = $1",
      [category_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});



//* - - - </> [Route to delete the categories by ID] </> - - - *//
router.delete("/categories/:category_id", async (req, res) => {
  const category_id = parseInt(req.params.category_id);
  try {
    const result = await client.query(
      "DELETE FROM tb_categories WHERE category_id = $1 RETURNING *",
      [category_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({
      message: "Category deleted successfully",
      category: result.rows[0],
    });
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});



//* - - - </> [Route to create the categories] </> - - - *//
router.post("/categories", async (req, res) => {
  const { category_desc, category_status } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO tb_categories (category_desc, category_status) VALUES ($1, $2) RETURNING *`,
      [category_desc, category_status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});



//* - - - </> [Route to update the categories] </> - - - *//
router.put("/categories/:category_id", async (req, res) => {
  const category_id = parseInt(req.params.category_id);
  const { category_desc, category_status } = req.body;

  try {
    const result = await client.query(
      "UPDATE tb_categories SET category_desc = $1, category_status = $2 WHERE category_id = $3 RETURNING *",
      [category_desc, category_status, category_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating category", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});

module.exports = router;
