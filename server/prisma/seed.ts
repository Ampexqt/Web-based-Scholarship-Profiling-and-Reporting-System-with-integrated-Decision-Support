import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@zppsu.edu.ph';
  const adminPassword = 'Admin123!';

  // Check if admin exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Super Admin',
        role: 'Admin',
      }
    });

    console.log('✅ Default Admin user created successfully.');
  } else {
    console.log('ℹ️ Admin user already exists. Skipping creation.');
  }

  console.log('Seeding location data...');
  
  // Seed Regions
  const regionsCount = await prisma.ph_regions.count();
  if (regionsCount === 0) {
    const regionsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'regions.json'), 'utf8'));
    await prisma.ph_regions.createMany({ data: regionsData, skipDuplicates: true });
    console.log(`✅ Seeded ${regionsData.length} regions.`);
  } else {
    console.log('ℹ️ Regions already seeded.');
  }

  // Seed Provinces
  const provincesCount = await prisma.ph_provinces.count();
  if (provincesCount === 0) {
    const provincesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'provinces.json'), 'utf8'));
    await prisma.ph_provinces.createMany({ data: provincesData, skipDuplicates: true });
    console.log(`✅ Seeded ${provincesData.length} provinces.`);
  } else {
    console.log('ℹ️ Provinces already seeded.');
  }

  // Seed Cities
  const citiesCount = await prisma.ph_cities.count();
  if (citiesCount === 0) {
    const citiesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'cities.json'), 'utf8'));
    // Since there can be many cities, we could chunk them, but typically there's only ~1600 cities/municipalities, createMany should handle it
    await prisma.ph_cities.createMany({ data: citiesData, skipDuplicates: true });
    console.log(`✅ Seeded ${citiesData.length} cities.`);
  } else {
    console.log('ℹ️ Cities already seeded.');
  }

  // Seed Barangays
  const barangaysCount = await prisma.ph_barangays.count();
  if (barangaysCount === 0) {
    const barangaysData = JSON.parse(fs.readFileSync(path.join(__dirname, 'barangays.json'), 'utf8'));
    // There are 42,000+ barangays. We should chunk the insert to avoid query limits.
    const chunkSize = 5000;
    for (let i = 0; i < barangaysData.length; i += chunkSize) {
      const chunk = barangaysData.slice(i, i + chunkSize);
      await prisma.ph_barangays.createMany({ data: chunk, skipDuplicates: true });
    }
    console.log(`✅ Seeded ${barangaysData.length} barangays.`);
  } else {
    console.log('ℹ️ Barangays already seeded.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
