import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import pool from "../db/dbpool.js";
import { setid } from "../service/auth.js";

const scrypt = promisify(scryptCallback);

const isNonEmptyString = (value) =>
    typeof value === "string" && value.trim().length > 0;

const isValidEmail = (value) =>
    typeof value === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

// const hashPassword = async (password) => {
//     const salt = randomBytes(16).toString("hex");
//     const derivedKey = await scrypt(password, salt, 64);

//     return `${salt}:${derivedKey.toString("hex")}`;
// };

export async function createUser(req, res) {
    const { name, email, password } = req.body ?? {};

    if (
        !isNonEmptyString(name) ||
        !isValidEmail(email) ||
        !isNonEmptyString(password) ||
        password.length < 8
    ) {
        return res.status(400).json({
            error: "Name, a valid email, and a password of at least 8 characters are required.",
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        // const passwordHash = await hashPassword(password);
        const { rows } = await pool.query(
            `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
            [name.trim(), normalizedEmail, password],
        );

        return res.status(201).json(rows[0]);
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                error: "A user with this email already exists.",
            });
        }

        console.error("Failed to create user:", error);
        return res.status(500).json({ error: "Unable to create user." });
    }
}
export async function loginuser(req, res) {
    try {
        const { email, password } = req.body ?? {};

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const normalizedEmail = email.trim().toLowerCase();
 
        const result = await pool.query(
            `SELECT id, name, (email = $1 AND password = $2) AS is_authenticated 
             FROM users 
             WHERE email = $1`,
            [normalizedEmail, password]
        );

        const foundUser = result.rows[0];

        if (!foundUser || !foundUser.is_authenticated) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const token = setid(foundUser); 
        
        return res
            .cookie("uid", token, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,  
            })
            .status(200)
            .json({
                message: "Login successful",
                user: { id: foundUser.id, name: foundUser.name }
            });

    } catch (error) {
        console.error("Failed to authenticate user:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}
