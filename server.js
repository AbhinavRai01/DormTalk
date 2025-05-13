const express = require("express");
const mongoose = require("mongoose");

const Question = require("./schemas/questions");

const app  = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

const MongoURI = "mongodb+srv://abhinav:abhinav2005@main.vtnmciu.mongodb.net/MainDatabase?retryWrites=true&w=majority&appName=Main";

mongoose.connect(MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

const addQuestion = (question,description, tags, senderID) => {
    const newQuestion = new Question({
        question,
        description,
        tags,
        senderID
    });

    newQuestion.save()
        .then(() => {
            console.log("Question added successfully");
        })
        .catch((err) => {
            console.error("Error adding question", err);
        });
}

app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
    console.log("Server is running on port 3000");
}
);

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/questions", (req, res) => {
    Question.find().sort({createdAt : -1})
    .then((questions)=>{
        res.render("questions", { questions });
    })
    .catch((err)=>{
        console.error("Error fetching questions", err);
})
});

app.get("/new-question", (req, res) => {
    res.render("newques");
});

app.get("/questions/:id", (req, res) => {
    const questionId = req.params.id;
   Question.findById(questionId)
    .then((question) => {
        if (!question) {
            return res.status(404).send("Question not found");
        }
        res.render("questionpage", { question });
    })
    .catch((err) => {
        console.error("Error fetching question", err);
        res.status(500).send("Internal Server Error");
    } );
}
);

app.post("/submit-question", (req, res) => {
    console.log(req.body);
   const { question,description, tags } = req.body;
   addQuestion(question,description, tags, "abhinav123");
   res.redirect("/questions");
});

console.log("Server is running...");