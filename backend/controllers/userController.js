const User = require('../schemas/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const createToken = (_id) => {
  return jwt.sign({ _id }, "abhinavraiisagoodboy", { expiresIn: '3d' })
}
// login a user
const loginUser = async (req, res) => {
    const { userId, password } = req.body;
    
    try {
        const user = await User.login(userId, password)
        // create a token
        const token = createToken(user._id)
    
        res.status(200).json({ userId: user.userId, token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    } 
}

const getUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({userId: userId});
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// signup a user
const signupUser = async (req, res) => {
const { userId, password } = req.body;
  try {
    const user = await User.signup(userId, password);
    // create a token
    const token = createToken(user._id);

    res.status(200).json({ userId: user.userId, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const followUser = async (req, res) => {
  const {followUserID, curUserID} = req.body;

  try{
    const user = await User.findOne({userId: curUserID});
    if(!user){
      return res.status(400).json({error: "User not found"});
    }
    console.log(user);
    const followedUsers = user.followedUsers;
    if(followedUsers.includes(followUserID)){
      return res.status(400).json({error: "Already following this user"});
    }
    followedUsers.push(followUserID);
    await User.updateOne({userId: curUserID}, {followedUsers: followedUsers});
    return res.status(200).json({ message: "Successfully followed the user" });
  }
  catch(err){
    console.error("Error following user", err);
    res.status(500).json({error: "Internal Server Error"});
  }
}

const unfollowUser = async (req, res) => {
  const {unfollowUserID, curUserID} = req.body;

  try{
    const user = await User.findOne({userId: curUserID});
    if(!user){
      return res.status(400).json({error: "User not found"});
    }
    const followedUsers = user.followedUsers;
    if(!followedUsers.includes(unfollowUserID)){
      return res.status(400).json({error: "Not following this user"});
    }
    followedUsers.splice(followedUsers.indexOf(unfollowUserID), 1);
    await User.updateOne({userId: curUserID}, {followedUsers: followedUsers});
    return res.status(200).json({ message: "Successfully unfollowed the user" });
  }
  catch(err){
    console.error("Error unfollowing user", err);
    res.status(500).json({error: "Internal Server Error"});
  }
}

const likeQuestion = async (req, res) => {
  const {questionID, curUserID} = req.body;

  try{
    const user = await User.findOne({userId: curUserID});
    var inc = 0;
    if(!user){
      return res.status(400).json({error: "User not found"});
    }
    const likedQuestions = user.likedQuestions;
    if(likedQuestions.includes(questionID)){
      likedQuestions.splice(likedQuestions.indexOf(questionID), 1);
      inc = -1;
    }else{
      likedQuestions.push(questionID);
      inc = 1;
    }
    await User.updateOne({userId: curUserID}, {likedQuestions: likedQuestions});
    res.status(200).json({inc});
  }
  catch(err){
    console.log("Error liking/disliking post:", err);
    res.status(500).json({error: "Internal Server Error"});
  }
}

const likeAnswer = async (req, res) => {
  const {answerID, curUserID} = req.body;

  try{
    const user = await User.findOne({userId: curUserID});
    if(!user){
      return res.status(400).json({error: "User not found"});
    }
    const likedAnswers = user.likedAnswers;
    var inc = 0;
    if(likedAnswers.includes(answerID)){
      likedAnswers.splice(likedAnswers.indexOf(answerID), 1);
      inc = -1;
    }else{
      likedAnswers.push(answerID);
      inc = 1;
    }
    await User.updateOne({userId: curUserID}, {likedAnswers: likedAnswers});
    res.status(200).json({inc});
  }
  catch(err){
    console.log("Error liking/disliking post:", err);
    res.status(500).json({error: "Internal Server Error"});
  }
}

const increaseFollowers = async (req, res) => {
  const {userID} = req.body;

  try{
    const user = await User.findOne({userId: userID});
    if(!user){
      return res.status(400).json({error: "User not found"});
    }
    var followers = user.followers;
    followers++;

    console.log("followers: ", followers);
    await User
    .updateOne({userId: userID}, {followers: followers});
    return res.status(200).json({ message: "Followers increased", followers });
  }
  catch(err){
    console.log("Error increasing followers:", err);
    res.status(500).json({error: "Internal Server Error"});
  }
}

const decreaseFollowers = async (req, res) => {
  const {userID} = req.body;

  try{
    const user = await User.findOne({userId: userID});
    if(!user){
      return res.status(400).json({error: "User not found"});
    }
    var followers = user.followers;
    followers--;
    console.log("followers: ", followers);
    await User
    .updateOne({userId: userID}, {followers: followers});
    return res.status(200).json({ message: "Followers decreased", followers });
  }
  catch(err){
    console.log("Error decreasing followers:", err);
    res.status(500).json({error: "Internal Server Error"});
  }
}

module.exports = { getUser, signupUser, loginUser,unfollowUser, followUser, likeQuestion, likeAnswer, increaseFollowers, decreaseFollowers};