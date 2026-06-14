const express = require('express');
const router = express.Router();
const { getBins, getBinById, createBin, updateBin, deleteBin } = require('../controllers/binController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, getBins);
router.get('/:id', auth, getBinById);
router.post('/', auth, authorize('admin'), createBin);
router.put('/:id', auth, authorize('admin'), updateBin);
router.delete('/:id', auth, authorize('admin'), deleteBin);

module.exports = router;
