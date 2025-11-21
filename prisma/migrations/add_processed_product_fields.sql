-- Add new fields for processed product data
ALTER TABLE "Product" ADD COLUMN "modifiedName" VARCHAR(500);
ALTER TABLE "Product" ADD COLUMN "modifiedDescription" TEXT;
ALTER TABLE "Product" ADD COLUMN "imageDescription" VARCHAR(500);