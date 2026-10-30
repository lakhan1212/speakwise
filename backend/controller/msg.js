import pool from "../db/dbpool.js";


export async function create_msg(conversation_id, role, msg) {
    try {
        
        const result = await pool.query(
            `insert into messages (conversation_id,role,content)
            values($1,$2,$3)
            RETURNING * 
            `, [conversation_id, role, msg]
        );
        
        return { success: true, message: result.rows[0] };
    } catch (error) {
        console.log(error)
         return { success: false, error: error.message };
    }
}

export async function get_msg(req,res) {
    const { id } = req.query;
    console.log(id);
    
    if (!id) {
        return res.status(400).json({ error: "conversation id is required" });
    }

    try {

        const result = await pool.query(
            `select id,role,content,interaction_id,created_at from messages where conversation_id=$1
             order by created_at
            
            `, [id]
        );
       
        // return { success: true, message: result };
        return res.status(200).json(result.rows);

        
    } 
    catch (error) {
        
        // console.log(error)
        return res.status(500).json({ error: "Database error" });

    }
}
 