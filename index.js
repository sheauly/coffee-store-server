const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clustersheauly.6uz8dzi.mongodb.net/?retryWrites=true&w=majority&appName=ClusterSheauly`;

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

    const coffeesCollection = client.db('coffeeDB').collection('coffees')

    app.get('/coffees', async (req, res) => {
      // const cursor = coffeesCollection.find();
      // const result = await cursor.toArray();
      const result = await coffeesCollection.find().toArray()
      res.send(result);
    })

    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeesCollection.findOne(query);
      res.send(result);
    })

    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const updatedDoc = {
        $set: updatedCoffee
      }
      const result = await coffeesCollection.updateOne(filter, updatedDoc, options);

      res.send(result);
    })

    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee)
      const result = await coffeesCollection.insertOne(newCoffee);
      res.send(result);
    })

    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await coffeesCollection.deleteOne(query);
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Coffee server is getting hotter.')
})

app.listen(port, () => {
  console.log(`Coffee server is running on port ${port}`)
})
