import { Patient, DailyCheckIn, Medication, WoundPhoto, PatientMetrics, Alert } from './types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 72,
    surgeryType: 'Hip Replacement',
    surgeryDate: '2024-01-15',
    daysSinceSurgery: 8,
    riskLevel: 'high',
    riskScore: 85,
    status: 'needs-attention',
    lastCheckIn: '2024-01-23T08:30:00',
    assignedClinician: 'Dr. Martinez'
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 65,
    surgeryType: 'Knee Replacement',
    surgeryDate: '2024-01-18',
    daysSinceSurgery: 5,
    riskLevel: 'high',
    riskScore: 78,
    status: 'at-risk',
    lastCheckIn: '2024-01-23T09:15:00',
    assignedClinician: 'Dr. Martinez'
  },
  {
    id: '3',
    name: 'Emma Williams',
    age: 58,
    surgeryType: 'Shoulder Surgery',
    surgeryDate: '2024-01-20',
    daysSinceSurgery: 3,
    riskLevel: 'medium',
    riskScore: 52,
    status: 'recovering',
    lastCheckIn: '2024-01-23T07:45:00',
    assignedClinician: 'Dr. Thompson'
  },
  {
    id: '4',
    name: 'Robert Davis',
    age: 70,
    surgeryType: 'Hip Replacement',
    surgeryDate: '2024-01-12',
    daysSinceSurgery: 11,
    riskLevel: 'low',
    riskScore: 28,
    status: 'stable',
    lastCheckIn: '2024-01-23T10:00:00',
    assignedClinician: 'Dr. Thompson'
  },
  {
    id: '5',
    name: 'Patricia Brown',
    age: 68,
    surgeryType: 'Spine Surgery',
    surgeryDate: '2024-01-16',
    daysSinceSurgery: 7,
    riskLevel: 'medium',
    riskScore: 45,
    status: 'recovering',
    lastCheckIn: '2024-01-22T18:30:00',
    assignedClinician: 'Dr. Martinez'
  },
  {
    id: '6',
    name: 'James Wilson',
    age: 74,
    surgeryType: 'Knee Replacement',
    surgeryDate: '2024-01-14',
    daysSinceSurgery: 9,
    riskLevel: 'low',
    riskScore: 22,
    status: 'stable',
    lastCheckIn: '2024-01-23T08:00:00',
    assignedClinician: 'Dr. Thompson'
  },
  {
    id: '7',
    name: 'Linda Anderson',
    age: 63,
    surgeryType: 'Hip Replacement',
    surgeryDate: '2024-01-19',
    daysSinceSurgery: 4,
    riskLevel: 'high',
    riskScore: 82,
    status: 'needs-attention',
    lastCheckIn: '2024-01-22T16:00:00',
    assignedClinician: 'Dr. Martinez'
  },
  {
    id: '8',
    name: 'David Miller',
    age: 69,
    surgeryType: 'Shoulder Surgery',
    surgeryDate: '2024-01-17',
    daysSinceSurgery: 6,
    riskLevel: 'medium',
    riskScore: 48,
    status: 'recovering',
    lastCheckIn: '2024-01-23T09:30:00',
    assignedClinician: 'Dr. Thompson'
  }
];

export const mockCheckIns: DailyCheckIn[] = [
  {
    id: 'c1',
    patientId: '1',
    date: '2024-01-23',
    painLevel: 8,
    mobilityScore: 3,
    medicationAdherence: 60,
    symptoms: ['swelling', 'redness', 'fever'],
    emotionalState: 'poor',
    sleepQuality: 4,
    appetite: 'poor',
    notes: 'Patient reports increased pain and difficulty sleeping'
  },
  {
    id: 'c2',
    patientId: '1',
    date: '2024-01-22',
    painLevel: 7,
    mobilityScore: 4,
    medicationAdherence: 80,
    symptoms: ['swelling'],
    emotionalState: 'fair',
    sleepQuality: 5,
    appetite: 'reduced'
  },
  {
    id: 'c3',
    patientId: '2',
    date: '2024-01-23',
    painLevel: 6,
    mobilityScore: 5,
    medicationAdherence: 90,
    symptoms: ['stiffness'],
    emotionalState: 'good',
    sleepQuality: 6,
    appetite: 'normal'
  },
  {
    id: 'c4',
    patientId: '3',
    date: '2024-01-23',
    painLevel: 4,
    mobilityScore: 7,
    medicationAdherence: 100,
    symptoms: [],
    emotionalState: 'excellent',
    sleepQuality: 8,
    appetite: 'normal'
  },
  {
    id: 'c5',
    patientId: '4',
    date: '2024-01-23',
    painLevel: 2,
    mobilityScore: 9,
    medicationAdherence: 100,
    symptoms: [],
    emotionalState: 'excellent',
    sleepQuality: 9,
    appetite: 'normal'
  }
];

export const mockMedications: Medication[] = [
  {
    id: 'm1',
    patientId: '1',
    name: 'Oxycodone',
    dosage: '5mg',
    frequency: 'Every 6 hours',
    startDate: '2024-01-15',
    adherence: 60,
    lastTaken: '2024-01-23T06:00:00',
    missedDoses: 4
  },
  {
    id: 'm2',
    patientId: '1',
    name: 'Ibuprofen',
    dosage: '400mg',
    frequency: 'Every 8 hours',
    startDate: '2024-01-15',
    adherence: 75,
    lastTaken: '2024-01-23T08:00:00',
    missedDoses: 2
  },
  {
    id: 'm3',
    patientId: '2',
    name: 'Acetaminophen',
    dosage: '500mg',
    frequency: 'Every 6 hours',
    startDate: '2024-01-18',
    adherence: 90,
    lastTaken: '2024-01-23T09:00:00',
    missedDoses: 1
  }
];

export const mockWoundPhotos: WoundPhoto[] = [
  {
    id: 'w1',
    patientId: '1',
    date: '2024-01-23',
    imageUrl: 'https://via.placeholder.com/400x300?text=Wound+Photo+1',
    flagged: true,
    flaggedReason: 'Significant redness and swelling observed'
  },
  {
    id: 'w2',
    patientId: '1',
    date: '2024-01-21',
    imageUrl: 'https://via.placeholder.com/400x300?text=Wound+Photo+2',
    flagged: false
  },
  {
    id: 'w3',
    patientId: '2',
    date: '2024-01-23',
    imageUrl: 'https://via.placeholder.com/400x300?text=Wound+Photo+3',
    flagged: false
  }
];

export const mockMetrics: PatientMetrics[] = [
  {
    patientId: '1',
    painTrend: [
      { date: '2024-01-16', value: 9 },
      { date: '2024-01-17', value: 8 },
      { date: '2024-01-18', value: 7 },
      { date: '2024-01-19', value: 7 },
      { date: '2024-01-20', value: 8 },
      { date: '2024-01-21', value: 7 },
      { date: '2024-01-22', value: 7 },
      { date: '2024-01-23', value: 8 }
    ],
    mobilityTrend: [
      { date: '2024-01-16', value: 2 },
      { date: '2024-01-17', value: 2 },
      { date: '2024-01-18', value: 3 },
      { date: '2024-01-19', value: 3 },
      { date: '2024-01-20', value: 3 },
      { date: '2024-01-21', value: 4 },
      { date: '2024-01-22', value: 4 },
      { date: '2024-01-23', value: 3 }
    ],
    medicationAdherenceTrend: [
      { date: '2024-01-16', value: 100 },
      { date: '2024-01-17', value: 90 },
      { date: '2024-01-18', value: 85 },
      { date: '2024-01-19', value: 80 },
      { date: '2024-01-20', value: 75 },
      { date: '2024-01-21', value: 70 },
      { date: '2024-01-22', value: 65 },
      { date: '2024-01-23', value: 60 }
    ],
    checkInCompletionRate: 87.5,
    totalCheckIns: 8,
    missedCheckIns: 1
  },
  {
    patientId: '2',
    painTrend: [
      { date: '2024-01-19', value: 8 },
      { date: '2024-01-20', value: 7 },
      { date: '2024-01-21', value: 6 },
      { date: '2024-01-22', value: 6 },
      { date: '2024-01-23', value: 6 }
    ],
    mobilityTrend: [
      { date: '2024-01-19', value: 3 },
      { date: '2024-01-20', value: 4 },
      { date: '2024-01-21', value: 4 },
      { date: '2024-01-22', value: 5 },
      { date: '2024-01-23', value: 5 }
    ],
    medicationAdherenceTrend: [
      { date: '2024-01-19', value: 100 },
      { date: '2024-01-20', value: 95 },
      { date: '2024-01-21', value: 90 },
      { date: '2024-01-22', value: 90 },
      { date: '2024-01-23', value: 90 }
    ],
    checkInCompletionRate: 100,
    totalCheckIns: 5,
    missedCheckIns: 0
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    patientId: '1',
    type: 'pain',
    severity: 'critical',
    message: 'Pain level increased to 8/10',
    timestamp: '2024-01-23T08:30:00',
    acknowledged: false
  },
  {
    id: 'a2',
    patientId: '1',
    type: 'medication',
    severity: 'warning',
    message: 'Medication adherence dropped to 60%',
    timestamp: '2024-01-23T08:30:00',
    acknowledged: false
  },
  {
    id: 'a3',
    patientId: '1',
    type: 'wound',
    severity: 'critical',
    message: 'Wound photo shows significant redness',
    timestamp: '2024-01-23T09:00:00',
    acknowledged: false
  },
  {
    id: 'a4',
    patientId: '2',
    type: 'symptom',
    severity: 'warning',
    message: 'New symptom reported: stiffness',
    timestamp: '2024-01-23T09:15:00',
    acknowledged: true
  },
  {
    id: 'a5',
    patientId: '7',
    type: 'missed-checkin',
    severity: 'warning',
    message: 'Missed daily check-in',
    timestamp: '2024-01-23T10:00:00',
    acknowledged: false
  }
];


