import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import PostMessage from "./models/postMessage.js"

const app = express();


app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const CONNECTION_URL = "mongodb://sai:123@ac-qr8rugp-shard-00-00.2b665rp.mongodb.net:27017,ac-qr8rugp-shard-00-01.2b665rp.mongodb.net:27017,ac-qr8rugp-shard-00-02.2b665rp.mongodb.net:27017/?ssl=true&replicaSet=atlas-o2tbpj-shard-0&authSource=admin&retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;
mongoose
.connect(CONNECTION_URL, {
useNewUrlParser: true,
useUnifiedTopology: true
// useCreateIndex: true
})
.then(()=> app.listen(PORT, function(){
    console.log(`Server running at ${PORT}`);
}))
.catch((error) => console.log(error.message));

app.get("/", (req, res)=>{
    res.send("hello memories api here.");
})

app.get("/posts", async (req, res) => {
    try {
        const postMessages = await PostMessage.find();
                
        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

app.post("/posts", async (req,res) => {
    const newPost = req.body;
    
    const newPostMessage = new PostMessage(newPost);
    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }

});

