import {MongoClient} from "mongodb";
const url = "mongodb://localhost:27017/habbiTracker"


let client;

export function connectToMongodb() {
    MongoClient.connect(url).then(clientInstance => {
        client = clientInstance;
        console.log("Mongodb is connected");
    }).catch(err => {
        console.log(err);
    });

}

export  function getdb(){
    return client.db();
}