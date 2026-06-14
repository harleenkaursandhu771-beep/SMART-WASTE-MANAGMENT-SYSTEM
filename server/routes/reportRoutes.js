const express = require('express');
const router = express.Router();
const { createReport, getReports, getReportById, updateReport, deleteReport } = require('../controllers/reportController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, createReport);
router.get('/', auth, getReports);
router.get('/:id', auth, getReportById);
router.put('/:id', auth, authorize('admin', 'worker'), updateReport);
router.delete('/:id', auth, authorize('admin'), deleteReport);

module.exports = router;
