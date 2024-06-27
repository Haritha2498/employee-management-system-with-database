const express = require('express');
const app = express();
const port=3010;
const path = require('path');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// let emplist=[];

const dotenv=require('dotenv')
dotenv.config();


const mongoose=require('mongoose');
const url=process.env.mongodb_uri;
mongoose.connect(
    url
)

const database=mongoose.connection;
database.on("error",(error)=>
{
    console.log(error)
});
database.once("connection",()=>
{
    console.log("database connected");
})



const empdb=require('./models/schema.js')


app.get('/',(req,res)=>
{
    res.sendFile(path.join(__dirname,'public','index.html'))
})

app.get('/add',(req,res)=>
{
    res.sendFile(path.join(__dirname,'public','add.html'))
})

app.get('/view',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','view.html'))
    
})

app.get('/update',(req,res)=>
{
    res.sendFile(path.join(__dirname,'public','update.html'))
})


app.get('/search',(req,res)=>
{
    res.sendFile(path.join(__dirname,'public','search.html'))
})


app.post('/add',async(req,res)=>
{
    try{
    var{id,name,role}=req.body;
    id=parseInt(id)
    const newemp={id,name,role};
    // emplist.push(newemp);
    const data=await empdb.create(newemp);
    console.log(data);
    console.log('added')
    res.redirect('/view')
    }
    catch(error){
        console.log(error)
    }
})

app.get('/view/data',async (req,res)=>{
    try{
    const data=await empdb.find();
    res.json(data)
    // res.json(emplist)
}
catch(error){
    console.log(error)
}
})

app.get('/update/:id',async(req,res)=>
{
 const eid=req.params.id;
//  const details=emplist.find(emp=>emp.id==parseInt(eid));
//  console.log(eid);
//  if(!details){
//     return res.status(404).json({error:'task not found'});
//  }
const details=await empdb.findOne({id:eid})
console.log(details)

    // console.log("updation id:")
    // console.log(eid);
    res.sendFile(path.join(__dirname,'public','update.html'))
    
})

app.post('/update/data/:id',async(req,res)=>
{
    try{
    let {id,name,role}=req.body;
    
    const update={id,name,role}
    let reqid=req.params.id;
    reqid=reqid.toString();
    const options = { new: true };
    console.log("hello");
    // let details = emplist.findIndex(emp => emp.id === parseInt(reqid));
    // 
    const updateddetails=await empdb.findOneAndUpdate({id:reqid},update,options);
    
    res.redirect('/view')
}
catch(error){
    console.log(error);
    res.status(500).json({ message: error.message });
}

})


app.get('/search/:id',(req,res)=>
{
    const id=req.params.id;
    // const details=emplist.find(emp=>emp.id==parseInt(id));
    // // console.log(id);
    // if(!details){
    //     return res.status(404).json({error:'task not found'});
    // }
    // // console.log(details)


    res.sendFile(path.join(__dirname,'public','search.html'))

})






app.get('/search/data/:id', async(req, res) => {
    try{
    const eid = req.params.id;
    //console.log(`Received ID: ${id}`);
    //console.log(emplist);
    
    // const details = emplist.find(emp => emp.id === parseInt(id)); // Ensure the types match
    // console.log("search details:")
    // console.log(details);

    const data=await empdb.findOne({id:eid})
    res.json(data);
}
catch(error){
    console.log(error)
}
}
);


app.post('/delete/:id', async(req, res) => {
    try{
    const id = req.params.id;
    // console.log('Before deletion:', emplist);
    
    // emplist = emplist.filter(emp => emp.id !==parseInt( id));

    // console.log('After deletion:', emplist);

    const deletedDetails = await empdb.findOneAndDelete({id:id});

    res.redirect('/view');
}
catch(error){
    console.log(error)
}
});




app.listen(port,()=>
{
    console.log("service running on port "+port);
})