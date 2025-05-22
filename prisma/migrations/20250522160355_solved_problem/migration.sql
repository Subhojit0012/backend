/*
  Warnings:

  - The values [HARDJ] on the enum `Defficulty` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Defficulty_new" AS ENUM ('EASY', 'MEDIUM', 'HARD');
ALTER TABLE "Problem" ALTER COLUMN "defficulty" TYPE "Defficulty_new" USING ("defficulty"::text::"Defficulty_new");
ALTER TYPE "Defficulty" RENAME TO "Defficulty_old";
ALTER TYPE "Defficulty_new" RENAME TO "Defficulty";
DROP TYPE "Defficulty_old";
COMMIT;

-- CreateTable
CREATE TABLE "SolvedProblem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolvedProblem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SolvedProblem_id_key" ON "SolvedProblem"("id");

-- AddForeignKey
ALTER TABLE "SolvedProblem" ADD CONSTRAINT "SolvedProblem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolvedProblem" ADD CONSTRAINT "SolvedProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
