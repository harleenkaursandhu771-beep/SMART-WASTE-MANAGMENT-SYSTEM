/**
 * Sample / Dummy Data
 *
 * Used during development when the backend is not connected.
 * Each object mirrors the Mongoose schema shape exactly, so swapping to
 * real API responses later requires zero UI changes.
 *
 * TO REPLACE WITH REAL DATA:
 * 1. Open src/services/api.js
 * 2. Change USE_SAMPLE_DATA to false
 * 3. Ensure your backend is running and MongoDB is connected
 * 4. All API calls will then hit the Express server instead of returning this data
 */

// ─── Users ──────────────────────────────────────────────────
export const sampleUsers = [
  {
    _id: 'u1',
    name: 'Admin User',
    email: 'admin@wastewise.com',
    role: 'admin',
    phone: '9876543210',
    address: '100 Admin St, City Center',
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    _id: 'u2',
    name: 'Raj Kumar',
    email: 'worker@wastewise.com',
    role: 'worker',
    phone: '9876543211',
    address: '42 Worker Lane, Industrial Area',
    createdAt: '2026-02-10T08:00:00Z',
  },
  {
    _id: 'u3',
    name: 'Priya Sharma',
    email: 'citizen@wastewise.com',
    role: 'citizen',
    phone: '9876543212',
    address: '7 Citizen Ave, Green Colony',
    createdAt: '2026-03-05T08:00:00Z',
  },
  {
    _id: 'u4',
    name: 'Anita Desai',
    email: 'anita@wastewise.com',
    role: 'citizen',
    phone: '9876543213',
    address: '15 Park View, Koramangala',
    createdAt: '2026-03-20T08:00:00Z',
  },
  {
    _id: 'u5',
    name: 'Sunil Rao',
    email: 'sunil@wastewise.com',
    role: 'worker',
    phone: '9876543214',
    address: '88 Service Rd, Whitefield',
    createdAt: '2026-04-01T08:00:00Z',
  },
];

// ─── Bins ───────────────────────────────────────────────────
export const sampleBins = [
  {
    _id: 'b1',
    binId: 'BIN-001',
    location: 'MG Road Junction',
    area: 'Central District',
    wasteLevel: 85,
    status: 'full',
    latitude: 12.9716,
    longitude: 77.5946,
    assignedWorker: { _id: 'u2', name: 'Raj Kumar', email: 'worker@wastewise.com' },
  },
  {
    _id: 'b2',
    binId: 'BIN-002',
    location: 'Indiranagar Market',
    area: 'East Zone',
    wasteLevel: 45,
    status: 'active',
    latitude: 12.9784,
    longitude: 77.6408,
    assignedWorker: { _id: 'u2', name: 'Raj Kumar', email: 'worker@wastewise.com' },
  },
  {
    _id: 'b3',
    binId: 'BIN-003',
    location: 'Koramangala Park',
    area: 'South Zone',
    wasteLevel: 92,
    status: 'full',
    latitude: 12.9352,
    longitude: 77.6245,
    assignedWorker: { _id: 'u2', name: 'Raj Kumar', email: 'worker@wastewise.com' },
  },
  {
    _id: 'b4',
    binId: 'BIN-004',
    location: 'Jayanagar Complex',
    area: 'South Zone',
    wasteLevel: 30,
    status: 'active',
    latitude: 12.9299,
    longitude: 77.5838,
    assignedWorker: null,
  },
  {
    _id: 'b5',
    binId: 'BIN-005',
    location: 'Whitefield Tech Park',
    area: 'East Zone',
    wasteLevel: 70,
    status: 'active',
    latitude: 12.9698,
    longitude: 77.7500,
    assignedWorker: { _id: 'u5', name: 'Sunil Rao', email: 'sunil@wastewise.com' },
  },
  {
    _id: 'b6',
    binId: 'BIN-006',
    location: 'Rajajinagar Circle',
    area: 'West Zone',
    wasteLevel: 15,
    status: 'active',
    latitude: 12.9866,
    longitude: 77.5527,
    assignedWorker: null,
  },
  {
    _id: 'b7',
    binId: 'BIN-007',
    location: 'Electronic City Gate',
    area: 'South Zone',
    wasteLevel: 60,
    status: 'active',
    latitude: 12.8455,
    longitude: 77.6602,
    assignedWorker: { _id: 'u2', name: 'Raj Kumar', email: 'worker@wastewise.com' },
  },
  {
    _id: 'b8',
    binId: 'BIN-008',
    location: 'Hebbal Flyover',
    area: 'North Zone',
    wasteLevel: 5,
    status: 'maintenance',
    latitude: 13.0358,
    longitude: 77.5970,
    assignedWorker: null,
  },
];

// ─── Waste Reports ──────────────────────────────────────────
export const sampleReports = [
  {
    _id: 'r1',
    reportId: 'RPT-001',
    citizenId: { _id: 'u3', name: 'Priya Sharma', email: 'citizen@wastewise.com' },
    binId: { _id: 'b1', binId: 'BIN-001', location: 'MG Road Junction', area: 'Central District' },
    description: 'Bin is overflowing and waste is spilling onto the road. Needs urgent attention.',
    imageUrl: '',
    status: 'pending',
    createdAt: '2026-05-20T09:30:00Z',
  },
  {
    _id: 'r2',
    reportId: 'RPT-002',
    citizenId: { _id: 'u3', name: 'Priya Sharma', email: 'citizen@wastewise.com' },
    binId: { _id: 'b3', binId: 'BIN-003', location: 'Koramangala Park', area: 'South Zone' },
    description: 'Foul smell emanating from the bin area. Has not been collected for 3 days.',
    imageUrl: '',
    status: 'in-progress',
    createdAt: '2026-05-19T14:15:00Z',
  },
  {
    _id: 'r3',
    reportId: 'RPT-003',
    citizenId: { _id: 'u3', name: 'Priya Sharma', email: 'citizen@wastewise.com' },
    binId: { _id: 'b5', binId: 'BIN-005', location: 'Whitefield Tech Park', area: 'East Zone' },
    description: 'Bin lid is broken. Stray animals are scattering the waste.',
    imageUrl: '',
    status: 'resolved',
    createdAt: '2026-05-18T10:00:00Z',
  },
  {
    _id: 'r4',
    reportId: 'RPT-004',
    citizenId: { _id: 'u4', name: 'Anita Desai', email: 'anita@wastewise.com' },
    binId: { _id: 'b2', binId: 'BIN-002', location: 'Indiranagar Market', area: 'East Zone' },
    description: 'Hazardous waste dumped near the bin. Chemical containers found.',
    imageUrl: '',
    status: 'pending',
    createdAt: '2026-05-21T16:45:00Z',
  },
  {
    _id: 'r5',
    reportId: 'RPT-005',
    citizenId: { _id: 'u4', name: 'Anita Desai', email: 'anita@wastewise.com' },
    binId: { _id: 'b7', binId: 'BIN-007', location: 'Electronic City Gate', area: 'South Zone' },
    description: 'Construction debris dumped around the bin blocking pedestrian path.',
    imageUrl: '',
    status: 'in-progress',
    createdAt: '2026-05-22T08:30:00Z',
  },
];

// ─── Collection Tasks ───────────────────────────────────────
export const sampleTasks = [
  {
    _id: 't1',
    taskId: 'TASK-001',
    workerId: { _id: 'u2', name: 'Raj Kumar', email: 'worker@wastewise.com' },
    binId: { _id: 'b1', binId: 'BIN-001', location: 'MG Road Junction', area: 'Central District', wasteLevel: 85 },
    collectionDate: '2026-05-24T06:00:00Z',
    status: 'pending',
  },
  {
    _id: 't2',
    taskId: 'TASK-002',
    workerId: { _id: 'u2', name: 'Raj Kumar', email: 'worker@wastewise.com' },
    binId: { _id: 'b3', binId: 'BIN-003', location: 'Koramangala Park', area: 'South Zone', wasteLevel: 92 },
    collectionDate: '2026-05-24T08:00:00Z',
    status: 'in-progress',
  },
  {
    _id: 't3',
    taskId: 'TASK-003',
    workerId: { _id: 'u2', name: 'Raj Kumar', email: 'worker@wastewise.com' },
    binId: { _id: 'b2', binId: 'BIN-002', location: 'Indiranagar Market', area: 'East Zone', wasteLevel: 45 },
    collectionDate: '2026-05-25T07:00:00Z',
    status: 'pending',
  },
  {
    _id: 't4',
    taskId: 'TASK-004',
    workerId: { _id: 'u5', name: 'Sunil Rao', email: 'sunil@wastewise.com' },
    binId: { _id: 'b5', binId: 'BIN-005', location: 'Whitefield Tech Park', area: 'East Zone', wasteLevel: 70 },
    collectionDate: '2026-05-23T06:00:00Z',
    status: 'completed',
  },
  {
    _id: 't5',
    taskId: 'TASK-005',
    workerId: { _id: 'u2', name: 'Raj Kumar', email: 'worker@wastewise.com' },
    binId: { _id: 'b7', binId: 'BIN-007', location: 'Electronic City Gate', area: 'South Zone', wasteLevel: 60 },
    collectionDate: '2026-05-25T09:00:00Z',
    status: 'pending',
  },
];

// ─── Vehicles ───────────────────────────────────────────────
export const sampleVehicles = [
  {
    _id: 'v1',
    vehicleId: 'VEH-001',
    vehicleNumber: 'KA-01-AB-1234',
    driverName: 'Suresh M',
    capacity: 5000,
    status: 'available',
  },
  {
    _id: 'v2',
    vehicleId: 'VEH-002',
    vehicleNumber: 'KA-01-CD-5678',
    driverName: 'Mahesh K',
    capacity: 8000,
    status: 'in-use',
  },
  {
    _id: 'v3',
    vehicleId: 'VEH-003',
    vehicleNumber: 'KA-01-EF-9012',
    driverName: 'Ramesh B',
    capacity: 3000,
    status: 'maintenance',
  },
  {
    _id: 'v4',
    vehicleId: 'VEH-004',
    vehicleNumber: 'KA-01-GH-3456',
    driverName: 'Vijay R',
    capacity: 10000,
    status: 'available',
  },
];

// ─── Notifications ──────────────────────────────────────────
export const sampleNotifications = [
  {
    _id: 'n1',
    message: 'Bin BIN-001 at MG Road Junction is now full. Immediate collection required.',
    recipientId: { _id: 'u2', name: 'Raj Kumar', role: 'worker' },
    type: 'warning',
    readStatus: false,
    createdAt: '2026-05-23T07:00:00Z',
  },
  {
    _id: 'n2',
    message: 'New waste report RPT-001 submitted by Priya Sharma.',
    recipientId: { _id: 'u1', name: 'Admin User', role: 'admin' },
    type: 'report',
    readStatus: false,
    createdAt: '2026-05-23T09:30:00Z',
  },
  {
    _id: 'n3',
    message: 'Your waste complaint RPT-003 has been resolved. Thank you for reporting!',
    recipientId: { _id: 'u3', name: 'Priya Sharma', role: 'citizen' },
    type: 'success',
    readStatus: true,
    createdAt: '2026-05-22T16:00:00Z',
  },
  {
    _id: 'n4',
    message: 'Task TASK-004 completed successfully. Bin BIN-005 at Whitefield Tech Park emptied.',
    recipientId: { _id: 'u1', name: 'Admin User', role: 'admin' },
    type: 'success',
    readStatus: false,
    createdAt: '2026-05-23T12:00:00Z',
  },
  {
    _id: 'n5',
    message: 'Vehicle VEH-003 is under maintenance. Expected return: 2 days.',
    recipientId: { _id: 'u1', name: 'Admin User', role: 'admin' },
    type: 'info',
    readStatus: true,
    createdAt: '2026-05-21T10:00:00Z',
  },
  {
    _id: 'n6',
    message: 'You have been assigned a new collection task TASK-005 at Electronic City Gate.',
    recipientId: { _id: 'u2', name: 'Raj Kumar', role: 'worker' },
    type: 'task',
    readStatus: false,
    createdAt: '2026-05-23T14:00:00Z',
  },
  {
    _id: 'n7',
    message: 'Weekly waste collection report is available. Check the admin dashboard for details.',
    recipientId: { _id: 'u1', name: 'Admin User', role: 'admin' },
    type: 'info',
    readStatus: false,
    createdAt: '2026-05-23T08:00:00Z',
  },
];

// ─── Feedback ───────────────────────────────────────────────
export const sampleFeedback = [
  {
    _id: 'f1',
    citizenId: { _id: 'u3', name: 'Priya Sharma', email: 'citizen@wastewise.com' },
    rating: 4,
    comment: 'Generally good service. Bins are collected on time in our area.',
    createdAt: '2026-05-15T10:00:00Z',
  },
  {
    _id: 'f2',
    citizenId: { _id: 'u3', name: 'Priya Sharma', email: 'citizen@wastewise.com' },
    rating: 3,
    comment: 'The bin near our park was not emptied for 2 days last week. Otherwise decent.',
    createdAt: '2026-05-18T14:30:00Z',
  },
  {
    _id: 'f3',
    citizenId: { _id: 'u4', name: 'Anita Desai', email: 'anita@wastewise.com' },
    rating: 5,
    comment: 'Excellent response to my complaint! The issue was resolved within 24 hours.',
    createdAt: '2026-05-20T11:00:00Z',
  },
  {
    _id: 'f4',
    citizenId: { _id: 'u4', name: 'Anita Desai', email: 'anita@wastewise.com' },
    rating: 2,
    comment: 'Waited too long for response. Need to improve turnaround time.',
    createdAt: '2026-05-22T09:15:00Z',
  },
];
