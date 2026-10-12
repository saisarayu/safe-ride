# SafeRide+ — Intelligent School Bus Safety & Journey Monitoring System

A pure, standalone **React Native (Expo + React Native Web)** frontend application for real-time school bus fleet monitoring, student attendance tracking, safe-drop verification, and emergency management.

---

## 🚀 Running the App

### 1. Start the Web App
```bash
npm run web
# or
npx expo start --web
```
Open your browser at [http://localhost:8081](http://localhost:8081).

### 2. Run on Android or iOS
```bash
# Android
npm run android

# iOS
npm run ios
```

---

## 👥 Built-in User Roles & Quick-Login Credentials

| Role | Name | Email / Quick Select | Features Accessible |
|---|---|---|---|
| **School Administrator** | Principal Sharma | `admin@saferide.edu` | Master Dashboard, Live Tracking, Student Directory, Fleet Manager, Route Manager, Missing Student Alerts, Safe-Drop Logs, SOS Emergencies |
| **Driver / Escort** | Rajesh Kumar (Bus 1) | `driver.rajesh@saferide.edu` | Trip Console, Live Passenger Manifest, Tap-to-Board / Tap-to-Exit RFID scanner, 1-Touch Emergency SOS Panic Trigger |
| **Parent / Guardian** | Priya Nair (Aarav's Mother) | `priya.nair@example.com` | Child Real-Time Status, Live Map Tracking, Bus ETA, Attendance & Drop-Off History Logs |
| **Student** | Aarav Nair | `aarav.nair@saferide.edu` | Designated Stops, Bus Crew details, Route Progress, Student Safety Guidelines |

---

## 🛡️ Core Client-Side Safety Engines

1. **Safe-Drop Verification Engine (`safetyEngine.js`)**:
   - Computes distance between bus GPS and designated student drop-off stop using the **Haversine formula**.
   - Validates if distance $\le 100\text{m}$ (geofence radius) and GPS timestamp freshness $\le 180\text{s}$.
   - Flags unsafe drop-offs immediately for administrator review and manual override.

2. **Missing-Student Detection**:
   - Detects students marked as absent or failing to board at designated stops.
   - Generates high-priority actionable alerts with one-click resolution.

3. **Non-Negative Real-Time Occupancy Counter**:
   - Hardware-synced passenger boarding and exit tracking with automatic overflow alerts if capacity exceeds limits.

4. **Emergency SOS Panic Dispatch**:
   - 1-Touch emergency classification (Medical, Accident, Fire, Breakdown, Security) broadcasting instant priority alerts across all screens.

5. **Live Route Simulation Engine**:
   - Interactive map simulation to advance bus telemetry along route stops, testing boarding, in-transit telemetry, and safe-drop triggers in real time.
