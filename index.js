const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion } = require('mongodb');
const objectId = require('mongodb').ObjectId

const app = express();
const port = process.env.PORT || 4000;

app.use(cors())
app.use(express.json())



const uri = "mongodb+srv://cryptomehedi:646266Mhn@cluster0.vu0hy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try {
        await client.connect();
        const usersCollection = client.db("foodExpress").collection("users");
        
        app.get("/user", async (req, res) =>{
            const query ={}
            const cursor = usersCollection.find(query);
            const users = await cursor.toArray()
            res.send(users)
        })

        app.get('/user/:id', async (req, res) =>{
            const id = req.params.id
            const query ={_id : objectId(id)}
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        app.post('/user',async (req, res)=>{
            const newUser = req.body
            console.log('adding new user', newUser )
            const result = await usersCollection.insertOne(newUser)
            res.send(result)
        })
        
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id
            const filter = {_id : objectId(id)}
            const updatedUser = req.body
            const options = { upsert: true };
            const updateDoc = {
                $set: updatedUser
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id : objectId(id)}
            const result = await usersCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir)


app.get('/', (req, res) =>{
    res.send('node server')
})

app.listen(port, ()=>{
    console.log(port)
});