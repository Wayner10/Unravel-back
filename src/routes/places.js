const express = require("express");
const client = require('../database/db_unravel.js');


const router = express.Router();

//* - - - </> [Route to get the places] </> - - - *//
router.get("/places", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM tb_places");
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});



//* - - - </> [Route to get the places by ID] </> - - - *//
router.get("/places/:place_id", async (req, res) => {
  const place_id = parseInt(req.params.place_id);
  try {
    const result = await client.query(
      "SELECT * FROM tb_places WHERE place_id = $1",
      [place_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});




//* - - - </> [Route to delete the places by ID] </> - - - *//
router.delete("/places/:place_id", async (req, res) => {
  const place_id = parseInt(req.params.place_id);
  try {
    const result = await client.query(
      "DELETE FROM tb_places WHERE place_id = $1 RETURNING *",
      [place_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.json({ message: "Place deleted successfully", place: result.rows[0] });
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});

// Route to create a place
router.post("/places", async (req, res) => {
  const {
    place_name,
    place_desc,
    place_score,
    place_email,
    place_phone,
    place_price_adult,
    place_price_children,
    place_lat,
    place_lng,
    place_canton,
    place_nearest_city,
    place_waze_url,
    place_google_url,
    place_website_url,
    place_open_time,
    place_close_time,
    place_status,
    place_type_id,
    region_id,
    user_id,
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO tb_places (
          place_name, place_desc, place_score, place_email, place_phone,
          place_price_adult, place_price_children, place_lat, place_lng,
          place_canton, place_nearest_city, place_waze_url, place_google_url,
          place_website_url, place_open_time, place_close_time, place_status,
          place_type_id, region_id, user_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
        ) RETURNING *`,
      [
        place_name,
        place_desc,
        place_score,
        place_email,
        place_phone,
        place_price_adult,
        place_price_children,
        place_lat,
        place_lng,
        place_canton,
        place_nearest_city,
        place_waze_url,
        place_google_url,
        place_website_url,
        place_open_time,
        place_close_time,
        place_status,
        place_type_id,
        region_id,
        user_id,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});



//* - - - </> [Route to update the places] </> - - - *//
router.put("/places/:place_id", async (req, res) => {
  const place_id = parseInt(req.params.place_id);
  const {
    place_name,
    place_desc,
    place_score,
    place_email,
    place_phone,
    place_price_adult,
    place_price_children,
    place_lat,
    place_lng,
    place_canton,
    place_nearest_city,
    place_waze_url,
    place_google_url,
    place_website_url,
    place_open_time,
    place_close_time,
    place_status,
    place_type_id,
    region_id,
    user_id,
  } = req.body;

  try {
    const result = await client.query(
      `UPDATE tb_places SET
        place_name = $1, place_desc = $2, place_score = $3, place_email = $4,
        place_phone = $5, place_price_adult = $6, place_price_children = $7,
        place_lat = $8, place_lng = $9, place_canton = $10, place_nearest_city = $11,
        place_waze_url = $12, place_google_url = $13, place_website_url = $14,
        place_open_time = $15, place_close_time = $16, place_status = $17,
        place_type_id = $18, region_id = $19, user_id = $20
        WHERE place_id = $21 RETURNING *`,
      [
        place_name,
        place_desc,
        place_score,
        place_email,
        place_phone,
        place_price_adult,
        place_price_children,
        place_lat,
        place_lng,
        place_canton,
        place_nearest_city,
        place_waze_url,
        place_google_url,
        place_website_url,
        place_open_time,
        place_close_time,
        place_status,
        place_type_id,
        region_id,
        user_id,
        place_id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Place not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating place", err.stack);
    res.status(500).json({ error: "Error executing query" });
  }
});

module.exports = router;
