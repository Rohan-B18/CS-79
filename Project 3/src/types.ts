export type RiskLevel = 'high' | 'medium' | 'low';

export interface Patient {
  id: string;
  name: string;
  age: number;
  surgeryType: string;
  surgeryDate: string;
  daysSinceSurgery: number;
  riskLevel: RiskLevel;
  riskScore: number;
  status: 'recovering' | 'at-risk' | 'needs-attention' | 'stable';
  lastCheckIn: string;
  nextCheckIn?: string;
  assignedClinician?: string;
}

export interface DailyCheckIn {
  id: string;
  patientId: string;
  date: string;
  painLevel: number; // 0-10
  mobilityScore: number; // 0-10, higher is better
  medicationAdherence: number; // 0-100 percentage
  symptoms: string[];
  notes?: string;
  woundPhotos?: string[];
  emotionalState: 'excellent' | 'good' | 'fair' | 'poor';
  sleepQuality: number; // 0-10
  appetite: 'normal' | 'reduced' | 'poor';
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  adherence: number; // 0-100 percentage
  lastTaken?: string;
  missedDoses: number;
}

export interface WoundPhoto {
  id: string;
  patientId: string;
  date: string;
  imageUrl: string;
  notes?: string;
  flagged: boolean;
  flaggedReason?: string;
}

export interface PatientMetrics {
  patientId: string;
  painTrend: { date: string; value: number }[];
  mobilityTrend: { date: string; value: number }[];
  medicationAdherenceTrend: { date: string; value: number }[];
  checkInCompletionRate: number;
  totalCheckIns: number;
  missedCheckIns: number;
}

export interface Alert {
  id: string;
  patientId: string;
  type: 'pain' | 'wound' | 'medication' | 'symptom' | 'missed-checkin';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}


