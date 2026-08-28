import {
  Station,
  Train,
  Alert,
  NetworkOverviewStats,
  CrowdPrediction,
  PlatformInfo,
  RailwayLine,
  CrowdStatus,
  DelayStatus
} from '../types';
import {
  MOCK_STATIONS,
  MOCK_ALERTS,
  MOCK_NETWORK_STATS,
  MOCK_ACCURACY_EVALUATIONS,
  MOCK_MODEL_STATS,
  MOCK_DATA_SIGNALS_INFO
} from '../data/mockData';

// Timezone constant
export const TIMEZONE = 'Asia/Kolkata';

/**
 * Returns Date details broken down in Asia/Kolkata (IST, UTC+5:30)
 */
export function getMumbaiTimeParts(date: Date = new Date()): {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMinutesInDay: number;
  formattedTime: string;
} {
  // Format with Intl to ensure exact Asia/Kolkata interpretation
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });

  const parts = formatter.formatToParts(date);
  const partMap: Record<string, number> = {};
  parts.forEach((p) => {
    if (p.type !== 'literal') {
      partMap[p.type] = parseInt(p.value, 10);
    }
  });

  const hours = partMap.hour === 24 ? 0 : (partMap.hour ?? 0);
  const minutes = partMap.minute ?? 0;
  const seconds = partMap.second ?? 0;
  const totalMinutesInDay = hours * 60 + minutes;

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
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

/**
 * Converts a minute of the day (0..1439) into a 12-hour formatted time string like "08:44 PM" or "12:05 AM"
 */
export function formatMinutesToTimeString(totalMinutes: number): string {
  const normalized = ((Math.floor(totalMinutes) % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;

  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const padH = String(hour12).padStart(2, '0');
  const padM = String(m).padStart(2, '0');

  return `${padH}:${padM} ${ampm}`;
}

/**
 * Calculates a station specific frequency in minutes based on line, time-of-day, and platform
 */
function getStationFrequency(stationId: string, line: RailwayLine, totalMinutes: number): number {
  const isMorningPeak = totalMinutes >= 480 && totalMinutes <= 690; // 08:00 - 11:30
  const isEveningPeak = totalMinutes >= 1020 && totalMinutes <= 1290; // 17:00 - 21:30
  const isLateNight = totalMinutes >= 1410 || totalMinutes < 240; // 23:30 - 04:00

  const majorHubs = ['churchgate', 'dadar', 'andheri', 'borivali', 'csmt', 'kurla', 'thane', 'kalyan', 'vashi', 'panvel'];
  const isMajor = majorHubs.includes(stationId.toLowerCase());

  if (isLateNight) {
    return isMajor ? 15 : 22;
  }
  if (isMorningPeak || isEveningPeak) {
    return isMajor ? 3 : 5;
  }
  return isMajor ? 5 : 8;
}

/**
 * Station hash to produce deterministic staggered departure offsets
 */
function getStationSeed(stationId: string, platformNum: number = 1): number {
  let hash = 0;
  for (let i = 0; i < stationId.length; i++) {
    hash = (hash * 31 + stationId.charCodeAt(i)) & 0xffffffff;
  }
  return (Math.abs(hash) % 7) + (platformNum * 2);
}

/**
 * Next train schedule calculation strictly in Asia/Kolkata timezone.
 * Guarantees that the returned departure time is strictly in the future relative to refDate (or now).
 * Handles midnight rollovers, evening rushes, and early morning service starts.
 */
export function getNextTrainDeparture(
  stationId: string,
  platformNum: number = 1,
  line: RailwayLine = 'WESTERN',
  refDate: Date = new Date()
): {
  departureTime: string;
  minutesUntil: number;
  destination: string;
  isFast: boolean;
} {
  const timeInfo = getMumbaiTimeParts(refDate);
  const currentTotalMins = timeInfo.totalMinutesInDay;
  const seed = getStationSeed(stationId, platformNum);

  // Service operating window:
  // Mumbai suburban trains run from 04:00 (240 mins) to 01:45 (105 mins of next day / 1545 mins).
  // Between 01:45 and 04:00 (105..240 mins), track maintenance occurs; first morning train starts at 04:00 + seed.
  let earliestFutureMinute: number;
  let minutesUntil: number;

  if (currentTotalMins >= 105 && currentTotalMins < 240) {
    // During maintenance window (01:45 AM - 04:00 AM)
    // Next train is early morning train
    const morningStart = 240 + (seed % 15); // 04:00 - 04:15 AM
    earliestFutureMinute = morningStart;
    minutesUntil = morningStart - currentTotalMins;
  } else {
    const freq = getStationFrequency(stationId, line, currentTotalMins);
    // Find next departure slot: slot = floor(currentTotalMins / freq) * freq + offset
    const offset = seed % freq;
    let nextSlot = Math.floor(currentTotalMins / freq) * freq + offset;

    // Ensure it is strictly in the future (at least 1.5 minutes ahead so it's not a departing/past train)
    while (nextSlot <= currentTotalMins + 1) {
      nextSlot += freq;
    }

    // Check if nextSlot falls in the maintenance window (between 01:45 and 04:00)
    const slotMod = nextSlot % 1440;
    if (slotMod >= 105 && slotMod < 240) {
      nextSlot = 240 + (seed % 15);
      minutesUntil = nextSlot > currentTotalMins ? (nextSlot - currentTotalMins) : (1440 - currentTotalMins + nextSlot);
      earliestFutureMinute = nextSlot % 1440;
    } else {
      earliestFutureMinute = slotMod;
      minutesUntil = nextSlot - currentTotalMins;
    }
  }

  // Determine realistic destination based on line and platform
  let destination = 'Borivali Fast';
  let isFast = platformNum === 1 || platformNum === 3 || platformNum === 5;

  if (line === 'WESTERN') {
    const destinations = ['Churchgate Fast', 'Borivali Fast', 'Virar Semi-Fast', 'Bandra Slow', 'Andheri Slow', 'Goregaon AC'];
    destination = destinations[(seed + platformNum) % destinations.length];
  } else if (line === 'CENTRAL') {
    const destinations = ['CSMT Fast', 'Kalyan Fast', 'Thane Slow', 'Dombivli Fast', 'Kasara Semi-Fast', 'Kurla Slow'];
    destination = destinations[(seed + platformNum) % destinations.length];
  } else if (line === 'HARBOUR') {
    const destinations = ['Panvel Fast', 'CSMT Slow', 'Belapur Slow', 'Vashi Slow', 'Bandra Harbour'];
    destination = destinations[(seed + platformNum) % destinations.length];
  }

  return {
    departureTime: formatMinutesToTimeString(earliestFutureMinute),
    minutesUntil: Math.max(1, Math.round(minutesUntil)),
    destination,
    isFast
  };
}

/**
 * Deterministic diurnal crowd occupancy calculation for Mumbai railway stations.
 * Reflects authentic commuter traffic patterns:
 * - Morning Peak: 08:00 - 11:30
 * - Midday: 11:30 - 16:30
 * - Evening Peak: 17:00 - 21:30
 * - Late Night: 21:30 - 01:30
 * - Night Maintenance: 01:30 - 04:30
 */
export function getSimulatedStationMetrics(
  baseStation: Station,
  refDate: Date = new Date()
): Station {
  const timeInfo = getMumbaiTimeParts(refDate);
  const totalMins = timeInfo.totalMinutesInDay;
  const seed = getStationSeed(baseStation.id);

  // Smooth micro-variation bucket (changes predictably every 5 minutes)
  const fiveMinBucket = Math.floor(totalMins / 5);
  const microDelta = (((fiveMinBucket * 7 + seed * 13) % 9) - 4); // -4 to +4%

  let baseOccupancy = 45;

  if (totalMins >= 480 && totalMins <= 690) {
    // Morning Rush (08:00 - 11:30)
    const peakProgress = Math.sin(((totalMins - 480) / 210) * Math.PI);
    baseOccupancy = 68 + Math.round(peakProgress * 24);
  } else if (totalMins > 690 && totalMins < 1020) {
    // Midday (11:30 - 17:00)
    baseOccupancy = 48 + (seed % 14);
  } else if (totalMins >= 1020 && totalMins <= 1290) {
    // Evening Surge (17:00 - 21:30)
    const peakProgress = Math.sin(((totalMins - 1020) / 270) * Math.PI);
    baseOccupancy = 72 + Math.round(peakProgress * 24);
  } else if (totalMins > 1290 || totalMins < 90) {
    // Late Night (21:30 - 01:30)
    baseOccupancy = 35 + (seed % 15);
  } else {
    // Maintenance window (01:30 - 04:30)
    baseOccupancy = 18 + (seed % 10);
  }

  // Major interchange / hub multiplier
  const majorHubs = ['dadar', 'andheri', 'kurla', 'thane', 'kalyan', 'borivali', 'csmt', 'churchgate', 'vashi'];
  if (majorHubs.includes(baseStation.id.toLowerCase())) {
    baseOccupancy = Math.min(98, Math.round(baseOccupancy * 1.12));
  }

  const currentOccupancy = Math.max(15, Math.min(98, baseOccupancy + microDelta));

  // 15-Minute Predicted Occupancy (multi-modal gradient)
  const isRising = (totalMins >= 450 && totalMins < 570) || (totalMins >= 990 && totalMins < 1140);
  const surgeFactor = isRising ? (3 + (seed % 5)) : (totalMins > 690 && totalMins < 800 ? -3 : (seed % 4));
  const predictedOccupancy = Math.max(15, Math.min(99, currentOccupancy + surgeFactor));

  // Crowd Status
  let crowdStatus: CrowdStatus = 'LOW';
  if (currentOccupancy >= 85) crowdStatus = 'CRITICAL';
  else if (currentOccupancy >= 70) crowdStatus = 'HIGH';
  else if (currentOccupancy >= 50) crowdStatus = 'MEDIUM';

  // Next train calculation
  const primaryPlatform = baseStation.platform || 1;
  const nextDeparture = getNextTrainDeparture(baseStation.id, primaryPlatform, baseStation.line, refDate);

  // Associated platform matrix
  const platformCount = baseStation.platformsCount || 4;
  const platforms: PlatformInfo[] = [];
  for (let p = 1; p <= platformCount; p++) {
    const pDeparture = getNextTrainDeparture(baseStation.id, p, baseStation.line, refDate);
    const pOccupancy = Math.max(20, Math.min(99, currentOccupancy + ((p % 2 === 0 ? -1 : 1) * (p * 3))));
    let pCrowd: CrowdStatus = 'LOW';
    if (pOccupancy >= 85) pCrowd = 'CRITICAL';
    else if (pOccupancy >= 70) pCrowd = 'HIGH';
    else if (pOccupancy >= 50) pCrowd = 'MEDIUM';

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

  // Multi-modal signals correlated directly with occupancy
  const cctvSignalConfidence = Math.min(99, 90 + (currentOccupancy % 9));
  const etvmTicketingVelocity = Math.round(currentOccupancy * 2.8 + (seed * 3));
  const utsActiveSessions = Math.round(currentOccupancy * 42 + (seed * 110));
  const deviceDensityIndex = Math.min(99, Math.round(currentOccupancy * 0.94 + 4));

  // Hourly trend forecast for the next 6 hours
  const hourlyTrend = [];
  for (let i = 0; i < 6; i++) {
    const futureMins = (totalMins + i * 60) % 1440;
    const fHour = Math.floor(futureMins / 60);
    const ampm = fHour >= 12 ? 'PM' : 'AM';
    const h12 = fHour === 0 ? 12 : fHour > 12 ? fHour - 12 : fHour;
    const timeLabel = `${String(h12).padStart(2, '0')}:00 ${ampm}`;

    let trendOcc = currentOccupancy;
    if (futureMins >= 480 && futureMins <= 690) trendOcc = 84 + (seed % 10);
    else if (futureMins >= 1020 && futureMins <= 1290) trendOcc = 90 + (seed % 8);
    else if (futureMins > 1290 || futureMins < 120) trendOcc = 42 + (seed % 12);
    else trendOcc = 54 + (seed % 12);

    trendOcc = Math.max(20, Math.min(98, trendOcc));
    let tCrowd: CrowdStatus = 'LOW';
    if (trendOcc >= 85) tCrowd = 'CRITICAL';
    else if (trendOcc >= 70) tCrowd = 'HIGH';
    else if (trendOcc >= 50) tCrowd = 'MEDIUM';

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
    delayStatus: (currentOccupancy >= 88 && seed % 2 === 0) ? 'Delayed' : 'On Time',
    delayMinutes: (currentOccupancy >= 88 && seed % 2 === 0) ? (2 + (seed % 3)) : 0,
    cctvSignalConfidence,
    etvmTicketingVelocity,
    utsActiveSessions,
    deviceDensityIndex,
    platforms,
    hourlyTrend
  };
}

/**
 * Returns all simulated stations with live deterministic telemetry
 */
export function getAllSimulatedStations(refDate: Date = new Date()): Station[] {
  return MOCK_STATIONS.map((base) => getSimulatedStationMetrics(base, refDate));
}

/**
 * Returns active trains in transit across Mumbai Suburban lines
 */
export function getActiveTrains(refDate: Date = new Date()): Train[] {
  const timeInfo = getMumbaiTimeParts(refDate);
  const totalMins = timeInfo.totalMinutesInDay;

  // Active trains with realistic dynamic ETAs strictly in the future in IST
  const trains: Train[] = [
    {
      id: 'TR-9042',
      trainNumber: '90428',
      trainName: 'Churchgate Fast Local',
      line: 'WESTERN',
      source: 'Borivali',
      destination: 'Churchgate',
      currentStation: 'Dadar',
      nextStation: 'Mumbai Central',
      eta: formatMinutesToTimeString(totalMins + 3),
      delayMinutes: 0,
      delayStatus: 'On Time',
      platform: 3,
      crowdLevel: 'HIGH',
      occupancyPercentage: 84,
      speedKmH: 64,
      isFast: true,
      coaches: 15
    },
    {
      id: 'TR-9521',
      trainNumber: '95214',
      trainName: 'Kalyan Fast Local',
      line: 'CENTRAL',
      source: 'CSMT',
      destination: 'Kalyan',
      currentStation: 'Dadar',
      nextStation: 'Kurla',
      eta: formatMinutesToTimeString(totalMins + 4),
      delayMinutes: 0,
      delayStatus: 'On Time',
      platform: 5,
      crowdLevel: 'CRITICAL',
      occupancyPercentage: 94,
      speedKmH: 58,
      isFast: true,
      coaches: 12
    },
    {
      id: 'TR-9118',
      trainNumber: '91182',
      trainName: 'Virar Semi-Fast AC',
      line: 'WESTERN',
      source: 'Churchgate',
      destination: 'Virar',
      currentStation: 'Bandra',
      nextStation: 'Andheri',
      eta: formatMinutesToTimeString(totalMins + 6),
      delayMinutes: 2,
      delayStatus: 'Delayed',
      platform: 4,
      crowdLevel: 'HIGH',
      occupancyPercentage: 88,
      speedKmH: 72,
      isFast: true,
      coaches: 15,
      acLocal: true
    },
    {
      id: 'TR-9630',
      trainNumber: '96305',
      trainName: 'Thane Slow Local',
      line: 'CENTRAL',
      source: 'CSMT',
      destination: 'Thane',
      currentStation: 'Byculla',
      nextStation: 'Chinchpokli',
      eta: formatMinutesToTimeString(totalMins + 5),
      delayMinutes: 0,
      delayStatus: 'On Time',
      platform: 1,
      crowdLevel: 'MEDIUM',
      occupancyPercentage: 62,
      speedKmH: 45,
      isFast: false,
      coaches: 12
    },
    {
      id: 'TR-9204',
      trainNumber: '92044',
      trainName: 'Borivali Slow Local',
      line: 'WESTERN',
      source: 'Churchgate',
      destination: 'Borivali',
      currentStation: 'Marine Lines',
      nextStation: 'Charni Road',
      eta: formatMinutesToTimeString(totalMins + 7),
      delayMinutes: 0,
      delayStatus: 'On Time',
      platform: 2,
      crowdLevel: 'LOW',
      occupancyPercentage: 44,
      speedKmH: 40,
      isFast: false,
      coaches: 12
    },
    {
      id: 'TR-9812',
      trainNumber: '98120',
      trainName: 'Panvel Harbour Fast',
      line: 'HARBOUR',
      source: 'CSMT',
      destination: 'Panvel',
      currentStation: 'Vashi',
      nextStation: 'Belapur (CBD)',
      eta: formatMinutesToTimeString(totalMins + 5),
      delayMinutes: 0,
      delayStatus: 'On Time',
      platform: 3,
      crowdLevel: 'CRITICAL',
      occupancyPercentage: 91,
      speedKmH: 62,
      isFast: true,
      coaches: 12
    },
    {
      id: 'TR-9705',
      trainNumber: '97056',
      trainName: 'Belapur Slow Local',
      line: 'HARBOUR',
      source: 'CSMT',
      destination: 'Belapur',
      currentStation: 'Kurla',
      nextStation: 'Tilak Nagar',
      eta: formatMinutesToTimeString(totalMins + 4),
      delayMinutes: 0,
      delayStatus: 'On Time',
      platform: 7,
      crowdLevel: 'HIGH',
      occupancyPercentage: 78,
      speedKmH: 48,
      isFast: false,
      coaches: 12
    },
    {
      id: 'TR-9433',
      trainNumber: '94331',
      trainName: 'CSMT AC Fast Local',
      line: 'CENTRAL',
      source: 'Kalyan',
      destination: 'CSMT',
      currentStation: 'Ghatkopar',
      nextStation: 'Kurla',
      eta: formatMinutesToTimeString(totalMins + 6),
      delayMinutes: 1,
      delayStatus: 'Delayed',
      platform: 4,
      crowdLevel: 'HIGH',
      occupancyPercentage: 86,
      speedKmH: 68,
      isFast: true,
      coaches: 15,
      acLocal: true
    }
  ];

  return trains;
}

/**
 * Operational OCC & Commuter Recommendations Store
 */
export interface OperationalRecommendation {
  id: string;
  stationId: string;
  stationName: string;
  platformNumber?: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'MARSHALLING' | 'HOLDING_AREA' | 'ANNOUNCEMENT' | 'TRAIN_INDUCTION' | 'COMMUTER_ADVISORY';
  title: string;
  actionRequired: string;
  rationale: string;
  estimatedCrowdRelief: string;
  generatedAt: string;
}

/**
 * Dynamic generation of operational recommendations based on actual simulated conditions
 */
export function getDynamicRecommendations(
  stations: Station[],
  refDate: Date = new Date()
): OperationalRecommendation[] {
  const timeInfo = getMumbaiTimeParts(refDate);
  const recs: OperationalRecommendation[] = [];

  // Identify critical stations (>= 85%) and high surge stations (>= 75%)
  const criticalStations = stations.filter((s) => s.currentOccupancy >= 85 || s.predictedOccupancy >= 85);
  const highStations = stations.filter((s) => s.currentOccupancy >= 70 && s.currentOccupancy < 85);

  let recIndex = 1;

  criticalStations.slice(0, 3).forEach((stn) => {
    if (stn.id === 'dadar' || stn.isInterchange) {
      recs.push({
        id: `REC-${String(recIndex++).padStart(3, '0')}`,
        stationId: stn.id,
        stationName: stn.name,
        platformNumber: stn.platform || 1,
        priority: 'HIGH',
        category: 'MARSHALLING',
        title: `Deploy RPF Crowd Marshals at ${stn.name} Middle FOB`,
        actionRequired: `Station Master to reposition 4 Railway Protection Force personnel to regulate pedestrian interchange transit from PF 1 to PF 6.`,
        rationale: `FOB bottleneck optical flow exceeded 1.8 persons/sqm threshold with ${stn.predictedOccupancy}% predicted surge in 15 minutes.`,
        estimatedCrowdRelief: `-22% localized staircase congestion within 8 minutes`,
        generatedAt: timeInfo.formattedTime
      });
    } else if (stn.id === 'kurla' || stn.id === 'vashi') {
      recs.push({
        id: `REC-${String(recIndex++).padStart(3, '0')}`,
        stationId: stn.id,
        stationName: stn.name,
        platformNumber: stn.platform || 7,
        priority: 'HIGH',
        category: 'HOLDING_AREA',
        title: `Activate East Booking Hall Auxiliary Holding Enclosure at ${stn.name}`,
        actionRequired: `Open North-East holding bay gates to stage passengers safely before entering platform stairs.`,
        rationale: `UTS digital ticket bookings spiked by 34% with live occupancy reaching ${stn.currentOccupancy}%.`,
        estimatedCrowdRelief: `-18% platform edge crowding during 15-minute peak window`,
        generatedAt: timeInfo.formattedTime
      });
    } else {
      recs.push({
        id: `REC-${String(recIndex++).padStart(3, '0')}`,
        stationId: stn.id,
        stationName: stn.name,
        platformNumber: stn.platform || 2,
        priority: 'HIGH',
        category: 'TRAIN_INDUCTION',
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
      id: `REC-${String(recIndex++).padStart(3, '0')}`,
      stationId: stn.id,
      stationName: stn.name,
      platformNumber: stn.platform || 3,
      priority: 'MEDIUM',
      category: 'ANNOUNCEMENT',
      title: `Broadcast Coach Equalization Advisory at ${stn.name}`,
      actionRequired: `Trigger automated bilingual audio announcements advising passengers that middle/rear coaches have lower occupancy.`,
      rationale: `CCTV cameras detect optical density of ${stn.currentOccupancy}% localized around front motorman coach.`,
      estimatedCrowdRelief: `Equalizes coach distribution evenly across formation`,
      generatedAt: timeInfo.formattedTime
    });
  });

  return recs;
}
