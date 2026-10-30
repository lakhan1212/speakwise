import { getid } from "../service/auth.js";

export default function auth(req, res, next) {
 const Uid = req.cookies?.uid;
   if (!Uid) {
        return res.status(401).json({ error: "Unauthorized: No session found" });
    }
    
       const user = getid(Uid);
    if (!user) {
        return res.status(401).json({ error: "Unauthorized: Invalid session" });
    }

     req.user = user;
    next();
}