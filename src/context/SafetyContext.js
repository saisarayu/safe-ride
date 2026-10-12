import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

// Haversine formula to calculate distance between two coordinates in meters
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // returns distance in meters
}

const INITIAL_ROUTES = [
  {
    id: 'route-1',
    name: 'North Sector Express',
    code: 'R-01',
    color: '#3b82f6',
    busId: 'bus-1',
    totalDistance: '18.4 km',
    estimatedDuration: '42 mins',
    stops: [
      { id: 'stop-101', name: 'Greenwood High Main Gate', lat: 12.9716, lng: 77.5946, scheduledTime: '07:15 AM', order: 1 },
      { id: 'stop-102', name: 'Maple Grove Ave (Corner 4)', lat: 12.9752, lng: 77.5982, scheduledTime: '07:24 AM', order: 2 },
      { id: 'stop-103', name: 'Silver Oak Tech Park', lat: 12.9814, lng: 77.6045, scheduledTime: '07:35 AM', order: 3 },
      { id: 'stop-104', name: 'Palm Meadows Gate 2', lat: 12.9880, lng: 77.6110, scheduledTime: '07:44 AM', order: 4 },
      { id: 'stop-105', name: 'Sunrise Enclave Phase 1', lat: 12.9935, lng: 77.6178, scheduledTime: '07:55 AM', order: 5 },
      { id: 'stop-106', name: 'Campus Terminal North', lat: 12.9990, lng: 77.6250, scheduledTime: '08:05 AM', order: 6 },
    ],
  },
  {
    id: 'route-2',
    name: 'Metro Valley Corridor',
    code: 'R-02',
    color: '#10b981',
    busId: 'bus-2',
    totalDistance: '22.1 km',
    estimatedDuration: '48 mins',
    stops: [
      { id: 'stop-201', name: 'Central Metro Hub', lat: 12.9650, lng: 77.5850, scheduledTime: '07:10 AM', order: 1 },
      { id: 'stop-202', name: 'Cedar Ridge Residency', lat: 12.9720, lng: 77.5890, scheduledTime: '07:22 AM', order: 2 },
      { id: 'stop-203', name: 'Lakeview Heights Block C', lat: 12.9790, lng: 77.5950, scheduledTime: '07:34 AM', order: 3 },
      { id: 'stop-204', name: 'Emerald Woods Gate 1', lat: 12.9860, lng: 77.6010, scheduledTime: '07:48 AM', order: 4 },
      { id: 'stop-205', name: 'Campus Terminal West', lat: 12.9990, lng: 77.6250, scheduledTime: '08:02 AM', order: 5 },
    ],
  },
  {
    id: 'route-3',
    name: 'Highland Woods Loop',
    code: 'R-03',
    color: '#f59e0b',
    busId: 'bus-3',
    totalDistance: '15.6 km',
    estimatedDuration: '36 mins',
    stops: [
      { id: 'stop-301', name: 'Pine Crest Circle', lat: 12.9600, lng: 77.6100, scheduledTime: '07:20 AM', order: 1 },
      { id: 'stop-302', name: 'Oakridge Boulevard', lat: 12.9680, lng: 77.6150, scheduledTime: '07:30 AM', order: 2 },
      { id: 'stop-303', name: 'Whispering Winds Phase 3', lat: 12.9770, lng: 77.6210, scheduledTime: '07:42 AM', order: 3 },
      { id: 'stop-304', name: 'Campus Terminal South', lat: 12.9990, lng: 77.6250, scheduledTime: '07:56 AM', order: 4 },
    ],
  },
  {
    id: 'route-4',
    name: 'Downtown Shuttle Direct',
    code: 'R-04',
    color: '#8b5cf6',
    busId: 'bus-4',
    totalDistance: '24.8 km',
    estimatedDuration: '52 mins',
    stops: [
      { id: 'stop-401', name: 'Civic Center Plaza', lat: 12.9550, lng: 77.5750, scheduledTime: '07:05 AM', order: 1 },
      { id: 'stop-402', name: 'Heritage Park East Gate', lat: 12.9640, lng: 77.5810, scheduledTime: '07:18 AM', order: 2 },
      { id: 'stop-403', name: 'Kingston Manor Cross', lat: 12.9730, lng: 77.5880, scheduledTime: '07:32 AM', order: 3 },
      { id: 'stop-404', name: 'Royal Orchid Villas', lat: 12.9830, lng: 77.5990, scheduledTime: '07:46 AM', order: 4 },
      { id: 'stop-405', name: 'Campus Terminal East', lat: 12.9990, lng: 77.6250, scheduledTime: '08:00 AM', order: 5 },
    ],
  },
];

const INITIAL_BUSES = [
  {
    id: 'bus-1',
    number: 'Bus #101',
    regNo: 'KA-04-E-1001',
    name: 'Blue Falcon',
    routeId: 'route-1',
    driver: 'Rajesh Kumar',
    driverPhone: '+91 98123 45678',
    attendant: 'Sunita Devi',
    attendantPhone: '+91 98123 45679',
    capacity: 35,
    currentOccupancy: 28,
    speed: 38,
    speedLimit: 45,
    status: 'In Transit',
    lat: 12.9752,
    lng: 77.5982,
    currentStopIndex: 1,
    nextStop: 'Silver Oak Tech Park',
    etaMins: 6,
    fuel: 82,
    battery: 98,
    engineTemp: '84°C',
    cctvStatus: 'Online (3 cams)',
    sosTriggered: false,
  },
  {
    id: 'bus-2',
    number: 'Bus #104',
    regNo: 'KA-04-E-1004',
    name: 'Eagle Express',
    routeId: 'route-2',
    driver: 'Manoj Verma',
    driverPhone: '+91 98234 56789',
    attendant: 'Rekha Sen',
    attendantPhone: '+91 98234 56780',
    capacity: 32,
    currentOccupancy: 24,
    speed: 42,
    speedLimit: 45,
    status: 'In Transit',
    lat: 12.9720,
    lng: 77.5890,
    currentStopIndex: 1,
    nextStop: 'Lakeview Heights Block C',
    etaMins: 8,
    fuel: 65,
    battery: 94,
    engineTemp: '86°C',
    cctvStatus: 'Online (2 cams)',
    sosTriggered: false,
  },
  {
    id: 'bus-3',
    number: 'Bus #202',
    regNo: 'KA-04-E-2002',
    name: 'Green Transit',
    routeId: 'route-3',
    driver: 'Gurpreet Singh',
    driverPhone: '+91 98345 67890',
    attendant: 'Anita Rao',
    attendantPhone: '+91 98345 67891',
    capacity: 30,
    currentOccupancy: 21,
    speed: 31,
    speedLimit: 45,
    status: 'Approaching Stop',
    lat: 12.9680,
    lng: 77.6150,
    currentStopIndex: 1,
    nextStop: 'Whispering Winds Phase 3',
    etaMins: 4,
    fuel: 91,
    battery: 99,
    engineTemp: '82°C',
    cctvStatus: 'Online (3 cams)',
    sosTriggered: false,
  },
  {
    id: 'bus-4',
    number: 'Bus #305',
    regNo: 'KA-04-E-3005',
    name: 'Silver Arrow',
    routeId: 'route-4',
    driver: 'Vikram Joshi',
    driverPhone: '+91 98456 78901',
    attendant: 'Geeta Kumari',
    attendantPhone: '+91 98456 78902',
    capacity: 35,
    currentOccupancy: 29,
    speed: 35,
    speedLimit: 45,
    status: 'In Transit',
    lat: 12.9730,
    lng: 77.5880,
    currentStopIndex: 2,
    nextStop: 'Royal Orchid Villas',
    etaMins: 11,
    fuel: 74,
    battery: 96,
    engineTemp: '85°C',
    cctvStatus: 'Online (3 cams)',
    sosTriggered: false,
  },
];

const INITIAL_STUDENTS = [
  {
    id: 'stud-1',
    name: 'Aarav Nair',
    grade: 'Grade 5-B',
    rollNo: '24',
    avatar: '👦',
    busId: 'bus-1',
    busNumber: 'Bus #101',
    stopId: 'stop-102',
    stopName: 'Maple Grove Ave (Corner 4)',
    status: 'boarded', // 'waiting', 'boarded', 'safe_dropped', 'absent'
    rfidTag: 'RFID-9901-AAR',
    guardianName: 'Priya Nair',
    guardianPhone: '+91 99887 76655',
    guardianRelation: 'Mother',
    bloodGroup: 'O+',
    medicalNotes: 'Mild peanut allergy (Carry EpiPen)',
    boardTime: '07:25 AM',
    dropTime: null,
    safeDropVerified: false,
    verificationDistance: 18,
  },
  {
    id: 'stud-2',
    name: 'Diya Sharma',
    grade: 'Grade 6-A',
    rollNo: '11',
    avatar: '👧',
    busId: 'bus-1',
    busNumber: 'Bus #101',
    stopId: 'stop-103',
    stopName: 'Silver Oak Tech Park',
    status: 'waiting',
    rfidTag: 'RFID-9902-DIY',
    guardianName: 'Dr. Amit Sharma',
    guardianPhone: '+91 99887 76602',
    guardianRelation: 'Father',
    bloodGroup: 'B+',
    medicalNotes: 'None',
    boardTime: null,
    dropTime: null,
    safeDropVerified: false,
    verificationDistance: null,
  },
  {
    id: 'stud-3',
    name: 'Rohan Deshmukh',
    grade: 'Grade 7-C',
    rollNo: '19',
    avatar: '🧒',
    busId: 'bus-1',
    busNumber: 'Bus #101',
    stopId: 'stop-102',
    stopName: 'Maple Grove Ave (Corner 4)',
    status: 'boarded',
    rfidTag: 'RFID-9903-ROH',
    guardianName: 'Sunita Deshmukh',
    guardianPhone: '+91 99887 76603',
    guardianRelation: 'Mother',
    bloodGroup: 'A+',
    medicalNotes: 'Asthma inhaler in backpack',
    boardTime: '07:26 AM',
    dropTime: null,
    safeDropVerified: false,
    verificationDistance: 22,
  },
  {
    id: 'stud-4',
    name: 'Ananya Pillai',
    grade: 'Grade 4-A',
    rollNo: '08',
    avatar: '👧',
    busId: 'bus-1',
    busNumber: 'Bus #101',
    stopId: 'stop-104',
    stopName: 'Palm Meadows Gate 2',
    status: 'waiting',
    rfidTag: 'RFID-9904-ANA',
    guardianName: 'Karthik Pillai',
    guardianPhone: '+91 99887 76604',
    guardianRelation: 'Father',
    bloodGroup: 'AB+',
    medicalNotes: 'None',
    boardTime: null,
    dropTime: null,
    safeDropVerified: false,
    verificationDistance: null,
  },
  {
    id: 'stud-5',
    name: 'Kabir Mehta',
    grade: 'Grade 8-B',
    rollNo: '14',
    avatar: '👦',
    busId: 'bus-1',
    busNumber: 'Bus #101',
    stopId: 'stop-101',
    stopName: 'Greenwood High Main Gate',
    status: 'safe_dropped',
    rfidTag: 'RFID-9905-KAB',
    guardianName: 'Neha Mehta',
    guardianPhone: '+91 99887 76605',
    guardianRelation: 'Mother',
    bloodGroup: 'O-',
    medicalNotes: 'None',
    boardTime: '07:16 AM',
    dropTime: '07:45 AM',
    safeDropVerified: true,
    verificationDistance: 12,
  },
  {
    id: 'stud-6',
    name: 'Ishaan Reddy',
    grade: 'Grade 9-A',
    rollNo: '05',
    avatar: '👦',
    busId: 'bus-2',
    busNumber: 'Bus #104',
    stopId: 'stop-202',
    stopName: 'Cedar Ridge Residency',
    status: 'boarded',
    rfidTag: 'RFID-9906-ISH',
    guardianName: 'Suresh Reddy',
    guardianPhone: '+91 99887 76606',
    guardianRelation: 'Father',
    bloodGroup: 'B-',
    medicalNotes: 'None',
    boardTime: '07:23 AM',
    dropTime: null,
    safeDropVerified: false,
    verificationDistance: 15,
  },
  {
    id: 'stud-7',
    name: 'Meera Iyer',
    grade: 'Grade 5-A',
    rollNo: '21',
    avatar: '👧',
    busId: 'bus-2',
    busNumber: 'Bus #104',
    stopId: 'stop-203',
    stopName: 'Lakeview Heights Block C',
    status: 'waiting',
    rfidTag: 'RFID-9907-MEE',
    guardianName: 'Lakshmi Iyer',
    guardianPhone: '+91 99887 76607',
    guardianRelation: 'Mother',
    bloodGroup: 'A-',
    medicalNotes: 'Spectacles wearer',
    boardTime: null,
    dropTime: null,
    safeDropVerified: false,
    verificationDistance: null,
  },
  {
    id: 'stud-8',
    name: 'Aryan Sengupta',
    grade: 'Grade 7-B',
    rollNo: '03',
    avatar: '👦',
    busId: 'bus-3',
    busNumber: 'Bus #202',
    stopId: 'stop-302',
    stopName: 'Oakridge Boulevard',
    status: 'boarded',
    rfidTag: 'RFID-9908-ARY',
    guardianName: 'Debashis Sengupta',
    guardianPhone: '+91 99887 76608',
    guardianRelation: 'Father',
    bloodGroup: 'O+',
    medicalNotes: 'None',
    boardTime: '07:31 AM',
    dropTime: null,
    safeDropVerified: false,
    verificationDistance: 20,
  },
  {
    id: 'stud-9',
    name: 'Zara Khan',
    grade: 'Grade 6-B',
    rollNo: '30',
    avatar: '👧',
    busId: 'bus-4',
    busNumber: 'Bus #305',
    stopId: 'stop-403',
    stopName: 'Kingston Manor Cross',
    status: 'boarded',
    rfidTag: 'RFID-9909-ZAR',
    guardianName: 'Farhan Khan',
    guardianPhone: '+91 99887 76609',
    guardianRelation: 'Father',
    bloodGroup: 'B+',
    medicalNotes: 'None',
    boardTime: '07:33 AM',
    dropTime: null,
    safeDropVerified: false,
    verificationDistance: 19,
  },
  {
    id: 'stud-10',
    name: 'Vihaan Agarwal',
    grade: 'Grade 3-C',
    rollNo: '16',
    avatar: '👦',
    busId: 'bus-1',
    busNumber: 'Bus #101',
    stopId: 'stop-105',
    stopName: 'Sunrise Enclave Phase 1',
    status: 'absent',
    rfidTag: 'RFID-9910-VIH',
    guardianName: 'Pooja Agarwal',
    guardianPhone: '+91 99887 76610',
    guardianRelation: 'Mother',
    bloodGroup: 'AB-',
    medicalNotes: 'Absent flagged: Family vacation notice',
    boardTime: null,
    dropTime: null,
    safeDropVerified: false,
    verificationDistance: null,
  },
];

const INITIAL_SAFE_DROP_LOGS = [
  {
    id: 'log-1',
    studentId: 'stud-5',
    studentName: 'Kabir Mehta',
    grade: 'Grade 8-B',
    busNumber: 'Bus #101',
    stopName: 'Greenwood High Main Gate',
    designatedCoords: '12.9716, 77.5946',
    actualDropCoords: '12.9717, 77.5947',
    distanceMeters: 12,
    geofenceThreshold: 100,
    timestamp: '07:45 AM',
    status: 'VERIFIED',
    guardianName: 'Neha Mehta',
    guardianVerified: true,
    verifiedBy: 'RFID + Geo-Hash Pass',
    notes: 'Safe drop confirmed within 12m of designated perimeter.',
  },
  {
    id: 'log-2',
    studentId: 'stud-99',
    studentName: 'Tanvi Joshi',
    grade: 'Grade 6-A',
    busNumber: 'Bus #104',
    stopName: 'Central Metro Hub',
    designatedCoords: '12.9650, 77.5850',
    actualDropCoords: '12.9651, 77.5852',
    distanceMeters: 26,
    geofenceThreshold: 100,
    timestamp: '07:12 AM',
    status: 'VERIFIED',
    guardianName: 'Alok Joshi',
    guardianVerified: true,
    verifiedBy: 'Escort Biometric Signature',
    notes: 'Parent confirmed at designated bus shelter.',
  },
  {
    id: 'log-3',
    studentId: 'stud-98',
    studentName: 'Dev Patel',
    grade: 'Grade 9-B',
    busNumber: 'Bus #202',
    stopName: 'Pine Crest Circle',
    designatedCoords: '12.9600, 77.6100',
    actualDropCoords: '12.9612, 77.6114',
    distanceMeters: 185,
    geofenceThreshold: 100,
    timestamp: '07:22 AM',
    status: 'OVERRIDDEN',
    guardianName: 'Mehul Patel',
    guardianVerified: true,
    verifiedBy: 'Principal Phone Authorization',
    notes: 'Deviation due to water main road closure. Father picked up at alternate cross street.',
  },
];

const INITIAL_MISSING_ALERTS = [
  {
    id: 'miss-1',
    studentId: 'stud-2',
    studentName: 'Diya Sharma',
    grade: 'Grade 6-A',
    busNumber: 'Bus #101',
    stopName: 'Silver Oak Tech Park',
    scheduledTime: '07:35 AM',
    severity: 'Medium',
    timestamp: '3 mins ago',
    guardianPhone: '+91 99887 76602',
    guardianName: 'Dr. Amit Sharma',
    status: 'Awaiting Boarding Scan',
    actionTaken: 'Auto-SMS Dispatched to Guardian',
  },
];

const INITIAL_EMERGENCIES = [
  {
    id: 'sos-1',
    type: 'Mechanical Breakdown (Coolant Alert)',
    busId: 'bus-4',
    busNumber: 'Bus #305 (Silver Arrow)',
    driverName: 'Vikram Joshi',
    driverPhone: '+91 98456 78901',
    location: 'Kingston Manor Cross (KM 14.2)',
    coordinates: '12.9730, 77.5880',
    severity: 'High',
    timestamp: '07:36 AM',
    studentsOnboard: 29,
    status: 'Active Incident Room',
    dispatchedUnits: [
      'Fleet Maintenance Van #02 (En Route - ETA 5m)',
      'Backup Shuttle Bus #108 Dispatched',
    ],
  },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Safe-Drop Confirmed',
    message: 'Kabir Mehta safely dropped at Greenwood High Main Gate. Geofence distance: 12m.',
    time: '4 mins ago',
    type: 'safe_drop',
    unread: true,
  },
  {
    id: 'notif-2',
    title: 'Fleet Telemetry Normal',
    message: 'All 4 buses transmitting telemetry on schedule. SafeRide AI speed limit guard active.',
    time: '12 mins ago',
    type: 'system',
    unread: false,
  },
  {
    id: 'notif-3',
    title: 'Boarding Scan: Aarav Nair',
    message: 'Aarav Nair boarded Bus #101 at Maple Grove Ave. RFID Verified.',
    time: '18 mins ago',
    type: 'boarding',
    unread: true,
  },
];

const SafetyContext = createContext(null);

export function SafetyProvider({ children }) {
  const [buses, setBuses] = useState(INITIAL_BUSES);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [routes, setRoutes] = useState(INITIAL_ROUTES);
  const [safeDropLogs, setSafeDropLogs] = useState(INITIAL_SAFE_DROP_LOGS);
  const [missingAlerts, setMissingAlerts] = useState(INITIAL_MISSING_ALERTS);
  const [emergencies, setEmergencies] = useState(INITIAL_EMERGENCIES);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeSOS, setActiveSOS] = useState(false);
  const [simulationTick, setSimulationTick] = useState(1);

  // Advance simulation step
  const advanceSimulation = () => {
    setSimulationTick((prev) => prev + 1);

    // 1. Move buses forward along their route
    setBuses((prevBuses) =>
      prevBuses.map((bus) => {
        const route = routes.find((r) => r.id === bus.routeId);
        if (!route || !route.stops.length) return bus;

        const nextIndex = (bus.currentStopIndex + 1) % route.stops.length;
        const currentStop = route.stops[nextIndex];
        const newSpeed = Math.floor(28 + Math.random() * 16);
        const newFuel = Math.max(10, bus.fuel - 1);
        const newEta = Math.max(1, Math.floor(Math.random() * 8) + 2);

        return {
          ...bus,
          currentStopIndex: nextIndex,
          lat: currentStop.lat + (Math.random() - 0.5) * 0.001,
          lng: currentStop.lng + (Math.random() - 0.5) * 0.001,
          nextStop: currentStop.name,
          speed: newSpeed,
          fuel: newFuel,
          etaMins: newEta,
          status: newSpeed > 35 ? 'In Transit' : 'Approaching Stop',
        };
      })
    );

    // 2. Simulate boarding for waiting students
    setStudents((prevStudents) => {
      return prevStudents.map((stud) => {
        if (stud.status === 'waiting') {
          return {
            ...stud,
            status: 'boarded',
            boardTime: '07:38 AM',
            verificationDistance: Math.floor(8 + Math.random() * 20),
          };
        }
        return stud;
      });
    });

    // 3. Add notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: `Telemetry Sync #${simulationTick + 1}`,
      message: `Fleet GPS coordinates synchronized. All active routes running within safe corridor parameters.`,
      time: 'Just now',
      type: 'system',
      unread: true,
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 19)]);
  };

  // Simulate RFID Tap
  const simulateRFIDScan = (studentId) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        if (s.status === 'waiting') {
          // Board student
          const updated = {
            ...s,
            status: 'boarded',
            boardTime: '07:40 AM',
            verificationDistance: Math.floor(5 + Math.random() * 25),
          };
          addNotification({
            title: `RFID Boarded: ${s.name}`,
            message: `${s.name} tapped in successfully on ${s.busNumber} at ${s.stopName}.`,
            type: 'boarding',
          });
          return updated;
        } else if (s.status === 'boarded') {
          // Drop student
          const dist = Math.floor(8 + Math.random() * 30);
          const updated = {
            ...s,
            status: 'safe_dropped',
            dropTime: '07:44 AM',
            safeDropVerified: dist <= 100,
            verificationDistance: dist,
          };
          // Add to safe drop logs
          const newLog = {
            id: `log-${Date.now()}`,
            studentId: s.id,
            studentName: s.name,
            grade: s.grade,
            busNumber: s.busNumber,
            stopName: s.stopName,
            designatedCoords: '12.9752, 77.5982',
            actualDropCoords: '12.9753, 77.5983',
            distanceMeters: dist,
            geofenceThreshold: 100,
            timestamp: '07:44 AM',
            status: dist <= 100 ? 'VERIFIED' : 'OVERRIDDEN',
            guardianName: s.guardianName,
            guardianVerified: true,
            verifiedBy: 'RFID Safe-Drop Sensor',
            notes: `Auto-verified geofence safe drop within ${dist}m radius.`,
          };
          setSafeDropLogs((logs) => [newLog, ...logs]);
          addNotification({
            title: `Safe-Drop Verified: ${s.name}`,
            message: `${s.name} safely dropped. Distance from perimeter: ${dist}m. Guardian alerted.`,
            type: 'safe_drop',
          });
          return updated;
        } else {
          // Reset to waiting
          return {
            ...s,
            status: 'waiting',
            boardTime: null,
            dropTime: null,
            safeDropVerified: false,
          };
        }
      })
    );
  };

  // Trigger Emergency SOS
  const triggerSOS = (type = 'Driver Panic Button SOS', busId = 'bus-1') => {
    setActiveSOS(true);
    const bus = buses.find((b) => b.id === busId) || buses[0];
    const newEmergency = {
      id: `sos-${Date.now()}`,
      type: type,
      busId: bus.id,
      busNumber: bus.number,
      driverName: bus.driver,
      driverPhone: bus.driverPhone,
      location: `${bus.nextStop} Perimeter`,
      coordinates: `${bus.lat.toFixed(4)}, ${bus.lng.toFixed(4)}`,
      severity: 'Critical',
      timestamp: 'Just now',
      studentsOnboard: bus.currentOccupancy,
      status: 'EMERGENCY BROADCAST ACTIVE',
      dispatchedUnits: [
        'Central School Control Room Alerted',
        'Emergency Medical Services #108 Dialed',
        'Escort Security Van Dispatched',
      ],
    };
    setEmergencies((prev) => [newEmergency, ...prev]);
    addNotification({
      title: `🚨 EMERGENCY SOS: ${bus.number}`,
      message: `${type} declared at ${bus.nextStop}. Emergency services and administrators notified!`,
      type: 'sos',
    });
  };

  // Resolve Emergency
  const resolveSOS = (emergencyId) => {
    setEmergencies((prev) =>
      prev.map((e) => (e.id === emergencyId ? { ...e, status: 'RESOLVED & SECURED' } : e))
    );
    setActiveSOS(false);
    addNotification({
      title: `Emergency Incident Secured`,
      message: `Incident room verified all students safe. Normal fleet operations resumed.`,
      type: 'info',
    });
  };

  // Resolve Missing Alert
  const resolveMissingAlert = (alertId) => {
    setMissingAlerts((prev) => prev.filter((a) => a.id !== alertId));
    addNotification({
      title: `Alert Resolved`,
      message: `Student presence confirmed with parent and class coordinator.`,
      type: 'info',
    });
  };

  // Safe Drop Supervisor Override
  const overrideSafeDrop = (logId, reason = 'Supervisor Approved') => {
    setSafeDropLogs((prev) =>
      prev.map((log) =>
        log.id === logId
          ? { ...log, status: 'OVERRIDDEN', notes: `${log.notes} | Override: ${reason}` }
          : log
      )
    );
  };

  // Mark student absent
  const markStudentAbsent = (studentId, reason = 'Parent reported illness') => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, status: 'absent', medicalNotes: `Absent: ${reason}` } : s
      )
    );
    addNotification({
      title: `Absence Recorded`,
      message: `Student marked absent. Driver manifest updated automatically.`,
      type: 'info',
    });
  };

  // Add Notification Helper
  const addNotification = ({ title, message, type = 'info' }) => {
    const item = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      type,
      unread: true,
    };
    setNotifications((prev) => [item, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const value = useMemo(
    () => ({
      buses,
      students,
      routes,
      safeDropLogs,
      missingAlerts,
      emergencies,
      notifications,
      activeSOS,
      simulationTick,
      advanceSimulation,
      simulateRFIDScan,
      triggerSOS,
      resolveSOS,
      resolveMissingAlert,
      overrideSafeDrop,
      markStudentAbsent,
      addNotification,
      markAllNotificationsRead,
    }),
    [
      buses,
      students,
      routes,
      safeDropLogs,
      missingAlerts,
      emergencies,
      notifications,
      activeSOS,
      simulationTick,
    ]
  );

  return <SafetyContext.Provider value={value}>{children}</SafetyContext.Provider>;
}

export function useSafety() {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used inside SafetyProvider');
  }
  return context;
}

