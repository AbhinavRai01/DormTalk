const express = require('express');
const router = express.Router();

const {createCluster, getClusterById, getClusterByName, clusterSearchForForm} = require('../controllers/clusterController');

router.post('/create', createCluster);
router.get('/:id', getClusterById);
router.get('/name/:name', getClusterByName);
router.get('/searchform/:query', clusterSearchForForm);

module.exports = router;