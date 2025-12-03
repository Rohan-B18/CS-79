import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Activity,
  Calendar,
  Pill,
  Camera,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Stethoscope,
  FileText,
  BarChart3,
  Image as ImageIcon,
  List,
  Grid,
  X,
  ZoomIn,
  ChevronRight,
  Heart,
  Moon,
  Utensils,
  Smile
} from 'lucide-react';
import { Patient, DailyCheckIn, Medication, WoundPhoto, PatientMetrics, Alert } from '../types';
import { mockPatients, mockCheckIns, mockMedications, mockWoundPhotos, mockMetrics, mockAlerts } from '../mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

type ViewMode = 'overview' | 'metrics' | 'checkins' | 'medications' | 'wounds' | 'alerts' | 'timeline';
type DetailView = 'checkin-detail' | 'medication-detail' | 'wound-detail' | null;

const PatientDetail: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [detailView, setDetailView] = useState<DetailView>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const patient = mockPatients.find(p => p.id === patientId);
  const checkIns = mockCheckIns.filter(c => c.patientId === patientId);
  const medications = mockMedications.filter(m => m.patientId === patientId);
  const woundPhotos = mockWoundPhotos.filter(w => w.patientId === patientId);
  const metrics = mockMetrics.find(m => m.patientId === patientId);
  const alerts = mockAlerts.filter(a => a.patientId === patientId);

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Patient not found</p>
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'needs-attention': return 'bg-red-500';
      case 'at-risk': return 'bg-orange-500';
      case 'stable': return 'bg-green-500';
      case 'recovering': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const handleViewItem = (type: 'checkin' | 'medication' | 'wound', id: string) => {
    setSelectedItem(id);
    if (type === 'checkin') setDetailView('checkin-detail');
    if (type === 'medication') setDetailView('medication-detail');
    if (type === 'wound') setDetailView('wound-detail');
  };

  const closeDetailView = () => {
    setDetailView(null);
    setSelectedItem(null);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'metrics', label: 'Metrics & Trends', icon: BarChart3 },
    { id: 'checkins', label: 'Daily Check-ins', icon: Calendar },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'wounds', label: 'Wound Photos', icon: Camera },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'timeline', label: 'Recovery Timeline', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
                <p className="text-sm text-gray-600">{patient.surgeryType} • Day {patient.daysSinceSurgery} Post-Op</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(patient.riskLevel)}`}>
                {patient.riskLevel.toUpperCase()} RISK
              </span>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(patient.status)}`} title={patient.status} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = viewMode === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setViewMode(item.id as ViewMode);
                      closeDetailView();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Quick Stats */}
            <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Score</span>
                  <span className="font-semibold">{patient.riskScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-ins</span>
                  <span className="font-semibold">{checkIns.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Medications</span>
                  <span className="font-semibold">{medications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Alerts</span>
                  <span className="font-semibold text-red-600">{alerts.filter(a => !a.acknowledged).length}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              {detailView ? (
                <DetailViewComponent
                  key={detailView}
                  type={detailView}
                  selectedItem={selectedItem}
                  patient={patient}
                  checkIns={checkIns}
                  medications={medications}
                  woundPhotos={woundPhotos}
                  onClose={closeDetailView}
                />
              ) : (
                <ViewModeComponent
                  key={viewMode}
                  viewMode={viewMode}
                  patient={patient}
                  checkIns={checkIns}
                  medications={medications}
                  woundPhotos={woundPhotos}
                  metrics={metrics}
                  alerts={alerts}
                  onViewItem={handleViewItem}
                />
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

// View Mode Components
const ViewModeComponent: React.FC<{
  viewMode: ViewMode;
  patient: Patient;
  checkIns: DailyCheckIn[];
  medications: Medication[];
  woundPhotos: WoundPhoto[];
  metrics?: PatientMetrics;
  alerts: Alert[];
  onViewItem: (type: 'checkin' | 'medication' | 'wound', id: string) => void;
}> = ({ viewMode, patient, checkIns, medications, woundPhotos, metrics, alerts, onViewItem }) => {
  switch (viewMode) {
    case 'overview':
      return <OverviewView patient={patient} checkIns={checkIns} medications={medications} woundPhotos={woundPhotos} alerts={alerts} metrics={metrics} onViewItem={onViewItem} />;
    case 'metrics':
      return <MetricsView metrics={metrics} checkIns={checkIns} />;
    case 'checkins':
      return <CheckInsView checkIns={checkIns} onViewItem={onViewItem} />;
    case 'medications':
      return <MedicationsView medications={medications} onViewItem={onViewItem} />;
    case 'wounds':
      return <WoundsView woundPhotos={woundPhotos} onViewItem={onViewItem} />;
    case 'alerts':
      return <AlertsView alerts={alerts} />;
    case 'timeline':
      return <TimelineView patient={patient} checkIns={checkIns} medications={medications} woundPhotos={woundPhotos} />;
    default:
      return null;
  }
};

// Overview View
const OverviewView: React.FC<{
  patient: Patient;
  checkIns: DailyCheckIn[];
  medications: Medication[];
  woundPhotos: WoundPhoto[];
  alerts: Alert[];
  metrics?: PatientMetrics;
  onViewItem: (type: 'checkin' | 'medication' | 'wound', id: string) => void;
}> = ({ patient, checkIns, medications, woundPhotos, alerts, metrics, onViewItem }) => {
  const latestCheckIn = checkIns[0];
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Latest Pain Level</span>
            <Activity className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{latestCheckIn?.painLevel || 'N/A'}<span className="text-lg text-gray-500">/10</span></p>
          {latestCheckIn && (
            <p className="text-xs text-gray-500 mt-1">
              {latestCheckIn.painLevel > 7 ? 'High' : latestCheckIn.painLevel > 4 ? 'Moderate' : 'Low'}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Mobility Score</span>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{latestCheckIn?.mobilityScore || 'N/A'}<span className="text-lg text-gray-500">/10</span></p>
          {latestCheckIn && (
            <p className="text-xs text-gray-500 mt-1">
              {latestCheckIn.mobilityScore > 7 ? 'Good' : latestCheckIn.mobilityScore > 4 ? 'Fair' : 'Poor'}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Medication Adherence</span>
            <Pill className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{latestCheckIn?.medicationAdherence || 0}%</p>
          {latestCheckIn && (
            <p className="text-xs text-gray-500 mt-1">
              {latestCheckIn.medicationAdherence >= 90 ? 'Excellent' : latestCheckIn.medicationAdherence >= 70 ? 'Good' : 'Needs Improvement'}
            </p>
          )}
        </div>
      </div>

      {/* Recent Check-in Summary */}
      {latestCheckIn && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Latest Check-in</h2>
            <button
              onClick={() => onViewItem('checkin', latestCheckIn.id)}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View Details <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Emotional State</p>
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-gray-400" />
                <span className="font-medium capitalize">{latestCheckIn.emotionalState}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Sleep Quality</p>
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{latestCheckIn.sleepQuality}/10</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Appetite</p>
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-gray-400" />
                <span className="font-medium capitalize">{latestCheckIn.appetite}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Symptoms</p>
              <span className="font-medium">{latestCheckIn.symptoms.length} reported</span>
            </div>
          </div>
          {latestCheckIn.symptoms.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Symptoms:</p>
              <div className="flex flex-wrap gap-2">
                {latestCheckIn.symptoms.map((symptom, idx) => (
                  <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Alerts */}
      {unacknowledgedAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-red-900">Active Alerts ({unacknowledgedAlerts.length})</h2>
          </div>
          <div className="space-y-2">
            {unacknowledgedAlerts.map(alert => (
              <div key={alert.id} className="bg-white rounded p-3 border border-red-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Medications ({medications.length})</h3>
          <div className="space-y-2">
            {medications.slice(0, 3).map(med => (
              <div key={med.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => onViewItem('medication', med.id)}>
                <div>
                  <p className="font-medium text-sm">{med.name}</p>
                  <p className="text-xs text-gray-500">{med.dosage} • {med.frequency}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${med.adherence >= 90 ? 'text-green-600' : med.adherence >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {med.adherence}%
                  </p>
                  {med.missedDoses > 0 && (
                    <p className="text-xs text-red-600">{med.missedDoses} missed</p>
                  )}
                </div>
              </div>
            ))}
            {medications.length > 3 && (
              <button
                onClick={() => {}}
                className="text-sm text-primary-600 hover:text-primary-700 w-full text-left p-2"
              >
                View all {medications.length} medications →
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Wound Photos ({woundPhotos.length})</h3>
          <div className="grid grid-cols-2 gap-2">
            {woundPhotos.slice(0, 4).map(photo => (
              <div
                key={photo.id}
                onClick={() => onViewItem('wound', photo.id)}
                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity group"
              >
                <img src={photo.imageUrl} alt="Wound" className="w-full h-full object-cover" />
                {photo.flagged && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Flagged
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            ))}
          </div>
          {woundPhotos.length > 4 && (
            <button
              onClick={() => {}}
              className="text-sm text-primary-600 hover:text-primary-700 mt-2"
            >
              View all {woundPhotos.length} photos →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Metrics View
const MetricsView: React.FC<{ metrics?: PatientMetrics; checkIns: DailyCheckIn[] }> = ({ metrics, checkIns }) => {
  if (!metrics) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500">
        No metrics data available
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Pain Level Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics.painTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} name="Pain Level" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Mobility Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.mobilityTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} name="Mobility Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Medication Adherence Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.medicationAdherenceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} name="Adherence %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Check-in Completion Rate</p>
          <p className="text-3xl font-bold text-gray-900">{metrics.checkInCompletionRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Total Check-ins</p>
          <p className="text-3xl font-bold text-gray-900">{metrics.totalCheckIns}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-2">Missed Check-ins</p>
          <p className="text-3xl font-bold text-red-600">{metrics.missedCheckIns}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Check-ins View
const CheckInsView: React.FC<{ checkIns: DailyCheckIn[]; onViewItem: (type: 'checkin', id: string) => void }> = ({ checkIns, onViewItem }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Daily Check-ins ({checkIns.length})</h2>
      <div className="space-y-4">
        {checkIns.map(checkIn => (
          <div
            key={checkIn.id}
            onClick={() => onViewItem('checkin', checkIn.id)}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-900">{new Date(checkIn.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">{new Date(checkIn.date).toLocaleDateString('en-US', { weekday: 'long' })}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Pain Level</p>
                <p className="font-semibold text-lg">{checkIn.painLevel}/10</p>
              </div>
              <div>
                <p className="text-gray-600">Mobility</p>
                <p className="font-semibold text-lg">{checkIn.mobilityScore}/10</p>
              </div>
              <div>
                <p className="text-gray-600">Medication Adherence</p>
                <p className="font-semibold text-lg">{checkIn.medicationAdherence}%</p>
              </div>
              <div>
                <p className="text-gray-600">Symptoms</p>
                <p className="font-semibold text-lg">{checkIn.symptoms.length}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Medications View
const MedicationsView: React.FC<{ medications: Medication[]; onViewItem: (type: 'medication', id: string) => void }> = ({ medications, onViewItem }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Medications ({medications.length})</h2>
      <div className="space-y-4">
        {medications.map(med => (
          <div
            key={med.id}
            onClick={() => onViewItem('medication', med.id)}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Pill className="w-5 h-5 text-primary-500" />
                  <h3 className="font-semibold text-gray-900">{med.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-1">{med.dosage} • {med.frequency}</p>
                <p className="text-xs text-gray-500">Started: {new Date(med.startDate).toLocaleDateString()}</p>
                {med.lastTaken && (
                  <p className="text-xs text-gray-500">Last taken: {new Date(med.lastTaken).toLocaleString()}</p>
                )}
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold mb-1 ${
                  med.adherence >= 90 ? 'text-green-600' :
                  med.adherence >= 70 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {med.adherence}%
                </div>
                <p className="text-xs text-gray-500">Adherence</p>
                {med.missedDoses > 0 && (
                  <p className="text-xs text-red-600 mt-1">{med.missedDoses} missed doses</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Wounds View
const WoundsView: React.FC<{ woundPhotos: WoundPhoto[]; onViewItem: (type: 'wound', id: string) => void }> = ({ woundPhotos, onViewItem }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Wound Photos ({woundPhotos.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {woundPhotos.map(photo => (
          <div
            key={photo.id}
            onClick={() => onViewItem('wound', photo.id)}
            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
          >
            <img src={photo.imageUrl} alt="Wound" className="w-full h-full object-cover" />
            {photo.flagged && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Flagged
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <p className="text-white text-sm font-medium">{new Date(photo.date).toLocaleDateString()}</p>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Alerts View
const AlertsView: React.FC<{ alerts: Alert[] }> = ({ alerts }) => {
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Alerts ({alerts.length})</h2>
      <div className="space-y-3">
        {sortedAlerts.map(alert => (
          <div
            key={alert.id}
            className={`border rounded-lg p-4 ${
              alert.severity === 'critical' ? 'border-red-300 bg-red-50' :
              alert.severity === 'warning' ? 'border-yellow-300 bg-yellow-50' :
              'border-blue-300 bg-blue-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                  alert.severity === 'critical' ? 'text-red-600' :
                  alert.severity === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{alert.message}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="capitalize">{alert.type}</span>
                    <span>•</span>
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {alert.acknowledged ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Acknowledged
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Timeline View
const TimelineView: React.FC<{
  patient: Patient;
  checkIns: DailyCheckIn[];
  medications: Medication[];
  woundPhotos: WoundPhoto[];
}> = ({ patient, checkIns, medications, woundPhotos }) => {
  const allEvents: Array<
    | { type: 'checkin'; date: string; data: DailyCheckIn }
    | { type: 'wound'; date: string; data: WoundPhoto }
    | { type: 'surgery'; date: string; data: { type: string } }
  > = [
    ...checkIns.map(c => ({ type: 'checkin' as const, date: c.date, data: c })),
    ...woundPhotos.map(w => ({ type: 'wound' as const, date: w.date, data: w })),
    { type: 'surgery' as const, date: patient.surgeryDate, data: { type: patient.surgeryType } }
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Recovery Timeline</h2>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
        <div className="space-y-6">
          {allEvents.map((event, idx) => (
            <div key={idx} className="relative flex items-start gap-4">
              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                event.type === 'surgery' ? 'bg-blue-500' :
                event.type === 'checkin' ? 'bg-green-500' :
                'bg-purple-500'
              }`}>
                {event.type === 'surgery' && <Activity className="w-4 h-4 text-white" />}
                {event.type === 'checkin' && <Calendar className="w-4 h-4 text-white" />}
                {event.type === 'wound' && <Camera className="w-4 h-4 text-white" />}
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">
                    {event.type === 'surgery' && 'Surgery'}
                    {event.type === 'checkin' && 'Daily Check-in'}
                    {event.type === 'wound' && 'Wound Photo'}
                  </p>
                  <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                </div>
                {event.type === 'checkin' && (
                  <div className="text-sm text-gray-600">
                    <p>Pain: {event.data.painLevel}/10 • Mobility: {event.data.mobilityScore}/10</p>
                    <p>Adherence: {event.data.medicationAdherence}%</p>
                  </div>
                )}
                {event.type === 'wound' && event.data.flagged && (
                  <p className="text-sm text-red-600">Flagged: {event.data.flaggedReason || 'Needs review'}</p>
                )}
                {event.type === 'surgery' && (
                  <p className="text-sm text-gray-600">{event.data.type}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Detail View Components
const DetailViewComponent: React.FC<{
  type: DetailView;
  selectedItem: string | null;
  patient: Patient;
  checkIns: DailyCheckIn[];
  medications: Medication[];
  woundPhotos: WoundPhoto[];
  onClose: () => void;
}> = ({ type, selectedItem, patient, checkIns, medications, woundPhotos, onClose }) => {
  if (!selectedItem) return null;

  switch (type) {
    case 'checkin-detail':
      const checkIn = checkIns.find(c => c.id === selectedItem);
      if (!checkIn) return null;
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Check-in Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Date</p>
              <p className="font-semibold">{new Date(checkIn.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pain Level</p>
                <p className="text-2xl font-bold">{checkIn.painLevel}/10</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Mobility Score</p>
                <p className="text-2xl font-bold">{checkIn.mobilityScore}/10</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Medication Adherence</p>
                <p className="text-2xl font-bold">{checkIn.medicationAdherence}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Sleep Quality</p>
                <p className="text-2xl font-bold">{checkIn.sleepQuality}/10</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Symptoms</p>
              <div className="flex flex-wrap gap-2">
                {checkIn.symptoms.length > 0 ? (
                  checkIn.symptoms.map((symptom, idx) => (
                    <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      {symptom}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No symptoms reported</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Emotional State</p>
                <p className="font-medium capitalize">{checkIn.emotionalState}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Appetite</p>
                <p className="font-medium capitalize">{checkIn.appetite}</p>
              </div>
            </div>
            {checkIn.notes && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Notes</p>
                <p className="bg-gray-50 rounded-lg p-4 text-gray-900">{checkIn.notes}</p>
              </div>
            )}
          </div>
        </motion.div>
      );

    case 'medication-detail':
      const medication = medications.find(m => m.id === selectedItem);
      if (!medication) return null;
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Medication Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Medication Name</p>
              <p className="text-xl font-semibold">{medication.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dosage</p>
                <p className="font-medium">{medication.dosage}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Frequency</p>
                <p className="font-medium">{medication.frequency}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Start Date</p>
                <p className="font-medium">{new Date(medication.startDate).toLocaleDateString()}</p>
              </div>
              {medication.endDate && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">End Date</p>
                  <p className="font-medium">{new Date(medication.endDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Adherence Rate</p>
                <p className={`text-2xl font-bold ${
                  medication.adherence >= 90 ? 'text-green-600' :
                  medication.adherence >= 70 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {medication.adherence}%
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    medication.adherence >= 90 ? 'bg-green-500' :
                    medication.adherence >= 70 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${medication.adherence}%` }}
                />
              </div>
            </div>
            {medication.missedDoses > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">⚠️ {medication.missedDoses} missed dose{medication.missedDoses !== 1 ? 's' : ''}</p>
              </div>
            )}
            {medication.lastTaken && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Taken</p>
                <p className="font-medium">{new Date(medication.lastTaken).toLocaleString()}</p>
              </div>
            )}
          </div>
        </motion.div>
      );

    case 'wound-detail':
      const wound = woundPhotos.find(w => w.id === selectedItem);
      if (!wound) return null;
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Wound Photo Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Date</p>
              <p className="font-semibold">{new Date(wound.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img src={wound.imageUrl} alt="Wound" className="w-full h-auto" />
            </div>
            {wound.flagged && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="font-semibold text-red-900">Flagged for Review</p>
                </div>
                {wound.flaggedReason && (
                  <p className="text-red-800">{wound.flaggedReason}</p>
                )}
              </div>
            )}
            {wound.notes && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Notes</p>
                <p className="bg-gray-50 rounded-lg p-4 text-gray-900">{wound.notes}</p>
              </div>
            )}
          </div>
        </motion.div>
      );

    default:
      return null;
  }
};

export default PatientDetail;

