import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getRegions = async (req: Request, res: Response) => {
  try {
    const regions = await prisma.ph_regions.findMany();
    
    // Sort regions by official numerical order
    const regionOrder = [
      "Region I",
      "Region II",
      "Region III",
      "Region IV-A",
      "Region IV-B",
      "Region V",
      "Region VI",
      "Region VII",
      "Region VIII",
      "Region IX",
      "Region X",
      "Region XI",
      "Region XII",
      "Region XIII",
      "National Capital Region",
      "Cordillera Administrative Region",
      "Bangsamoro Autonomous Region in Muslim Mindanao"
    ];

    regions.sort((a, b) => {
      const indexA = regionOrder.indexOf(a.region_name || "");
      const indexB = regionOrder.indexOf(b.region_name || "");
      
      // If both are found in the array, compare their indices
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      // If only one is found, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      // Fallback to alphabetical sorting by name
      return (a.name || "").localeCompare(b.name || "");
    });

    res.json(regions);
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ error: 'Failed to fetch regions' });
  }
};

export const getProvinces = async (req: Request, res: Response) => {
  const { regionCode } = req.query;
  try {
    const whereClause = regionCode ? { region_code: String(regionCode) } : {};
    const provinces = await prisma.ph_provinces.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });
    res.json(provinces);
  } catch (error) {
    console.error('Error fetching provinces:', error);
    res.status(500).json({ error: 'Failed to fetch provinces' });
  }
};

export const getCities = async (req: Request, res: Response) => {
  const { provinceCode, regionCode } = req.query;
  try {
    const whereClause: any = {};
    if (provinceCode) whereClause.province_code = String(provinceCode);
    if (regionCode) whereClause.region_code = String(regionCode);

    const cities = await prisma.ph_cities.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
};

export const getBarangays = async (req: Request, res: Response) => {
  const { cityCode } = req.query;
  try {
    const whereClause = cityCode ? { city_code: String(cityCode) } : {};
    const barangays = await prisma.ph_barangays.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });
    res.json(barangays);
  } catch (error) {
    console.error('Error fetching barangays:', error);
    res.status(500).json({ error: 'Failed to fetch barangays' });
  }
};
