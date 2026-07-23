/*
  Warnings:

  - You are about to drop the column `min_stock` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "min_stock" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "min_stock";
