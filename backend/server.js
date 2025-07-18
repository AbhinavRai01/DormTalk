const express = require("express");
const mongoose = require("mongoose");
const questionRoutes = require("./routers/questionRoutes");
const userRoutes = require("./routers/userRoutes");
const answerRoutes = require("./routers/answerRoutes");
const commentRoutes = require("./routers/commentRoutes");
const postRoutes = require("./routers/postRoutes");
const clusterRoutes = require('./routers/clusterRoutes');
const Cluster = require('./schemas/clusters');

const cors = require("cors");

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

Cluster.collection.dropIndex("name_1");
Cluster.collection.createIndex({name: 1});

app.use(express.json());

app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/clusters', clusterRoutes);

app.use(express.urlencoded({ extended: true }));

app.listen(5000, () => {
    console.log("Server is running on port 5000");
}
);

console.log("Server is running...");