-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "agent_departament_id" TEXT;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_agent_departament_id_fkey" FOREIGN KEY ("agent_departament_id") REFERENCES "departaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
