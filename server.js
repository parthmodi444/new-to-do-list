const express=require('express');
const bodyParser=require("body-parser");
const date=require(__dirname+"/date.js");
const mongoose = require('mongoose');
const _=require("lodash");
mongoose.connect('mongodb+srv://admin-parth:Test123@cluster0.yql9fsn.mongodb.net/toDoListDB',{useNewUrlParser:true});
console.log(date);
let ejs = require('ejs');
const app=express();
app.use(express.static("public"))
// let workItems=[]
// let items=["buy food","cook food" ,"eat food"]
const itemsSchema= new mongoose.Schema({
    name: String
  });
  const listSchema= new mongoose.Schema({
    name: String,
    items:[itemsSchema]
  });
  const List= mongoose.model('List', listSchema);
const Item = mongoose.model('Item', itemsSchema);
const item1=new Item({
    name:"Go Home"
})
const item2=new Item({
    name:"Go Office"
});
const item3=new Item({
    name:"Go Gym"
});
const defaultItems=[item1,item2,item3];
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}))
// Item.insertMany(defaultItems,function(err){
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log("Submitted sucessfully")
//     }
// })
app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;
    const listName=req.body.listName
    console.log(req.body);
    const item_id=req.body.checkbox;
    if(listName==="Today"){
        Item.findByIdAndDelete(item_id, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Deleted : ", docs);
        }
        res.redirect("/")
    });
   

    }

    else{

    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){

        if(!err){
            res.redirect("/"+listName)
        }
    })

}
})
app.get("/",function(req,res){
    // var now = new Date();
    // var day = days[ now.getDay() ];
    var day=date.getDate();
    Item.find({},function(err,foundItems){
        if(foundItems.length===0){
            Item.insertMany(defaultItems,function(err){
        if(err){
             console.log(err)
            }
        else{
            console.log("Submitted sucessfully")
            }
        })
        res.redirect("/")
        }
        else{
            res.render("list",{listTitle:"Today",itemList:foundItems})
        }
        
    });


})
app.post("/",function(req,res){
    let item=(req.body.item);
    let list_title=req.body.list;
    const itemUn=new Item({
        name:item
    });
    if(list_title==="Today")
    {

    itemUn.save();
    res.redirect("/")
    }
    else{
        List.findOne({name:list_title }, function (err, foundItem) {
            if (err){
                console,log(err)
            }
            else{
                (foundItem.items.push(itemUn));
                foundItem.save();
                res.redirect("/"+list_title);
            }
        });
    }



       
   
    // console.log(req.body)
    

})

// app.get("/work",function(req,res){
//     res.render("list",{listTitle:"Work List",itemList:workItems})
// })
app.get("/:customListName",function(req,res){
    var customListName=_.capitalize(req.params.customListName);
    List.findOne({ name: customListName}, function (err, foundList) {
        if (!err){
            if(!foundList){
                const list=new List({
                    name:customListName,
                    items:defaultItems
                })
                list.save();
                // console.log("Doesnot exists")
                res.redirect("/"+customListName);
            }
        else{
        res.render("list",{listTitle:customListName,itemList:foundList.items})
        // console.log("Exists");
        }
    }
    });    
})

app.listen(process.env.PORT || 3000,function(){
    console.log("listening to port 3000")
})