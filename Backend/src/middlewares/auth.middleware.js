
import { getdb } from '../config/mongodb.js';

export const  checkUser = async (email)=>{

    const db = await getdb();
    const collection = await db.collection("users");
    return await collection.findOne({email})

}

export const auth = async(req,res,next)=>{
    if(req.session.userEmail){
        next();
    }else{
        res.redirect('/login');
    }
}