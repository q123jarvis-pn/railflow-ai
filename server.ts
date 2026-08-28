import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import {
  MOCK_ALERTS,
  MOCK_NETWORK_STATS,
  MOCK_DADAR_PREDICTION,
  MOCK_ACCURACY_EVALUATIONS,
  MOCK_MODEL_STATS,
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware & CORS
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
    })
  );
  app.use(express.json());

  // -------------------------------------------------------------
  // BACKEND REST API ROUTES
  // -------------------------------------------------------------

  // 1. Health & Server Status
  app.get("/api/health", (req: Request, res: Response) => {
    const timeInfo = getMumbaiTimeParts();
    res.json({
      status: "ok",
      service: "RailFlow AI Backend Service",
      timestamp: new Date().toISOString(),
      mumbaiTime: timeInfo.formattedTime,
      version: "1.2.0",
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime()
    });
  });

  // 2. Network Overview Statistics
  app.get("/api/network/overview", (req: Request, res: Response) => {
    try {
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

      res.json({
        success: true,
        data: {
          ...MOCK_NETWORK_STATS,
          totalStationsMonitored: stations.length,
          activeTrains: activeTrains.length,
          westernStationsCount: westernStations.length,
          centralStationsCount: centralStations.length,
          harbourStationsCount: harbourStations.length,
          criticalStationsCount: criticalCount,
          highCrowdStationsCount: highCount,
          moderateStationsCount: moderateCount,
          normalStationsCount: normalCount,
          averageOccupancy: avgOccupancy,
          forecasted15mSurgeCount: stations.filter((s) => s.predictedOccupancy >= 80).length,
          systemHealth: criticalCount > 4 ? "Congestion Alert" : criticalCount > 0 ? "Heavy Traffic" : "Optimal",
          lastSignalSync: `Live (Sync @ ${timeInfo.formattedTime})`
        }
      });
    } catch (error) {
      console.error("Error in /api/network/overview:", error);
      res.status(500).json({ success: false, error: "Failed to generate network overview" });
    }
  });

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
            s.name.toLowerCase().includes(q) ||
            (s.marathiName && s.marathiName.includes(q)) ||
            (s.hindiName && s.hindiName.includes(q)) ||
            s.line.toLowerCase().includes(q)
        );
      }

      // Filter by Minimum Occupancy
      if (minOccupancy && !isNaN(Number(minOccupancy))) {
        const minOcc = Number(minOccupancy);
        stations = stations.filter((s) => s.currentOccupancy >= minOcc);
      }

      // Limit results if requested
      const totalCount = stations.length;
      if (limit && !isNaN(Number(limit))) {
        stations = stations.slice(0, Number(limit));
      }

      res.json({
        success: true,
        count: stations.length,
        total: totalCount,
        data: stations
      });
    } catch (error) {
      console.error("Error in /api/stations:", error);
      res.status(500).json({ success: false, error: "Failed to fetch stations" });
    }
  });

  // 4. Single Station Details by ID
  app.get("/api/stations/:id", (req: Request, res: Response) => {
    try {
      const stationId = req.params.id.toLowerCase();
      const stations = getAllSimulatedStations();
      const station = stations.find((s) => s.id.toLowerCase() === stationId);

      if (!station) {
        return res.status(404).json({ success: false, error: `Station '${req.params.id}' not found` });
      }

      const allRecs = getDynamicRecommendations(stations);
      const stationRecs = allRecs.filter((r) => r.stationId.toLowerCase() === stationId);
      const stationAlerts = activeAlerts.filter((a) => a.stationId.toLowerCase() === stationId);

      res.json({
        success: true,
        data: {
          ...station,
          recommendations: stationRecs,
          activeAlerts: stationAlerts
        }
      });
    } catch (error) {
      console.error(`Error in /api/stations/${req.params.id}:`, error);
      res.status(500).json({ success: false, error: "Failed to retrieve station details" });
    }
  });

  // 5. Station Platforms Breakdown
  app.get("/api/stations/:id/platforms", (req: Request, res: Response) => {
    try {
      const stationId = req.params.id.toLowerCase();
      const stations = getAllSimulatedStations();
      const station = stations.find((s) => s.id.toLowerCase() === stationId);

      if (!station) {
        return res.status(404).json({ success: false, error: `Station '${req.params.id}' not found` });
      }

      res.json({
        success: true,
        stationId: station.id,
        stationName: station.name,
        platformsCount: station.platformsCount,
        data: station.platforms || []
      });
    } catch (error) {
      console.error(`Error in /api/stations/${req.params.id}/platforms:`, error);
      res.status(500).json({ success: false, error: "Failed to fetch platform telemetry" });
    }
  });

  // 6. Railway Network Heatmap Dataset
  app.get("/api/network/heatmap", (req: Request, res: Response) => {
    try {
      const stations = getAllSimulatedStations();
      const heatmapPoints = stations.map((s) => ({
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
      console.error("Error in /api/network/heatmap:", error);
      res.status(500).json({ success: false, error: "Failed to generate heatmap dataset" });
    }
  });

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
        primaryPrediction
      });
    } catch (error) {
      console.error("Error in /api/predictions/15m:", error);
      res.status(500).json({ success: false, error: "Failed to generate predictive telemetry" });
    }
  });

  // 9. Single Station Prediction Details
  app.get("/api/predictions/:stationId", (req: Request, res: Response) => {
    try {
      const stationId = req.params.stationId.toLowerCase();
      const stations = getAllSimulatedStations();
      const station = stations.find((s) => s.id.toLowerCase() === stationId);

      if (!station) {
        return res.status(404).json({ success: false, error: `Station '${req.params.stationId}' prediction not found` });
      }

      const prediction: CrowdPrediction = {
        stationId: station.id,
        stationName: station.name,
        line: station.line,
        timestamp: getMumbaiTimeParts().formattedTime,
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
            factor: "Anonymous Device-Density Signal",
            impact: "medium",
            description: `Aggregated non-individualized RF index reading ${station.deviceDensityIndex}/100.`
          }
        ]
      };

      res.json({ success: true, data: prediction });
    } catch (error) {
      console.error(`Error in /api/predictions/${req.params.stationId}:`, error);
      res.status(500).json({ success: false, error: "Failed to compute station prediction" });
    }
  });

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
      }

      res.json({
        success: true,
        count: recs.length,
        data: recs
      });
    } catch (error) {
      console.error("Error in /api/recommendations:", error);
      res.status(500).json({ success: false, error: "Failed to fetch recommendations" });
    }
  });

  // 11. Operational Alerts List
  app.get("/api/alerts", (req: Request, res: Response) => {
    try {
      const { severity, resolved } = req.query;
      let alerts = [...activeAlerts];

      if (severity && typeof severity === "string") {
        alerts = alerts.filter((a) => a.severity.toLowerCase() === severity.toLowerCase());
      }
      if (resolved !== undefined) {
        const isResolved = resolved === "true";
        alerts = alerts.filter((a) => a.resolved === isResolved);
      }

      res.json({
        success: true,
        count: alerts.length,
        unresolvedCount: alerts.filter((a) => !a.resolved).length,
        data: alerts
      });
    } catch (error) {
      console.error("Error in /api/alerts:", error);
      res.status(500).json({ success: false, error: "Failed to fetch alerts" });
    }
  });

  // 12. Acknowledge Alert (POST /api/alerts/:id/ack)
  app.post("/api/alerts/:id/ack", (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const targetAlert = activeAlerts.find((a) => a.id === id);

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
      console.error(`Error acknowledging alert ${req.params.id}:`, error);
      res.status(500).json({ success: false, error: "Failed to acknowledge alert" });
    }
  });

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

  // -------------------------------------------------------------
  // VITE DEV MIDDLEWARE / STATIC PRODUCTION SERVING
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
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
