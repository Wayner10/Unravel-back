const express = require("express");
const client = require('../database/db_unravel.js');


const router = express.Router();

//* - - - </> [Route to get the reviews] </> - - - *//
router.get("/reviews", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM tb_reviews");
    res.json(result.rows);
  } catch (err) {
    console.error("Error execuring query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});

//* - - - </> [Route to get the reviews by ID] </> - - - *//
router.get("/reviews/:review_id", async (req, res) => {
  const review_id = parseInt(req.params.review_id);
  try {
    const result = await client.query(
      "SELECT * FROM tb_reviews WHERE review_id = $1,",
      [review_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "reviews not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});



//* - - - </> [Route to delete the reviews by ID] </> - - - *//
router.delete("/reviews/:review_id", async (req, res) => {
  const review_id = parseInt(req.params.review_id);
  try {
    const result = await client.query(
      "DELETE FROM tb_reviews WHERE review_id = $1 RETURNING *",
      [review_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "region not found" });
    }
    res.json({
      message: "region deleted successfully",
      region: result.rows[0],
    });
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});



//* - - - </> [Route to create the reviews] </> - - - *//
router.post("/reviews", async (req, res) => {
  const { region_desc } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO tb_reviews (region_desc) VALUES ($1) RETURNING *`,
      [region_desc]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});



//* - - - </> [Route to update the reviews] </> - - - *//
router.post("/reviews", async (req, res) => {
  const { region_desc } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO tb_reviews (region_desc) VALUES ($1) RETURNING *`,
      [region_desc]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});

module.exports = router;
