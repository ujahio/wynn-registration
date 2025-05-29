-- AlterTable
ALTER TABLE "OTPStore" ADD COLUMN     "channel" TEXT NOT NULL DEFAULT 'email';

-- CreateIndex
CREATE INDEX "OTPStore_channel_contact_idx" ON "OTPStore"("channel", "contact");

-- CreateIndex
CREATE INDEX "OTPStore_expires_at_idx" ON "OTPStore"("expires_at");
