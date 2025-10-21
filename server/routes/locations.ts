import { RequestHandler } from "express";
import { prisma } from "../db";

// Get all regions
export const getRegions: RequestHandler = async (_req, res) => {
  try {
    const regions = await prisma.region.findMany({
      orderBy: { name: "asc" },
    });

    res.json({ regions });
  } catch (error) {
    console.error("Error fetching regions:", error);
    res.status(500).json({ error: "Failed to fetch regions" });
  }
};

// Get cities by region
export const getCitiesByRegion: RequestHandler = async (req, res) => {
  const regionId = Number(req.params.regionId);

  if (!regionId) {
    return res.status(400).json({ error: "Region ID is required" });
  }

  try {
    const cities = await prisma.city.findMany({
      where: { regionId },
      orderBy: { name: "asc" },
    });

    res.json({ cities });
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
};

// Get all cities with region information
export const getAllCities: RequestHandler = async (_req, res) => {
  try {
    const cities = await prisma.city.findMany({
      include: { region: true },
      orderBy: [
        { region: { name: "asc" } },
        { name: "asc" },
      ],
    });

    res.json({
      cities: cities.map((city) => ({
        id: city.id,
        name: city.name,
        region_id: city.regionId,
        region_name: city.region?.name ?? "",
      })),
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
};

// Get a specific city by ID
export const getCityById: RequestHandler = async (req, res) => {
  const cityId = Number(req.params.id);

  if (!cityId) {
    return res.status(400).json({ error: "City ID is required" });
  }

  try {
    const city = await prisma.city.findUnique({
      where: { id: cityId },
      include: { region: true },
    });

    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }

    res.json({
      city: {
        id: city.id,
        name: city.name,
        region_id: city.regionId,
        region_name: city.region?.name ?? null,
      },
    });
  } catch (error) {
    console.error("Error fetching city:", error);
    res.status(500).json({ error: "Failed to fetch city" });
  }
};
