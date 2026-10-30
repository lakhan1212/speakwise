import jwt from "jsonwebtoken";
const secret = "lakhansecure"

export function setid(user) {


   return jwt.sign({
      _id: user._id,
      email: user.email,
   }, secret)

}
export function getid(token) {

   try {
      jwt.verify(token, secret);
      return true;
   } catch (error) {
      console.log(error)
      return false;
   }
}