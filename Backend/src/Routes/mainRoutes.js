import express from "express";
import User from "../models/user.model.js";
import { getdb } from "../config/mongodb.js";
import { auth, checkUser } from "../middlewares/auth.middleware.js";
const Router = express.Router();

Router.get('/',auth, async (req,res)=>{





        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const habbit_date = `${year}-${month}-${day}`;
     




        const db = await getdb();
        const collections = await db.collection("users");
        const user_mail = req.session.userEmail;
        const user = await collections.findOne({email : user_mail});
        let data;
        const index = await user.habbits.findIndex(habbit => habbit.date === habbit_date);
    
        if(index!=-1){
            let habbitList = user.habbits[index].habbitList;
            let habbitList_ = user.habbits[index].habbitList_;
      
         data = {
                check : false,
                date:habbit_date,
                habbitList:habbitList,
                habbitList_:habbitList_
            }
            

        }
        else{
            data = {
                check : true,
                date:habbit_date,
                
            }
        }
   
    
   

       
    
    res.render('home',{data});
})

Router.get('/login',(req,res)=>{
    res.render("login");
})


Router.get('/register',(req,res)=>{
    res.render("register");
})




// Post methods


Router.post('/login', async (req,res)=>{
    const {email,password} = req.body;
    const db = await getdb();
    const collection = db.collection("users");
    const user = await collection.findOne({email});


    if(user){
        // console.log(password===user.password)
        if(password===user.password){
            req.session.userEmail = email;
           
            res.redirect('/');

        }
        else{
            res.send("password doesnot match");
        }
    }
    else{
        res.send("Soory no user Found please Register");
    }

})


Router.post('/register',async (req,res)=>{
    // console.log(req.body);
    const {name,email,password} = req.body;
    let habbits = [];



    const new_user = new User(name,email,password,habbits);
    // console.log(new_user);

    const user = await  checkUser(new_user.email);
    // console.log(user);
    
    if(!user){
        const db = await getdb();
        const collection = db.collection("users");
        const enter = await collection.insertOne(new_user);
        
        if(enter){
            res.redirect("/login");
        }
        else{
            res.send("some error occur")
        }
    }
    else{
        res.send("THe user is already exists")
    }



   
    
})


Router.post('/logout',(req,res)=>{
    console.log("clicked");
    if(req.session.userEmail){
        req.session.destroy((err)=>{
            if(err){
                console.log(err);
                res.send("error occured");
            }
            else{
                console.log("Logout succesfully")
                res.redirect('/login')
            }
        })
    }
    else{
        res.send("Login first");
    }


})




export default Router;