const express = require('express');
const router = express.Router();
const { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, getVehicles);
router.get('/:id', auth, getVehicleById);
router.post('/', auth, authorize('admin'), createVehicle);
router.put('/:id', auth, authorize('admin'), updateVehicle);
router.delete('/:id', auth, authorize('admin'), deleteVehicle);

module.exports = router;
