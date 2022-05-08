const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// websterWarehouse
// pdno45Sec16Z0pbZ

const uri =
  "mongodb+srv://websterWarehouse:pdno45Sec16Z0pbZ@cluster0.svzql.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const InventoryCollection = client.db("inventory").collection("cars");
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
      const service = await InventoryCollection.findOne(query);
      res.send(service);
    });

    // app.post("/inventory", async (req, res) => {
    //   const result = await InventoryCollection.insertOne(item);
    //   res.send(result);
    // });
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