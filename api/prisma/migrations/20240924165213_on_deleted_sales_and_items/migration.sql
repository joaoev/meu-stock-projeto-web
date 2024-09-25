-- DropForeignKey
ALTER TABLE "sales" DROP CONSTRAINT "sales_id_user_fkey";

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
