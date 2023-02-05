require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https= require("https");
const { stringify } = require("querystring");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});
app.post("/", function(req,res){
    const fname = req.body.one;
    const lname = req.body.two;
    const eml = req.body.three;
    
    
    const data={
        members: [
            {
                email_address : eml,
                status : "subscribed",
                merge_fields :{
                    FNAME : fname,
                    LNAME : lname
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    
    const url= "https://us18.api.mailchimp.com/3.0/process.env.api_key";
    const options = {
        method : "POST",
        auth : "prab:process.env.auth_key"
    }
    const request = https.request(url, options, function(response){
        var sc = response.statusCode;
       
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
        if (sc=== 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server running on port 3000 ");
})

