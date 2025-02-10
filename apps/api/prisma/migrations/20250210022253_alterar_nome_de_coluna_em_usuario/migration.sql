/*
  Warnings:

  - You are about to drop the column `nome` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "nome",
ADD COLUMN     "name" TEXT;
