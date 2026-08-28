import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import {
<<<<<<< HEAD
=======
  MOCK_STATIONS,
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
  MOCK_ALERTS,
  MOCK_NETWORK_STATS,
  MOCK_DADAR_PREDICTION,
  MOCK_ACCURACY_EVALUATIONS,
  MOCK_MODEL_STATS,
<<<<<<< HEAD
  MOCK_DATA_SIGNALS_INFO
} from "./src/data/mockData";
import { Alert, CrowdPrediction, Station } from "./src/types";
import {
  getAllSimulatedStations,
  getActiveTrains,
  getDynamicRecommendations,
  getMumbaiTimeParts,
  getNextTrainDeparture
} from "./src/server/railwayEngine";
import { generateOperationalAdvisory } from "./src/server/geminiService";

// In-memory active alerts store to support persistent acknowledgments during server runtime
let activeAlerts: Alert[] = MOCK_ALERTS.map((a) => ({ ...a }));
=======
  MOCK_DATA_SIGNALS_INFO,
  getStationById,
  getMumbaiNextTrainTime
} from "./src/data/mockData";
import { Station, Alert, CrowdPrediction } from "./src/types";

// In-memory active alerts state to support live acknowledgments
let activeAlerts: Alert[] = [...MOCK_ALERTS];

// Operational OCC & Commuter Recommendations Store
interface OperationalRecommendation {
  id: string;
  stationId: string;
  stationName: string;
  platformNumber?: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  category: "MARSHALLING" | "HOLDING_AREA" | "ANNOUNCEMENT" | "TRAIN_INDUCTION" | "COMMUTER_ADVISORY";
  title: string;
  actionRequired: string;
  rationale: string;
  estimatedCrowdRelief: string;
  generatedAt: string;
}

const OPERATIONAL_RECOMMENDATIONS: OperationalRecommendation[] = [
  {
    id: "REC-001",
    stationId: "dadar",
    stationName: "Dadar Interchange",
    platformNumber: 1,
    priority: "HIGH",
    category: "MARSHALLING",
    title: "Deploy RPF Crowd Marshals at Western-Central Middle FOB",
    actionRequired: "Station Master to reposition 4 Railway Protection Force personnel to regulate pedestrian interchange transit from PF 1 to PF 6.",
    rationale: "FOB bottleneck optical flow exceeded 1.8 persons/sqm threshold with 89% predicted surge in 15 minutes.",
    estimatedCrowdRelief: "-22% localized staircase congestion within 8 minutes",
    generatedAt: "08:43 PM"
  },
  {
    id: "REC-002",
    stationId: "kurla",
    stationName: "Kurla Junction",
    platformNumber: 7,
    priority: "HIGH",
    category: "HOLDING_AREA",
    title: "Activate East Booking Hall Auxiliary Holding Enclosure",
    actionRequired: "Open North-East holding bay gates to stage passengers safely before entering Harbour Line platform stairs.",
    rationale: "UTS digital ticket bookings spiked by 34% for Panvel-bound evening commuters.",
    estimatedCrowdRelief: "-18% platform edge crowding during 15-minute peak window",
    generatedAt: "08:41 PM"
  },
  {
    id: "REC-003",
    stationId: "thane",
    stationName: "Thane",
    platformNumber: 2,
    priority: "HIGH",
    category: "TRAIN_INDUCTION",
    title: "Request OCC for 15-Car Kalyan Fast Local Staging",
    actionRequired: "Dispatcher advisory: Advance scheduled empty rake from Kalwa car shed to absorb platform 2 surge.",
    rationale: "Live occupancy reached 96% with platform dwell times stretching to 45 seconds.",
    estimatedCrowdRelief: "-35% platform clearance immediately upon rake arrival",
    generatedAt: "08:40 PM"
  },
  {
    id: "REC-004",
    stationId: "andheri",
    stationName: "Andheri",
    platformNumber: 3,
    priority: "MEDIUM",
    category: "ANNOUNCEMENT",
    title: "Broadcast Commuter Equalization Advisory to Rear Coaches",
    actionRequired: "Trigger automated bilingual audio announcements advising passengers that rear coaches have 40% lower occupancy.",
    rationale: "Optical camera feeds reveal front motorman coach sector is congested at 92% while rear coaches are at 52%.",
    estimatedCrowdRelief: "Balancing coach distribution evenly across 12-car formation",
    generatedAt: "08:38 PM"
  },
  {
    id: "REC-005",
    stationId: "borivali",
    stationName: "Borivali",
    platformNumber: 4,
    priority: "MEDIUM",
    category: "COMMUTER_ADVISORY",
    title: "Suggest Virar Slow Connection from Platform 5",
    actionRequired: "Display digital signage recommending non-peak commuters take the subsequent 08:58 PM local to avoid 08:48 PM fast rush.",
    rationale: "Subsequent service has 42% projected capacity compared to 86% on current train.",
    estimatedCrowdRelief: "Reduces boarding stampede risk on Platform 4",
    generatedAt: "08:35 PM"
  }
];
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c

async function startServer() {
  const app = express();
  const PORT = 3000;

<<<<<<< HEAD
  // Middleware & CORS
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
    })
  );
=======
  // Middleware
  app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  }));
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
  app.use(express.json());

  // -------------------------------------------------------------
  // BACKEND REST API ROUTES
  // -------------------------------------------------------------

  // 1. Health & Server Status
  app.get("/api/health", (req: Request, res: Response) => {
<<<<<<< HEAD
    const timeInfo = getMumbaiTimeParts();
=======
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
    res.json({
      status: "ok",
      service: "RailFlow AI Backend Service",
      timestamp: new Date().toISOString(),
<<<<<<< HEAD
      mumbaiTime: timeInfo.formattedTime,
      version: "1.2.0",
=======
      version: "1.0.0",
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime()
    });
  });

  // 2. Network Overview Statistics
  app.get("/api/network/overview", (req: Request, res: Response) => {
    try {
<<<<<<< HEAD
      const stations = getAllSimulatedStations();
      const westernStations = stations.filter((s) => s.line === "WESTERN" || s.lines.includes("WESTERN"));
      const centralStations = stations.filter((s) => s.line === "CENTRAL" || s.lines.includes("CENTRAL"));
      const harbourStations = stations.filter((s) => s.line === "HARBOUR" || s.lines.includes("HARBOUR"));

      const criticalCount = stations.filter((s) => s.currentOccupancy >= 85).length;
      const highCount = stations.filter((s) => s.currentOccupancy >= 70 && s.currentOccupancy < 85).length;
      const moderateCount = stations.filter((s) => s.currentOccupancy >= 50 && s.currentOccupancy < 70).length;
      const normalCount = stations.filter((s) => s.currentOccupancy < 50).length;

      const totalOccupancy = stations.reduce((acc, s) => acc + s.currentOccupancy, 0);
      const avgOccupancy = Math.round(totalOccupancy / stations.length);
      const activeTrains = getActiveTrains();

      const timeInfo = getMumbaiTimeParts();
=======
      const westernStations = MOCK_STATIONS.filter(s => s.line === "WESTERN" || s.lines.includes("WESTERN"));
      const centralStations = MOCK_STATIONS.filter(s => s.line === "CENTRAL" || s.lines.includes("CENTRAL"));
      const harbourStations = MOCK_STATIONS.filter(s => s.line === "HARBOUR" || s.lines.includes("HARBOUR"));

      const criticalCount = MOCK_STATIONS.filter(s => s.currentOccupancy >= 85).length;
      const highCount = MOCK_STATIONS.filter(s => s.currentOccupancy >= 70 && s.currentOccupancy < 85).length;
      const moderateCount = MOCK_STATIONS.filter(s => s.currentOccupancy >= 50 && s.currentOccupancy < 70).length;
      const normalCount = MOCK_STATIONS.filter(s => s.currentOccupancy < 50).length;

      const totalOccupancy = MOCK_STATIONS.reduce((acc, s) => acc + s.currentOccupancy, 0);
      const avgOccupancy = Math.round(totalOccupancy / MOCK_STATIONS.length);
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c

      res.json({
        success: true,
        data: {
          ...MOCK_NETWORK_STATS,
<<<<<<< HEAD
          totalStationsMonitored: stations.length,
          activeTrains: activeTrains.length,
=======
          totalStationsMonitored: MOCK_STATIONS.length,
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
          westernStationsCount: westernStations.length,
          centralStationsCount: centralStations.length,
          harbourStationsCount: harbourStations.length,
          criticalStationsCount: criticalCount,
          highCrowdStationsCount: highCount,
          moderateStationsCount: moderateCount,
          normalStationsCount: normalCount,
          averageOccupancy: avgOccupancy,
<<<<<<< HEAD
          forecasted15mSurgeCount: stations.filter((s) => s.predictedOccupancy >= 80).length,
          systemHealth: criticalCount > 4 ? "Congestion Alert" : criticalCount > 0 ? "Heavy Traffic" : "Optimal",
          lastSignalSync: `Live (Sync @ ${timeInfo.formattedTime})`
        }
      });
    } catch (error) {
      console.error("Error in /api/network/overview:", error);
=======
          forecasted15mSurgeCount: MOCK_STATIONS.filter(s => s.predictedOccupancy >= 80).length,
          lastSignalSync: `Live (Sync @ ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })})`
        }
      });
    } catch (error) {
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
      res.status(500).json({ success: false, error: "Failed to generate network overview" });
    }
  });

<<<<<<< HEAD
  // 3. Stations Directory (Filtering by line, search query, minOccupancy, limit)
  app.get("/api/stations", (req: Request, res: Response) => {
    try {
      const { line, search, minOccupancy, limit } = req.query;
      let stations = getAllSimulatedStations();

      // Filter by Line
      if (line && typeof line === "string" && line.toUpperCase() !== "ALL") {
        const lineUpper = line.toUpperCase();
        stations = stations.filter(
          (s) => s.line === lineUpper || s.lines.includes(lineUpper as any)
        );
      }

      // Filter by Search Query
      if (search && typeof search === "string" && search.trim()) {
        const q = search.toLowerCase().trim();
        stations = stations.filter(
          (s) =>
=======
  // 3. Stations List (Supports filtering by line, search, minOccupancy)
  app.get("/api/stations", (req: Request, res: Response) => {
    try {
      const { line, search, minOccupancy, limit } = req.query;
      let stations = [...MOCK_STATIONS];

      // Line filter
      if (line && typeof line === "string" && line.toUpperCase() !== "ALL") {
        const lineUpper = line.toUpperCase();
        stations = stations.filter(
          s => s.line === lineUpper || s.lines.includes(lineUpper as any)
        );
      }

      // Search filter
      if (search && typeof search === "string" && search.trim()) {
        const q = search.toLowerCase().trim();
        stations = stations.filter(
          s =>
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
            s.name.toLowerCase().includes(q) ||
            (s.marathiName && s.marathiName.includes(q)) ||
            (s.hindiName && s.hindiName.includes(q)) ||
            s.line.toLowerCase().includes(q)
        );
      }

<<<<<<< HEAD
      // Filter by Minimum Occupancy
      if (minOccupancy && !isNaN(Number(minOccupancy))) {
        const minOcc = Number(minOccupancy);
        stations = stations.filter((s) => s.currentOccupancy >= minOcc);
      }

      // Limit results if requested
      const totalCount = stations.length;
=======
      // Minimum occupancy filter
      if (minOccupancy && !isNaN(Number(minOccupancy))) {
        const minOcc = Number(minOccupancy);
        stations = stations.filter(s => s.currentOccupancy >= minOcc);
      }

      // Limit
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
      if (limit && !isNaN(Number(limit))) {
        stations = stations.slice(0, Number(limit));
      }

      res.json({
        success: true,
        count: stations.length,
<<<<<<< HEAD
        total: totalCount,
        data: stations
      });
    } catch (error) {
      console.error("Error in /api/stations:", error);
=======
        total: MOCK_STATIONS.length,
        data: stations
      });
    } catch (error) {
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
      res.status(500).json({ success: false, error: "Failed to fetch stations" });
    }
  });

  // 4. Single Station Details by ID
  app.get("/api/stations/:id", (req: Request, res: Response) => {
    try {
      const stationId = req.params.id.toLowerCase();
<<<<<<< HEAD
      const stations = getAllSimulatedStations();
      const station = stations.find((s) => s.id.toLowerCase() === stationId);
=======
      const station = getStationById(stationId);
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c

      if (!station) {
        return res.status(404).json({ success: false, error: `Station '${req.params.id}' not found` });
      }

<<<<<<< HEAD
      const allRecs = getDynamicRecommendations(stations);
      const stationRecs = allRecs.filter((r) => r.stationId.toLowerCase() === stationId);
      const stationAlerts = activeAlerts.filter((a) => a.stationId.toLowerCase() === stationId);
=======
      const stationRecs = OPERATIONAL_RECOMMENDATIONS.filter(r => r.stationId.toLowerCase() === stationId);
      const stationAlerts = activeAlerts.filter(a => a.stationId.toLowerCase() === stationId);
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c

      res.json({
        success: true,
        data: {
          ...station,
          recommendations: stationRecs,
          activeAlerts: stationAlerts
        }
      });
    } catch (error) {
<<<<<<< HEAD
      console.error(`Error in /api/stations/${req.params.id}:`, error);
=======
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
      res.status(500).json({ success: false, error: "Failed to retrieve station details" });
    }
  });

  // 5. Station Platforms Breakdown
  app.get("/api/stations/:id/platforms", (req: Request, res: Response) => {
    try {
      const stationId = req.params.id.toLowerCase();
<<<<<<< HEAD
      const stations = getAllSimulatedStations();
      const station = stations.find((s) => s.id.toLowerCase() === stationId);
=======
      const station = getStationById(stationId);
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c

      if (!station) {
        return res.status(404).json({ success: false, error: `Station '${req.params.id}' not found` });
      }

<<<<<<< HEAD
=======
      const platforms = station.platforms || [
        { platformNumber: 1, line: station.line, currentCrowd: station.crowdStatus, occupancyPercentage: station.currentOccupancy, nextTrainTime: station.nextTrain, nextTrainDestination: station.destination, isFastTrainOnly: true },
        { platformNumber: 2, line: station.line, currentCrowd: 'MEDIUM', occupancyPercentage: Math.max(30, station.currentOccupancy - 15), nextTrainTime: getMumbaiNextTrainTime(5), nextTrainDestination: 'Bandra Slow' }
      ];

>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
      res.json({
        success: true,
        stationId: station.id,
        stationName: station.name,
        platformsCount: station.platformsCount,
<<<<<<< HEAD
        data: station.platforms || []
      });
    } catch (error) {
      console.error(`Error in /api/stations/${req.params.id}/platforms:`, error);
=======
        data: platforms
      });
    } catch (error) {
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
      res.status(500).json({ success: false, error: "Failed to fetch platform telemetry" });
    }
  });

<<<<<<< HEAD
  // 6. Railway Network Heatmap Dataset
  app.get("/api/network/heatmap", (req: Request, res: Response) => {
    try {
      const stations = getAllSimulatedStations();
      const heatmapPoints = stations.map((s) => ({
=======
  // 6. Railway Network Heatmap Data
  app.get("/api/network/heatmap", (req: Request, res: Response) => {
    try {
      const heatmapPoints = MOCK_STATIONS.map(s => ({
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
        id: s.id,
        name: s.name,
        marathiName: s.marathiName,
        line: s.line,
        lines: s.lines,
        latitude: s.latitude,
        longitude: s.longitude,
        currentOccupancy: s.currentOccupancy,
        predictedOccupancy: s.predictedOccupancy,
        crowdStatus: s.crowdStatus,
        heatWeight: Math.round((s.currentOccupancy / 100) * 10) / 10,
        forecastHeatWeight: Math.round((s.predictedOccupancy / 100) * 10) / 10,
        surgeAlert: s.predictedOccupancy >= 80,
        nextTrain: s.nextTrain,
        platform: s.platform,
        destination: s.destination
      }));

      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        count: heatmapPoints.length,
        data: heatmapPoints
      });
    } catch (error) {
<<<<<<< HEAD
      console.error("Error in /api/network/heatmap:", error);
=======
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
      res.status(500).json({ success: false, error: "Failed to generate heatmap dataset" });
    }
  });

<<<<<<< HEAD
  // 7. Live Trains in Transit (GET /api/trains & GET /api/trains/:id)
  app.get("/api/trains", (req: Request, res: Response) => {
    try {
      const { line, search, status } = req.query;
      let trains = getActiveTrains();

      if (line && typeof line === "string" && line.toUpperCase() !== "ALL") {
        trains = trains.filter((t) => t.line === line.toUpperCase());
      }
      if (search && typeof search === "string" && search.trim()) {
        const q = search.toLowerCase().trim();
        trains = trains.filter(
          (t) =>
            t.trainName.toLowerCase().includes(q) ||
            t.trainNumber.includes(q) ||
            t.destination.toLowerCase().includes(q) ||
            t.source.toLowerCase().includes(q) ||
            t.currentStation.toLowerCase().includes(q)
        );
      }
      if (status && typeof status === "string") {
        trains = trains.filter((t) => t.delayStatus.toLowerCase() === status.toLowerCase());
      }

      res.json({
        success: true,
        count: trains.length,
        data: trains
      });
    } catch (error) {
      console.error("Error in /api/trains:", error);
      res.status(500).json({ success: false, error: "Failed to retrieve active trains" });
    }
  });

  app.get("/api/trains/:id", (req: Request, res: Response) => {
    try {
      const trainId = req.params.id.toUpperCase();
      const trains = getActiveTrains();
      const train = trains.find((t) => t.id.toUpperCase() === trainId || t.trainNumber === trainId);

      if (!train) {
        return res.status(404).json({ success: false, error: `Train '${req.params.id}' not found` });
      }

      res.json({
        success: true,
        data: train
      });
    } catch (error) {
      console.error(`Error in /api/trains/${req.params.id}:`, error);
      res.status(500).json({ success: false, error: "Failed to retrieve train details" });
    }
  });

  // 8. 15-Minute Predictive Surge Analytics & Key Stations Comparison
  app.get("/api/predictions/15m", (req: Request, res: Response) => {
    try {
      const stations = getAllSimulatedStations();
      const keyStationIds = ["dadar", "andheri", "churchgate", "mumbai-central", "csmt", "borivali", "kurla", "thane"];

      const keyStationsComparison = keyStationIds.map((id) => {
        const stn = stations.find((s) => s.id.toLowerCase() === id) || stations[0];
=======
  // 7. 15-Minute Predictive Surge Analytics & Key Stations Comparison
  app.get("/api/predictions/15m", (req: Request, res: Response) => {
    try {
      const keyStationIds = ["dadar", "andheri", "churchgate", "mumbai-central", "csmt", "borivali", "kurla", "thane"];
      const keyStationsComparison = keyStationIds.map(id => {
        const stn = getStationById(id);
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
        return {
          id: stn.id,
          name: stn.name,
          line: stn.line,
          currentOccupancy: stn.currentOccupancy,
          predictedOccupancy: stn.predictedOccupancy,
          crowdStatus: stn.crowdStatus,
          shiftPercentage: stn.predictedOccupancy - stn.currentOccupancy,
          isHighCrowd: stn.predictedOccupancy >= 70,
          isCritical: stn.predictedOccupancy >= 85,
          confidenceScore: stn.cctvSignalConfidence,
          nextTrain: stn.nextTrain,
          platform: stn.platform
        };
      });

<<<<<<< HEAD
      const dadarStation = stations.find((s) => s.id === "dadar") || stations[0];
      const primaryPrediction: CrowdPrediction = {
        stationId: dadarStation.id,
        stationName: dadarStation.name,
        line: dadarStation.line,
        timestamp: dadarStation.nextTrain,
        targetMinutes: 15,
        predictedCrowd: dadarStation.predictedOccupancy >= 85 ? "CRITICAL" : dadarStation.predictedOccupancy >= 70 ? "HIGH" : "MEDIUM",
        predictedOccupancy: dadarStation.predictedOccupancy,
        confidenceScore: dadarStation.cctvSignalConfidence,
        trend: dadarStation.predictedOccupancy > dadarStation.currentOccupancy ? "rising" : "falling",
        contributingFactors: MOCK_DADAR_PREDICTION.contributingFactors
      };

=======
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
      res.json({
        success: true,
        meta: {
          predictionWindowMinutes: 15,
          modelRefreshInterval: "30s rolling",
          accuracyRate: MOCK_MODEL_STATS.overallAccuracy,
          meanAbsoluteError: MOCK_MODEL_STATS.meanAbsoluteError,
          overpredictionRate: MOCK_MODEL_STATS.overpredictionRate,
          underpredictionRate: MOCK_MODEL_STATS.underpredictionRate
        },
        keyStationsComparison,
        sampleAccuracyEvaluations: MOCK_ACCURACY_EVALUATIONS,
        telemetrySignals: MOCK_DATA_SIGNALS_INFO,
<<<<<<< HEAD
        primaryPrediction
      });
    } catch (error) {
      console.error("Error in /api/predictions/15m:", error);
=======
        primaryPrediction: MOCK_DADAR_PREDICTION
      });
    } catch (error) {
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
      res.status(500).json({ success: false, error: "Failed to generate predictive telemetry" });
    }
  });

<<<<<<< HEAD
  // 9. Single Station Prediction Details
  app.get("/api/predictions/:stationId", (req: Request, res: Response) => {
    try {
      const stationId = req.params.stationId.toLowerCase();
      const stations = getAllSimulatedStations();
      const station = stations.find((s) => s.id.toLowerCase() === stationId);

      if (!station) {
        return res.status(404).json({ success: false, error: `Station '${req.params.stationId}' prediction not found` });
=======
  // 8. Single Station Prediction Details
  app.get("/api/predictions/:stationId", (req: Request, res: Response) => {
    try {
      const station = getStationById(req.params.stationId);
      if (!station) {
        return res.status(404).json({ success: false, error: "Station prediction not found" });
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
      }

      const prediction: CrowdPrediction = {
        stationId: station.id,
        stationName: station.name,
        line: station.line,
<<<<<<< HEAD
        timestamp: getMumbaiTimeParts().formattedTime,
=======
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
        targetMinutes: 15,
        predictedCrowd: station.predictedOccupancy >= 85 ? "CRITICAL" : station.predictedOccupancy >= 70 ? "HIGH" : station.predictedOccupancy >= 50 ? "MEDIUM" : "LOW",
        predictedOccupancy: station.predictedOccupancy,
        confidenceScore: station.cctvSignalConfidence,
        trend: station.predictedOccupancy > station.currentOccupancy ? "rising" : station.predictedOccupancy < station.currentOccupancy ? "falling" : "stable",
        contributingFactors: [
          {
            factor: "CCTV Optical Density Flow",
            impact: "high",
            description: `Edge optical flow tracking concourse density index at ${station.cctvSignalConfidence}% confidence.`
          },
          {
            factor: "UTS Digital Ticketing Velocity",
            impact: "high",
            description: `${station.utsActiveSessions.toLocaleString()} active mobile UTS app sessions in geofence.`
          },
          {
            factor: "ETVM / ATVM Counter Velocity",
            impact: "medium",
            description: `${station.etvmTicketingVelocity} tickets dispensed per minute across automated kiosks.`
          },
          {
<<<<<<< HEAD
            factor: "Anonymous Device-Density Signal",
=======
            factor: "Experimental Anonymous Device-Density Signal",
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
            impact: "medium",
            description: `Aggregated non-individualized RF index reading ${station.deviceDensityIndex}/100.`
          }
        ]
      };

      res.json({ success: true, data: prediction });
    } catch (error) {
<<<<<<< HEAD
      console.error(`Error in /api/predictions/${req.params.stationId}:`, error);
=======
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
      res.status(500).json({ success: false, error: "Failed to compute station prediction" });
    }
  });

<<<<<<< HEAD
  // 10. Operational & Commuter Recommendations
  app.get("/api/recommendations", (req: Request, res: Response) => {
    try {
      const { stationId, priority } = req.query;
      const stations = getAllSimulatedStations();
      let recs = getDynamicRecommendations(stations);

      if (stationId && typeof stationId === "string") {
        recs = recs.filter((r) => r.stationId.toLowerCase() === stationId.toLowerCase());
      }
      if (priority && typeof priority === "string") {
        recs = recs.filter((r) => r.priority.toUpperCase() === priority.toUpperCase());
=======
  // 9. Operational & Commuter Recommendations
  app.get("/api/recommendations", (req: Request, res: Response) => {
    try {
      const { stationId, priority } = req.query;
      let recs = [...OPERATIONAL_RECOMMENDATIONS];

      if (stationId && typeof stationId === "string") {
        recs = recs.filter(r => r.stationId.toLowerCase() === stationId.toLowerCase());
      }
      if (priority && typeof priority === "string") {
        recs = recs.filter(r => r.priority.toUpperCase() === priority.toUpperCase());
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
      }

      res.json({
        success: true,
        count: recs.length,
        data: recs
      });
    } catch (error) {
<<<<<<< HEAD
      console.error("Error in /api/recommendations:", error);
=======
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
      res.status(500).json({ success: false, error: "Failed to fetch recommendations" });
    }
  });

<<<<<<< HEAD
  // 11. Operational Alerts List
=======
  // 10. Operational Alerts List
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
  app.get("/api/alerts", (req: Request, res: Response) => {
    try {
      const { severity, resolved } = req.query;
      let alerts = [...activeAlerts];

      if (severity && typeof severity === "string") {
<<<<<<< HEAD
        alerts = alerts.filter((a) => a.severity.toLowerCase() === severity.toLowerCase());
      }
      if (resolved !== undefined) {
        const isResolved = resolved === "true";
        alerts = alerts.filter((a) => a.resolved === isResolved);
=======
        alerts = alerts.filter(a => a.severity.toLowerCase() === severity.toLowerCase());
      }
      if (resolved !== undefined) {
        const isResolved = resolved === "true";
        alerts = alerts.filter(a => a.resolved === isResolved);
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
      }

      res.json({
        success: true,
        count: alerts.length,
<<<<<<< HEAD
        unresolvedCount: alerts.filter((a) => !a.resolved).length,
        data: alerts
      });
    } catch (error) {
      console.error("Error in /api/alerts:", error);
=======
        unresolvedCount: alerts.filter(a => !a.resolved).length,
        data: alerts
      });
    } catch (error) {
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
      res.status(500).json({ success: false, error: "Failed to fetch alerts" });
    }
  });

<<<<<<< HEAD
  // 12. Acknowledge Alert (POST /api/alerts/:id/ack)
  app.post("/api/alerts/:id/ack", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const targetAlert = activeAlerts.find((a) => a.id === id);
=======
  // 11. Acknowledge Alert (POST)
  app.post("/api/alerts/:id/ack", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const targetAlert = activeAlerts.find(a => a.id === id);
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c

      if (!targetAlert) {
        return res.status(404).json({ success: false, error: `Alert '${id}' not found` });
      }

      targetAlert.resolved = true;

      res.json({
        success: true,
        message: `Alert '${id}' acknowledged successfully`,
        data: targetAlert
      });
    } catch (error) {
<<<<<<< HEAD
      console.error(`Error acknowledging alert ${req.params.id}:`, error);
=======
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
      res.status(500).json({ success: false, error: "Failed to acknowledge alert" });
    }
  });

<<<<<<< HEAD
  // 13. AI Operational Decision Support Advisory (POST /api/ai/advisory)
  app.post("/api/ai/advisory", async (req: Request, res: Response) => {
    try {
      const { stationId, query } = req.body || {};
      const stations = getAllSimulatedStations();
      const recommendations = getDynamicRecommendations(stations);

      const advisory = await generateOperationalAdvisory(
        stations,
        recommendations,
        typeof query === "string" ? query : undefined,
        typeof stationId === "string" ? stationId : undefined
      );

      res.json({
        success: true,
        data: advisory
      });
    } catch (error) {
      console.error("Error generating AI advisory:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate operational advisory"
      });
    }
  });

=======
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
  // -------------------------------------------------------------
  // VITE DEV MIDDLEWARE / STATIC PRODUCTION SERVING
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
<<<<<<< HEAD
      appType: "spa"
=======
      appType: "spa",
>>>>>>> 0cbbf9798e5d6de6e0b6065efac7a84d70e0d10c
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RailFlow AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start RailFlow AI Server:", err);
  process.exit(1);
});
