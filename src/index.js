const express = require('express');
const cors = require('cors');
const hbs = require('hbs');
const path = require('path');
const port = process.env.PORT;
const app = express();



const publicDirectory = path.join(__dirname,'../public');
const viewsPath = path.join(__dirname,"../templates/views");
const partialsPath = path.join(__dirname,"../templates/partials");

app.set('view engine','hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.json());
app.use(cors());
app.use(express.static(publicDirectory));

app.get('',(req,res)=>{
    res.render('index');
});

app.get('/admin', (req,res)=>{
    res.render('admin');
});

app.get('/cart', (req,res)=>{
    res.render('cart');
});

app.get('/book/:isbn', (req,res)=>{
    const isbn = req.params.isbn;
    res.render('book');
});


app.listen(port,()=>{
    console.log('Server is connected. port: ',port);
});