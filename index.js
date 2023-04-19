const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const dotenv = require("dotenv").config();


const app = express()
app.use(cors())
app.use(express.json({limit : "10mb"}))

const PORT =  8080

// mongodb connection
// console.log(process.env.MOONODB_URL)
mongoose.set('strictQuery' , false);
mongoose
  .connect("mongodb+srv://amit:amit123@amitstore.dnbzoi2.mongodb.net/amitEcommerce?retryWrites=true&w=majority")
.then(()=>console.log("connect to Database"))
.catch((err)=>console.log(err))

// schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image : String,
})

//
const userModel = mongoose.model("user",userSchema)


// api
app.get("/",(req,res)=>{
    res.send("Server is running")
})
app.post("/signup",async(req,res)=>{
  console.log(req.body)
  try{
    const email = await userModel.findOne(req.body)
    if(email){
      res.send({message:"Email is already register", alert:false})
    }
    if(!email){
      const data =userModel(req.body)
     const save =data.save()
     res.send({message:"succesfully sign up", alert:true})
    }
   
    
  }catch (error){
    console.log(error)
  }
  
})

app.post("/login", async(req, res) => {
  console.log(req.body);
  try{
    const result = await userModel.findOne(req.body)
      if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      console.log(dataSend);
      res.send({
        message: "Login is successfully",
        alert: true,
        data: dataSend,
      });
    } if(!result){
      res.send({
        message: "Email is not available, please sign up",
        alert: false,
      });
    }
   }catch (error){
      console.log(error)
    }

});

//product section

const SchemaProduct= mongoose.Schema({
  name : String,
  category : String,
  image : String,
  price : String,
  description : String,
});

const productModel =mongoose.model("product", SchemaProduct)
// save product in data
// api

app.post("/uploadProduct",async(req,res)=>{
  console.log(req.body)
  const data = await productModel(req.body)
  const datasave = await data.save()
  console.log(datasave)
  res.send({message : "Upload successfully"})
})

//
app.get("/product",async(req,res)=>{
const data = await productModel.find({})
res.send(JSON.stringify(data))
})

app.listen(PORT,()=>console.log("server is running at port :" + PORT))