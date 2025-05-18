const Answer = require('../models/Answer');
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

module.exports = {
    getAnswersForQuestion,
    addAnswer,
    getAnswerForProfile
}
