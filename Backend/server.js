import  express from "express";
import dotenv from 'dotenv'
import expressEjsLayouts from "express-ejs-layouts";
import {connectToMongodb} from "./src/config/mongodb.js";
import mainRoutes from './src/Routes/mainRoutes.js'
import habitRoutes from './src/Routes/habitRoutes.js'
import session from "express-session";

dotenv.config();
const server = express();

server.use(session({
    secret:"Key_Sec",
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}))

server.use(express.urlencoded({extended:true}));
server.use(express.json())
server.set('view engine','ejs');
server.set("views",'src/views');
server.use(expressEjsLayouts);
server.set('layout',"layout_/index");

server.use("/",mainRoutes);
server.use("/habbit",habitRoutes)



const port = process.env.PORT
server.listen(port,()=>{
    console.log("Port is running at ",port);
    connectToMongodb();
});