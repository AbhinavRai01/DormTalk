const express = require('express');
const router = express.Router();

const {createCluster, getClusterById, getClusterByName} = require('../controllers/clusterController');

router.post('/create', createCluster);
router.get('/:id', getClusterById);
router.get('/name/:name', getClusterByName);

module.exports = router;