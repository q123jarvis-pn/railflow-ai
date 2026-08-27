import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import {
  MOCK_STATIONS,
  MOCK_ALERTS,
  MOCK_NETWORK_STATS,
  MOCK_DADAR_PREDICTION,
  MOCK_ACCURACY_EVALUATIONS,
  MOCK_MODEL_STATS,
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  }));
  app.use(express.json());

  // -------------------------------------------------------------
  // BACKEND REST API ROUTES
  // -------------------------------------------------------------

  // 1. Health & Server Status
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({
      status: "ok",
      service: "RailFlow AI Backend Service",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime()
    });
  });

  // 2. Network Overview Statistics
  app.get("/api/network/overview", (req: Request, res: Response) => {
    try {
      const westernStations = MOCK_STATIONS.filter(s => s.line === "WESTERN" || s.lines.includes("WESTERN"));
      const centralStations = MOCK_STATIONS.filter(s => s.line === "CENTRAL" || s.lines.includes("CENTRAL"));
      const harbourStations = MOCK_STATIONS.filter(s => s.line === "HARBOUR" || s.lines.includes("HARBOUR"));

      const criticalCount = MOCK_STATIONS.filter(s => s.currentOccupancy >= 85).length;
      const highCount = MOCK_STATIONS.filter(s => s.currentOccupancy >= 70 && s.currentOccupancy < 85).length;
      const moderateCount = MOCK_STATIONS.filter(s => s.currentOccupancy >= 50 && s.currentOccupancy < 70).length;
      const normalCount = MOCK_STATIONS.filter(s => s.currentOccupancy < 50).length;

      const totalOccupancy = MOCK_STATIONS.reduce((acc, s) => acc + s.currentOccupancy, 0);
      const avgOccupancy = Math.round(totalOccupancy / MOCK_STATIONS.length);

      res.json({
        success: true,
        data: {
          ...MOCK_NETWORK_STATS,
          totalStationsMonitored: MOCK_STATIONS.length,
          westernStationsCount: westernStations.length,
          centralStationsCount: centralStations.length,
          harbourStationsCount: harbourStations.length,
          criticalStationsCount: criticalCount,
          highCrowdStationsCount: highCount,
          moderateStationsCount: moderateCount,
          normalStationsCount: normalCount,
          averageOccupancy: avgOccupancy,
          forecasted15mSurgeCount: MOCK_STATIONS.filter(s => s.predictedOccupancy >= 80).length,
          lastSignalSync: `Live (Sync @ ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })})`
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to generate network overview" });
    }
  });

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
            s.name.toLowerCase().includes(q) ||
            (s.marathiName && s.marathiName.includes(q)) ||
            (s.hindiName && s.hindiName.includes(q)) ||
            s.line.toLowerCase().includes(q)
        );
      }

      // Minimum occupancy filter
      if (minOccupancy && !isNaN(Number(minOccupancy))) {
        const minOcc = Number(minOccupancy);
        stations = stations.filter(s => s.currentOccupancy >= minOcc);
      }

      // Limit
      if (limit && !isNaN(Number(limit))) {
        stations = stations.slice(0, Number(limit));
      }

      res.json({
        success: true,
        count: stations.length,
        total: MOCK_STATIONS.length,
        data: stations
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch stations" });
    }
  });

  // 4. Single Station Details by ID
  app.get("/api/stations/:id", (req: Request, res: Response) => {
    try {
      const stationId = req.params.id.toLowerCase();
      const station = getStationById(stationId);

      if (!station) {
        return res.status(404).json({ success: false, error: `Station '${req.params.id}' not found` });
      }

      const stationRecs = OPERATIONAL_RECOMMENDATIONS.filter(r => r.stationId.toLowerCase() === stationId);
      const stationAlerts = activeAlerts.filter(a => a.stationId.toLowerCase() === stationId);

      res.json({
        success: true,
        data: {
          ...station,
          recommendations: stationRecs,
          activeAlerts: stationAlerts
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to retrieve station details" });
    }
  });

  // 5. Station Platforms Breakdown
  app.get("/api/stations/:id/platforms", (req: Request, res: Response) => {
    try {
      const stationId = req.params.id.toLowerCase();
      const station = getStationById(stationId);

      if (!station) {
        return res.status(404).json({ success: false, error: `Station '${req.params.id}' not found` });
      }

      const platforms = station.platforms || [
        { platformNumber: 1, line: station.line, currentCrowd: station.crowdStatus, occupancyPercentage: station.currentOccupancy, nextTrainTime: station.nextTrain, nextTrainDestination: station.destination, isFastTrainOnly: true },
        { platformNumber: 2, line: station.line, currentCrowd: 'MEDIUM', occupancyPercentage: Math.max(30, station.currentOccupancy - 15), nextTrainTime: getMumbaiNextTrainTime(5), nextTrainDestination: 'Bandra Slow' }
      ];

      res.json({
        success: true,
        stationId: station.id,
        stationName: station.name,
        platformsCount: station.platformsCount,
        data: platforms
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch platform telemetry" });
    }
  });

  // 6. Railway Network Heatmap Data
  app.get("/api/network/heatmap", (req: Request, res: Response) => {
    try {
      const heatmapPoints = MOCK_STATIONS.map(s => ({
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
      res.status(500).json({ success: false, error: "Failed to generate heatmap dataset" });
    }
  });

  // 7. 15-Minute Predictive Surge Analytics & Key Stations Comparison
  app.get("/api/predictions/15m", (req: Request, res: Response) => {
    try {
      const keyStationIds = ["dadar", "andheri", "churchgate", "mumbai-central", "csmt", "borivali", "kurla", "thane"];
      const keyStationsComparison = keyStationIds.map(id => {
        const stn = getStationById(id);
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
        primaryPrediction: MOCK_DADAR_PREDICTION
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to generate predictive telemetry" });
    }
  });

  // 8. Single Station Prediction Details
  app.get("/api/predictions/:stationId", (req: Request, res: Response) => {
    try {
      const station = getStationById(req.params.stationId);
      if (!station) {
        return res.status(404).json({ success: false, error: "Station prediction not found" });
      }

      const prediction: CrowdPrediction = {
        stationId: station.id,
        stationName: station.name,
        line: station.line,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
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
            factor: "Experimental Anonymous Device-Density Signal",
            impact: "medium",
            description: `Aggregated non-individualized RF index reading ${station.deviceDensityIndex}/100.`
          }
        ]
      };

      res.json({ success: true, data: prediction });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to compute station prediction" });
    }
  });

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
      }

      res.json({
        success: true,
        count: recs.length,
        data: recs
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch recommendations" });
    }
  });

  // 10. Operational Alerts List
  app.get("/api/alerts", (req: Request, res: Response) => {
    try {
      const { severity, resolved } = req.query;
      let alerts = [...activeAlerts];

      if (severity && typeof severity === "string") {
        alerts = alerts.filter(a => a.severity.toLowerCase() === severity.toLowerCase());
      }
      if (resolved !== undefined) {
        const isResolved = resolved === "true";
        alerts = alerts.filter(a => a.resolved === isResolved);
      }

      res.json({
        success: true,
        count: alerts.length,
        unresolvedCount: alerts.filter(a => !a.resolved).length,
        data: alerts
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch alerts" });
    }
  });

  // 11. Acknowledge Alert (POST)
  app.post("/api/alerts/:id/ack", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const targetAlert = activeAlerts.find(a => a.id === id);

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
      res.status(500).json({ success: false, error: "Failed to acknowledge alert" });
    }
  });

  // -------------------------------------------------------------
  // VITE DEV MIDDLEWARE / STATIC PRODUCTION SERVING
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
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
