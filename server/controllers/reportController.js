const WasteReport = require('../models/WasteReport');
const Notification = require('../models/Notification');
const { logActivity } = require('../utils/activityLogger');
const { parseValidationError } = require('../utils/errorHandler');

/**
 * Create a new waste report (citizen files a complaint)
 * POST /api/reports
 */
const createReport = async (req, res) => {
  try {
    const { reportId, citizenId, binId, description, imageUrl } = req.body;

    const existingReport = await WasteReport.findOne({ reportId });
    if (existingReport) {
      return res.status(400).json({ message: 'A report with this ID already exists.' });
    }

    const report = await WasteReport.create({
      reportId,
      citizenId,
      binId,
      description,
      imageUrl: imageUrl || '',
      status: 'pending',
    });

    const populatedReport = await WasteReport.findById(report._id)
      .populate('citizenId', 'name email phone')
      .populate('binId', 'binId location area');

    // Log action
    await logActivity('REPORT_CREATED', 'WasteReport', report._id, req.user?._id, `Citizen filed complaint ${report.reportId}`);

    res.status(201).json({ message: 'Report submitted successfully', report: populatedReport });
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message, errors: parsed.errors });
  }
};

/**
 * Get all waste reports
 * GET /api/reports
 */
const getReports = async (req, res) => {
  try {
    const reports = await WasteReport.find()
      .populate('citizenId', 'name email phone')
      .populate('binId', 'binId location area');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get a waste report by ID
 * GET /api/reports/:id
 */
const getReportById = async (req, res) => {
  try {
    const report = await WasteReport.findById(req.params.id)
      .populate('citizenId', 'name email phone')
      .populate('binId', 'binId location area');
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message });
  }
};

/**
 * Update a waste report status
 * PUT /api/reports/:id
 */
const updateReport = async (req, res) => {
  try {
    const reportBefore = await WasteReport.findById(req.params.id);
    if (!reportBefore) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const report = await WasteReport.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('citizenId', 'name email phone')
      .populate('binId', 'binId location area');

    // Log status change
    let action = 'REPORT_UPDATED';
    if (req.body.status && req.body.status !== reportBefore.status) {
      if (req.body.status === 'resolved') action = 'COMPLAINT_RESOLVED';
      else if (req.body.status === 'in-progress') action = 'COMPLAINT_IN_PROGRESS';
      else if (req.body.status === 'rejected') action = 'COMPLAINT_REJECTED';

      if (report.citizenId) {
        const citizenIdVal = report.citizenId._id || report.citizenId;
        await Notification.create({
          recipientId: citizenIdVal,
          message: `Your complaint ${report.reportId} status has been updated to ${req.body.status}.`,
          type: 'report',
        });
      }
    }
    await logActivity(action, 'WasteReport', report._id, req.user?._id, `Complaint status updated to ${report.status} for ${report.reportId}`);

    res.json({ message: 'Report updated successfully', report });
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message, errors: parsed.errors });
  }
};

/**
 * Delete a waste report (Admin only)
 * DELETE /api/reports/:id
 */
const deleteReport = async (req, res) => {
  try {
    const report = await WasteReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await WasteReport.findByIdAndDelete(req.params.id);

    // Log deletion
    await logActivity('REPORT_DELETED', 'WasteReport', report._id, req.user?._id, `Deleted complaint ${report.reportId}`);

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createReport, getReports, getReportById, updateReport, deleteReport };
