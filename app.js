const express = require("express");
const bodyparser=require("body-parser");
const mongoose = require('mongoose');


const app=express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect('mongodb://127.0.0.1:27017/riot_keepDB');


const itemSchema=new mongoose.Schema({
    name:String
});
const Item=mongoose.model("Item",itemSchema);

const brush =new Item({
    name:"brush"
});
const bath=new Item({
    name:"bath"
});

const defaultactivites=[brush,bath];
// Item.insertMany(defaultactivites).then(function () {
//     console.log("Data inserted") // Success 
// }).catch(function (error) {
//     console.log(error)     //Failure
// }); 


app.get("/",async function(req,res)
{
    const tasks = await Item.find({});
    console.log(tasks);
    let today=new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
    const detailedDate = today.toLocaleDateString('en-US', options);

    if(tasks.length==0)
    {
        Item.insertMany(defaultactivites).then(function () {
    console.log("Data inserted") // Success 
}).catch(function (error) {
    console.log(error)     //Failure
    res.redirect("/")
}); 

    }else{
   

    res.render("list",{kindOfDay:detailedDate,tasks:tasks});
}
    
})

app.post("/",function(req,res)
{
    let itemName=req.body.inputField;
    const item=new Item({
        name:itemName

    });
    item.save();
    res.redirect("/");
})
app.post("/delete", async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.body.taskId);
        
        res.sendStatus(200);
    } catch (err) {
        console.error("Error deleting task:", err);
        res.sendStatus(500);
    }
});



app.listen(3000,function()
{
    console.log("server is up and running on port 3000.");
})