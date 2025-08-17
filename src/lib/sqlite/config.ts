import sqlite3 from "sqlite3";
import { open } from "sqlite"; 
import bcrypt from "bcryptjs";
import { Associate, Supervisor } from "@/types";

const DATABASE_PATH = './database.sqlite';

export async function openDB() {
    const db = await open({
        filename: DATABASE_PATH,
        driver: sqlite3.Database
    });
    await db.exec(`
            CREATE TABLE IF NOT EXISTS users(
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL CHECK (role IN ('ASSOCIATE', 'SUPERVISOR')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS associates (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                cep TEXT NOT NULL,
                address TEXT NOT NULL,
                number TEXT,
                neighborhood TEXT NOT NULL,
                city TEXT NOT NULL,
                state TEXT NOT NULL,
                phone TEXT NOT NULL,
                cnpj TEXT UNIQUE NOT NULL,
                business_types TEXT NOT NULL, -- JSON array
                is_active BOOLEAN DEFAULT 1,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS supervisors (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                permissions TEXT NOT NULL, -- JSON array
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_associates_cnpj ON associates(cnpj);
        `);
    return db;
}

export async function createAssociate(data: {
    email: string;
    name: string;
    password: string;
    cep: string;
    address: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    phone: string;
    cnpj: string;
    businessTypes: string[];
}): Promise<Associate | null> {
    try {
        const db = await openDB();
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const userId = crypto.randomUUID();
        const associatedId = crypto.randomUUID();

        await db.run('BEGIN TRANSACTION')

        //criar usuário
        await db.run(
            `INSERT INTO users (id, email, name, password, role) VALUES (?, ?, ?, ?, 'ASSOCIATE')`,
            [userId, data.email, data.name, hashedPassword]
        )

        //criar associado
        await db.run(
            `INSERT INTO associates (id, user_id, cep, address, number, neighborhood, city, state, phone, cnpj, business_types) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [associatedId, userId, data.cep, data.address, data.number, data.neighborhood, data.city, data.state, data.phone, data.cnpj, JSON.stringify(data.businessTypes)]
        )

        await db.run('COMMIT');
        await db.close();

        return {
            id: associatedId,
            email: data.email,
            password: '',
            name: data.name,
            cep: data.cep,
            address: data.address,
            number: data.number,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
            phone: data.phone,
            cnpj: data.cnpj,
            businessTypes: data.businessTypes,
            role: "ASSOCIATE",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    } catch (error) {
        console.error("Error creating associate:", error);
        return null;
    }
}

export async function authenticateUser(email: string, password: string): Promise<Associate | Supervisor | null> {
    try{
        const db = await openDB();
        const user = await db.get(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        )

        if (!user) {
            await db.close();
            return null; // Usuário não encontrado
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            await db.close();
            return null; // Senha inválida
        }

        let userData;

        if (user.role === 'ASSOCIATE') {
            const associate = await db.get(
                `SELECT a.*, u.email, u.name FROM associates a 
                JOIN users u ON a.user_id = u.id
                WHERE u.id = ?`,
                [user.id]
            );

            userData = {
                id: associate.id,
                email: associate.email,
                name: associate.name,
                password: '',
                cep: associate.cep,
                address: associate.address,
                number: associate.number,
                neighborhood: associate.neighborhood,
                city: associate.city,
                state: associate.state,
                phone: associate.phone,
                cnpj: associate.cnpj,
                businessTypes: JSON.parse(associate.business_types),
                role: "ASSOCIATE" as const,
                isActive: associate.is_active === 1,
                createdAt: new Date(user.created_at),
                updatedAt: new Date(user.updated_at)
            };
        } else {
            const supervisor = await db.get(
                `SELECT s.*, u.email, u.name FROM supervisors s 
                JOIN users u ON s.user_id = u.id
                WHERE u.id = ?`,
                [user.id]
            );

            userData = {
                id: supervisor.id,
                email: supervisor.email,
                name: supervisor.name,
                password: '',
                role: "SUPERVISOR" as const,
                permissions: JSON.parse(supervisor.permissions),
                createdAt: new Date(user.created_at),
                updatedAt: new Date(user.updated_at)
            };
        }

        await db.close();
        return userData;
    } catch (error) {
        console.error("Error authenticating user:", error);
        return null;
    }
}