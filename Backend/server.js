const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config()//process.env.SECRET_KEY
// let mClient = new MongoClient('mongodb://127.0.0.1:27017');
let mClient = new MongoClient(process.env.DB_URL);
const cors=require('cors');

  app.use(cors({
    origin:'https://full-stack-project-frontend-q7a4.onrender.com'
  }))

mClient.connect()
  .then((connectionObj) => {
    console.log("DB connection Successful");
    const fsddb = connectionObj.db('pvpdb');



    const usersCollection = fsddb.collection('userlist');
    const productsCollection = fsddb.collection('products');
    const cartCollection = fsddb.collection('cart');



    app.set('usersCollection', usersCollection);
    app.set('productsCollection', productsCollection);
    app.set('cartCollection', cartCollection);


    const PORT = process.env.PORT_No || 3000;



    app.listen(PORT, () => console.log(`HTTP server started on port ${PORT}`));
  })
  .catch(err => console.log("Error in connection", err));

const userApp = require('./APIs/UserAPI');
const productsApp = require('./APIs/ProductsAPI');

app.use('/user-api', userApp);
app.use('/product-api', productsApp);
//handling ivalid paths
app.use('*',(req,res,next)=>{
  console.log(req.status)
  res.send({message:'Invalid path'})
})

app.use((err,req,res,next)=>{
  res.send({message:"Error Occured",errMessage:err.message})
})
