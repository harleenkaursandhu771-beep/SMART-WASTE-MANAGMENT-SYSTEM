const Vehicle = require('../models/Vehicle');
const { logActivity } = require('../utils/activityLogger');
const { parseValidationError } = require('../utils/errorHandler');

/**
 * Get all vehicles
 * GET /api/vehicles
 */
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('assignedWorker', 'name email phone');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get vehicle by ID
 * GET /api/vehicles/:id
 */
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('assignedWorker', 'name email phone');
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message });
  }
};

/**
 * Create a new vehicle
 * POST /api/vehicles
 */
const createVehicle = async (req, res) => {
  try {
    const { vehicleId, vehicleNumber, driverName, capacity, status, assignedWorker } = req.body;

    const existingVehicle = await Vehicle.findOne({
      $or: [{ vehicleId }, { vehicleNumber }],
    });
    if (existingVehicle) {
      if (existingVehicle.vehicleId === vehicleId) {
        return res.status(400).json({ message: 'A vehicle with this ID already exists.' });
      }
      return res.status(400).json({ message: 'A vehicle with this registration number already exists.' });
    }

    const vehicle = await Vehicle.create({
      vehicleId,
      vehicleNumber,
      driverName,
      capacity,
      status: status || 'available',
      assignedWorker: assignedWorker || null,
    });

    // Log action
    await logActivity('VEHICLE_CREATED', 'Vehicle', vehicle._id, req.user?._id, `Added vehicle ${vehicle.vehicleNumber} (${vehicle.vehicleId})`);

    res.status(201).json({ message: 'Vehicle added successfully', vehicle });
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message, errors: parsed.errors });
  }
};

/**
 * Update a vehicle
 * PUT /api/vehicles/:id
 */
const updateVehicle = async (req, res) => {
  try {
    const { vehicleId, vehicleNumber, driverName, capacity, status, assignedWorker } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check uniqueness if ID or Number changed
    if (vehicleId && vehicleId !== vehicle.vehicleId) {
      const checkId = await Vehicle.findOne({ vehicleId });
      if (checkId) return res.status(400).json({ message: 'Vehicle ID already exists' });
    }
    if (vehicleNumber && vehicleNumber !== vehicle.vehicleNumber) {
      const checkNum = await Vehicle.findOne({ vehicleNumber });
      if (checkNum) return res.status(400).json({ message: 'Vehicle registration number already exists' });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        vehicleId,
        vehicleNumber,
        driverName,
        capacity,
        status,
        assignedWorker: assignedWorker === '' ? null : assignedWorker,
      },
      { new: true, runValidators: true }
    ).populate('assignedWorker', 'name email phone');

    // Log action
    await logActivity(
      'VEHICLE_UPDATED',
      'Vehicle',
      updatedVehicle._id,
      req.user?._id,
      `Updated vehicle ${updatedVehicle.vehicleNumber} (${updatedVehicle.vehicleId})`
    );

    res.json({ message: 'Vehicle updated successfully', vehicle: updatedVehicle });
  } catch (error) {
    const parsed = parseValidationError(error);
    res.status(parsed.statusCode).json({ message: parsed.message, errors: parsed.errors });
  }
};

/**
 * Delete a vehicle
 * DELETE /api/vehicles/:id
 */
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    // Log action
    await logActivity('VEHICLE_DELETED', 'Vehicle', vehicle._id, req.user?._id, `Deleted vehicle ${vehicle.vehicleNumber} (${vehicle.vehicleId})`);

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle };
