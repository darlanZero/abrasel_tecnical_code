import sqlite3 from "sqlite3";
import { open } from "sqlite"; 
import bcrypt from "bcryptjs";
import { Associate, Supervisor, UserRole } from "@/types";

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

export async function getAllUsers(): Promise<(Associate | Supervisor)[]> {
    let db;
    try {
        db = await openDB();
        const users = await db.all(`
            SELECT 
                u.id, u.email, u.name, u.role, u.created_at, u.updated_at,
                a.id as associate_id, a.cep, a.address, a.number, a.neighborhood, 
                a.city, a.state, a.phone, a.cnpj, a.business_types, a.is_active,
                s.id as supervisor_id, s.permissions
            FROM users u
            LEFT JOIN associates a ON u.id = a.user_id AND u.role = 'ASSOCIATE'
            LEFT JOIN supervisors s ON u.id = s.user_id AND u.role = 'SUPERVISOR'
            ORDER BY u.created_at DESC
        `);

        return users.map(user => {
            const baseUser = {
                email: user.email,
                userId: user.user_id,
                name: user.name,
                password: '',
                createdAt: new Date(user.created_at),
                updatedAt: new Date(user.updated_at)
            };

            if (user.role === 'ASSOCIATE') {
                return {
                    ...baseUser,
                    id: user.associate_id,
                    cep: user.cep,
                    address: user.address,
                    number: user.number,
                    neighborhood: user.neighborhood,
                    city: user.city,
                    state: user.state,
                    phone: user.phone,
                    cnpj: user.cnpj,
                    businessTypes: JSON.parse(user.business_types || '[]'),
                    role: "ASSOCIATE" as const,
                    isActive: user.is_active === 1
                };
            } else {
                return {
                    ...baseUser,
                    id: user.supervisor_id,
                    role: "SUPERVISOR" as const,
                    permissions: JSON.parse(user.permissions || '[]')
                };
            }
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    } finally {
        if (db) {
            await db.close();
        }
    }
}
export async function updateUser(userId: string, data: {
    name?: string;
    email?: string;
    role?: UserRole;
    isActive?: boolean;
}): Promise<boolean> {
    let db;
    try {
        db = await openDB();
        await db.run('BEGIN TRANSACTION');

        let userIdFromUsers;
        const associate = await db.get('SELECT user_id FROM associates WHERE id = ?', [userId]);
        if (associate) {
            userIdFromUsers = associate.user_id;
        } else {
            const supervisor = await db.get('SELECT user_id FROM supervisors WHERE id = ?', [userId]);
            if (supervisor) {
                userIdFromUsers = supervisor.user_id;
            } else {
                userIdFromUsers = userId;
            }
        }

        const updateFields = [];
        const updateValues = [];
        
        if (data.name !== undefined) {
            updateFields.push('name = ?');
            updateValues.push(data.name);
        }
        if (data.email !== undefined) {
            updateFields.push('email = ?');
            updateValues.push(data.email);
        }
        if (data.role !== undefined) {
            updateFields.push('role = ?');
            updateValues.push(data.role);
        }

        if (updateFields.length > 0) {
            updateFields.push('updated_at = CURRENT_TIMESTAMP');
            updateValues.push(userIdFromUsers); 
            
            await db.run(
                `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
                updateValues
            );
        }

        if (data.isActive !== undefined) {
            await db.run(
                `UPDATE associates SET is_active = ? WHERE user_id = ?`,
                [data.isActive ? 1 : 0, userIdFromUsers]
            );
        }

        await db.run('COMMIT');
        return true;
    } catch (error) {
        console.error("Error updating user:", error);
        if (db) {
            await db.run('ROLLBACK');
        }
        return false;
    } finally {
        if (db) {
            await db.close();
        }
    }
}

export async function deleteUser(userId: string): Promise<boolean> {
    let db;
    try {
        db = await openDB();
        await db.run('BEGIN TRANSACTION');

        let userIdFromUsers;
        const associate = await db.get('SELECT user_id FROM associates WHERE id = ?', [userId]);
        if (associate) {
            userIdFromUsers = associate.user_id;
        } else {
            const supervisor = await db.get('SELECT user_id FROM supervisors WHERE id = ?', [userId]);
            if (supervisor) {
                userIdFromUsers = supervisor.user_id;
            } else {
                userIdFromUsers = userId;
            }
        }

        const result = await db.run('DELETE FROM users WHERE id = ?', [userIdFromUsers]);
        
        if (result.changes === 0) {
            await db.run('ROLLBACK');
            return false; 
        }

        await db.run('COMMIT');
        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        if (db) {
            try {
                await db.run('ROLLBACK');
            } catch (rollbackError) {
                console.error("Error during rollback:", rollbackError);
            }
        }
        return false;
    } finally {
        if (db) {
            await db.close();
        }
    }
}