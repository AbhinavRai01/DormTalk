const express = require("express");

const app  = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

const questions = [
    {
        question: "What is the capital of France?",
        tags: ["geography", "capital"],
        senderID: "abhinav123"
    },
    {
        question: "What is the capital of India?",
        tags: ["geography", "capital"],
        senderID: "abhinav123"
    },
    {
        question: "What is the capital of USA?",
        tags: ["geography", "capital"],
        senderID: "abhinav123"
    },
    {
        question: "What is the capital of Japan?",
        tags: ["geography", "capital"],
        senderID: "abhinav123"
    }
]

app.listen(3000, () => {
    console.log("Server is running on port 3000");
}
);

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/questions", (req, res) => {
    res.render("questions", { questions });
});

app.get("/new-question", (req, res) => {
    res.render("newques");
});

console.log("Server is running...");