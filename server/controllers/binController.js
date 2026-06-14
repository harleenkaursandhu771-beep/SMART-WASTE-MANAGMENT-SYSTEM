const Bin = require('../models/Bin');
const Notification = require('../models/Notification');
const { logActivity } = require('../utils/activityLogger');
const { parseValidationError } = require('../utils/errorHandler');

/**
 * Get all bins
 * GET /api/bins
 */
const getBins = async (req, res) => {
  try {
    const bins = await Bin.find().populate('assignedWorker', 'name email phone');
    res.json(bins);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get a bin by ID
 * GET /api/bins/:id
 */
const getBinById = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id).populate('assignedWorker', 'name email phone');
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }
    res.json(bin);
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message });
  }
};

/**
 * Create a new bin
 * POST /api/bins
 */
const createBin = async (req, res) => {
  try {
    const { binId, location, area, wasteLevel, status, latitude, longitude, assignedWorker } =
      req.body;

    const existingBin = await Bin.findOne({ binId });
    if (existingBin) {
      return res.status(400).json({ message: 'A bin with this ID already exists. Please use a different Bin ID.' });
    }

    const bin = await Bin.create({
      binId,
      location,
      area,
      wasteLevel: wasteLevel || 0,
      status: status || 'active',
      latitude,
      longitude,
      assignedWorker: assignedWorker || null,
    });

    const populatedBin = await Bin.findById(bin._id).populate('assignedWorker', 'name email phone');

    // Log action
    await logActivity('BIN_CREATED', 'Bin', bin._id, req.user?._id, `Created bin ${bin.binId} at ${bin.location}`);

    res.status(201).json({ message: 'Bin created successfully', bin: populatedBin });
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message, errors: parsed.errors });
  }
};

/**
 * Update a bin
 * PUT /api/bins/:id
 */
const updateBin = async (req, res) => {
  try {
    const binBefore = await Bin.findById(req.params.id);
    if (!binBefore) {
      return res.status(404).json({ message: 'Bin not found' });
    }

    const bin = await Bin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('assignedWorker', 'name email phone');

    // Log status or level change or worker assignment change
    let details = `Updated bin ${bin.binId}`;
    let action = 'BIN_UPDATED';

    if (req.body.assignedWorker && String(req.body.assignedWorker) !== String(binBefore.assignedWorker)) {
      action = 'WORKER_ASSIGNED';
      details = `Assigned worker to bin ${bin.binId}`;
      await Notification.create({
        recipientId: req.body.assignedWorker,
        message: `You have been assigned to manage Bin ${bin.binId} at ${bin.location}.`,
        type: 'info'
      });
    } else if (req.body.wasteLevel !== undefined && req.body.wasteLevel !== binBefore.wasteLevel) {
      details = `Waste level of bin ${bin.binId} updated to ${bin.wasteLevel}%`;
      if (bin.wasteLevel >= 80 && bin.assignedWorker) {
        const workerId = bin.assignedWorker._id || bin.assignedWorker;
        await Notification.create({
          recipientId: workerId,
          message: `Warning: Bin ${bin.binId} at ${bin.location} is ${bin.wasteLevel}% full. Please clear it soon.`,
          type: 'warning'
        });
      }
    }

    await logActivity(action, 'Bin', bin._id, req.user?._id, details);

    res.json({ message: 'Bin updated successfully', bin });
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message, errors: parsed.errors });
  }
};

/**
 * Delete a bin
 * DELETE /api/bins/:id
 */
const deleteBin = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);

    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }

    await Bin.findByIdAndDelete(req.params.id);

    // Log action
    await logActivity('BIN_DELETED', 'Bin', bin._id, req.user?._id, `Deleted bin ${bin.binId}`);

    res.json({ message: 'Bin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getBins, getBinById, createBin, updateBin, deleteBin };
