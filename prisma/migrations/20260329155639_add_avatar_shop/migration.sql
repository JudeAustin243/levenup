-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('Common', 'Rare', 'Legendary');

-- CreateEnum
CREATE TYPE "AvatarLayer" AS ENUM ('background', 'body', 'shirt', 'pants', 'shoes', 'hat', 'accessory', 'effect');

-- CreateEnum
CREATE TYPE "PackTier" AS ENUM ('Bronze', 'Silver', 'Gold');

-- AlterTable
ALTER TABLE "Child" ADD COLUMN     "coins" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "AvatarItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "layer" "AvatarLayer" NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "coinValue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvatarItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnedItem" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "equipped" BOOLEAN NOT NULL DEFAULT false,
    "acquiredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OwnedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackPurchase" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "packTier" "PackTier" NOT NULL,
    "coinsCost" INTEGER NOT NULL,
    "itemsJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AvatarItem_rarity_idx" ON "AvatarItem"("rarity");

-- CreateIndex
CREATE INDEX "AvatarItem_layer_idx" ON "AvatarItem"("layer");

-- CreateIndex
CREATE INDEX "OwnedItem_childId_idx" ON "OwnedItem"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "OwnedItem_childId_itemId_key" ON "OwnedItem"("childId", "itemId");

-- CreateIndex
CREATE INDEX "PackPurchase_childId_idx" ON "PackPurchase"("childId");

-- AddForeignKey
ALTER TABLE "OwnedItem" ADD CONSTRAINT "OwnedItem_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnedItem" ADD CONSTRAINT "OwnedItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "AvatarItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackPurchase" ADD CONSTRAINT "PackPurchase_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
