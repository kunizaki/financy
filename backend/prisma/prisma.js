import { PrismaClient } from '@prisma/client'
const globalForPrisma = global
export const prismaClient = globalForPrisma.prisma || new PrismaClient()
globalForPrisma.prisma = prismaClient
