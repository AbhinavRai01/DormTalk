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
    const { questionID, senderID, content, question , imageURL } = req.body;
    const newAnswer = new Answer({
        questionID,
        senderID,
        content,
        question,
        imageURL
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
    const { answerId } = req.body;
    try {
        const answer = await Answer.findById(answerId);
        if (!answer) {
            return res.status(404).send("Answer not found");
        }
        const likes = (answer.likes || 0) + 1;
        await Answer.updateOne({ _id: answerId }, { likes: likes });
        res.status(200).send("Like increased successfully");
    } catch (err) {
        console.error("Error increasing like", err);
        res.status(500).send("Internal Server Error");
    }
}

const decreaseLike = async (req, res) => {
    const { answerId } = req.body;
    try {
        const answer = await Answer.findById(answerId);
        if (!answer) {
            return res.status(404).send("Answer not found");
        }
        const likes = Math.max((answer.likes || 0) - 1, 0);
        await Answer.updateOne({ _id: answerId }, { likes: likes });
        res.status(200).send("Like decreased successfully");
    } catch (err) {
        console.error("Error decreasing like", err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    getAnswersForQuestion,
    addAnswer,
    getAnswerForProfile,
    increaseLike,
    decreaseLike
}
