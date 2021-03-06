
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const name = req.body.firstName;
    const lName = req.body.lastName;
    const email = req.body.eAddress;
    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: name,
                    LNAME: lName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us4.api.mailchimp.com/3.0/lists/8533cf892f";
    const options = {
        method: "POST",
        auth: "maritza:173fedf6ff30f62a54cf5c7f5aab1fd3-us4"
    }
    const request = https.request(url, options, function(response) {
        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
    
    
        response.on("data", function(data) {
        console.log(JSON.parse(data));
    })
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
})
app.listen(process.env.PORT || 3000,function() {
    console.log("Server is running on port 3000.");
});
