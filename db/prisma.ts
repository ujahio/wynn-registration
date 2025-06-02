import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { PrismaClient } from "@/lib/generated/prisma/client";

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
	console.error("DATABASE_URL is not defined in environment variables");
}

const connectionString = `${process.env.DATABASE_URL}`;

// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon({
	connectionString,
	max: 5,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 10000,
});

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		adapter: adapter as any,
		log: ["error", "warn", "query"],
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
