import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

const items = [
  // ── Backgrounds ──
  { name: "Blue Sky",        rarity: "Common",    layer: "background", imageUrl: "/avatar-items/background/blue-sky.svg",       coinValue: 50 },
  { name: "Sunset",          rarity: "Common",    layer: "background", imageUrl: "/avatar-items/background/sunset.svg",         coinValue: 50 },
  { name: "Forest",          rarity: "Rare",      layer: "background", imageUrl: "/avatar-items/background/forest.svg",         coinValue: 150 },
  { name: "Space Nebula",    rarity: "Rare",      layer: "background", imageUrl: "/avatar-items/background/space-nebula.svg",   coinValue: 150 },
  { name: "Aurora Borealis", rarity: "Legendary", layer: "background", imageUrl: "/avatar-items/background/aurora.svg",         coinValue: 500 },
  { name: "Galaxy",          rarity: "Mythical",  layer: "background", imageUrl: "/avatar-items/background/galaxy.svg",         coinValue: 1500 },

  // ── Bodies ──
  { name: "Default Body",    rarity: "Common",    layer: "body", imageUrl: "/avatar-items/body/default.svg",       coinValue: 0 },
  { name: "Sporty Body",     rarity: "Common",    layer: "body", imageUrl: "/avatar-items/body/sporty.svg",        coinValue: 50 },
  { name: "Robot Body",      rarity: "Rare",      layer: "body", imageUrl: "/avatar-items/body/robot.svg",         coinValue: 150 },
  { name: "Crystal Body",    rarity: "Legendary", layer: "body", imageUrl: "/avatar-items/body/crystal.svg",       coinValue: 500 },
  { name: "Phoenix Body",    rarity: "Mythical",  layer: "body", imageUrl: "/avatar-items/body/phoenix.svg",       coinValue: 1500 },

  // ── Shirts ──
  { name: "White Tee",       rarity: "Common",    layer: "shirt", imageUrl: "/avatar-items/shirt/white-tee.svg",     coinValue: 50 },
  { name: "Blue Hoodie",     rarity: "Common",    layer: "shirt", imageUrl: "/avatar-items/shirt/blue-hoodie.svg",   coinValue: 50 },
  { name: "Red Jacket",      rarity: "Common",    layer: "shirt", imageUrl: "/avatar-items/shirt/red-jacket.svg",    coinValue: 50 },
  { name: "Varsity Jacket",  rarity: "Rare",      layer: "shirt", imageUrl: "/avatar-items/shirt/varsity.svg",       coinValue: 150 },
  { name: "Gold Blazer",     rarity: "Rare",      layer: "shirt", imageUrl: "/avatar-items/shirt/gold-blazer.svg",   coinValue: 150 },
  { name: "Dragon Armour",   rarity: "Legendary", layer: "shirt", imageUrl: "/avatar-items/shirt/dragon-armour.svg", coinValue: 500 },
  { name: "Diamond Armour",  rarity: "Mythical",  layer: "shirt", imageUrl: "/avatar-items/shirt/diamond-armour.svg", coinValue: 1500 },

  // ── Pants ──
  { name: "Blue Jeans",      rarity: "Common",    layer: "pants", imageUrl: "/avatar-items/pants/blue-jeans.svg",    coinValue: 50 },
  { name: "Black Joggers",   rarity: "Common",    layer: "pants", imageUrl: "/avatar-items/pants/black-joggers.svg", coinValue: 50 },
  { name: "Camo Pants",      rarity: "Rare",      layer: "pants", imageUrl: "/avatar-items/pants/camo.svg",          coinValue: 150 },
  { name: "Flame Pants",     rarity: "Legendary", layer: "pants", imageUrl: "/avatar-items/pants/flame.svg",         coinValue: 500 },
  { name: "Void Pants",      rarity: "Mythical",  layer: "pants", imageUrl: "/avatar-items/pants/void.svg",          coinValue: 1500 },

  // ── Shoes ──
  { name: "White Trainers",  rarity: "Common",    layer: "shoes", imageUrl: "/avatar-items/shoes/white-trainers.svg", coinValue: 50 },
  { name: "Black Boots",     rarity: "Common",    layer: "shoes", imageUrl: "/avatar-items/shoes/black-boots.svg",    coinValue: 50 },
  { name: "Gold Kicks",      rarity: "Rare",      layer: "shoes", imageUrl: "/avatar-items/shoes/gold-kicks.svg",     coinValue: 150 },
  { name: "Rocket Boots",    rarity: "Legendary", layer: "shoes", imageUrl: "/avatar-items/shoes/rocket-boots.svg",   coinValue: 500 },
  { name: "Cloud Walkers",   rarity: "Mythical",  layer: "shoes", imageUrl: "/avatar-items/shoes/cloud-walkers.svg",  coinValue: 1500 },

  // ── Hats ──
  { name: "Red Cap",         rarity: "Common",    layer: "hat", imageUrl: "/avatar-items/hat/red-cap.svg",        coinValue: 50 },
  { name: "Beanie",          rarity: "Common",    layer: "hat", imageUrl: "/avatar-items/hat/beanie.svg",         coinValue: 50 },
  { name: "Wizard Hat",      rarity: "Rare",      layer: "hat", imageUrl: "/avatar-items/hat/wizard.svg",         coinValue: 150 },
  { name: "Crown",           rarity: "Rare",      layer: "hat", imageUrl: "/avatar-items/hat/crown.svg",          coinValue: 150 },
  { name: "Halo",            rarity: "Legendary", layer: "hat", imageUrl: "/avatar-items/hat/halo.svg",           coinValue: 500 },
  { name: "Astral Crown",    rarity: "Mythical",  layer: "hat", imageUrl: "/avatar-items/hat/astral-crown.svg",   coinValue: 1500 },

  // ── Accessories ──
  { name: "Round Glasses",   rarity: "Common",    layer: "accessory", imageUrl: "/avatar-items/accessory/round-glasses.svg", coinValue: 50 },
  { name: "Sunglasses",      rarity: "Common",    layer: "accessory", imageUrl: "/avatar-items/accessory/sunglasses.svg",    coinValue: 50 },
  { name: "Gold Chain",      rarity: "Rare",      layer: "accessory", imageUrl: "/avatar-items/accessory/gold-chain.svg",    coinValue: 150 },
  { name: "Wings",           rarity: "Legendary", layer: "accessory", imageUrl: "/avatar-items/accessory/wings.svg",         coinValue: 500 },
  { name: "Angel Wings",     rarity: "Mythical",  layer: "accessory", imageUrl: "/avatar-items/accessory/angel-wings.svg",  coinValue: 1500 },

  // ── Effects ──
  { name: "Sparkles",        rarity: "Rare",      layer: "effect", imageUrl: "/avatar-items/effect/sparkles.svg",   coinValue: 150 },
  { name: "Fire Aura",       rarity: "Legendary", layer: "effect", imageUrl: "/avatar-items/effect/fire-aura.svg",  coinValue: 500 },
  { name: "Lightning",       rarity: "Legendary", layer: "effect", imageUrl: "/avatar-items/effect/lightning.svg",  coinValue: 500 },
  { name: "Cosmic Storm",    rarity: "Mythical",  layer: "effect", imageUrl: "/avatar-items/effect/cosmic-storm.svg", coinValue: 1500 },
] as const;

async function main() {
  console.log("Seeding avatar items...");

  for (const item of items) {
    await prisma.avatarItem.upsert({
      where: { id: `avatar-${item.name.toLowerCase().replace(/\s+/g, "-")}` },
      update: {
        name: item.name,
        rarity: item.rarity,
        layer: item.layer,
        imageUrl: item.imageUrl,
        coinValue: item.coinValue,
      },
      create: {
        id: `avatar-${item.name.toLowerCase().replace(/\s+/g, "-")}`,
        name: item.name,
        rarity: item.rarity as any,
        layer: item.layer as any,
        imageUrl: item.imageUrl,
        coinValue: item.coinValue,
      },
    });
  }

  console.log(`Seeded ${items.length} avatar items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
