const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error')
const express = require('express');
const User = require('../models/user')
const CheckedInUser = require('../models/checked-in-user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');


const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}))

    const signUp = async (req, res, next) => {
       
        const {name, email , password, regNo} = req.body;
        let existingUser;
    try{
    existingUser = await User.findOne({ email:email })
} catch(err){

    const error = new HttpError(
        'Signup failed, please try again later',
        500
    );
    return next(error);
}

        if(existingUser){
            const error = new HttpError(
                'User exists already, please login instead',
                422
            );
            return next(error);
        }

        let hashedPassword;
        try{
        hashedPassword = await bcrypt.hash(password, 12);
    }
        catch (err) {
            const error = new HttpError(
                'Could not create user please try again later',
                500
            );
            return next(error);
        }
        const createdUser = new User ({
            name,
            email,
            image : req.file.path,
            password: hashedPassword,
            regNo,
            posts:[]
        });
    
        try{
            await createdUser.save();
            transporter.sendMail({
                to: email,
                from: 'anshum06as@gmail.com',
                subject: 'Gym Membership Succesfully Taken - Your Login Details',
                html: `<p> Thanks for taking your memebership, here are your login details for Gym Buddies login:
                </p> <br>
                <p> Email: ${email} </p>
                <br>
                <p> Registration Number: ${regNo} </p>
                <br>
                <p> Password: ${password} </p>`
            })
        } catch (err){
            const error= new HttpError(
                'Signing up failed, please try again later',
                500
            );
            return next(error);
        }

        let token;
        try{
        token = jwt.sign({userId: createdUser.id, email: createdUser.email}, 'AnshumTheGreatSuperSecret', {expiresIn: '1h'})
        } catch(err){
            const error = new HttpError('Signing up failed, please try again later', 500);
            return next(error);
            
        }
         res.status(201).json({userId: createdUser.id, email: createdUser.email, token: token});
    
    };

    const checkin =async (req, res, next) => {
        const {id} = req.body;
        let existingUser;
        try{
        existingUser = await User.findById(id)
    } catch(err){
    
        const error = new HttpError(
            'Checkin failed, please try again later',
            500
        );
        return next(error);
    }
    if( !existingUser){
        const error= new HttpError(
            'Could not identify user, not a member',
            403
        );
        return next(error);
    }
    const checkedInUser = new CheckedInUser({
        name: existingUser.name,
            email:existingUser.email,
            image : existingUser.image,
            password : existingUser.password,
            regNo : existingUser.regNo,
            posts: existingUser.posts,
            _id:existingUser.id
    })
    try{
        await checkedInUser.save();
    } catch (err){
        console.log(err)
        const error= new HttpError(
            
            'Checkin failed, please try again later in some time',
            500
        );
        return next(error);
    }
         res.status(201).json({user: existingUser});
    }

    const checkout = async (req, res, next) => {
        const {id} = req.body;
        let existingUser;
        try{
        existingUser = await CheckedInUser.findById(id)
    } catch(err){
    
        const error = new HttpError(
            'Checkin failed, please try again later in some time',
            500
        );
        return next(error);
    }
    if( !existingUser){
        const error= new HttpError(
            'Not a member',
            500
        );
        return next(error);
    }
   
    try{
        await existingUser.remove();
    } catch (err){
        const error= new HttpError(
            'Checkout failed, please try again later',
            500
        );
        return next(error);
    }
         res.status(201).json({message:'deleted'});
    }

    const usersInGym = async (req, res, next) => {
        let checkedInUser;
    try{
        checkedInUser = await CheckedInUser.find({}, '-password')
    }catch (err) {
        const error = new HttpError(
            'Fetching users failed, please try again later', 500
        ); 
        return next(error);
    }
    
        if(!checkedInUser){
            const error = new HttpError('Could not find users for the provided id', 404);
            return next(error);
           }
        res.json({user: checkedInUser.map(checkedInUser => checkedInUser.toObject({getters: true}))})
    }

exports.signUp = signUp;
exports.checkin = checkin;
exports.checkout = checkout;
exports.usersInGym = usersInGym;