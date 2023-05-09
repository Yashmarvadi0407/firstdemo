const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User =require('./useSchema')
const bodyParser = require('body-parser')
const cors=require('cors')


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors())

//database connected
mongoose.connect("mongodb+srv://yashmevada1522:Yashmevada1522@cluster0.p4ygfxj.mongodb.net/tabledemo")
.then(()=>{
    console.log("db is on");
})
.catch((e)=>{
    console.log(e);
})

//Router 
//post data
app.post('/',async(req,res)=>{

    const user= new User(req.body)
    await user.save();
    res.send(user);
})


//updatedata
app.patch('/update',async(req,res)=>{
               
    try {
        console.log(req.body);
       const _id=req.body
       console.log(_id)
       const updatedata = await User.findByIdAndUpdate(_id,req.body)
    //    await updatebike.save()
       //console.log(updatebike)
       res.status(200).send(updatedata)
    //    console.log(updatebike);
    } 
    catch(e){

      res.status(400).send({"meassge":" id is not match"});
    }
});
app.delete('/delete',async(req,res)=>{
               
    try {
        console.log(req.body);
       const _id=req.body
       console.log(_id)
       const deletedata = await User.findByIdAndDelete(_id)
    //    await updatebike.save()
       //console.log(updatebike)
       res.status(200).send(deletedata)
    //    console.log(updatebike);
    } 
    catch(e){

      res.status(400).send({"meassge":" id is not match"});
    }
});

// //deleteall
// app.delete('/deletemany',async(req,res)=>{
               
//     try {
//         console.log(req.body);
//        const _id=req.body
//        console.log(_id)
//        const deletedata = await User.deleteMany()
//     //    await updatebike.save()
//        //console.log(updatebike)
//        res.status(200).send(deletedata)
//     //    console.log(updatebike);
//     } 
//     catch(e){

//       res.status(400).send(e);
//     }
// });


//getdata
app.get("/getdata",async(req, res)=>{
    try {
        let {page,limit}=req.params;
        if(!page) page=1;
        if (!limit) limit=10
       const skip=(page-1)*10

        const userdata = await User.find().skip(skip).limit(limit)
      res.status(200).json({limit:limit,page:page,user:userdata});
    //   res.send(userdata.length)
    } catch (e) {
      res.status(500).send(e);
      res.send(e)
    }
  })


app.listen("5000",(req,res)=>{
    console.log("server is listening ");

})