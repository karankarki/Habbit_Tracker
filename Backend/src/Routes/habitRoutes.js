import express, { json } from "express";
import { getdb } from "../config/mongodb.js";
import { auth } from "../middlewares/auth.middleware.js";

const Router = express.Router();


Router.post('/habbitShow',auth,async (req,res)=>{
    const {habbit_date} = req.body;
    // console.log(habbit_date);
    const db = await getdb();
    const collections = await db.collection("users");
    const user_mail = req.session.userEmail;
    // console.log(user_mail);
    const user = await collections.findOne({email : user_mail});
    let data;
    const index = await user.habbits.findIndex(habbit => habbit.date === habbit_date);

    if(index!=-1){
        let habbitList = user.habbits[index].habbitList;
        let habbitList_ = user.habbits[index].habbitList_;
     
     data = {
            check : false,
            date:habbit_date,
            habbit:habbitList,
            habbit_:habbitList_
        }
        

    }
    else{
        res.send("No data is found for this day");
    }


    res.render("./components/card2",{data});
})


Router.post("/addHabbit",auth,async (req,res)=>{


    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const habbit_date = `${year}-${month}-${day}`;

    const db = await getdb();
    const collections = await db.collection("users");
    const user_mail = req.session.userEmail;
    const user = await collections.findOne({email : user_mail});

    let habbitList = [];
    try {
        const index = await user.habbits.findIndex(habbit => habbit.date === habbit_date);
        
         habbitList = user.habbits[index].habbitList;

        
    } catch (error) {
        habbitList=[]
        
    }


    // console.log("ffdasfd  ",habbitList);

    res.render("addHabbit",{habbitList});

})


Router.post('/addHabbit2',auth,async (req,res)=>{
    const habbitList = req.body;
 

    const mergedArray = Object.values(habbitList)
    .reduce((acc, val) => {
      if (Array.isArray(val)) {
        return acc.concat(val);
      } else {
        return acc.concat([val]);
      }
    }, []);

    console.log("merged arrauy ",mergedArray );
  

       

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const habbit_date = `${year}-${month}-${day}`;


    const db = await getdb();
    const collections = await db.collection("users");
    const user_mail = req.session.userEmail;
    const user = await collections.findOne({email : user_mail});
    const index = await user.habbits.findIndex(habbit => habbit.date === habbit_date);
    console.log(index);

   let habbitList_ = [];
   for(let i = 0;i<mergedArray.length;i++){
    habbitList_.push("default");
   }


   if(index!=-1){
    const filter = { email: user_mail, 'habbits.date': habbit_date };
    const updateDoc = {
        $set: {
            'habbits.$.habbitList': mergedArray,
            'habbits.$.habbitList_': habbitList_
        }
    };

    const result = await collections.updateOne(filter, updateDoc);
    console.log(result);
   }
   else{
    const filter = { email: user_mail };
    const updateDoc = {
        $push: {
            habbits: {
                date: habbit_date,
                habbitList: mergedArray,
                habbitList_: habbitList_
            }
        }
    };

    const result = await collections.updateOne(filter, updateDoc);
    console.log(result)

   }

  

    
    res.redirect('/');

    


})


Router.post("/submitHabbit",auth,async (req,res)=>{
    const {hiddenList} = req.body;
    let list_ = hiddenList.split(",");
    console.log(list_);

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const habbit_date = `${year}-${month}-${day}`;

  
    const db = await getdb();
    const collections = await db.collection("users");
    const user_mail = req.session.userEmail;
    const filter = { email: user_mail, 'habbits.date': habbit_date };
    const updateDoc = {
        $set: {
            'habbits.$.habbitList_': list_
        }
    };

    const result = await collections.updateOne(filter, updateDoc);



    res.redirect('/');

})

export default Router;