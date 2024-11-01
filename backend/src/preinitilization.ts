import { PrismaClient } from '@prisma/client';

declare global {
    var prismaClient:PrismaClient;
}

global.prismaClient = new PrismaClient();