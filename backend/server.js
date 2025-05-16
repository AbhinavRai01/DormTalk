const express = require("express");
const mongoose = require("mongoose");
const questionRoutes = require("./routers/questionRoutes");
const userRoutes = require("./routers/userRoutes");
const cors = require("cors");

const Question = require("./schemas/questions");

const app  = express();

app.use(cors());

const MongoURI = "mongodb+srv://abhinav:abhinav2005@main.vtnmciu.mongodb.net/MainDatabase?retryWrites=true&w=majority&appName=Main";

mongoose.connect(MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

app.use(express.json());

app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes);

app.use(express.urlencoded({ extended: true }));

app.listen(5000, () => {
    console.log("Server is running on port 5000");
}
);

console.log("Server is running...");