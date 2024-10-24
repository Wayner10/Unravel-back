const express = require('express');
const client = require('../database/db_unravel.js');


const router = express.Router();

//* - - - </> [Route to get the regions] </> - - - *//
router.get('/regions', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM tb_regions');
        res.json(result.rows);
    } catch (err) {
        console.error('Error execuring query', err.stack);
        res.status(500).json({ error: 'Error executing query' })
    }
});

//* - - - </> [Route to get the regions by ID] </> - - - *//
router.get('/regions/:region_id', async (req, res) => {
    const region_id = parseInt(req.params.region_id);
    try {
        const result = await client.query('SELECT * FROM tb_regions WHERE region_id = $1,', [region_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'regions not found'});
        }
        res.json(result.rows[0])
    } catch (err) {
        console.error('Error executing query', err.stack)
        res.status(500).json({ error: 'Error executing query' })
    }
});


//* - - - </> [Route to delete the regions by ID] </> - - - *//
router.delete('/regions/:region_id', async (req, res) => {
    const region_id = parseInt(req.params.region_id);
    try {
      const result = await client.query('DELETE FROM tb_regions WHERE region_id = $1 RETURNING *', [region_id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'region not found' });
      }
      res.json({ message: 'region deleted successfully', region: result.rows[0] });
    } catch (err) {
      console.error('Error executing query', err.stack);
      res.status(500).json({ error: 'Error executing query' });
    }
  });



//* - - - </> [Route to create the regions] </> - - - *//
router.post('/regions', async (req, res) => {
    const { region_desc } = req.body;
  
    try {
      const result = await client.query(
        `INSERT INTO tb_regions (region_desc) VALUES ($1) RETURNING *`,
        [region_desc]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error executing query', err.stack);
      res.status(500).json({ error: 'Error executing query' });
    }
  });



//* - - - </> [Route to update the regions] </> - - - *//
  router.post('/regions', async (req, res) => {
    const { region_desc } = req.body;
  
    try {
      const result = await client.query(
        `INSERT INTO tb_regions (region_desc) VALUES ($1) RETURNING *`,
        [region_desc]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error executing query', err.stack);
      res.status(500).json({ error: 'Error executing query' });
    }
  });


module.exports = router 