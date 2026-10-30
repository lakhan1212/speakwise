import pool from "../db/dbpool.js";

export async function create_conversation(req, res) {
    try {
        const { user_id, title, latest_interaction_id } = req.body;

        const result = await pool.query(
            `INSERT INTO conversations (user_id, title, latest_interaction_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [user_id, String(title), latest_interaction_id]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }

    
    }




export async function get_conversation(req, res) {
    try {
        const user_id = req.query.user_id;
        if (!user_id) {
            return res.status(400).json({ error: "user_id is required" });
        }

        const result = await pool.query(
            `select * from conversations c where c.user_id=$1 
        `,
            [user_id]
        );
        return res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error" });
    } 
}

export async function set_inter_id(conversation_id,interaction_id) {
    const result =await pool.query(
        `update  conversations set latest_interaction_id=$2 
        where id=$1`,
        [conversation_id,interaction_id]
    )
}
export async function get_inter_id(conversation_id) {
    const result =await pool.query(
        `select latest_interaction_id from conversations where id=$1`,
        [conversation_id]
    )
    return result.rows[0]?.latest_interaction_id ?? null;
}