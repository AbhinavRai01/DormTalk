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
    const { question, description, tags, senderID } = req.body;
    const newQuestion = new Question({
        question,
        description,
        tags,
        senderID
    });

    try {
        await newQuestion.save();
        res.status(201).send("Question added successfully");
    } catch (err) {
        console.error("Error adding question", err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    getQuestions,
    getQuestion,
    addQuestion
}