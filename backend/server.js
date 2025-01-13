const express = require('express')
const path = require('path');
const mysql2 = require('mysql2')
const app = express();
app.use(express.json());

const database = mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:"pragnya",
    database:"blogdb"
});
database.connect((error) => {
    if(error){
        return console.error(error)
    }
    console.log("Mysql database is connected....")
})

//MIDDLEWARE FOR PARSING THE FORM DETAILS;
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, '../frontend')));
//ROUTE WHICH IS RESPONSIBLE TO DISPLAY HTML FILE
app.get('/',(req,res) => {
    const htmlfile = path.join(__dirname,'../frontend/index.html');
    res.sendFile(htmlfile)
})
//ROUTE FOR HANDLING FORM SUBMISSIONS FOR REGISTER
app.post('/regForm',(req,res) => {
   try{
        const {username,password} = req.body;
        console.log(req.body);
        const SQL_COMMAND = "INSERT INTO users (username,password) VALUES (?,?)";
        database.query(SQL_COMMAND,[username,password],(err,result) => {
            if(err){
                console.error(err);
                return res.send("Registration unsuccessful")
            }
            console.log(result);
            res.send("Registration successful")
        })
   }
   catch(err){
    console.error(err);
    res.send("Registration Unsuccessful")
   }
})

//ROUTE FOR HANDLING LOGIN
app.post('/loginForm', (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(req.body);

        const SQL_COMMAND = "SELECT password FROM users WHERE username = ?";
        
        database.query(SQL_COMMAND, [username], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send("An error occurred during login.");
            }
            
            if (results.length === 0) {
                return res.status(401).send("Invalid username or password.");
            }

            const storedPassword = results[0].password;

            
            if (password === storedPassword) {
                res.send("Login successful");
            } else {
                res.status(401).send("Invalid username or password.");
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred during login.");
    }
});

// ROUTE FOR HANDLING POSTS
app.post('/postForm',(req,res) => {
    try{
         const {title,content} = req.body;
         console.log(req.body);
         const SQL_COMMAND = "INSERT INTO posts (title,content) VALUES (?,?)";
         database.query(SQL_COMMAND,[title,content],(err,result) => {
             if(err){
                 console.error(err);
                 return res.send("Post display unsuccessful")
             }
             console.log(result);
             res.send("Post display successful")
         })
    }
    catch(err){
     console.error(err);
     res.send("Post display Unsuccessful")
    }
 }) 
    

app.listen(4000,() => {
    console.log("Server listening...")
})
