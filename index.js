const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app=express();
const port=process.env.PORT||5000;

// ummehomairatarin
// Z8YEsdYuprDLdvw2
// middleware
app.use(cors())
app.use(express.json())

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fdvzwaw.mongodb.net/?retryWrites=true&w=majority`;
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

    const topservies=client.db('RestaurentData').collection('TopServices');
    const allresdata=client.db('RestaurentData').collection('FoodAllData');
    const Orderdata=client.db('RestaurentData').collection('ordered');
    const Addelement=client.db('RestaurentData').collection('Addeddata')
    


    // topservies
    app.get("/topfood",async(req,res)=>{
        const cursor=topservies.find();
        const result=await cursor.toArray();
        res.send(result)
    })
    // for all data
    app.get("/allresfood",async(req,res)=>{
       console.log("x",req.query);
        const page=parseInt(req.query.pages)
        const size=parseInt(req.query.size)
        console.log("oa",page,size);
        const result=await allresdata.find()
        .skip(page*size)
        .limit(size)
        .toArray();
        res.send(result)
    })

    app.get("/count",async(req,res)=>{
      const count=await allresdata.estimatedDocumentCount()
      res.send({count});
    })


    // details
  
    
    app.get('/allresfood/:id', async (req,res) => {
      const id = parseInt(req.params.id);
      const query = { FoodID: id };
      const result = await allresdata.findOne(query);
      res.send(result);
  })

  // orderdata

  app.get('/orderdata',async(req,res)=>{
    console.log(req.query.email);
    let query={};
    if(req.query?.email){
      query= { Email: req.query.email}
    }
    const result=await Orderdata.find(query).toArray();
    res.send(result);
  })

  app.post("/orderdata",async(req,res)=>{
    const bookdata=req.body;
    console.log(bookdata);
    const result=await Orderdata.insertOne(bookdata)
    res.send(result)
  })

  app.delete('/orderdata/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:new ObjectId(id)}
    const result=await Orderdata.deleteOne(query);
    res.send(result);
  })

    
// add element

app.get('/adddata',async(req,res)=>{
  console.log(req.query.email);
  let query={};
  if(req.query?.email){
    query= { AddBy: req.query.email}
  }
  const result=await Addelement.find(query).toArray();
  res.send(result);
})

app.post("/adddata",async(req,res)=>{
  const adddata=req.body;
  console.log(adddata);
  const result=await Addelement.insertOne(adddata)
  res.send(result)
})

// update data

app.get('/adddata/:id',async(req,res)=>{
  const id = req.params.id;
  console.log(id);
  const query = { _id: new ObjectId(id) };
  const result=await Addelement.findOne(query)
  res.send(result);

})
app.put('/updateddata/:id',async(req,res)=>{
  const id=req.params.id;
  console.log(id);
  const filter={_id: new ObjectId(id)}
  const options={ upsert :true}
  const updatedata=req.body;
   const dataupdate= {

    $set:{
  
      Foodname:updatedata.Foodname,
      Quantity:updatedata.Quantity,
      Category:updatedata.Category,
      Origin:updatedata.Origin,
      Price:updatedata.Price,
      Describtion:updatedata.Describtion,
      Image:updatedata.Image

    }
  }
  const result=await Addelement.updateOne(filter, dataupdate,options)
  res.send(result)
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

app.get("/",(req,res)=>{
   res.send('Restaurent is Running')
})
app.listen(port,()=>{
    console.log(`The res is Running ${port}`);
})

