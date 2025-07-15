const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const clusterSchema = new Schema({
    name:{
        type: String,
        //dont allow spaces and special characters
        match: /^[a-zA-Z0-9]+$/,
        unique: true,
        required:true
    },
    description: {
        type: String,
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

const Cluster = Mongoose.model('Cluster', clusterSchema);
module.exports = Cluster;