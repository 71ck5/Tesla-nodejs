const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const tesla = require ('/tesla.js');
var cookieParser = require('cookie-parser');
const cheerio = require('cheerio');
var fs = require('fs');

// Adding functions to app()
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Allowing access to static pages
app.use('/public', express.static('public'))
app.use('/public', express.static('images'))

const $ = cheerio.load(fs.readFileSync(__dirname + '/public/template.html'));

function updatedHtml(res){
    res.send($.html())
}
app.get
var called = false
function tesla_list(token, res){
    tesla.listcars(token).then(result2 => {
        if(called == false){
        for(let index = 0; index < result2.count; index++) {
           $('div.lu').append(`
           <div class="li">
           <p>${result2.response[index].display_name}</p>
           <img src="https://static-assets.tesla.com/v1/compositor/?model=mx&view=STUD_3QTR_V2&size=700&options=MTX03,COL2-PMNG,WT20&bkba_opt=1&context=design_studio_2.png">
            </div>
            <div class="content">
           <a href="#Wakeup" value="Wakeup">Wakeup</a>
           <a href="#" value="Unlock Doors">Unlock Doors</a>
           <a href="#" value="Lock Doors">Lock Doors</a>
           <a href="#" value="Honk Horn">Honk Horn</a>
           <a href="#" value="Flash Lights">Flash Lights</a>
           <a href="#" value="Start HVAC System">Start HVAC System</a>
           <a href="#" value="Stop HVAC System">Stop HVAC System</a>
           <a href="#" value="Set Temperature">Set Temperature</a>
           <a href="#" value="Set Charge Limit">Set Charge Limit</a>
           <a href="#" value="Set Max Range Charge Limit">Set Max Range Charge Limit</a>
           <a href="#" value="Set Standard Charge Limit">Set Standard Charge Limit</a>
           <a href="#" value="Open sun roof">Open sun roof</a>
           <a href="#" value="Actuate trunk">Actuate trunk</a>
            </div>`);
       }
       return called = true
    }
               updatedHtml(res)
       }
    )    
    .catch(error =>{
        res.send(error)
    })
    
}

app.post("/login", async (req, res) =>{
    var email = req.body.Email
    var pass = req.body.Pass
    if(req.cookies.access_token){
        res.redirect('/cars')
    }
    else{
    console.log(req)
    tesla.RenewPassword(email, pass).then(result => {
        res.redirect('/cars')
        res.cookie('access_token', `${result.access_token}`) 
    })
    .catch(error =>{
        res.send('User name or password incorrect! Try Again!')
    }
    )
}
})

app.get("/cars", async (req, res) =>{
    var token = req.cookies.access_token
    tesla_list(token, res)
}
)
app.get("/", (req,res) => {
    res.redirect('/public/')
})
app.get("/test", (req,res) => {
    res.send('<p>test</p>')
})

app.listen(process.env.PORT||3000,console.log('3000'))