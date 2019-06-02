const express = require('express');
const request =  require('request');
const bodyParser =  require('body-parser');
const path = require('path');

// Init app
const app = express();

// Bodyparser Middlware
app.use(bodyParser.urlencoded({extended:true}));


// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// making a post request to /signup
// Signup Route
app.post('/signup', (req,res) => {
    // get the data that's submitted in the form
   const { firstName, lastName, email } = req.body;

   // Make sure fields are filled
   if(!firstName || !lastName || !email) {
        res.redirect('/fail.html');
        return;
   }

   // Construct req data
   const data = {
       members: [
           {
               email_address: email, // email from the form
               status: 'subscribed',
               merge_fields: {
                   FNAME: firstName,
                   LNAME: lastName
               }

           }
       ]
   };

   const postData  = JSON.stringify(data); // stringify version of data

   const options = {
       url: 'https://us20.api.mailchimp.com/3.0/lists/0d5ccce010',
       method: 'POST',
       headers: {
           Authorization: 'auth a458979d1bfb1591703fdfddfa0c0fc5-us20'
       },
       body: postData
   }

   // request to Mailchimp
   request(options, (err,response,body) => {
        if(err) {
            res.redirect('/fail.html');
        }else {
            if(response.statusCode === 200) {
                res.redirect('/sucess.html');
            } else {
                res.redirect('/fail.html');
            }
        }
   });
})

// Run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on ${PORT}`));


