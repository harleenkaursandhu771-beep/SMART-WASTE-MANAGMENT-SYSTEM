/**
 * Database Seeder — Enhanced
 * Populates MongoDB with realistic, comprehensive sample data for DBMS demo.
 * Run with: npm run seed
 *
 * Data volumes:
 * - 3 Admins, 10 Workers, 25 Citizens = 38 Users
 * - 50 Bins across 10 city areas
 * - 40 Waste Reports
 * - 50 Collection Tasks
 * - 10 Vehicles
 * - 25 Feedback entries
 * - Realistic Notifications & Activity Logs
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');

// Fix for Node 18+ DNS resolution issues
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = require('../config/db');

// Import all models
const User = require('../models/User');
const Bin = require('../models/Bin');
const WasteReport = require('../models/WasteReport');
const CollectionTask = require('../models/CollectionTask');
const Vehicle = require('../models/Vehicle');
const Notification = require('../models/Notification');
const Feedback = require('../models/Feedback');
const ActivityLog = require('../models/ActivityLog');

// Helper: random pick from array
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
// Helper: random integer between min and max (inclusive)
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
// Helper: random date within last N days
const randomPastDate = (days) => new Date(Date.now() - Math.random() * days * 24 * 60 * 60 * 1000);
// Helper: random future date within next N days
const randomFutureDate = (days) => new Date(Date.now() + Math.random() * days * 24 * 60 * 60 * 1000);

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Bin.deleteMany({});
    await WasteReport.deleteMany({});
    await CollectionTask.deleteMany({});
    await Vehicle.deleteMany({});
    await Notification.deleteMany({});
    await Feedback.deleteMany({});
    await ActivityLog.deleteMany({});

    console.log('🗑️  Cleared existing collections');

    // Hash password for all users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // ═══════════════════════════════════════════
    // 1. CREATE USERS (3 Admins + 10 Workers + 25 Citizens = 38)
    // ═══════════════════════════════════════════
    const userData = [
      // 3 Admins
      { name: 'Rajesh Kumar', email: 'admin@wastewise.com', password: passwordHash, role: 'admin', phone: '+91-9876543210', address: 'Municipal HQ, Zone 1, Bengaluru' },
      { name: 'Priya Sharma', email: 'admin2@wastewise.com', password: passwordHash, role: 'admin', phone: '+91-9876543211', address: 'Administrative Block B, Zone 3, Bengaluru' },
      { name: 'Vikram Singh', email: 'admin3@wastewise.com', password: passwordHash, role: 'admin', phone: '+91-9876543212', address: 'Civic Centre, MG Road, Bengaluru' },
      // 10 Workers
      { name: 'Suresh Babu', email: 'worker@wastewise.com', password: passwordHash, role: 'worker', phone: '+91-9845012301', address: 'Staff Quarters, Sector 4, Bengaluru' },
      { name: 'Mohammed Rafi', email: 'worker2@wastewise.com', password: passwordHash, role: 'worker', phone: '+91-9845012302', address: 'Staff Quarters, Sector 7, Bengaluru' },
      { name: 'Ganesh Reddy', email: 'worker3@wastewise.com', password: passwordHash, role: 'worker', phone: '+91-9845012303', address: 'Municipal Colony, HSR Layout' },
      { name: 'Ramesh Gowda', email: 'worker4@wastewise.com', password: passwordHash, role: 'worker', phone: '+91-9845012304', address: 'Workers Block, Koramangala' },
      { name: 'Naveen Kumar', email: 'worker5@wastewise.com', password: passwordHash, role: 'worker', phone: '+91-9845012305', address: 'Service Quarters, Whitefield' },
      { name: 'Deepak Shetty', email: 'worker6@wastewise.com', password: passwordHash, role: 'worker', phone: '+91-9845012306', address: 'Municipal Housing, Indiranagar' },
      { name: 'Prakash Nair', email: 'worker7@wastewise.com', password: passwordHash, role: 'worker', phone: '+91-9845012307', address: 'Govt Quarters, JP Nagar' },
      { name: 'Arun Prasad', email: 'worker8@wastewise.com', password: passwordHash, role: 'worker', phone: '+91-9845012308', address: 'Workers Colony, Electronic City' },
      { name: 'Ravi Shankar', email: 'worker9@wastewise.com', password: passwordHash, role: 'worker', phone: '+91-9845012309', address: 'Staff Housing, BTM Layout' },
      { name: 'Kiran Patel', email: 'worker10@wastewise.com', password: passwordHash, role: 'worker', phone: '+91-9845012310', address: 'Service Quarters, Marathahalli' },
      // 25 Citizens
      { name: 'Ananya Iyer', email: 'citizen@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112201', address: 'Apt 4B, Greenwood Valley, Bengaluru' },
      { name: 'Rohan Desai', email: 'citizen2@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112202', address: 'Villa 12, Lakeside Estates, Bengaluru' },
      { name: 'Meera Joshi', email: 'citizen3@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112203', address: '23 MG Road, Bengaluru' },
      { name: 'Arjun Mehta', email: 'citizen4@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112204', address: 'House 5, HSR Layout, Sector 1' },
      { name: 'Sneha Rao', email: 'citizen5@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112205', address: 'Flat 302, Palm Springs, Koramangala' },
      { name: 'Aditya Bhat', email: 'citizen6@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112206', address: '67 Church Street, Bengaluru' },
      { name: 'Kavitha Menon', email: 'citizen7@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112207', address: 'Block D, Prestige Falcon, Whitefield' },
      { name: 'Siddharth Gupta', email: 'citizen8@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112208', address: '45 Brigade Road, Bengaluru' },
      { name: 'Divya Krishnan', email: 'citizen9@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112209', address: 'Apt 8A, Sobha Lake View, BTM' },
      { name: 'Nikhil Saxena', email: 'citizen10@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112210', address: 'Row House 7, Rainbow Colony, JP Nagar' },
      { name: 'Pooja Hegde', email: 'citizen11@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112211', address: 'Flat 501, Mantri Square, Malleshwaram' },
      { name: 'Rahul Verma', email: 'citizen12@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112212', address: '12 Residency Road, Bengaluru' },
      { name: 'Swathi Naidu', email: 'citizen13@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112213', address: 'Apt 2C, Salarpuria, Marathahalli' },
      { name: 'Karthik Rangan', email: 'citizen14@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112214', address: 'Villa 3, Orchid County, Yelahanka' },
      { name: 'Anjali Pillai', email: 'citizen15@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112215', address: 'House 78, Jayanagar 4th Block' },
      { name: 'Varun Kapoor', email: 'citizen16@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112216', address: 'Flat 609, Prestige Shantiniketan, ITPL' },
      { name: 'Lakshmi Devi', email: 'citizen17@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112217', address: '34 Bull Temple Road, Basavanagudi' },
      { name: 'Amit Chatterjee', email: 'citizen18@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112218', address: 'Apt 11B, Embassy Lake, Hebbal' },
      { name: 'Ritu Agarwal', email: 'citizen19@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112219', address: 'Flat 203, Gopalan Arcade, Bannerghatta' },
      { name: 'Vivek Reddy', email: 'citizen20@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112220', address: 'House 9, Domlur Layout, Bengaluru' },
      { name: 'Nisha Fernandes', email: 'citizen21@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112221', address: 'Apt 15, Cunningham Road, Bengaluru' },
      { name: 'Tanvi Reddy', email: 'citizen22@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112222', address: 'Villa 21, Purva Riviera, Marathahalli' },
      { name: 'Sameer Khan', email: 'citizen23@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112223', address: 'Row House 14, Golden Enclave, RT Nagar' },
      { name: 'Ishita Mukherjee', email: 'citizen24@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112224', address: 'Apt 4D, Brigade Gateway, Rajajinagar' },
      { name: 'Pranav Nambiar', email: 'citizen25@wastewise.com', password: passwordHash, role: 'citizen', phone: '+91-9900112225', address: 'Flat 702, Mantri Pinnacle, Banashankari' },
    ];

    const users = await User.insertMany(userData);
    const admins = users.filter(u => u.role === 'admin');
    const workers = users.filter(u => u.role === 'worker');
    const citizens = users.filter(u => u.role === 'citizen');

    console.log(`👤 Users seeded: ${admins.length} admins, ${workers.length} workers, ${citizens.length} citizens`);

    // ═══════════════════════════════════════════
    // 2. CREATE BINS (50)
    // ═══════════════════════════════════════════
    const areas = ['Greenwood Valley', 'Lakeside Estates', 'Whitefield', 'Electronic City', 'Koramangala', 'HSR Layout', 'Indiranagar', 'JP Nagar', 'BTM Layout', 'Marathahalli'];
    const locations = [
      ['Greenwood Park Main Gate', 'Greenwood Shopping Complex', 'Greenwood Bus Stop', 'Greenwood Community Hall', 'Greenwood Playground'],
      ['Lakeside Jogging Track', 'Lakeside Club House', 'Lakeside School Gate', 'Lakeside Market Lane', 'Lakeside Temple Road'],
      ['Whitefield Tech Park Gate A', 'Whitefield Railway Station', 'Whitefield Bus Depot', 'Whitefield Forum Mall', 'Whitefield ITPL Main Road'],
      ['EC Phase 1 Gate', 'EC Infosys Campus', 'EC Wipro Junction', 'EC Food Court Plaza', 'EC Metro Station'],
      ['Koramangala 4th Block', 'Koramangala Forum Mall', 'Koramangala Bus Stand', 'Koramangala Water Tank', 'Koramangala Church Street'],
      ['HSR Sector 1 Park', 'HSR BDA Complex', 'HSR Main Road Junction', 'HSR Club Road', 'HSR Agara Lake Gate'],
      ['Indiranagar 100ft Road', 'Indiranagar Metro Station', 'Indiranagar Defence Colony', 'Indiranagar CMH Road', 'Indiranagar Domlur Flyover'],
      ['JP Nagar 6th Phase', 'JP Nagar Bannerghatta Road', 'JP Nagar Shopping Centre', 'JP Nagar Bus Depot', 'JP Nagar Padmanabha Temple'],
      ['BTM 1st Stage Main Road', 'BTM Udupi Garden Lane', 'BTM Silk Board Junction', 'BTM Water Tank Road', 'BTM Madiwala Market'],
      ['Marathahalli Bridge', 'Marathahalli AECS Layout', 'Marathahalli Inner Ring Road', 'Marathahalli Spice Garden', 'Marathahalli Kundalahalli'],
    ];
    const statuses = ['active', 'active', 'active', 'full', 'maintenance', 'inactive'];
    const baseLat = 12.92;
    const baseLng = 77.58;

    const binData = [];
    for (let i = 0; i < 50; i++) {
      const areaIdx = i % 10;
      const locIdx = Math.floor(i / 10);
      const wl = i % 7 === 0 ? randInt(80, 100) : i % 5 === 0 ? randInt(50, 79) : randInt(0, 49);
      const st = wl >= 90 ? 'full' : i % 13 === 0 ? 'maintenance' : i % 17 === 0 ? 'inactive' : 'active';
      binData.push({
        binId: `BIN-${String(i + 1).padStart(3, '0')}`,
        location: locations[areaIdx][locIdx % 5],
        area: areas[areaIdx],
        wasteLevel: wl,
        status: st,
        latitude: baseLat + (areaIdx * 0.008) + (Math.random() * 0.005),
        longitude: baseLng + (locIdx * 0.015) + (Math.random() * 0.005),
        assignedWorker: workers[i % workers.length]._id,
      });
    }

    const bins = await Bin.insertMany(binData);
    console.log(`🗑️  Bins seeded: ${bins.length}`);

    // ═══════════════════════════════════════════
    // 3. CREATE WASTE REPORTS (40)
    // ═══════════════════════════════════════════
    const descriptions = [
      'Trash is overflowing at this location. It smells terrible and is attracting stray animals.',
      'The bin is completely filled and waste is spilling onto the sidewalk. Needs immediate attention.',
      'Hazardous chemical waste noticed near this bin. Please send specialized cleanup crew.',
      'Construction debris dumped next to the bin blocking pedestrian pathway.',
      'E-waste including old monitors and keyboards dumped in the regular waste bin.',
      'Medical waste found in this general waste bin. This is a health hazard.',
      'The bin lid is broken and waste is scattered by wind and animals.',
      'Foul odor emanating from this location for the past 3 days. Bin not emptied.',
      'Plastic bags and packaging waste overflowing. Recycling bin needed here.',
      'Food waste attracting rats and insects. Urgent sanitation required.',
      'Green waste and garden trimmings dumped on the road near this bin.',
      'Industrial waste noticed, possibly from nearby factory. Needs investigation.',
      'Broken glass and sharp objects near the bin. Safety concern for children.',
      'Waterlogged area around the bin creating mosquito breeding ground.',
      'Paint cans and chemical containers dumped illegally near this bin.',
      'The bin has not been collected for over a week. Community is frustrated.',
      'Large furniture items dumped near the bin blocking the entire access road.',
      'Oil and grease spill near the bin from nearby auto garage.',
      'Burning smell from the bin. Someone may have lit waste on fire.',
      'Multiple bags of household waste placed outside the already full bin.',
    ];

    const reportStatuses = ['pending', 'pending', 'in-progress', 'in-progress', 'resolved', 'resolved', 'rejected'];
    const reportData = [];
    for (let i = 0; i < 40; i++) {
      reportData.push({
        reportId: `RPT-${1001 + i}`,
        citizenId: citizens[i % citizens.length]._id,
        binId: bins[i % bins.length]._id,
        description: descriptions[i % descriptions.length],
        imageUrl: i % 4 === 0 ? 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500' : i % 4 === 1 ? 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500' : '',
        status: reportStatuses[i % reportStatuses.length],
        createdAt: randomPastDate(60),
      });
    }

    const reports = await WasteReport.insertMany(reportData);
    console.log(`📝 Waste Reports seeded: ${reports.length}`);

    // ═══════════════════════════════════════════
    // 4. CREATE COLLECTION TASKS (50)
    // ═══════════════════════════════════════════
    const taskStatuses = ['pending', 'pending', 'in-progress', 'in-progress', 'completed', 'completed', 'completed', 'cancelled'];
    const taskData = [];
    for (let i = 0; i < 50; i++) {
      const st = taskStatuses[i % taskStatuses.length];
      const cd = st === 'completed' ? randomPastDate(30) : st === 'cancelled' ? randomPastDate(14) : randomFutureDate(14);
      taskData.push({
        taskId: `TASK-${201 + i}`,
        workerId: workers[i % workers.length]._id,
        binId: bins[i % bins.length]._id,
        collectionDate: cd,
        status: st,
        createdAt: new Date(cd.getTime() - 2 * 24 * 60 * 60 * 1000), // created 2 days before collection
      });
    }

    const tasks = await CollectionTask.insertMany(taskData);
    console.log(`📋 Collection Tasks seeded: ${tasks.length}`);

    // ═══════════════════════════════════════════
    // 5. CREATE VEHICLES (10)
    // ═══════════════════════════════════════════
    const vehicleData = [
      { vehicleId: 'VEH-001', vehicleNumber: 'KA-03-HA-1234', driverName: 'Suresh Babu', capacity: 1500, status: 'in-use', assignedWorker: workers[0]._id },
      { vehicleId: 'VEH-002', vehicleNumber: 'KA-03-HA-5678', driverName: 'Mohammed Rafi', capacity: 2000, status: 'in-use', assignedWorker: workers[1]._id },
      { vehicleId: 'VEH-003', vehicleNumber: 'KA-03-HB-9012', driverName: 'Ganesh Reddy', capacity: 1800, status: 'available', assignedWorker: workers[2]._id },
      { vehicleId: 'VEH-004', vehicleNumber: 'KA-03-HB-3456', driverName: 'Ramesh Gowda', capacity: 1200, status: 'available', assignedWorker: workers[3]._id },
      { vehicleId: 'VEH-005', vehicleNumber: 'KA-03-HC-7890', driverName: 'Naveen Kumar', capacity: 2500, status: 'in-use', assignedWorker: workers[4]._id },
      { vehicleId: 'VEH-006', vehicleNumber: 'KA-03-HC-2345', driverName: 'Deepak Shetty', capacity: 3000, status: 'maintenance', assignedWorker: null },
      { vehicleId: 'VEH-007', vehicleNumber: 'KA-03-HD-6789', driverName: 'Prakash Nair', capacity: 1600, status: 'available', assignedWorker: workers[6]._id },
      { vehicleId: 'VEH-008', vehicleNumber: 'KA-03-HD-1234', driverName: 'Arun Prasad', capacity: 2200, status: 'in-use', assignedWorker: workers[7]._id },
      { vehicleId: 'VEH-009', vehicleNumber: 'KA-03-HE-5678', driverName: 'Ravi Shankar', capacity: 1900, status: 'available', assignedWorker: workers[8]._id },
      { vehicleId: 'VEH-010', vehicleNumber: 'KA-03-HE-9012', driverName: 'Kiran Patel', capacity: 2800, status: 'retired', assignedWorker: null },
    ];

    const vehicles = await Vehicle.insertMany(vehicleData);
    console.log(`🚛 Vehicles seeded: ${vehicles.length}`);

    // ═══════════════════════════════════════════
    // 6. CREATE NOTIFICATIONS (realistic)
    // ═══════════════════════════════════════════
    const notificationData = [];

    // Admin notifications
    for (let i = 0; i < 8; i++) {
      notificationData.push({
        message: `Bin ${bins[i].binId} at ${bins[i].location} is ${bins[i].wasteLevel}% full. ${bins[i].wasteLevel >= 80 ? 'Immediate collection required!' : 'Monitor closely.'}`,
        recipientId: admins[i % admins.length]._id,
        type: bins[i].wasteLevel >= 80 ? 'warning' : 'info',
        readStatus: i < 3,
        createdAt: randomPastDate(7),
      });
    }

    // Worker notifications (task assignments)
    for (let i = 0; i < 10; i++) {
      notificationData.push({
        message: `New collection task ${tasks[i].taskId} has been assigned to you for ${bins[i % bins.length].location}.`,
        recipientId: workers[i % workers.length]._id,
        type: 'task',
        readStatus: i < 5,
        createdAt: randomPastDate(14),
      });
    }

    // Citizen notifications (report updates)
    for (let i = 0; i < 12; i++) {
      const rpt = reports[i % reports.length];
      notificationData.push({
        message: `Your complaint ${rpt.reportId} status has been updated to ${rpt.status}.`,
        recipientId: citizens[i % citizens.length]._id,
        type: 'report',
        readStatus: i < 6,
        createdAt: randomPastDate(21),
      });
    }

    // System notifications
    notificationData.push(
      { message: 'System maintenance scheduled for tonight 11 PM - 2 AM. App may be unavailable.', recipientId: admins[0]._id, type: 'warning', readStatus: false, createdAt: randomPastDate(2) },
      { message: 'Monthly waste collection report is now available for download.', recipientId: admins[1]._id, type: 'info', readStatus: true, createdAt: randomPastDate(5) },
      { message: 'Welcome to WasteWise! Start by reporting any waste issues in your area.', recipientId: citizens[20]._id, type: 'success', readStatus: false, createdAt: randomPastDate(1) },
      { message: 'Your feedback has been recorded. Thank you for helping us improve!', recipientId: citizens[5]._id, type: 'success', readStatus: true, createdAt: randomPastDate(10) },
      { message: 'Vehicle VEH-006 has been sent for maintenance. Expect delays in Zone 6.', recipientId: workers[5]._id, type: 'warning', readStatus: false, createdAt: randomPastDate(3) },
    );

    await Notification.insertMany(notificationData);
    console.log(`🔔 Notifications seeded: ${notificationData.length}`);

    // ═══════════════════════════════════════════
    // 7. CREATE FEEDBACK (25)
    // ═══════════════════════════════════════════
    const comments = [
      'Great initiative! The bin near my house is usually collected on time now.',
      'The collection schedule has improved significantly. Keep it up!',
      'Still facing delays in Lakeside area. The bin overflowed for 2 days last week.',
      'The mobile app is very user-friendly. Easy to report issues and track status.',
      'Excellent response time when I reported overflowing waste. Resolved in 4 hours!',
      'Workers are polite and efficient. Very impressed with the service improvement.',
      'Need more bins in the HSR Layout area. Current ones fill up too quickly.',
      'The notification system is helpful. I get updates on my complaints promptly.',
      'Waste segregation awareness programs would be helpful for the community.',
      'Great service overall but recycling bins are missing in many locations.',
      'The Koramangala area cleanup has been outstanding this month.',
      'Response to complaints has been much faster compared to last quarter.',
      'Some bins have broken lids. Please schedule maintenance checks regularly.',
      'The evening collection timing is perfect for our residential area.',
      'Would appreciate weekend collection services in the Electronic City zone.',
      'The app dashboard shows clear statistics. Very professional system.',
      'Impressed with the vehicle fleet management. Trucks arrive on schedule.',
      'Greenwood Park is always clean now. Thank you to the dedicated workers!',
      'Suggestion: Add a feature to schedule bulk waste pickup for households.',
      'The complaint resolution process is transparent and efficient.',
      'BTM Layout service has improved drastically. Rating 5 stars!',
      'Minor issue: app sometimes shows wrong bin locations. Please verify GPS data.',
      'Night collection reduces noise pollution. Great planning by the admin team.',
      'Workers deserve appreciation. They work hard in difficult conditions.',
      'Overall satisfied with the waste management system in our ward.',
    ];

    const feedbackData = [];
    for (let i = 0; i < 25; i++) {
      feedbackData.push({
        citizenId: citizens[i % citizens.length]._id,
        rating: i % 5 === 0 ? 5 : i % 5 === 1 ? 4 : i % 5 === 2 ? 3 : i % 5 === 3 ? 5 : 4,
        comment: comments[i],
        createdAt: randomPastDate(45),
      });
    }

    const feedback = await Feedback.insertMany(feedbackData);
    console.log(`⭐ Feedback seeded: ${feedback.length}`);

    // ═══════════════════════════════════════════
    // 8. CREATE ACTIVITY LOGS (realistic historical actions)
    // ═══════════════════════════════════════════
    const activityData = [];

    // User registrations
    for (let i = 0; i < 5; i++) {
      activityData.push({
        action: 'USER_REGISTER', entityType: 'User', entityId: citizens[i]._id.toString(),
        userId: citizens[i]._id, details: `Registered new citizen account: ${citizens[i].name}`,
        createdAt: randomPastDate(90),
      });
    }

    // Bin creation logs
    for (let i = 0; i < 10; i++) {
      activityData.push({
        action: 'BIN_CREATED', entityType: 'Bin', entityId: bins[i]._id.toString(),
        userId: admins[i % admins.length]._id, details: `Admin created waste bin: ${bins[i].binId} at ${bins[i].location}`,
        createdAt: randomPastDate(75),
      });
    }

    // Worker assignments
    for (let i = 0; i < 8; i++) {
      activityData.push({
        action: 'WORKER_ASSIGNED', entityType: 'Bin', entityId: bins[i]._id.toString(),
        userId: admins[0]._id, details: `Assigned worker ${workers[i % workers.length].name} to bin ${bins[i].binId}`,
        createdAt: randomPastDate(60),
      });
    }

    // Report creation logs
    for (let i = 0; i < 10; i++) {
      activityData.push({
        action: 'REPORT_CREATED', entityType: 'WasteReport', entityId: reports[i]._id.toString(),
        userId: citizens[i % citizens.length]._id, details: `Filed waste complaint ${reports[i].reportId} for bin ${bins[i % bins.length].binId}`,
        createdAt: randomPastDate(50),
      });
    }

    // Task creation and completion logs
    for (let i = 0; i < 10; i++) {
      activityData.push({
        action: 'TASK_CREATED', entityType: 'CollectionTask', entityId: tasks[i]._id.toString(),
        userId: admins[i % admins.length]._id, details: `Created collection task ${tasks[i].taskId} and assigned to ${workers[i % workers.length].name}`,
        createdAt: randomPastDate(40),
      });
    }
    for (let i = 0; i < 6; i++) {
      activityData.push({
        action: 'TASK_COMPLETED', entityType: 'CollectionTask', entityId: tasks[i]._id.toString(),
        userId: workers[i % workers.length]._id, details: `Worker ${workers[i % workers.length].name} completed task ${tasks[i].taskId}`,
        createdAt: randomPastDate(20),
      });
    }

    // Vehicle logs
    for (let i = 0; i < 5; i++) {
      activityData.push({
        action: 'VEHICLE_CREATED', entityType: 'Vehicle', entityId: vehicles[i]._id.toString(),
        userId: admins[0]._id, details: `Added fleet vehicle: ${vehicles[i].vehicleNumber} (${vehicles[i].vehicleId})`,
        createdAt: randomPastDate(70),
      });
    }

    // Complaint resolution logs
    for (let i = 0; i < 6; i++) {
      activityData.push({
        action: 'COMPLAINT_RESOLVED', entityType: 'WasteReport', entityId: reports[i]._id.toString(),
        userId: admins[i % admins.length]._id, details: `Marked report ${reports[i].reportId} as resolved`,
        createdAt: randomPastDate(15),
      });
    }

    // Feedback logs
    for (let i = 0; i < 5; i++) {
      activityData.push({
        action: 'FEEDBACK_SUBMITTED', entityType: 'Feedback', entityId: feedback[i]._id.toString(),
        userId: citizens[i]._id, details: `Citizen ${citizens[i].name} submitted feedback with rating: ${feedback[i].rating}`,
        createdAt: randomPastDate(30),
      });
    }

    // User update/delete logs
    activityData.push(
      { action: 'USER_UPDATED', entityType: 'User', entityId: workers[0]._id.toString(), userId: admins[0]._id, details: `Admin updated worker ${workers[0].name} phone number`, createdAt: randomPastDate(25) },
      { action: 'USER_UPDATED', entityType: 'User', entityId: citizens[3]._id.toString(), userId: admins[1]._id, details: `Admin updated citizen ${citizens[3].name} address`, createdAt: randomPastDate(18) },
      { action: 'BIN_UPDATED', entityType: 'Bin', entityId: bins[5]._id.toString(), userId: admins[0]._id, details: `Updated bin ${bins[5].binId} status to maintenance`, createdAt: randomPastDate(12) },
      { action: 'VEHICLE_UPDATED', entityType: 'Vehicle', entityId: vehicles[5]._id.toString(), userId: admins[2]._id, details: `Vehicle ${vehicles[5].vehicleNumber} sent for maintenance`, createdAt: randomPastDate(8) },
    );

    await ActivityLog.insertMany(activityData);
    console.log(`📜 Activity Logs seeded: ${activityData.length}`);

    // ═══════════════════════════════════════════
    // SUMMARY
    // ═══════════════════════════════════════════
    console.log('\n✨ Database seeded successfully!');
    console.log('═══════════════════════════════════════════');
    console.log('📊 Seed Data Summary:');
    console.log(`   Users:         ${users.length} (${admins.length} admins, ${workers.length} workers, ${citizens.length} citizens)`);
    console.log(`   Bins:          ${bins.length}`);
    console.log(`   Reports:       ${reports.length}`);
    console.log(`   Tasks:         ${tasks.length}`);
    console.log(`   Vehicles:      ${vehicles.length}`);
    console.log(`   Notifications: ${notificationData.length}`);
    console.log(`   Feedback:      ${feedback.length}`);
    console.log(`   Activity Logs: ${activityData.length}`);
    console.log('═══════════════════════════════════════════');
    console.log('\n📧 Demo Credentials (Password: password123 for all):');
    console.log('   🔴 Admin:    admin@wastewise.com  (Rajesh Kumar)');
    console.log('   🔴 Admin 2:  admin2@wastewise.com (Priya Sharma)');
    console.log('   🔴 Admin 3:  admin3@wastewise.com (Vikram Singh)');
    console.log('   🟢 Worker:   worker@wastewise.com (Suresh Babu)');
    console.log('   🟢 Worker 2: worker2@wastewise.com (Mohammed Rafi)');
    console.log('   🔵 Citizen:  citizen@wastewise.com (Ananya Iyer)');
    console.log('   🔵 Citizen 2: citizen2@wastewise.com (Rohan Desai)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
