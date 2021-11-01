const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r71m8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("travel");
        const servicesCollection = database.collection("services");
        const myServices = database.collection("myServices");

        //get api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        app.get('/myServicesPlan', async (req, res) => {
            const cursor = myServices.find({});
            const all = await cursor.toArray();
            res.send(all);
        })
        //post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });
        app.post('/myServices', async (req, res) => {
            const newPlan = req.body;
            const result = await myServices.insertOne(newPlan)
            console.log('New User', req.body);
            console.log('added user', result);
            res.json(result);
        });
        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
        app.delete('/myServicesPlan/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myServices.deleteOne(query);
            console.log('deleting..', result);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running TravelGuru Server");
});

app.get('/hello', (req, res) => {
    res.send('hello updated here');
})

app.listen(port, () => {
    console.log('Running TravelGuru Server on port', port);
})

