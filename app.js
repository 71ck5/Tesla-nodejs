const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const tesla = require ('./tesla.js');
var cookieParser = require('cookie-parser');
const cheerio = require('cheerio');
var fs = require('fs');

// Adding functions to app()
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

// Allowing access to static pages


const port = process.env.PORT || 8080;

const $ = cheerio.load(fs.readFileSync(__dirname + '/public/template.html'));

function updatedHtml(res){
    res.send($.html())
}
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
           <a href="/command?wake_up=${result2.response[index].id}" value="Wakeup">Wakeup</a>
           <a href="/command?door_unlock=${result2.response[index].id}" value="Unlock Doors">Unlock Doors</a>
           <a href="/command?door_lock=${result2.response[index].id}" value="Lock Doors">Lock Doors</a>
           <a href="/command?honk_horn=${result2.response[index].id}" value="Honk Horn">Honk Horn</a>
           <a href="/command?flash_lights=${result2.response[index].id}" value="Flash Lights">Flash Lights</a>
           <a href="/data?vehicle_data=${result2.response[index].id}" value="Data">Get Vehicle Data</a>
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
        try{
            res.cookie('access_token', `${result.access_token}`) 
        }
        finally{
            res.redirect('/cars')
        }
    })
    .catch(error =>{
        res.send('User name or password incorrect! Try Again!')
    })
}
})

app.get("/login", async (req, res) =>{

})

app.get("/cars", async (req, res) =>{
    var token = req.cookies.access_token
    tesla_list(token, res)
    }
)

app.get("/data", async (req, res) =>{
    if(req.query){
        var token = req.cookies.access_token
        var data = Object.keys(req.query)[0]
        var id = Object.values(req.query)[0]
        tesla.tesla_state(token, id, data).then(result => {
        res.json(result)
        })
    }else{
        res.send("no data")
    }
})

app.get("/command", (req, res) =>{
    if(req.query){
        var token = req.cookies.access_token
        var command =  Object.keys(req.query)[0]
        var id = Object.values(req.query)[0]
        tesla.tesla_command(token, id, command).then(result => {
        res.send(result)
        console.log(result)
        })
    }
})

app.get("/test", (req,res) => {
    res.send('<p>test</p>')
})

app.listen(port, () => {
    console.log(`Running on port ${port}`);
    });