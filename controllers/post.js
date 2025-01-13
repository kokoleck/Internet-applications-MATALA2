const { json } = require("body-parser");
const postModel = require("../models/posts_model");
const { post } = require("../routes/posts_routes");

const getAllPosts = async (req, res) => {
    const ownerFilter = req.query.owner;
    try{
        if(ownerFilter){
            const posts = await postModel.find({owner: ownerFilter});
            res.status(200).send(posts);
        }else{
            const posts = await postModel.find();
            res.status(200).send(posts);
        }
   
    }
    catch(error){
        res.status(400).send(error.message);

    }
  };

const getPostsById = async (req, res) => {
    const postId = req.params.id;
    try{
        const post = await postModel.findById(postId);
        res.status(200).send(post);
    }catch(error){
        res.status(400).send(error.message);
    }
  };

  const createPost = async (req, res) => {
    const post = req.body;
    try{
     const newPost = await postModel.create(post);
        res.status(201).send(newPost);
    }catch(error){
        res.status(400).send(error);

    }
  };


  const deletePost = async (req, res) => {
    const postId = req.params.id;
    try {
        const deletedPost = await postModel.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).send("Post not found");
        }
        res.status(200).send({ message: "Post deleted successfully", deletedPost });
    } catch (error) {
        res.status(400).send(error.message);
    }
};



console.log("The post controller is loaded and working!");

module.exports = { getAllPosts,  createPost , deletePost ,getPostsById ,};
