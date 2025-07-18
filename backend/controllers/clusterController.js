const Cluster = require('../schemas/clusters');

const createCluster = async (req, res) => {
    const { name, description } = req.body;
    const newCluster = new Cluster({ name, description });

    try {
        await newCluster.save();
        res.status(201).send("Cluster created successfully");
    } catch (err) {
        console.error("Error creating cluster", err);
        res.status(500).send("Internal Server Error");
    }
}

const getClusterById = async (req, res) => {
    const clusterId = req.params.id;
    try {
        const cluster = await Cluster.findById(clusterId).populate('members', 'userId');
        if (!cluster) {
            return res.status(404).send("Cluster not found");
        }
        res.status(200).send(cluster);
    } catch (err) { 
        console.error("Error fetching cluster", err);
        res.status(500).send("Internal Server Error");
    }
}

const getClusterByName = async (req, res) => {
    const name = req.params.name;
    try {
        const cluster = await Cluster.find({name}).populate('members', 'userId');
        if (!cluster) {
            return res.status(404).send("Cluster not found");
        }
        res.status(200).send(cluster);
    } catch (err) { 
        console.error("Error fetching cluster", err);
        res.status(500).send("Internal Server Error");
    }
}

const clusterSearchForForm = async (req,res) =>{
    const {query} = req.params;
    try {
        const clusters = await Cluster.find({ name: { $regex: query, $options: 'i' } }).limit(4);
        res.status(200).json(clusters);
    } catch (err) {
        console.error("Error searching clusters", err);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    createCluster,
    getClusterById,
    getClusterByName,
    clusterSearchForForm
};