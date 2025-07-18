const Question = require('../schemas/questions');
const mongoose = require('mongoose');
const express = require('express');

const getQuestions = async (req, res) => {
    try {
        const questions = await Question.find().sort({ createdAt: -1 });
        res.status(200).send(questions);
    } catch (err) {
        console.error("Error fetching questions", err);
        res.status(500).send("Internal Server Error");
    }
}

const getQuestion = async (req, res) => {
    const questionId = req.params.id;
   Question.findById(questionId)
    .then((question) => {
        if (!question) {
            return res.status(404).send("Question not found");
        }
        res.status(200).send(question);
    })
    .catch((err) => {
        console.error("Error fetching question", err);
        res.status(500).send("Internal Server Error");
    })} ;


const addQuestion = async (req, res) => {
    const { question, description, tags, senderID, imageURL } = req.body;
    const newQuestion = new Question({
        question,
        description,
        tags,
        senderID,
        imageURL
    });

    try {
        await newQuestion.save();
        res.status(201).send("Question added successfully");
    } catch (err) {
        console.error("Error adding question", err);
        res.status(500).send("Internal Server Error");
    }
}

const increaseLike = async (req, res) => {
    try{
    const {questionId} = req.body;
    const question = await Question.findById(questionId);
    
    question.likes ++;
    await Question.updateOne({_id: questionId},{likes: question.likes});

    res.status(200).json("LIKES INCREASED");
    }
    catch(err){
        res.status(500).json(err);
    }
}

const decreaseLike = async (req, res) => {
    try{
    const {questionId} = req.body;
    const question = await Question.findById(questionId);
    
    question.likes --;
    await Question.updateOne({_id: questionId},{likes: question.likes});
     res.status(200).json("LIKES DECREASED");
    }
    catch(err){
        res.status(500).json(err);
    }

}

const uploadSageAnswer = async (req,res) =>{
    try{
        const questionId = req.params.id;
        const {answer} = req.body;

        await Question.findByIdAndUpdate({_id: questionId}, {sageAnswer: answer});
        res.status(200).json("SENT SAGE ANSWER");
    }catch(err){
        res.status(500).json(err);
    }
}

module.exports = {
    getQuestions,
    getQuestion,
    increaseLike,
    decreaseLike,
    addQuestion,
    uploadSageAnswer
}