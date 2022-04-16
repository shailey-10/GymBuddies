const e = require('express');
const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Anshum Shailey',
        email: 'anshum06as@gmail.com',
        regNo: '199301038',
        password: 'tester'
    }
]

const getUsers = (req, res, next) => {
   res.json({users: DUMMY_USERS})
};



const login =async(req, res, next) => {
    const {email , password, regNo} = req.body;

    let existingUser;
    try{
    existingUser = await User.findOne({ email:email })
    console.log(existingUser);
} catch(err){

    const error = new HttpError(
        'Logging in failed, please try again later',
        500
    );
    return next(error);
}

    if(!existingUser){

        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            403
        );
        return next(error);

    }
    let isValidPassword = false;
    try{
      isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch(err) {
      const error = new HttpError(
        'Could not log you in, please check your credentials and try again',
        500
      );
      return next(error);

    }

    if(!isValidPassword){
      const error = new HttpError(
        'Invalid credentials, could not log you in.',
        403
    );
    return next(error);
    }

    let token;
        try{
        token = jwt.sign({userId: existingUser.id, email: existingUser.email}, 'AnshumTheGreatSuperSecret', {expiresIn: '1h'})
        } catch(err){
            const error = new HttpError('Login failed, please try again later', 500);
            return next(error);
            
        } 

    
    res.json({userId : existingUser.id,
    email: existingUser.email,
  token: token})
};

const userCheckin = async (req, res, next) => {
     const userId = req.params.uid;
let userToCheckin;
  try {
    userToCheckin = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'Fetching posts failed, please try again later',
      500
    );
    return next(error);
  }
  if (!userToCheckin) {
    return next(
      new HttpError('Could not find posts for the provided user id.', 404)
    );
  }

  res.json({
    posts: userToCheckin.toObject({ getters: true })
  });
}


exports.getUsers = getUsers;
exports.login = login;
exports.userCheckin = userCheckin;