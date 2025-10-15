import { RequestHandler } from 'express';
import { db } from '../db';

// Get all regions
export const getRegions: RequestHandler = (req, res) => {
  db.all(
    "SELECT * FROM Region ORDER BY name",
    [],
    (err, rows) => {
      if (err) {
        console.error("Error fetching regions:", err);
        res.status(500).json({ error: "Failed to fetch regions" });
        return;
      }
      res.json(rows);
    }
  );
};

// Get cities by region
export const getCitiesByRegion: RequestHandler = (req, res) => {
  const { regionId } = req.params;
  
  db.all(
    "SELECT * FROM City WHERE region_id = ? ORDER BY name",
    [regionId],
    (err, rows) => {
      if (err) {
        console.error("Error fetching cities:", err);
        res.status(500).json({ error: "Failed to fetch cities" });
        return;
      }
      res.json(rows);
    }
  );
};

// Get all cities with region information
export const getAllCities: RequestHandler = (req, res) => {
  db.all(
    `SELECT c.*, r.name as region_name 
     FROM City c 
     JOIN Region r ON c.region_id = r.id 
     ORDER BY r.name, c.name`,
    [],
    (err, rows) => {
      if (err) {
        console.error("Error fetching cities:", err);
        res.status(500).json({ error: "Failed to fetch cities" });
        return;
      }
      res.json({ cities: rows });
    }
  );
};

// Get a specific city by ID
export const getCityById: RequestHandler = (req, res) => {
  const { id } = req.params;
  
  db.get(
    `SELECT c.*, r.name as region_name 
     FROM City c 
     JOIN Region r ON c.region_id = r.id 
     WHERE c.id = ?`,
    [id],
    (err, row) => {
      if (err) {
        console.error("Error fetching city:", err);
        res.status(500).json({ error: "Failed to fetch city" });
        return;
      }
      
      if (!row) {
        res.status(404).json({ error: "City not found" });
        return;
      }
      
      res.json({ city: row });
    }
  );
};