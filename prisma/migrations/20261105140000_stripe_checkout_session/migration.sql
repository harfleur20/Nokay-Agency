ALTER TABLE "Payment" ADD COLUMN "providerCheckoutSessionId" TEXT;
CREATE UNIQUE INDEX "Payment_providerCheckoutSessionId_key" ON "Payment"("providerCheckoutSessionId");
