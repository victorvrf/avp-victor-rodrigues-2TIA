import 'dotenv/config';
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client/extension";

const adapter = new PrismaMariaDb();
const prisma = new PrismaClient({ adapter });

export default prisma;
