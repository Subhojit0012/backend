/*
  Warnings:

  - Changed the type of `examples` on the `Problem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "examples",
ADD COLUMN     "examples" JSONB NOT NULL;
