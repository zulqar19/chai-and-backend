import connectDB from "./db/index.js";
import dotenv from "dotenv"
import {app} from './app.js'

dotenv.config({
    path: './.env'
})



connectDB()
.then(() => {
    app.on("error",(err) => {
        console.log(`Err: Error on connecting `, err);
        throw err
    })

    app.listen(process.env.PORT , () =>{
        console.log(`Server is running at Port : ${process.env.PORT}`  );
    })
})
.catch((err) => {
    console.log("Err : MongoDB connection failed ", err);
})