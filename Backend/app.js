const express = require('express');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const multer = require('multer');
const path =require('path');


const postsRoutes = require('./routes/posts-route');
const usersRoutes = require('./routes/users-route');
const adminRoutes = require('./routes/admin-routes');


const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    next();
})

app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes)

app.use((req, res, next) => {
    const error= new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if(req.file) {
    fs.unlink(req.file.path, err =>{
        console.log(err)
    })
    }
    if(res.headerSent){;
    return next(error);
}
res.status(error.code || 500);
res.json({message: error.message || 'An unknown error occured'})
})
mongoose
.connect('mongodb+srv://anshum:anshum@cluster0.2s1of.mongodb.net/mern?retryWrites=true&w=majority')
.then(() => {
app.listen(5000);
})
.catch((err) => {
    console.log(err);
})
