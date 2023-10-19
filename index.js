const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bjwj9uc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // create mongoDB database for Products
        const productsCollections = client.db("productsDB").collection("products");

        // create mongoDB database for Products
        const brandCollections = client.db("productsDB").collection("brands");

        // gel all brands 
        app.get('/brands', async (req, res) => {
            const result = await brandCollections.find().toArray();
            res.send(result);
        })

        // get single products id wise
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productsCollections.findOne(query);
            res.send(result);
        })

        // Update the /products route in your back-end
        app.get('/products', async (req, res) => {
            const brand = req.query.brand; // Get the brand from the query parameter
            const query = brand ? { brand } : {}; // Create a query to filter by brand if it exists

            const result = await productsCollections.find(query).toArray();
            res.send(result);
        });

        // get only Google Products
        app.get('/googleProducts', async (req, res) => {
            const result = await productsCollections.find({ brand: "Google" }).toArray();
            res.send(result);
        });

        // get only Apple Products
        app.get('/appleProducts', async (req, res) => {
            const result = await productsCollections.find({ brand: "Apple" }).toArray();
            res.send(result);
        });

        // cerate API for products
        app.post('/products', async (req, res) => {
            const product = req.body;
            // console.log('product will be added', product);
            // Insert the defined document into the "productsCollections"
            const result = await productsCollections.insertOne(product);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('brandShop server is running')
});

app.listen(port, () => {
    console.log(`brandShop server is running on port ${port}`);
});