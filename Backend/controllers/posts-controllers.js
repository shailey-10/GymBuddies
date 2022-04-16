const { v4: uuidv4 } = require('uuid');
const {validationResult} = require('express-validator');
const Post = require('../models/post')
const User = require('../models/user')
const mongoose = require('mongoose')
const fs = require('fs')
const HttpError = require('../models/http-error');
const { post } = require('../routes/posts-route');
const checkAuth = require('../middlewares/check-auth')


const getPostById = async (req, res, next) => {
    const postId = req.params.pid;
    let post;
    try{
        post = await Post.findById(postId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find post', 500
        ); 
        return next(error);
    }
    

    if(!post){
      const error = new HttpError('Could not find posts for the provided id', 404);
      return next(error);
     }
    res.json({post: post.toObject({getters: true})})
}

const getPostsByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    // let posts;
    let userWithPosts;
  try {
    userWithPosts = await User.findById(userId).populate('posts');
  } catch (err) {
    const error = new HttpError(
      'Fetching posts failed, please try again later',
      500
    );
    return next(error);
  }

  // if (!places || places.length === 0) {
  if (!userWithPosts || userWithPosts.posts.length === 0) {
    return next(
      new HttpError('Could not find posts for the provided user id.', 404)
    );
  }

  res.json({
    posts: userWithPosts.posts.map(post =>
      post.toObject({ getters: true })
    )
  });
}

const getFeed = async (req, res, next) => {
    let posts;
    try{
        posts = await Post.find()
    }catch (err) {
        const error = new HttpError(
            'Fetching posts failed, please try again later', 500
        ); 
        return next(error);
    }
    
        if(!posts || posts.length === 0){
            const error = new HttpError('Could not find posts for the provided id', 404);
            return next(error);
           }
        res.json({posts: posts.map(posts => posts.toObject({getters: true}))})
    }
 

const createPost = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid inputs passes, please check your data', 422);
    }
    const {title,description} = req.body;
    const createdPost = new Post({
        title,
        description,
        image : req.file.path,
        creator : req.userData.userId
    });

    let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError('Creating post failed, please try again', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPost.save({ session: sess });
    user.posts.push(createdPost);
    // await user.markModified('posts');
    console.log(user)
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Creating post failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ post: createdPost });
}

const updatePost = async (req, res, next) => {
    const {title,description} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid inputs passes, please check your data', 422);
    }
    const postId = req.params.pid;

    let post;
    try{
        post = await Post.findById(postId)
    }catch (err){
        const error= new HttpError(
            'Something went wrong, could not update post',
            500
        );
        return next(error);
      }
        if(post.creator.toString() !== req.userData.userId){
          const error= new HttpError(
            'You are not allowed to edit this place',
            401
        );
        return next(error);
      }
      
    post.title = title;
    post.description = description;

    try{
        await post.save();
    }catch (err){
        const error= new HttpError(
            'Something went wrong, could not update post',
            500
        );
        return next(error);
        }

    res.status(200).json({post: post.toObject({getters: true})});


};
const deletePost = async (req, res, next) => {
    const postId = req.params.pid;
    
    let post;
    try{
    post = await Post.findById(postId).populate('creator');
    }catch (err){
        const error= new HttpError(
            'Something went wrong, could not update post',
            500
        );
        return next(error);
        }

        if(!post){
            const error = new HttpError('Could not find post for this id.', 404);
            return next(error);
        }

        if(post.creator.id !== req.userData.userId){
          const error= new HttpError(
            'You are not allowed to edit this place',
            401
        );
        return next(error);
        }

        const imagePath = post.image;
        try{
            const sess = await mongoose.startSession();
            sess.startTransaction();
            await post.remove({ session: sess });
            post.creator.posts.pull(post);
            await post.creator.save({ session: sess });
            await sess.commitTransaction();
        }catch (err){
            const error= new HttpError(
                'Something went wrong, could not delete post',
                500
            );
            return next(error);
            }

            
  fs.unlink(imagePath, err => {
    console.log(err);
  })

    res.status(200).json('deleted')
      
};

 exports.getPostsByUserId = getPostsByUserId;
 exports.getPostById = getPostById;
 exports.getFeed = getFeed;
 exports.createPost = createPost;
 exports.deletePost = deletePost;
 exports.updatePost = updatePost;