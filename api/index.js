// src/server/app.ts
import express, { Router } from "express";
import cors from "cors";

// src/data/mockData.ts
var MOCK_STATIONS = [
  // ===================== WESTERN LINE =====================
  {
    id: "churchgate",
    name: "Churchgate",
    marathiName: "\u091A\u0930\u094D\u091A\u0917\u0947\u091F",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 18.9322,
    longitude: 72.8264,
    crowdStatus: "HIGH",
    currentOccupancy: 76,
    predictedOccupancy: 84,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 4,
    nextTrain: "08:45 PM",
    destination: "Borivali Fast",
    delayStatus: "On Time",
    delayMinutes: 0,
    cctvSignalConfidence: 96,
    etvmTicketingVelocity: 142,
    utsActiveSessions: 1840,
    deviceDensityIndex: 78,
    platforms: [
      { platformNumber: 1, line: "WESTERN", currentCrowd: "HIGH", occupancyPercentage: 78, nextTrainTime: "08:45 PM", nextTrainDestination: "Borivali Fast", isFastTrainOnly: true },
      { platformNumber: 2, line: "WESTERN", currentCrowd: "MEDIUM", occupancyPercentage: 62, nextTrainTime: "08:48 PM", nextTrainDestination: "Virar Slow" },
      { platformNumber: 3, line: "WESTERN", currentCrowd: "LOW", occupancyPercentage: 35, nextTrainTime: "08:55 PM", nextTrainDestination: "Andheri Slow" },
      { platformNumber: 4, line: "WESTERN", currentCrowd: "MEDIUM", occupancyPercentage: 58, nextTrainTime: "09:02 PM", nextTrainDestination: "Goregaon AC" }
    ]
  },
  {
    id: "marine-lines",
    name: "Marine Lines",
    marathiName: "\u092E\u0930\u0940\u0928 \u0932\u093E\u0908\u0928\u094D\u0938",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 18.9438,
    longitude: 72.8236,
    crowdStatus: "LOW",
    currentOccupancy: 38,
    predictedOccupancy: 42,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 2,
    nextTrain: "08:47 PM",
    destination: "Borivali Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 91,
    etvmTicketingVelocity: 48,
    utsActiveSessions: 420,
    deviceDensityIndex: 39
  },
  {
    id: "charni-road",
    name: "Charni Road",
    marathiName: "\u091A\u0930\u094D\u0928\u0940 \u0930\u094B\u0921",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 18.9519,
    longitude: 72.8188,
    crowdStatus: "LOW",
    currentOccupancy: 44,
    predictedOccupancy: 49,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 2,
    nextTrain: "08:50 PM",
    destination: "Virar Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 89,
    etvmTicketingVelocity: 55,
    utsActiveSessions: 510,
    deviceDensityIndex: 45
  },
  {
    id: "grant-road",
    name: "Grant Road",
    marathiName: "\u0917\u094D\u0930\u0901\u091F \u0930\u094B\u0921",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 18.9632,
    longitude: 72.8155,
    crowdStatus: "MEDIUM",
    currentOccupancy: 58,
    predictedOccupancy: 65,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 4,
    nextTrain: "08:52 PM",
    destination: "Borivali Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 92,
    etvmTicketingVelocity: 82,
    utsActiveSessions: 890,
    deviceDensityIndex: 60
  },
  {
    id: "mumbai-central",
    name: "Mumbai Central",
    marathiName: "\u092E\u0941\u0902\u092C\u0908 \u0938\u0947\u0902\u091F\u094D\u0930\u0932",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 18.9696,
    longitude: 72.8193,
    crowdStatus: "HIGH",
    currentOccupancy: 74,
    predictedOccupancy: 81,
    predictionMinutes: 15,
    platform: 3,
    platformsCount: 5,
    nextTrain: "08:53 PM",
    destination: "Dahanu Fast",
    delayStatus: "On Time",
    cctvSignalConfidence: 95,
    etvmTicketingVelocity: 120,
    utsActiveSessions: 1450,
    deviceDensityIndex: 75
  },
  {
    id: "mahalaxmi",
    name: "Mahalaxmi",
    marathiName: "\u092E\u0939\u093E\u0932\u0915\u094D\u0937\u094D\u092E\u0940",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 18.9827,
    longitude: 72.8242,
    crowdStatus: "MEDIUM",
    currentOccupancy: 52,
    predictedOccupancy: 56,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 3,
    nextTrain: "08:56 PM",
    destination: "Andheri Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 90,
    etvmTicketingVelocity: 64,
    utsActiveSessions: 670,
    deviceDensityIndex: 53
  },
  {
    id: "lower-parel",
    name: "Lower Parel",
    marathiName: "\u0932\u094B\u0905\u0930 \u092A\u0930\u0933",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 18.9953,
    longitude: 72.8306,
    crowdStatus: "CRITICAL",
    currentOccupancy: 91,
    predictedOccupancy: 94,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 3,
    nextTrain: "08:58 PM",
    destination: "Borivali Slow",
    delayStatus: "Delayed",
    delayMinutes: 4,
    cctvSignalConfidence: 94,
    etvmTicketingVelocity: 165,
    utsActiveSessions: 2280,
    deviceDensityIndex: 92
  },
  {
    id: "prabhadevi",
    name: "Prabhadevi",
    marathiName: "\u092A\u094D\u0930\u092D\u093E\u0926\u0947\u0935\u0940",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 19.0069,
    longitude: 72.8361,
    crowdStatus: "MEDIUM",
    currentOccupancy: 64,
    predictedOccupancy: 70,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 2,
    nextTrain: "09:01 PM",
    destination: "Virar Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 93,
    etvmTicketingVelocity: 78,
    utsActiveSessions: 940,
    deviceDensityIndex: 65
  },
  // ===================== DADAR (INTERCHANGE) =====================
  {
    id: "dadar",
    name: "Dadar",
    marathiName: "\u0926\u093E\u0926\u0930",
    line: "INTERCHANGE",
    lines: ["CENTRAL", "WESTERN"],
    latitude: 19.0178,
    longitude: 72.8431,
    crowdStatus: "MEDIUM",
    currentOccupancy: 82,
    predictedOccupancy: 89,
    predictionMinutes: 15,
    platform: 3,
    platformsCount: 15,
    nextTrain: "08:42 PM",
    destination: "Churchgate",
    delayStatus: "On Time",
    delayMinutes: 0,
    isInterchange: true,
    interchangeLines: ["CENTRAL", "WESTERN"],
    cctvSignalConfidence: 97,
    etvmTicketingVelocity: 235,
    utsActiveSessions: 3840,
    deviceDensityIndex: 84,
    platforms: [
      { platformNumber: 1, line: "WESTERN", currentCrowd: "HIGH", occupancyPercentage: 86, nextTrainTime: "08:44 PM", nextTrainDestination: "Borivali Fast", isFastTrainOnly: true },
      { platformNumber: 2, line: "WESTERN", currentCrowd: "MEDIUM", occupancyPercentage: 68, nextTrainTime: "08:48 PM", nextTrainDestination: "Bandra Slow" },
      { platformNumber: 3, line: "WESTERN", currentCrowd: "HIGH", occupancyPercentage: 82, nextTrainTime: "08:42 PM", nextTrainDestination: "Churchgate", isFastTrainOnly: false },
      { platformNumber: 4, line: "WESTERN", currentCrowd: "LOW", occupancyPercentage: 42, nextTrainTime: "08:52 PM", nextTrainDestination: "Virar Fast" },
      { platformNumber: 5, line: "CENTRAL", currentCrowd: "CRITICAL", occupancyPercentage: 93, nextTrainTime: "08:43 PM", nextTrainDestination: "Kalyan Fast", isFastTrainOnly: true },
      { platformNumber: 6, line: "CENTRAL", currentCrowd: "HIGH", occupancyPercentage: 79, nextTrainTime: "08:47 PM", nextTrainDestination: "Thane Slow" },
      { platformNumber: 7, line: "CENTRAL", currentCrowd: "MEDIUM", occupancyPercentage: 65, nextTrainTime: "08:51 PM", nextTrainDestination: "CSMT Fast" },
      { platformNumber: 8, line: "CENTRAL", currentCrowd: "MEDIUM", occupancyPercentage: 59, nextTrainTime: "08:56 PM", nextTrainDestination: "Dombivli Slow" }
    ],
    hourlyTrend: [
      { time: "05:00 PM", occupancy: 65, predicted: 68, crowdLevel: "MEDIUM" },
      { time: "06:00 PM", occupancy: 88, predicted: 85, crowdLevel: "HIGH" },
      { time: "07:00 PM", occupancy: 95, predicted: 94, crowdLevel: "CRITICAL" },
      { time: "08:00 PM", occupancy: 82, predicted: 89, crowdLevel: "HIGH" },
      { time: "09:00 PM", occupancy: 70, predicted: 72, crowdLevel: "HIGH" },
      { time: "10:00 PM", occupancy: 48, predicted: 50, crowdLevel: "MEDIUM" },
      { time: "11:00 PM", occupancy: 28, predicted: 30, crowdLevel: "LOW" }
    ]
  },
  {
    id: "matunga-road",
    name: "Matunga Road",
    marathiName: "\u092E\u093E\u091F\u0941\u0902\u0917\u093E \u0930\u094B\u0921",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 19.0275,
    longitude: 72.8454,
    crowdStatus: "LOW",
    currentOccupancy: 42,
    predictedOccupancy: 47,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 2,
    nextTrain: "08:48 PM",
    destination: "Borivali Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 88,
    etvmTicketingVelocity: 38,
    utsActiveSessions: 390,
    deviceDensityIndex: 43
  },
  {
    id: "mahim",
    name: "Mahim",
    marathiName: "\u092E\u093E\u0939\u093F\u092E",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 19.0409,
    longitude: 72.8436,
    crowdStatus: "MEDIUM",
    currentOccupancy: 56,
    predictedOccupancy: 61,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 4,
    nextTrain: "08:51 PM",
    destination: "Andheri Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 91,
    etvmTicketingVelocity: 68,
    utsActiveSessions: 720,
    deviceDensityIndex: 58
  },
  {
    id: "bandra",
    name: "Bandra",
    marathiName: "\u0935\u093E\u0902\u0926\u094D\u0930\u0947",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 19.0544,
    longitude: 72.8407,
    crowdStatus: "HIGH",
    currentOccupancy: 84,
    predictedOccupancy: 88,
    predictionMinutes: 15,
    platform: 4,
    platformsCount: 7,
    nextTrain: "08:46 PM",
    destination: "Virar Fast",
    delayStatus: "Delayed",
    delayMinutes: 2,
    cctvSignalConfidence: 95,
    etvmTicketingVelocity: 180,
    utsActiveSessions: 2600,
    deviceDensityIndex: 85
  },
  {
    id: "khar-road",
    name: "Khar Road",
    marathiName: "\u0916\u093E\u0930 \u0930\u094B\u0921",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 19.0699,
    longitude: 72.8398,
    crowdStatus: "MEDIUM",
    currentOccupancy: 51,
    predictedOccupancy: 54,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 4,
    nextTrain: "08:53 PM",
    destination: "Borivali Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 89,
    etvmTicketingVelocity: 52,
    utsActiveSessions: 610,
    deviceDensityIndex: 52
  },
  {
    id: "santacruz",
    name: "Santacruz",
    marathiName: "\u0938\u093E\u0902\u0924\u093E\u0915\u094D\u0930\u0941\u091D",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 19.0825,
    longitude: 72.8415,
    crowdStatus: "MEDIUM",
    currentOccupancy: 63,
    predictedOccupancy: 67,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 4,
    nextTrain: "08:55 PM",
    destination: "Goregaon Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 92,
    etvmTicketingVelocity: 74,
    utsActiveSessions: 890,
    deviceDensityIndex: 64
  },
  {
    id: "vile-parle",
    name: "Vile Parle",
    marathiName: "\u0935\u093F\u0932\u0947\u092A\u093E\u0930\u094D\u0932\u0947",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 19.0991,
    longitude: 72.8439,
    crowdStatus: "MEDIUM",
    currentOccupancy: 67,
    predictedOccupancy: 73,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 4,
    nextTrain: "08:57 PM",
    destination: "Borivali Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 91,
    etvmTicketingVelocity: 88,
    utsActiveSessions: 1120,
    deviceDensityIndex: 69
  },
  {
    id: "andheri",
    name: "Andheri",
    marathiName: "\u0905\u0902\u0927\u0947\u0930\u0940",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 19.1197,
    longitude: 72.8464,
    crowdStatus: "CRITICAL",
    currentOccupancy: 94,
    predictedOccupancy: 96,
    predictionMinutes: 15,
    platform: 5,
    platformsCount: 9,
    nextTrain: "08:44 PM",
    destination: "Virar Fast",
    delayStatus: "Delayed",
    delayMinutes: 3,
    cctvSignalConfidence: 97,
    etvmTicketingVelocity: 260,
    utsActiveSessions: 4100,
    deviceDensityIndex: 96
  },
  {
    id: "jogeshwari",
    name: "Jogeshwari",
    marathiName: "\u091C\u094B\u0917\u0947\u0936\u094D\u0935\u0930\u0940",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 19.1362,
    longitude: 72.8491,
    crowdStatus: "HIGH",
    currentOccupancy: 71,
    predictedOccupancy: 76,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 4,
    nextTrain: "08:52 PM",
    destination: "Borivali Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 90,
    etvmTicketingVelocity: 92,
    utsActiveSessions: 1250,
    deviceDensityIndex: 73
  },
  {
    id: "ram-mandir",
    name: "Ram Mandir",
    marathiName: "\u0930\u093E\u092E \u092E\u0902\u0926\u093F\u0930",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 19.1517,
    longitude: 72.8499,
    crowdStatus: "LOW",
    currentOccupancy: 39,
    predictedOccupancy: 43,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 4,
    nextTrain: "08:56 PM",
    destination: "Borivali Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 87,
    etvmTicketingVelocity: 42,
    utsActiveSessions: 430,
    deviceDensityIndex: 40
  },
  {
    id: "goregaon",
    name: "Goregaon",
    marathiName: "\u0917\u094B\u0930\u0947\u0917\u093E\u0935",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 19.1643,
    longitude: 72.8496,
    crowdStatus: "HIGH",
    currentOccupancy: 78,
    predictedOccupancy: 82,
    predictionMinutes: 15,
    platform: 3,
    platformsCount: 7,
    nextTrain: "08:49 PM",
    destination: "Churchgate Fast",
    delayStatus: "On Time",
    cctvSignalConfidence: 94,
    etvmTicketingVelocity: 145,
    utsActiveSessions: 1980,
    deviceDensityIndex: 80
  },
  {
    id: "malad",
    name: "Malad",
    marathiName: "\u092E\u093E\u0932\u093E\u0921",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 19.1868,
    longitude: 72.8483,
    crowdStatus: "HIGH",
    currentOccupancy: 75,
    predictedOccupancy: 79,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 4,
    nextTrain: "08:53 PM",
    destination: "Borivali Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 92,
    etvmTicketingVelocity: 130,
    utsActiveSessions: 1720,
    deviceDensityIndex: 77
  },
  {
    id: "kandivali",
    name: "Kandivali",
    marathiName: "\u0915\u093E\u0902\u0926\u093F\u0935\u0932\u0940",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 19.2046,
    longitude: 72.8521,
    crowdStatus: "HIGH",
    currentOccupancy: 79,
    predictedOccupancy: 83,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 4,
    nextTrain: "08:55 PM",
    destination: "Virar Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 93,
    etvmTicketingVelocity: 148,
    utsActiveSessions: 1910,
    deviceDensityIndex: 81
  },
  {
    id: "borivali",
    name: "Borivali",
    marathiName: "\u092C\u094B\u0930\u093F\u0935\u0932\u0940",
    line: "WESTERN",
    lines: ["WESTERN"],
    latitude: 19.2294,
    longitude: 72.8576,
    crowdStatus: "CRITICAL",
    currentOccupancy: 92,
    predictedOccupancy: 95,
    predictionMinutes: 15,
    platform: 4,
    platformsCount: 10,
    nextTrain: "08:45 PM",
    destination: "Churchgate Fast",
    delayStatus: "On Time",
    cctvSignalConfidence: 96,
    etvmTicketingVelocity: 250,
    utsActiveSessions: 3950,
    deviceDensityIndex: 94
  },
  // ===================== CENTRAL LINE =====================
  {
    id: "csmt",
    name: "CSMT",
    marathiName: "\u0938\u0940\u090F\u0938\u090F\u092E\u091F\u0940 (\u091B.\u0936\u093F.\u092E.\u091F.)",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 18.9401,
    longitude: 72.8354,
    crowdStatus: "HIGH",
    currentOccupancy: 81,
    predictedOccupancy: 87,
    predictionMinutes: 15,
    platform: 3,
    platformsCount: 18,
    nextTrain: "08:44 PM",
    destination: "Kalyan Fast",
    delayStatus: "On Time",
    cctvSignalConfidence: 97,
    etvmTicketingVelocity: 210,
    utsActiveSessions: 3200,
    deviceDensityIndex: 83
  },
  {
    id: "masjid",
    name: "Masjid",
    marathiName: "\u092E\u0936\u0940\u0926",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 18.9525,
    longitude: 72.8398,
    crowdStatus: "LOW",
    currentOccupancy: 36,
    predictedOccupancy: 40,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 4,
    nextTrain: "08:49 PM",
    destination: "Thane Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 89,
    etvmTicketingVelocity: 45,
    utsActiveSessions: 480,
    deviceDensityIndex: 38
  },
  {
    id: "sandhurst-road",
    name: "Sandhurst Road",
    marathiName: "\u0938\u0901\u0921\u0939\u0930\u094D\u0938\u094D\u091F \u0930\u094B\u0921",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 18.9612,
    longitude: 72.8419,
    crowdStatus: "LOW",
    currentOccupancy: 39,
    predictedOccupancy: 44,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 4,
    nextTrain: "08:52 PM",
    destination: "Kalyan Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 90,
    etvmTicketingVelocity: 50,
    utsActiveSessions: 520,
    deviceDensityIndex: 41
  },
  {
    id: "byculla",
    name: "Byculla",
    marathiName: "\u092D\u093E\u092F\u0916\u0933\u093E",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 18.9774,
    longitude: 72.8347,
    crowdStatus: "MEDIUM",
    currentOccupancy: 62,
    predictedOccupancy: 67,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 4,
    nextTrain: "08:54 PM",
    destination: "Dombivli Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 91,
    etvmTicketingVelocity: 76,
    utsActiveSessions: 890,
    deviceDensityIndex: 63
  },
  {
    id: "chinchpokli",
    name: "Chinchpokli",
    marathiName: "\u091A\u093F\u0902\u091A\u092A\u094B\u0915\u0933\u0940",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 18.9892,
    longitude: 72.8329,
    crowdStatus: "LOW",
    currentOccupancy: 41,
    predictedOccupancy: 45,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 2,
    nextTrain: "08:56 PM",
    destination: "Thane Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 87,
    etvmTicketingVelocity: 41,
    utsActiveSessions: 420,
    deviceDensityIndex: 42
  },
  {
    id: "currey-road",
    name: "Currey Road",
    marathiName: "\u0915\u0930\u0940 \u0930\u094B\u0921",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 18.9972,
    longitude: 72.8336,
    crowdStatus: "MEDIUM",
    currentOccupancy: 58,
    predictedOccupancy: 63,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 2,
    nextTrain: "08:58 PM",
    destination: "Kalyan Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 90,
    etvmTicketingVelocity: 68,
    utsActiveSessions: 780,
    deviceDensityIndex: 59
  },
  {
    id: "parel",
    name: "Parel",
    marathiName: "\u092A\u0930\u0933",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.0083,
    longitude: 72.8378,
    crowdStatus: "HIGH",
    currentOccupancy: 76,
    predictedOccupancy: 81,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 3,
    nextTrain: "09:00 PM",
    destination: "Titwala Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 93,
    etvmTicketingVelocity: 115,
    utsActiveSessions: 1480,
    deviceDensityIndex: 78
  },
  {
    id: "matunga",
    name: "Matunga",
    marathiName: "\u092E\u093E\u091F\u0941\u0902\u0917\u093E",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.0271,
    longitude: 72.8553,
    crowdStatus: "LOW",
    currentOccupancy: 46,
    predictedOccupancy: 50,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 4,
    nextTrain: "08:50 PM",
    destination: "Thane Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 89,
    etvmTicketingVelocity: 55,
    utsActiveSessions: 610,
    deviceDensityIndex: 47
  },
  {
    id: "sion",
    name: "Sion",
    marathiName: "\u0936\u0940\u0935 (\u0938\u093E\u092F\u0928)",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.0396,
    longitude: 72.8621,
    crowdStatus: "MEDIUM",
    currentOccupancy: 64,
    predictedOccupancy: 69,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 4,
    nextTrain: "08:52 PM",
    destination: "Kalyan Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 91,
    etvmTicketingVelocity: 79,
    utsActiveSessions: 920,
    deviceDensityIndex: 65
  },
  {
    id: "kurla",
    name: "Kurla",
    marathiName: "\u0915\u0941\u0930\u094D\u0932\u093E",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.0664,
    longitude: 72.8797,
    crowdStatus: "CRITICAL",
    currentOccupancy: 95,
    predictedOccupancy: 97,
    predictionMinutes: 15,
    platform: 5,
    platformsCount: 8,
    nextTrain: "08:43 PM",
    destination: "Kasara Fast",
    delayStatus: "Delayed",
    delayMinutes: 5,
    cctvSignalConfidence: 96,
    etvmTicketingVelocity: 280,
    utsActiveSessions: 4400,
    deviceDensityIndex: 97
  },
  {
    id: "vidyavihar",
    name: "Vidyavihar",
    marathiName: "\u0935\u093F\u0926\u094D\u092F\u093E\u0935\u093F\u0939\u093E\u0930",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.0792,
    longitude: 72.8953,
    crowdStatus: "LOW",
    currentOccupancy: 43,
    predictedOccupancy: 46,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 4,
    nextTrain: "08:56 PM",
    destination: "Thane Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 88,
    etvmTicketingVelocity: 48,
    utsActiveSessions: 530,
    deviceDensityIndex: 44
  },
  {
    id: "ghatkopar",
    name: "Ghatkopar",
    marathiName: "\u0918\u093E\u091F\u0915\u094B\u092A\u0930",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.0863,
    longitude: 72.9081,
    crowdStatus: "CRITICAL",
    currentOccupancy: 93,
    predictedOccupancy: 96,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 7,
    nextTrain: "08:46 PM",
    destination: "Badlapur Fast",
    delayStatus: "Delayed",
    delayMinutes: 3,
    cctvSignalConfidence: 96,
    etvmTicketingVelocity: 270,
    utsActiveSessions: 4200,
    deviceDensityIndex: 95
  },
  {
    id: "vikhroli",
    name: "Vikhroli",
    marathiName: "\u0935\u093F\u0915\u094D\u0930\u094B\u0933\u0940",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.1118,
    longitude: 72.9298,
    crowdStatus: "MEDIUM",
    currentOccupancy: 61,
    predictedOccupancy: 66,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 4,
    nextTrain: "08:54 PM",
    destination: "Kalyan Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 91,
    etvmTicketingVelocity: 72,
    utsActiveSessions: 810,
    deviceDensityIndex: 62
  },
  {
    id: "kanjurmarg",
    name: "Kanjurmarg",
    marathiName: "\u0915\u093E\u0902\u091C\u0942\u0930\u092E\u093E\u0930\u094D\u0917",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.1274,
    longitude: 72.9372,
    crowdStatus: "MEDIUM",
    currentOccupancy: 59,
    predictedOccupancy: 63,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 4,
    nextTrain: "08:57 PM",
    destination: "Asangaon Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 90,
    etvmTicketingVelocity: 68,
    utsActiveSessions: 750,
    deviceDensityIndex: 60
  },
  {
    id: "bhandup",
    name: "Bhandup",
    marathiName: "\u092D\u093E\u0902\u0921\u0941\u092A",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.1432,
    longitude: 72.9378,
    crowdStatus: "HIGH",
    currentOccupancy: 73,
    predictedOccupancy: 77,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 4,
    nextTrain: "08:59 PM",
    destination: "Thane Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 92,
    etvmTicketingVelocity: 95,
    utsActiveSessions: 1180,
    deviceDensityIndex: 74
  },
  {
    id: "nahur",
    name: "Nahur",
    marathiName: "\u0928\u093E\u0939\u0942\u0930",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.1578,
    longitude: 72.9431,
    crowdStatus: "LOW",
    currentOccupancy: 38,
    predictedOccupancy: 42,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 2,
    nextTrain: "09:02 PM",
    destination: "Kalyan Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 87,
    etvmTicketingVelocity: 36,
    utsActiveSessions: 390,
    deviceDensityIndex: 39
  },
  {
    id: "mulund",
    name: "Mulund",
    marathiName: "\u092E\u0941\u0932\u0941\u0902\u0921",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.1726,
    longitude: 72.9564,
    crowdStatus: "HIGH",
    currentOccupancy: 77,
    predictedOccupancy: 81,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 4,
    nextTrain: "08:52 PM",
    destination: "CSMT Fast",
    delayStatus: "On Time",
    cctvSignalConfidence: 93,
    etvmTicketingVelocity: 140,
    utsActiveSessions: 1890,
    deviceDensityIndex: 79
  },
  {
    id: "thane",
    name: "Thane",
    marathiName: "\u0920\u093E\u0923\u0947",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.186,
    longitude: 72.9754,
    crowdStatus: "CRITICAL",
    currentOccupancy: 96,
    predictedOccupancy: 98,
    predictionMinutes: 15,
    platform: 5,
    platformsCount: 11,
    nextTrain: "08:41 PM",
    destination: "Karjat Fast",
    delayStatus: "Delayed",
    delayMinutes: 4,
    cctvSignalConfidence: 97,
    etvmTicketingVelocity: 310,
    utsActiveSessions: 4900,
    deviceDensityIndex: 98
  },
  {
    id: "kalwa",
    name: "Kalwa",
    marathiName: "\u0915\u0933\u0935\u093E",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.2001,
    longitude: 72.9942,
    crowdStatus: "HIGH",
    currentOccupancy: 76,
    predictedOccupancy: 80,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 4,
    nextTrain: "08:55 PM",
    destination: "Kalyan Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 91,
    etvmTicketingVelocity: 98,
    utsActiveSessions: 1220,
    deviceDensityIndex: 77
  },
  {
    id: "mumbra",
    name: "Mumbra",
    marathiName: "\u092E\u0941\u0902\u092C\u094D\u0930\u093E",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.1764,
    longitude: 73.0189,
    crowdStatus: "HIGH",
    currentOccupancy: 78,
    predictedOccupancy: 82,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 4,
    nextTrain: "08:58 PM",
    destination: "Dombivli Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 90,
    etvmTicketingVelocity: 110,
    utsActiveSessions: 1350,
    deviceDensityIndex: 80
  },
  {
    id: "diva",
    name: "Diva",
    marathiName: "\u0926\u093F\u0935\u093E",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.1892,
    longitude: 73.0441,
    crowdStatus: "MEDIUM",
    currentOccupancy: 68,
    predictedOccupancy: 73,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 4,
    nextTrain: "09:01 PM",
    destination: "Kalyan Fast",
    delayStatus: "On Time",
    cctvSignalConfidence: 90,
    etvmTicketingVelocity: 85,
    utsActiveSessions: 990,
    deviceDensityIndex: 70
  },
  {
    id: "kopar",
    name: "Kopar",
    marathiName: "\u0915\u094B\u092A\u0930",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.2132,
    longitude: 73.0786,
    crowdStatus: "LOW",
    currentOccupancy: 45,
    predictedOccupancy: 49,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 2,
    nextTrain: "09:05 PM",
    destination: "Kalyan Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 88,
    etvmTicketingVelocity: 42,
    utsActiveSessions: 460,
    deviceDensityIndex: 46
  },
  {
    id: "dombivli",
    name: "Dombivli",
    marathiName: "\u0921\u094B\u0902\u092C\u093F\u0935\u0932\u0940",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.2184,
    longitude: 73.0867,
    crowdStatus: "CRITICAL",
    currentOccupancy: 94,
    predictedOccupancy: 96,
    predictionMinutes: 15,
    platform: 3,
    platformsCount: 5,
    nextTrain: "08:47 PM",
    destination: "CSMT Fast",
    delayStatus: "Delayed",
    delayMinutes: 2,
    cctvSignalConfidence: 96,
    etvmTicketingVelocity: 265,
    utsActiveSessions: 3950,
    deviceDensityIndex: 95
  },
  {
    id: "thakurli",
    name: "Thakurli",
    marathiName: "\u0920\u093E\u0915\u0941\u0930\u094D\u0932\u0940",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.2272,
    longitude: 73.1091,
    crowdStatus: "LOW",
    currentOccupancy: 41,
    predictedOccupancy: 45,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 2,
    nextTrain: "09:08 PM",
    destination: "Kalyan Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 87,
    etvmTicketingVelocity: 39,
    utsActiveSessions: 410,
    deviceDensityIndex: 42
  },
  {
    id: "kalyan",
    name: "Kalyan",
    marathiName: "\u0915\u0932\u094D\u092F\u093E\u0923",
    line: "CENTRAL",
    lines: ["CENTRAL"],
    latitude: 19.2364,
    longitude: 73.1305,
    crowdStatus: "CRITICAL",
    currentOccupancy: 93,
    predictedOccupancy: 95,
    predictionMinutes: 15,
    platform: 4,
    platformsCount: 8,
    nextTrain: "08:45 PM",
    destination: "CSMT AC Fast",
    delayStatus: "On Time",
    cctvSignalConfidence: 97,
    etvmTicketingVelocity: 290,
    utsActiveSessions: 4300,
    deviceDensityIndex: 94
  },
  // ===================== HARBOUR LINE =====================
  {
    id: "wadala-road",
    name: "Wadala Road",
    marathiName: "\u0935\u0921\u093E\u0933\u093E \u0930\u094B\u0921",
    line: "HARBOUR",
    lines: ["HARBOUR"],
    latitude: 19.0163,
    longitude: 72.8587,
    crowdStatus: "HIGH",
    currentOccupancy: 78,
    predictedOccupancy: 85,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 4,
    nextTrain: "08:48 PM",
    destination: "Panvel Slow",
    delayStatus: "On Time",
    isInterchange: true,
    interchangeLines: ["HARBOUR"],
    cctvSignalConfidence: 93,
    etvmTicketingVelocity: 110,
    utsActiveSessions: 1650,
    deviceDensityIndex: 79
  },
  {
    id: "gtb-nagar",
    name: "GTB Nagar",
    marathiName: "\u091C\u0940.\u091F\u0940.\u092C\u0940. \u0928\u0917\u0930",
    line: "HARBOUR",
    lines: ["HARBOUR"],
    latitude: 19.0375,
    longitude: 72.8654,
    crowdStatus: "LOW",
    currentOccupancy: 42,
    predictedOccupancy: 46,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 2,
    nextTrain: "08:51 PM",
    destination: "Belapur Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 89,
    etvmTicketingVelocity: 44,
    utsActiveSessions: 490,
    deviceDensityIndex: 43
  },
  {
    id: "chunabhatti",
    name: "Chunabhatti",
    marathiName: "\u091A\u0941\u0928\u093E\u092D\u091F\u094D\u091F\u0940",
    line: "HARBOUR",
    lines: ["HARBOUR"],
    latitude: 19.052,
    longitude: 72.8735,
    crowdStatus: "MEDIUM",
    currentOccupancy: 54,
    predictedOccupancy: 59,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 2,
    nextTrain: "08:54 PM",
    destination: "Panvel Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 88,
    etvmTicketingVelocity: 58,
    utsActiveSessions: 620,
    deviceDensityIndex: 55
  },
  {
    id: "tilak-nagar",
    name: "Tilak Nagar",
    marathiName: "\u091F\u093F\u0933\u0915 \u0928\u0917\u0930",
    line: "HARBOUR",
    lines: ["HARBOUR"],
    latitude: 19.0682,
    longitude: 72.8943,
    crowdStatus: "LOW",
    currentOccupancy: 46,
    predictedOccupancy: 51,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 2,
    nextTrain: "08:56 PM",
    destination: "Vashi Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 90,
    etvmTicketingVelocity: 50,
    utsActiveSessions: 540,
    deviceDensityIndex: 47
  },
  {
    id: "chembur",
    name: "Chembur",
    marathiName: "\u091A\u0947\u0902\u092C\u0930",
    line: "HARBOUR",
    lines: ["HARBOUR"],
    latitude: 19.0624,
    longitude: 72.9031,
    crowdStatus: "HIGH",
    currentOccupancy: 79,
    predictedOccupancy: 84,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 2,
    nextTrain: "08:52 PM",
    destination: "Panvel Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 94,
    etvmTicketingVelocity: 140,
    utsActiveSessions: 1850,
    deviceDensityIndex: 80
  },
  {
    id: "govandi",
    name: "Govandi",
    marathiName: "\u0917\u094B\u0935\u0902\u0921\u0940",
    line: "HARBOUR",
    lines: ["HARBOUR"],
    latitude: 19.0556,
    longitude: 72.9152,
    crowdStatus: "HIGH",
    currentOccupancy: 76,
    predictedOccupancy: 81,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 2,
    nextTrain: "08:55 PM",
    destination: "Belapur Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 91,
    etvmTicketingVelocity: 125,
    utsActiveSessions: 1520,
    deviceDensityIndex: 77
  },
  {
    id: "mankhurd",
    name: "Mankhurd",
    marathiName: "\u092E\u093E\u0928\u0916\u0941\u0930\u094D\u0926",
    line: "HARBOUR",
    lines: ["HARBOUR"],
    latitude: 19.0494,
    longitude: 72.9324,
    crowdStatus: "MEDIUM",
    currentOccupancy: 68,
    predictedOccupancy: 74,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 3,
    nextTrain: "08:58 PM",
    destination: "Panvel Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 90,
    etvmTicketingVelocity: 95,
    utsActiveSessions: 1100,
    deviceDensityIndex: 70
  },
  {
    id: "vashi",
    name: "Vashi",
    marathiName: "\u0935\u093E\u0936\u0940",
    line: "HARBOUR",
    lines: ["HARBOUR"],
    latitude: 19.0771,
    longitude: 72.9986,
    crowdStatus: "CRITICAL",
    currentOccupancy: 91,
    predictedOccupancy: 94,
    predictionMinutes: 15,
    platform: 3,
    platformsCount: 4,
    nextTrain: "08:46 PM",
    destination: "CSMT Fast",
    delayStatus: "Delayed",
    delayMinutes: 2,
    cctvSignalConfidence: 96,
    etvmTicketingVelocity: 240,
    utsActiveSessions: 3600,
    deviceDensityIndex: 93
  },
  {
    id: "sanpada",
    name: "Sanpada",
    marathiName: "\u0938\u093E\u0928\u092A\u093E\u0921\u093E",
    line: "HARBOUR",
    lines: ["HARBOUR"],
    latitude: 19.0673,
    longitude: 73.0089,
    crowdStatus: "LOW",
    currentOccupancy: 44,
    predictedOccupancy: 48,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 4,
    nextTrain: "09:02 PM",
    destination: "Panvel Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 89,
    etvmTicketingVelocity: 48,
    utsActiveSessions: 520,
    deviceDensityIndex: 45
  },
  {
    id: "juinagar",
    name: "Juinagar",
    marathiName: "\u091C\u0941\u0908\u0928\u0917\u0930",
    line: "HARBOUR",
    lines: ["HARBOUR"],
    latitude: 19.0559,
    longitude: 73.0187,
    crowdStatus: "MEDIUM",
    currentOccupancy: 56,
    predictedOccupancy: 61,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 4,
    nextTrain: "09:05 PM",
    destination: "Belapur Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 90,
    etvmTicketingVelocity: 66,
    utsActiveSessions: 740,
    deviceDensityIndex: 58
  },
  {
    id: "nerul",
    name: "Nerul",
    marathiName: "\u0928\u0947\u0930\u0942\u0933",
    line: "HARBOUR",
    lines: ["HARBOUR"],
    latitude: 19.033,
    longitude: 73.0176,
    crowdStatus: "HIGH",
    currentOccupancy: 81,
    predictedOccupancy: 86,
    predictionMinutes: 15,
    platform: 3,
    platformsCount: 6,
    nextTrain: "08:50 PM",
    destination: "Panvel Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 94,
    etvmTicketingVelocity: 160,
    utsActiveSessions: 2100,
    deviceDensityIndex: 82
  },
  {
    id: "seawoods-darave",
    name: "Seawoods - Darave",
    marathiName: "\u0938\u0940\u0935\u0942\u0921\u094D\u0938 - \u0926\u093E\u0930\u093E\u0935\u0947",
    line: "HARBOUR",
    lines: ["HARBOUR"],
    latitude: 19.0205,
    longitude: 73.0197,
    crowdStatus: "MEDIUM",
    currentOccupancy: 65,
    predictedOccupancy: 70,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 4,
    nextTrain: "08:54 PM",
    destination: "Panvel Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 92,
    etvmTicketingVelocity: 85,
    utsActiveSessions: 980,
    deviceDensityIndex: 66
  },
  {
    id: "cbd-belapur",
    name: "Belapur (CBD)",
    marathiName: "\u0938\u0940.\u092C\u0940.\u0921\u0940. \u092C\u0947\u0932\u093E\u092A\u0942\u0930",
    line: "HARBOUR",
    lines: ["HARBOUR"],
    latitude: 19.0189,
    longitude: 73.0389,
    crowdStatus: "HIGH",
    currentOccupancy: 83,
    predictedOccupancy: 88,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 4,
    nextTrain: "08:49 PM",
    destination: "CSMT Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 95,
    etvmTicketingVelocity: 175,
    utsActiveSessions: 2300,
    deviceDensityIndex: 84
  },
  {
    id: "kharghar",
    name: "Kharghar",
    marathiName: "\u0916\u093E\u0930\u0918\u0930",
    line: "HARBOUR",
    lines: ["HARBOUR"],
    latitude: 19.0271,
    longitude: 73.0687,
    crowdStatus: "HIGH",
    currentOccupancy: 77,
    predictedOccupancy: 82,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 4,
    nextTrain: "08:56 PM",
    destination: "Panvel Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 93,
    etvmTicketingVelocity: 135,
    utsActiveSessions: 1780,
    deviceDensityIndex: 78
  },
  {
    id: "mansarovar",
    name: "Mansarovar",
    marathiName: "\u092E\u093E\u0928\u0938\u0930\u094B\u0935\u0930",
    line: "HARBOUR",
    lines: ["HARBOUR"],
    latitude: 19.0142,
    longitude: 73.0898,
    crowdStatus: "LOW",
    currentOccupancy: 41,
    predictedOccupancy: 45,
    predictionMinutes: 15,
    platform: 1,
    platformsCount: 2,
    nextTrain: "09:03 PM",
    destination: "Panvel Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 88,
    etvmTicketingVelocity: 38,
    utsActiveSessions: 420,
    deviceDensityIndex: 42
  },
  {
    id: "khandeshwar",
    name: "Khandeshwar",
    marathiName: "\u0916\u093E\u0902\u0926\u0947\u0936\u094D\u0935\u0930",
    line: "HARBOUR",
    lines: ["HARBOUR"],
    latitude: 18.9984,
    longitude: 73.1032,
    crowdStatus: "LOW",
    currentOccupancy: 43,
    predictedOccupancy: 47,
    predictionMinutes: 15,
    platform: 2,
    platformsCount: 2,
    nextTrain: "09:07 PM",
    destination: "Panvel Slow",
    delayStatus: "On Time",
    cctvSignalConfidence: 89,
    etvmTicketingVelocity: 40,
    utsActiveSessions: 460,
    deviceDensityIndex: 44
  },
  {
    id: "panvel",
    name: "Panvel",
    marathiName: "\u092A\u0928\u0935\u0947\u0932",
    line: "HARBOUR",
    lines: ["HARBOUR"],
    latitude: 18.9894,
    longitude: 73.1218,
    crowdStatus: "CRITICAL",
    currentOccupancy: 92,
    predictedOccupancy: 95,
    predictionMinutes: 15,
    platform: 4,
    platformsCount: 7,
    nextTrain: "08:44 PM",
    destination: "CSMT Fast",
    delayStatus: "On Time",
    cctvSignalConfidence: 96,
    etvmTicketingVelocity: 260,
    utsActiveSessions: 3900,
    deviceDensityIndex: 94
  }
];
var MOCK_ALERTS = [
  {
    id: "ALT-101",
    stationId: "kurla",
    stationName: "Kurla Junction",
    line: "CENTRAL",
    severity: "critical",
    title: "Surge Alert: Platform 5 Overflowing",
    description: "Rapid ingress of passengers detected via UTS surge and CCTV density signal. Exceeds 95% capacity.",
    timestamp: "2 mins ago",
    resolved: false,
    actionRecommended: "Deploy crowd marshals to FOB 2 and hold trailing slow local at Sion."
  },
  {
    id: "ALT-102",
    stationId: "andheri",
    stationName: "Andheri",
    line: "WESTERN",
    severity: "critical",
    title: "High Congestion: Metro Interchange FOB",
    description: "Elevated device-density signal and camera footfall index at East-West skywalk link.",
    timestamp: "6 mins ago",
    resolved: false,
    actionRecommended: "Regulate turnstiles at North concourse."
  },
  {
    id: "ALT-103",
    stationId: "thane",
    stationName: "Thane",
    line: "CENTRAL",
    severity: "warning",
    title: "Platform 5 Ingress Spike",
    description: "3 consecutive fast trains delayed by 4 minutes, causing platform dwell accumulation.",
    timestamp: "12 mins ago",
    resolved: false,
    actionRecommended: "Broadcast audio announcements for Trans-Harbour alternate routes."
  },
  {
    id: "ALT-104",
    stationId: "lower-parel",
    stationName: "Lower Parel",
    line: "WESTERN",
    severity: "warning",
    title: "Corporate Evening Egress Peak",
    description: "ETVM counter queue time increased to 4.2 mins at South booking office.",
    timestamp: "18 mins ago",
    resolved: false,
    actionRecommended: "Activate extra automatic ticket vending assistance."
  },
  {
    id: "ALT-105",
    stationId: "dadar",
    stationName: "Dadar Interchange",
    line: "INTERCHANGE",
    severity: "info",
    title: "Smooth Crowd Transition at Middle FOB",
    description: "Crowd management marshals active. Central to Western footfall transit within normal range.",
    timestamp: "25 mins ago",
    resolved: true
  }
];
var MOCK_NETWORK_STATS = {
  totalStationsMonitored: 62,
  activeTrains: 174,
  averageOccupancy: 72,
  criticalStationsCount: 8,
  highCrowdStationsCount: 16,
  moderateStationsCount: 20,
  normalStationsCount: 18,
  systemHealth: "Heavy Traffic",
  lastSignalSync: "Live (Updated 4s ago)"
};
var MOCK_DADAR_PREDICTION = {
  stationId: "dadar",
  stationName: "Dadar Interchange",
  line: "INTERCHANGE",
  timestamp: "08:42 PM",
  targetMinutes: 15,
  predictedCrowd: "HIGH",
  predictedOccupancy: 89,
  confidenceScore: 94.2,
  trend: "rising",
  contributingFactors: [
    {
      factor: "CCTV Optical Density Flow",
      impact: "high",
      description: "Concourse & FOB camera optical flow rate increased by 22% in the last 10 minutes."
    },
    {
      factor: "UTS Digital Ticketing Velocity",
      impact: "high",
      description: "3,840 active mobile UTS app sessions within 500m geofence radius."
    },
    {
      factor: "ETVM Counter Pressure",
      impact: "medium",
      description: "235 physical tickets dispensed per minute across 18 automated kiosks."
    },
    {
      factor: "Experimental Anonymous Device-Density Signal",
      impact: "medium",
      description: "Supporting ambient RF/device density index reading 84/100 (non-individualized metric)."
    }
  ]
};
var MOCK_ACCURACY_EVALUATIONS = [
  { time: "07:30 PM", actualOccupancy: 64, predictedOccupancy: 68, difference: 4, classification: "Overprediction", stationName: "Dadar" },
  { time: "07:45 PM", actualOccupancy: 72, predictedOccupancy: 75, difference: 3, classification: "Overprediction", stationName: "Dadar" },
  { time: "08:00 PM", actualOccupancy: 81, predictedOccupancy: 78, difference: -3, classification: "Underprediction", stationName: "Dadar" },
  { time: "08:15 PM", actualOccupancy: 85, predictedOccupancy: 88, difference: 3, classification: "Overprediction", stationName: "Dadar" },
  { time: "08:30 PM", actualOccupancy: 82, predictedOccupancy: 82, difference: 0, classification: "Exact Match", stationName: "Dadar" },
  { time: "08:45 PM", actualOccupancy: 76, predictedOccupancy: 82, difference: 6, classification: "Overprediction", stationName: "Dadar" }
];
var MOCK_MODEL_STATS = {
  overallAccuracy: 94.2,
  // percentage
  meanAbsoluteError: 3.2,
  // percentage points
  overpredictionRate: 8.4,
  // % of instances
  underpredictionRate: 5.6,
  // % of instances
  sampleSize: "18,400+ train-station arrivals",
  modelRefreshRate: "30 seconds rolling"
};
var MOCK_DATA_SIGNALS_INFO = [
  {
    id: "cctv",
    title: "CCTV Optical Flow",
    subtitle: "Edge Vision / Head Counting",
    status: "Active",
    uptime: "99.8%",
    sampleRate: "1.2s intervals",
    confidenceWeight: "38%",
    description: "Real-time footfall density tracking on platforms and Foot Overbridges without storing biometric facial data."
  },
  {
    id: "etm_uts",
    title: "ETM / UTS Ticketing",
    subtitle: "ATVM & Digital Geo-Ticketing",
    status: "Active",
    uptime: "99.9%",
    sampleRate: "Live Stream",
    confidenceWeight: "32%",
    description: "Transaction velocity from physical ticketing kiosks and geofenced UTS mobile ticket bookings 10-20 min in advance."
  },
  {
    id: "historical",
    title: "Historical Passenger Data",
    subtitle: "Time-of-day & Day Patterns",
    status: "Active",
    uptime: "100%",
    sampleRate: "Hourly Baseline",
    confidenceWeight: "14%",
    description: "Trained baseline regression of typical peak vs non-peak crowd curves across all 45 suburban stations."
  },
  {
    id: "schedule",
    title: "Train Schedule & Delays",
    subtitle: "Live Telemetry & Frequency",
    status: "Active",
    uptime: "99.4%",
    sampleRate: "Real-time GPS",
    confidenceWeight: "10%",
    description: "Signals from railway signaling blocks detecting delayed or bunched locals which cause platform crowd dwell."
  },
  {
    id: "device_density",
    title: "Device Density Signal",
    subtitle: "Aggregated Ambient RF",
    status: "Experimental",
    uptime: "98.5%",
    sampleRate: "3.0s intervals",
    confidenceWeight: "6%",
    description: "Experimental anonymous device-density metric used as a non-individualized supporting indicator in low-visibility zones."
  }
];
var getMumbaiNextTrainTime = (offsetMinutes = 3) => {
  const targetDate = new Date(Date.now() + Math.max(1, offsetMinutes) * 60 * 1e3);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(targetDate);
};
var getStationTrainOffset = (stationId, platformNum = 1) => {
  let hash = 0;
  for (let i = 0; i < stationId.length; i++) {
    hash = hash * 31 + stationId.charCodeAt(i) & 4294967295;
  }
  const baseOffset = Math.abs(hash) % 5 + 2;
  return baseOffset + (platformNum > 1 ? (platformNum - 1) * 2 : 0);
};
MOCK_STATIONS.forEach((station) => {
  const stationOffset = getStationTrainOffset(station.id, station.platform || 1);
  Object.defineProperty(station, "nextTrain", {
    get() {
      return getMumbaiNextTrainTime(stationOffset);
    },
    enumerable: true,
    configurable: true
  });
  if (station.platforms) {
    station.platforms.forEach((p) => {
      const platOffset = getStationTrainOffset(station.id, p.platformNumber);
      Object.defineProperty(p, "nextTrainTime", {
        get() {
          return getMumbaiNextTrainTime(platOffset);
        },
        enumerable: true,
        configurable: true
      });
    });
  }
});

// src/server/railwayEngine.ts
var TIMEZONE = "Asia/Kolkata";
function getMumbaiTimeParts(date = /* @__PURE__ */ new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false
  });
  const parts = formatter.formatToParts(date);
  const partMap = {};
  parts.forEach((p) => {
    if (p.type !== "literal") {
      partMap[p.type] = parseInt(p.value, 10);
    }
  });
  const hours = partMap.hour === 24 ? 0 : partMap.hour ?? 0;
  const minutes = partMap.minute ?? 0;
  const seconds = partMap.second ?? 0;
  const totalMinutesInDay = hours * 60 + minutes;
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(date);
  return {
    year: partMap.year ?? 2026,
    month: partMap.month ?? 1,
    day: partMap.day ?? 1,
    hours,
    minutes,
    seconds,
    totalMinutesInDay,
    formattedTime
  };
}
function formatMinutesToTimeString(totalMinutes) {
  const normalized = (Math.floor(totalMinutes) % 1440 + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h >= 12 ? "PM" : "AM";
  const padH = String(hour12).padStart(2, "0");
  const padM = String(m).padStart(2, "0");
  return `${padH}:${padM} ${ampm}`;
}
function getStationFrequency(stationId, line, totalMinutes) {
  const isMorningPeak = totalMinutes >= 480 && totalMinutes <= 690;
  const isEveningPeak = totalMinutes >= 1020 && totalMinutes <= 1290;
  const isLateNight = totalMinutes >= 1410 || totalMinutes < 240;
  const majorHubs = ["churchgate", "dadar", "andheri", "borivali", "csmt", "kurla", "thane", "kalyan", "vashi", "panvel"];
  const isMajor = majorHubs.includes(stationId.toLowerCase());
  if (isLateNight) {
    return isMajor ? 15 : 22;
  }
  if (isMorningPeak || isEveningPeak) {
    return isMajor ? 3 : 5;
  }
  return isMajor ? 5 : 8;
}
function getStationSeed(stationId, platformNum = 1) {
  let hash = 0;
  for (let i = 0; i < stationId.length; i++) {
    hash = hash * 31 + stationId.charCodeAt(i) & 4294967295;
  }
  return Math.abs(hash) % 7 + platformNum * 2;
}
function getNextTrainDeparture(stationId, platformNum = 1, line = "WESTERN", refDate = /* @__PURE__ */ new Date()) {
  const timeInfo = getMumbaiTimeParts(refDate);
  const currentTotalMins = timeInfo.totalMinutesInDay;
  const seed = getStationSeed(stationId, platformNum);
  let earliestFutureMinute;
  let minutesUntil;
  if (currentTotalMins >= 105 && currentTotalMins < 240) {
    const morningStart = 240 + seed % 15;
    earliestFutureMinute = morningStart;
    minutesUntil = morningStart - currentTotalMins;
  } else {
    const freq = getStationFrequency(stationId, line, currentTotalMins);
    const offset = seed % freq;
    let nextSlot = Math.floor(currentTotalMins / freq) * freq + offset;
    while (nextSlot <= currentTotalMins + 1) {
      nextSlot += freq;
    }
    const slotMod = nextSlot % 1440;
    if (slotMod >= 105 && slotMod < 240) {
      nextSlot = 240 + seed % 15;
      minutesUntil = nextSlot > currentTotalMins ? nextSlot - currentTotalMins : 1440 - currentTotalMins + nextSlot;
      earliestFutureMinute = nextSlot % 1440;
    } else {
      earliestFutureMinute = slotMod;
      minutesUntil = nextSlot - currentTotalMins;
    }
  }
  let destination = "Borivali Fast";
  let isFast = platformNum === 1 || platformNum === 3 || platformNum === 5;
  if (line === "WESTERN") {
    const destinations = ["Churchgate Fast", "Borivali Fast", "Virar Semi-Fast", "Bandra Slow", "Andheri Slow", "Goregaon AC"];
    destination = destinations[(seed + platformNum) % destinations.length];
  } else if (line === "CENTRAL") {
    const destinations = ["CSMT Fast", "Kalyan Fast", "Thane Slow", "Dombivli Fast", "Kasara Semi-Fast", "Kurla Slow"];
    destination = destinations[(seed + platformNum) % destinations.length];
  } else if (line === "HARBOUR") {
    const destinations = ["Panvel Fast", "CSMT Slow", "Belapur Slow", "Vashi Slow", "Bandra Harbour"];
    destination = destinations[(seed + platformNum) % destinations.length];
  }
  return {
    departureTime: formatMinutesToTimeString(earliestFutureMinute),
    minutesUntil: Math.max(1, Math.round(minutesUntil)),
    destination,
    isFast
  };
}
function getSimulatedStationMetrics(baseStation, refDate = /* @__PURE__ */ new Date()) {
  const timeInfo = getMumbaiTimeParts(refDate);
  const totalMins = timeInfo.totalMinutesInDay;
  const seed = getStationSeed(baseStation.id);
  const fiveMinBucket = Math.floor(totalMins / 5);
  const microDelta = (fiveMinBucket * 7 + seed * 13) % 9 - 4;
  let baseOccupancy = 45;
  if (totalMins >= 480 && totalMins <= 690) {
    const peakProgress = Math.sin((totalMins - 480) / 210 * Math.PI);
    baseOccupancy = 68 + Math.round(peakProgress * 24);
  } else if (totalMins > 690 && totalMins < 1020) {
    baseOccupancy = 48 + seed % 14;
  } else if (totalMins >= 1020 && totalMins <= 1290) {
    const peakProgress = Math.sin((totalMins - 1020) / 270 * Math.PI);
    baseOccupancy = 72 + Math.round(peakProgress * 24);
  } else if (totalMins > 1290 || totalMins < 90) {
    baseOccupancy = 35 + seed % 15;
  } else {
    baseOccupancy = 18 + seed % 10;
  }
  const majorHubs = ["dadar", "andheri", "kurla", "thane", "kalyan", "borivali", "csmt", "churchgate", "vashi"];
  if (majorHubs.includes(baseStation.id.toLowerCase())) {
    baseOccupancy = Math.min(98, Math.round(baseOccupancy * 1.12));
  }
  const currentOccupancy = Math.max(15, Math.min(98, baseOccupancy + microDelta));
  const isRising = totalMins >= 450 && totalMins < 570 || totalMins >= 990 && totalMins < 1140;
  const surgeFactor = isRising ? 3 + seed % 5 : totalMins > 690 && totalMins < 800 ? -3 : seed % 4;
  const predictedOccupancy = Math.max(15, Math.min(99, currentOccupancy + surgeFactor));
  let crowdStatus = "LOW";
  if (currentOccupancy >= 85) crowdStatus = "CRITICAL";
  else if (currentOccupancy >= 70) crowdStatus = "HIGH";
  else if (currentOccupancy >= 50) crowdStatus = "MEDIUM";
  const primaryPlatform = baseStation.platform || 1;
  const nextDeparture = getNextTrainDeparture(baseStation.id, primaryPlatform, baseStation.line, refDate);
  const platformCount = baseStation.platformsCount || 4;
  const platforms = [];
  for (let p = 1; p <= platformCount; p++) {
    const pDeparture = getNextTrainDeparture(baseStation.id, p, baseStation.line, refDate);
    const pOccupancy = Math.max(20, Math.min(99, currentOccupancy + (p % 2 === 0 ? -1 : 1) * (p * 3)));
    let pCrowd = "LOW";
    if (pOccupancy >= 85) pCrowd = "CRITICAL";
    else if (pOccupancy >= 70) pCrowd = "HIGH";
    else if (pOccupancy >= 50) pCrowd = "MEDIUM";
    platforms.push({
      platformNumber: p,
      line: baseStation.line,
      currentCrowd: pCrowd,
      occupancyPercentage: pOccupancy,
      nextTrainTime: pDeparture.departureTime,
      nextTrainDestination: pDeparture.destination,
      isFastTrainOnly: pDeparture.isFast
    });
  }
  const cctvSignalConfidence = Math.min(99, 90 + currentOccupancy % 9);
  const etvmTicketingVelocity = Math.round(currentOccupancy * 2.8 + seed * 3);
  const utsActiveSessions = Math.round(currentOccupancy * 42 + seed * 110);
  const deviceDensityIndex = Math.min(99, Math.round(currentOccupancy * 0.94 + 4));
  const hourlyTrend = [];
  for (let i = 0; i < 6; i++) {
    const futureMins = (totalMins + i * 60) % 1440;
    const fHour = Math.floor(futureMins / 60);
    const ampm = fHour >= 12 ? "PM" : "AM";
    const h12 = fHour === 0 ? 12 : fHour > 12 ? fHour - 12 : fHour;
    const timeLabel = `${String(h12).padStart(2, "0")}:00 ${ampm}`;
    let trendOcc = currentOccupancy;
    if (futureMins >= 480 && futureMins <= 690) trendOcc = 84 + seed % 10;
    else if (futureMins >= 1020 && futureMins <= 1290) trendOcc = 90 + seed % 8;
    else if (futureMins > 1290 || futureMins < 120) trendOcc = 42 + seed % 12;
    else trendOcc = 54 + seed % 12;
    trendOcc = Math.max(20, Math.min(98, trendOcc));
    let tCrowd = "LOW";
    if (trendOcc >= 85) tCrowd = "CRITICAL";
    else if (trendOcc >= 70) tCrowd = "HIGH";
    else if (trendOcc >= 50) tCrowd = "MEDIUM";
    hourlyTrend.push({
      time: timeLabel,
      occupancy: trendOcc,
      predicted: Math.min(99, trendOcc + 3),
      crowdLevel: tCrowd
    });
  }
  return {
    ...baseStation,
    crowdStatus,
    currentOccupancy,
    predictedOccupancy,
    predictionMinutes: 15,
    nextTrain: nextDeparture.departureTime,
    destination: nextDeparture.destination,
    delayStatus: currentOccupancy >= 88 && seed % 2 === 0 ? "Delayed" : "On Time",
    delayMinutes: currentOccupancy >= 88 && seed % 2 === 0 ? 2 + seed % 3 : 0,
    cctvSignalConfidence,
    etvmTicketingVelocity,
    utsActiveSessions,
    deviceDensityIndex,
    platforms,
    hourlyTrend
  };
}
function getAllSimulatedStations(refDate = /* @__PURE__ */ new Date()) {
  return MOCK_STATIONS.map((base) => getSimulatedStationMetrics(base, refDate));
}
function getActiveTrains(refDate = /* @__PURE__ */ new Date()) {
  const timeInfo = getMumbaiTimeParts(refDate);
  const totalMins = timeInfo.totalMinutesInDay;
  const trains = [
    {
      id: "TR-9042",
      trainNumber: "90428",
      trainName: "Churchgate Fast Local",
      line: "WESTERN",
      source: "Borivali",
      destination: "Churchgate",
      currentStation: "Dadar",
      nextStation: "Mumbai Central",
      eta: formatMinutesToTimeString(totalMins + 3),
      delayMinutes: 0,
      delayStatus: "On Time",
      platform: 3,
      crowdLevel: "HIGH",
      occupancyPercentage: 84,
      speedKmH: 64,
      isFast: true,
      coaches: 15
    },
    {
      id: "TR-9521",
      trainNumber: "95214",
      trainName: "Kalyan Fast Local",
      line: "CENTRAL",
      source: "CSMT",
      destination: "Kalyan",
      currentStation: "Dadar",
      nextStation: "Kurla",
      eta: formatMinutesToTimeString(totalMins + 4),
      delayMinutes: 0,
      delayStatus: "On Time",
      platform: 5,
      crowdLevel: "CRITICAL",
      occupancyPercentage: 94,
      speedKmH: 58,
      isFast: true,
      coaches: 12
    },
    {
      id: "TR-9118",
      trainNumber: "91182",
      trainName: "Virar Semi-Fast AC",
      line: "WESTERN",
      source: "Churchgate",
      destination: "Virar",
      currentStation: "Bandra",
      nextStation: "Andheri",
      eta: formatMinutesToTimeString(totalMins + 6),
      delayMinutes: 2,
      delayStatus: "Delayed",
      platform: 4,
      crowdLevel: "HIGH",
      occupancyPercentage: 88,
      speedKmH: 72,
      isFast: true,
      coaches: 15,
      acLocal: true
    },
    {
      id: "TR-9630",
      trainNumber: "96305",
      trainName: "Thane Slow Local",
      line: "CENTRAL",
      source: "CSMT",
      destination: "Thane",
      currentStation: "Byculla",
      nextStation: "Chinchpokli",
      eta: formatMinutesToTimeString(totalMins + 5),
      delayMinutes: 0,
      delayStatus: "On Time",
      platform: 1,
      crowdLevel: "MEDIUM",
      occupancyPercentage: 62,
      speedKmH: 45,
      isFast: false,
      coaches: 12
    },
    {
      id: "TR-9204",
      trainNumber: "92044",
      trainName: "Borivali Slow Local",
      line: "WESTERN",
      source: "Churchgate",
      destination: "Borivali",
      currentStation: "Marine Lines",
      nextStation: "Charni Road",
      eta: formatMinutesToTimeString(totalMins + 7),
      delayMinutes: 0,
      delayStatus: "On Time",
      platform: 2,
      crowdLevel: "LOW",
      occupancyPercentage: 44,
      speedKmH: 40,
      isFast: false,
      coaches: 12
    },
    {
      id: "TR-9812",
      trainNumber: "98120",
      trainName: "Panvel Harbour Fast",
      line: "HARBOUR",
      source: "CSMT",
      destination: "Panvel",
      currentStation: "Vashi",
      nextStation: "Belapur (CBD)",
      eta: formatMinutesToTimeString(totalMins + 5),
      delayMinutes: 0,
      delayStatus: "On Time",
      platform: 3,
      crowdLevel: "CRITICAL",
      occupancyPercentage: 91,
      speedKmH: 62,
      isFast: true,
      coaches: 12
    },
    {
      id: "TR-9705",
      trainNumber: "97056",
      trainName: "Belapur Slow Local",
      line: "HARBOUR",
      source: "CSMT",
      destination: "Belapur",
      currentStation: "Kurla",
      nextStation: "Tilak Nagar",
      eta: formatMinutesToTimeString(totalMins + 4),
      delayMinutes: 0,
      delayStatus: "On Time",
      platform: 7,
      crowdLevel: "HIGH",
      occupancyPercentage: 78,
      speedKmH: 48,
      isFast: false,
      coaches: 12
    },
    {
      id: "TR-9433",
      trainNumber: "94331",
      trainName: "CSMT AC Fast Local",
      line: "CENTRAL",
      source: "Kalyan",
      destination: "CSMT",
      currentStation: "Ghatkopar",
      nextStation: "Kurla",
      eta: formatMinutesToTimeString(totalMins + 6),
      delayMinutes: 1,
      delayStatus: "Delayed",
      platform: 4,
      crowdLevel: "HIGH",
      occupancyPercentage: 86,
      speedKmH: 68,
      isFast: true,
      coaches: 15,
      acLocal: true
    }
  ];
  return trains;
}
function getDynamicRecommendations(stations, refDate = /* @__PURE__ */ new Date()) {
  const timeInfo = getMumbaiTimeParts(refDate);
  const recs = [];
  const criticalStations = stations.filter((s) => s.currentOccupancy >= 85 || s.predictedOccupancy >= 85);
  const highStations = stations.filter((s) => s.currentOccupancy >= 70 && s.currentOccupancy < 85);
  let recIndex = 1;
  criticalStations.slice(0, 3).forEach((stn) => {
    if (stn.id === "dadar" || stn.isInterchange) {
      recs.push({
        id: `REC-${String(recIndex++).padStart(3, "0")}`,
        stationId: stn.id,
        stationName: stn.name,
        platformNumber: stn.platform || 1,
        priority: "HIGH",
        category: "MARSHALLING",
        title: `Deploy RPF Crowd Marshals at ${stn.name} Middle FOB`,
        actionRequired: `Station Master to reposition 4 Railway Protection Force personnel to regulate pedestrian interchange transit from PF 1 to PF 6.`,
        rationale: `FOB bottleneck optical flow exceeded 1.8 persons/sqm threshold with ${stn.predictedOccupancy}% predicted surge in 15 minutes.`,
        estimatedCrowdRelief: `-22% localized staircase congestion within 8 minutes`,
        generatedAt: timeInfo.formattedTime
      });
    } else if (stn.id === "kurla" || stn.id === "vashi") {
      recs.push({
        id: `REC-${String(recIndex++).padStart(3, "0")}`,
        stationId: stn.id,
        stationName: stn.name,
        platformNumber: stn.platform || 7,
        priority: "HIGH",
        category: "HOLDING_AREA",
        title: `Activate East Booking Hall Auxiliary Holding Enclosure at ${stn.name}`,
        actionRequired: `Open North-East holding bay gates to stage passengers safely before entering platform stairs.`,
        rationale: `UTS digital ticket bookings spiked by 34% with live occupancy reaching ${stn.currentOccupancy}%.`,
        estimatedCrowdRelief: `-18% platform edge crowding during 15-minute peak window`,
        generatedAt: timeInfo.formattedTime
      });
    } else {
      recs.push({
        id: `REC-${String(recIndex++).padStart(3, "0")}`,
        stationId: stn.id,
        stationName: stn.name,
        platformNumber: stn.platform || 2,
        priority: "HIGH",
        category: "TRAIN_INDUCTION",
        title: `Request OCC for 15-Car Rake Staging at ${stn.name}`,
        actionRequired: `Dispatcher advisory: Advance scheduled empty rake from car shed to absorb platform surge.`,
        rationale: `Live occupancy reached ${stn.currentOccupancy}% with platform dwell times stretching to 45 seconds.`,
        estimatedCrowdRelief: `-35% platform clearance immediately upon rake arrival`,
        generatedAt: timeInfo.formattedTime
      });
    }
  });
  highStations.slice(0, 2).forEach((stn) => {
    recs.push({
      id: `REC-${String(recIndex++).padStart(3, "0")}`,
      stationId: stn.id,
      stationName: stn.name,
      platformNumber: stn.platform || 3,
      priority: "MEDIUM",
      category: "ANNOUNCEMENT",
      title: `Broadcast Coach Equalization Advisory at ${stn.name}`,
      actionRequired: `Trigger automated bilingual audio announcements advising passengers that middle/rear coaches have lower occupancy.`,
      rationale: `CCTV cameras detect optical density of ${stn.currentOccupancy}% localized around front motorman coach.`,
      estimatedCrowdRelief: `Equalizes coach distribution evenly across formation`,
      generatedAt: timeInfo.formattedTime
    });
  });
  return recs;
}

// src/server/geminiService.ts
import { GoogleGenAI } from "@google/genai";
var geminiClient = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return geminiClient;
}
async function generateOperationalAdvisory(stations, recommendations, query, targetStationId) {
  const targetStation = targetStationId ? stations.find((s) => s.id.toLowerCase() === targetStationId.toLowerCase()) : null;
  const criticalCount = stations.filter((s) => s.currentOccupancy >= 85).length;
  const highCount = stations.filter((s) => s.currentOccupancy >= 70 && s.currentOccupancy < 85).length;
  const avgOccupancy = Math.round(stations.reduce((acc, s) => acc + s.currentOccupancy, 0) / stations.length);
  const topCongested = [...stations].sort((a, b) => b.currentOccupancy - a.currentOccupancy).slice(0, 5).map((s) => `${s.name} (${s.line}): ${s.currentOccupancy}% occupancy, 15m surge ${s.predictedOccupancy}%, Next: ${s.nextTrain} (${s.destination})`);
  const client = getGeminiClient();
  if (client) {
    try {
      const prompt = `You are RailFlow AI, the real-time operational decision support assistant for Mumbai Suburban Railway Operation Control Centre (OCC).
Based on the following live deterministic ground-truth telemetry facts:
- Network Average Occupancy: ${avgOccupancy}%
- Critical Stations (>=85%): ${criticalCount}
- High Congestion Stations (70-84%): ${highCount}
- Top 5 Congested Stations:
${topCongested.map((s) => `  * ${s}`).join("\n")}
${targetStation ? `- Target Focus Station: ${targetStation.name} (${targetStation.line}) - Current Occupancy: ${targetStation.currentOccupancy}%, 15m Forecast: ${targetStation.predictedOccupancy}%, CCTV Confidence: ${targetStation.cctvSignalConfidence}%, ETVM Velocity: ${targetStation.etvmTicketingVelocity}/min, Delay: ${targetStation.delayStatus}` : ""}
- Active Recommendations:
${recommendations.map((r) => `  * [${r.priority}] ${r.title}: ${r.actionRequired}`).join("\n")}

${query ? `User specific inquiry: "${query}"` : "Provide an executive crowd mitigation synopsis for the OCC controller."}

Respond in strict JSON format matching this schema:
{
  "summary": "Concise 2-sentence executive summary of network crowd dynamics and operational risks",
  "keyInsights": ["3 specific data-driven observations citing actual station numbers"],
  "recommendedActions": ["2-3 concrete operational directives for station masters and motormen"],
  "riskLevel": "LOW" | "MODERATE" | "HIGH" | "CRITICAL"
}`;
      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim());
        return {
          summary: parsed.summary || "Network operational telemetry processed.",
          keyInsights: Array.isArray(parsed.keyInsights) ? parsed.keyInsights : [],
          recommendedActions: Array.isArray(parsed.recommendedActions) ? parsed.recommendedActions : [],
          riskLevel: parsed.riskLevel || (criticalCount > 0 ? "CRITICAL" : highCount > 2 ? "HIGH" : "MODERATE"),
          source: "GEMINI_AI",
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        };
      }
    } catch (error) {
      console.warn("Gemini AI advisory generation failed, falling back to deterministic engine:", error);
    }
  }
  const riskLevel = criticalCount >= 3 ? "CRITICAL" : criticalCount > 0 || highCount >= 3 ? "HIGH" : avgOccupancy > 60 ? "MODERATE" : "LOW";
  let summary = `Mumbai suburban network operating at ${avgOccupancy}% average capacity with ${criticalCount} critical hubs and ${highCount} high-density sectors under active optical flow surveillance.`;
  if (targetStation) {
    summary = `${targetStation.name} (${targetStation.line}) is at ${targetStation.currentOccupancy}% occupancy (${targetStation.crowdStatus}) with a projected 15-minute surge to ${targetStation.predictedOccupancy}%.`;
  }
  const keyInsights = [
    `Interchange and terminal hubs (${topCongested.slice(0, 2).map((s) => s.split(":")[0]).join(", ")}) account for peak ingress velocity.`,
    `Multi-signal vision confidence maintains an aggregated mean of 94.2% across active concourse feeds.`,
    `${criticalCount > 0 ? "Surge mitigation thresholds active on FOB choke points." : "All passenger corridors flowing within safe dwell allowances."}`
  ];
  const recommendedActions = recommendations.slice(0, 3).map((r) => `${r.title} \u2014 ${r.actionRequired}`);
  if (recommendedActions.length === 0) {
    recommendedActions.push("Maintain regular 3-minute headway dispatch and monitor ticketing velocity at turnstiles.");
  }
  return {
    summary,
    keyInsights,
    recommendedActions,
    riskLevel,
    source: "DETERMINISTIC_ENGINE",
    timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  };
}

// src/server/app.ts
var activeAlerts = MOCK_ALERTS.map((a) => ({ ...a }));
function createExpressApp() {
  const app2 = express();
  app2.use(
    cors({
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
    })
  );
  app2.use(express.json());
  const apiRouter = Router();
  apiRouter.get("/health", (req, res) => {
    const timeInfo = getMumbaiTimeParts();
    res.json({
      status: "ok",
      service: "RailFlow AI Backend Service",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      mumbaiTime: timeInfo.formattedTime,
      version: "1.2.0",
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime()
    });
  });
  apiRouter.get("/network/overview", (req, res) => {
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
  apiRouter.get("/stations", (req, res) => {
    try {
      const { line, search, minOccupancy, limit } = req.query;
      let stations = getAllSimulatedStations();
      if (line && typeof line === "string" && line.toUpperCase() !== "ALL") {
        const lineUpper = line.toUpperCase();
        stations = stations.filter(
          (s) => s.line === lineUpper || s.lines.includes(lineUpper)
        );
      }
      if (search && typeof search === "string" && search.trim()) {
        const q = search.toLowerCase().trim();
        stations = stations.filter(
          (s) => s.name.toLowerCase().includes(q) || s.marathiName && s.marathiName.includes(q) || s.hindiName && s.hindiName.includes(q) || s.line.toLowerCase().includes(q)
        );
      }
      if (minOccupancy && !isNaN(Number(minOccupancy))) {
        const minOcc = Number(minOccupancy);
        stations = stations.filter((s) => s.currentOccupancy >= minOcc);
      }
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
  apiRouter.get("/stations/:id", (req, res) => {
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
  apiRouter.get("/stations/:id/platforms", (req, res) => {
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
  apiRouter.get("/network/heatmap", (req, res) => {
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
        heatWeight: Math.round(s.currentOccupancy / 100 * 10) / 10,
        forecastHeatWeight: Math.round(s.predictedOccupancy / 100 * 10) / 10,
        surgeAlert: s.predictedOccupancy >= 80,
        nextTrain: s.nextTrain,
        platform: s.platform,
        destination: s.destination
      }));
      res.json({
        success: true,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        count: heatmapPoints.length,
        data: heatmapPoints
      });
    } catch (error) {
      console.error("Error in /api/network/heatmap:", error);
      res.status(500).json({ success: false, error: "Failed to generate heatmap dataset" });
    }
  });
  apiRouter.get("/trains", (req, res) => {
    try {
      const { line, search, status } = req.query;
      let trains = getActiveTrains();
      if (line && typeof line === "string" && line.toUpperCase() !== "ALL") {
        trains = trains.filter((t) => t.line === line.toUpperCase());
      }
      if (search && typeof search === "string" && search.trim()) {
        const q = search.toLowerCase().trim();
        trains = trains.filter(
          (t) => t.trainName.toLowerCase().includes(q) || t.trainNumber.includes(q) || t.destination.toLowerCase().includes(q) || t.source.toLowerCase().includes(q) || t.currentStation.toLowerCase().includes(q)
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
  apiRouter.get("/trains/:id", (req, res) => {
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
  apiRouter.get("/predictions/15m", (req, res) => {
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
      const primaryPrediction = {
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
  apiRouter.get("/predictions/:stationId", (req, res) => {
    try {
      const stationId = req.params.stationId.toLowerCase();
      const stations = getAllSimulatedStations();
      const station = stations.find((s) => s.id.toLowerCase() === stationId);
      if (!station) {
        return res.status(404).json({ success: false, error: `Station '${req.params.stationId}' prediction not found` });
      }
      const prediction = {
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
  apiRouter.get("/recommendations", (req, res) => {
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
  apiRouter.get("/alerts", (req, res) => {
    try {
      const { severity, resolved } = req.query;
      let alerts = [...activeAlerts];
      if (severity && typeof severity === "string") {
        alerts = alerts.filter((a) => a.severity.toLowerCase() === severity.toLowerCase());
      }
      if (resolved !== void 0) {
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
  apiRouter.post("/alerts/:id/ack", (req, res) => {
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
  apiRouter.post("/ai/advisory", async (req, res) => {
    try {
      const { stationId, query } = req.body || {};
      const stations = getAllSimulatedStations();
      const recommendations = getDynamicRecommendations(stations);
      const advisory = await generateOperationalAdvisory(
        stations,
        recommendations,
        typeof query === "string" ? query : void 0,
        typeof stationId === "string" ? stationId : void 0
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
  app2.use("/api", apiRouter);
  app2.use("/", apiRouter);
  return app2;
}
var app = createExpressApp();

// src/server/vercelHandler.ts
function handler(req, res) {
  return app(req, res);
}
export {
  handler as default
};
