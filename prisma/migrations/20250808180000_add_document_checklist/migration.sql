-- AlterTable
ALTER TABLE "Solicitud" ADD COLUMN "copiaIneRecibida" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Solicitud" ADD COLUMN "copiaComprobanteRecibida" BOOLEAN NOT NULL DEFAULT false;