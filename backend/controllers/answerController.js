const Answer = require('../schemas/answer');
const mongoose = require('mongoose');
const express = require('express');

const getAnswersForQuestion = async (req, res) => {
    const questionId = req.params.id;
    try {
        const answers = await Answer.find({ questionID: questionId }).sort({ createdAt: -1 });
        res.status(200).send(answers);
    }
    catch (err) {
        console.error("Error fetching answers", err);
        res.status(500).send("Internal Server Error");
    }
}

const addAnswer = async (req, res) => {
    const { questionID, senderID, content, question } = req.body;
    const newAnswer = new Answer({
        questionID,
        senderID,
        content,
        question
    });

    try {
        await newAnswer.save();
        res.status(201).send("Answer added successfully");
    } catch (err) {
        console.error("Error adding answer", err);
        res.status(500).send("Internal Server Error");
    }
}

const getAnswerForProfile = async (req, res) => {
    const senderID = req.params.id;
    try {
        const answers = await Answer.find({ senderID: senderID }).sort({ createdAt: -1 });
        res.status(200).send(answers);
    }
    catch (err) {
        console.error("Error fetching answers", err);
        res.status(500).send("Internal Server Error");
    }
}

const increaseLike = async (req, res) => {
    const {answerId} = req.body;
    const answer = await answer.findById(answerId);
    
    answer.likes ++;
    await Answer.updateOne({_id: answerId},{likes: answer.likes});
}

const decreaseLike = async (req, res) => {
    const {answerId} = req.body;
    const answer =  await Answer.findById(answerId);
    
    answer.likes --;
    await Answer.updateOne({_id: answerId},{likes: answer.likes});
}

module.exports = {
    getAnswersForQuestion,
    addAnswer,
    getAnswerForProfile,
    increaseLike,
    decreaseLike
}
