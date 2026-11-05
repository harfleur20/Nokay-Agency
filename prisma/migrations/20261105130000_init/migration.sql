CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'CLIENT');
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'QUALIFIED', 'QUOTED', 'WON', 'LOST', 'ARCHIVED');
CREATE TYPE "QuoteStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'DESIGN', 'DEVELOPMENT', 'REVIEW', 'DELIVERED', 'ON_HOLD');

CREATE TABLE "User" (
  "id" TEXT NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "passwordHash" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'CLIENT', "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Lead" (
  "id" TEXT NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "company" TEXT, "service" TEXT NOT NULL,
  "budget" TEXT NOT NULL, "message" TEXT NOT NULL, "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
  "source" TEXT NOT NULL DEFAULT 'website', "ownerId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Service" (
  "id" TEXT NOT NULL, "slug" TEXT NOT NULL, "nameFr" TEXT NOT NULL, "nameEn" TEXT NOT NULL,
  "descriptionFr" TEXT, "descriptionEn" TEXT, "active" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Quote" (
  "id" TEXT NOT NULL, "reference" TEXT NOT NULL, "clientId" TEXT NOT NULL, "title" TEXT NOT NULL,
  "description" TEXT, "amountCents" INTEGER NOT NULL, "currency" TEXT NOT NULL DEFAULT 'EUR',
  "status" "QuoteStatus" NOT NULL DEFAULT 'DRAFT', "validUntil" TIMESTAMP(3), "acceptedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Order" (
  "id" TEXT NOT NULL, "reference" TEXT NOT NULL, "clientId" TEXT NOT NULL, "quoteId" TEXT,
  "title" TEXT NOT NULL, "amountCents" INTEGER NOT NULL, "depositCents" INTEGER,
  "currency" TEXT NOT NULL DEFAULT 'EUR', "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Payment" (
  "id" TEXT NOT NULL, "orderId" TEXT NOT NULL, "amountCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'EUR', "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "provider" TEXT NOT NULL DEFAULT 'stripe', "providerPaymentIntentId" TEXT, "idempotencyKey" TEXT,
  "paidAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Project" (
  "id" TEXT NOT NULL, "clientId" TEXT NOT NULL, "orderId" TEXT, "name" TEXT NOT NULL,
  "description" TEXT, "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING', "progress" INTEGER NOT NULL DEFAULT 0,
  "startDate" TIMESTAMP(3), "dueDate" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ProjectUpdate" (
  "id" TEXT NOT NULL, "projectId" TEXT NOT NULL, "title" TEXT NOT NULL, "body" TEXT NOT NULL,
  "visibleToClient" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProjectUpdate_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "PortfolioItem" (
  "id" TEXT NOT NULL, "slug" TEXT NOT NULL, "title" TEXT NOT NULL, "summary" TEXT NOT NULL,
  "category" TEXT NOT NULL, "imageUrl" TEXT, "projectUrl" TEXT, "isConcept" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "PortfolioItem_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL, "actorId" TEXT, "action" TEXT NOT NULL, "entity" TEXT NOT NULL, "entityId" TEXT,
  "metadata" JSONB, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "Lead_status_createdAt_idx" ON "Lead"("status", "createdAt");
CREATE INDEX "Lead_email_idx" ON "Lead"("email");
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
CREATE UNIQUE INDEX "Quote_reference_key" ON "Quote"("reference");
CREATE UNIQUE INDEX "Order_reference_key" ON "Order"("reference");
CREATE UNIQUE INDEX "Order_quoteId_key" ON "Order"("quoteId");
CREATE UNIQUE INDEX "Payment_providerPaymentIntentId_key" ON "Payment"("providerPaymentIntentId");
CREATE UNIQUE INDEX "Payment_idempotencyKey_key" ON "Payment"("idempotencyKey");
CREATE INDEX "ProjectUpdate_projectId_createdAt_idx" ON "ProjectUpdate"("projectId", "createdAt");
CREATE UNIQUE INDEX "PortfolioItem_slug_key" ON "PortfolioItem"("slug");
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

ALTER TABLE "Lead" ADD CONSTRAINT "Lead_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ProjectUpdate" ADD CONSTRAINT "ProjectUpdate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
