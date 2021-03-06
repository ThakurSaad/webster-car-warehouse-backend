const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.svzql.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const InventoryCollection = client.db("inventory").collection("cars");
    const myCarsCollection = client.db("inventory").collection("myCars");
    console.log("connected to database");

    // GET // Inventory
    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = InventoryCollection.find(query);
      const inventory = await cursor.toArray();
      res.send(inventory);
    });

    // GET // for single Inventory
    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const inventory = await InventoryCollection.findOne(query);
      res.send(inventory);
    });

    // POST // new Car, new car inventory
    app.post("/inventory", async (req, res) => {
      const newItem = req.body;
      const result = await InventoryCollection.insertOne(newItem);
      res.send(result);
    });

    // DELETE // single car
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await InventoryCollection.deleteOne(query);
      res.send(result);
    });

    // UPDATE // update quantity
    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const updatedQuantity = req.body;
      console.log(updatedQuantity);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updatedQuantity.manageQuantity,
        },
      };
      const result = await InventoryCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //POST // post mycars, single car adding
    app.post("/myCars", async (req, res) => {
      const newMyCar = req.body;
      const result = await myCarsCollection.insertOne(newMyCar);
      res.send(result);
    });

    // GET // my cars user(email) based
    app.get("/myCars", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = myCarsCollection.find(query);
      const myCars = await cursor.toArray();
      res.send(myCars);
    });

    // DELETE // single my car
    app.delete("/myCars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await myCarsCollection.deleteOne(query);
      res.send(result);
    })
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running webster warehouse super server");
});

app.listen(port, (res, req) => {
  console.log("listening to port", port);
});
