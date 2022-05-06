const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();


// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cyc0z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     console.log('eco warhous db connected')
//     // perform actions on the collection object
//     client.close();
// });
async function run() {
    try {
        await client.connect();
        const productCOllection = client.db('assignment-11-eco-warehouse').collection('product');
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCOllection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCOllection.findOne(query);
            res.send(product);
        });


        //POST: add new product
        app.post('/product', async (req, res) => {

            const newProduct = req.body;
            const result = await productCOllection.insertOne(newProduct);
            res.send(result);
        });


        //delete single item item api
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCOllection.deleteOne(query);
            res.send(result);
        });

    } finally {

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running eco-warehouse server');
});

app.listen(port, () => {
    console.log("Listening to port", port);
});