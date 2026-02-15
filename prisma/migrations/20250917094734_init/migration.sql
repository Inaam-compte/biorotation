-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "exploitantName" TEXT NOT NULL,
    "gouvernorat" TEXT NOT NULL,
    "animalCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Animal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "species" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "physiologicalPhase" TEXT NOT NULL,
    "parity" TEXT NOT NULL,
    "milkProduction" DOUBLE PRECISION,
    "daysInLactation" INTEGER,
    "daysInGestation" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Aliment" (
    "id" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "category_fr" TEXT NOT NULL,
    "category_ar" TEXT NOT NULL,
    "ms_percentage" DOUBLE PRECISION NOT NULL,
    "ufl_per_kg_ms" DOUBLE PRECISION NOT NULL,
    "pdie_per_kg_ms" DOUBLE PRECISION NOT NULL,
    "pdin_per_kg_ms" DOUBLE PRECISION NOT NULL,
    "ndf_per_kg_ms" DOUBLE PRECISION NOT NULL,
    "userId" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Aliment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DailyTip" (
    "id" TEXT NOT NULL,
    "title_fr" TEXT NOT NULL,
    "title_ar" TEXT NOT NULL,
    "content_fr" TEXT NOT NULL,
    "content_ar" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyTip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- CreateIndex
CREATE INDEX "Animal_userId_idx" ON "public"."Animal"("userId");

-- CreateIndex
CREATE INDEX "Aliment_userId_idx" ON "public"."Aliment"("userId");
