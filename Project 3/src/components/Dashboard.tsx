import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Activity,
  Users,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Clock,
  ChevronRight,
  User,
  Calendar,
  Stethoscope
} from 'lucide-react';
import { Patient, RiskLevel } from '../types';
import { mockPatients, mockAlerts } from '../mockData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPatients = useMemo(() => {
    return mockPatients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.surgeryType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = riskFilter === 'all' || patient.riskLevel === riskFilter;
      const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
      return matchesSearch && matchesRisk && matchesStatus;
    });
  }, [searchQuery, riskFilter, statusFilter]);

  const patientsByRisk = useMemo(() => {
    return {
      high: filteredPatients.filter(p => p.riskLevel === 'high'),
      medium: filteredPatients.filter(p => p.riskLevel === 'medium'),
      low: filteredPatients.filter(p => p.riskLevel === 'low')
    };
  }, [filteredPatients]);

  const unacknowledgedAlerts = mockAlerts.filter(a => !a.acknowledged);
  const criticalAlerts = unacknowledgedAlerts.filter(a => a.severity === 'critical');

  const stats = {
    total: mockPatients.length,
    highRisk: patientsByRisk.high.length,
    mediumRisk: patientsByRisk.medium.length,
    lowRisk: patientsByRisk.low.length,
    needsAttention: mockPatients.filter(p => p.status === 'needs-attention').length,
    atRisk: mockPatients.filter(p => p.status === 'at-risk').length,
    stable: mockPatients.filter(p => p.status === 'stable').length
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
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

  const PatientCard: React.FC<{ patient: Patient }> = ({ patient }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/patient/${patient.id}`)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(patient.riskLevel)}`}>
              {patient.riskLevel.toUpperCase()} RISK
            </span>
          </div>
          <p className="text-sm text-gray-600">{patient.surgeryType}</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${getStatusColor(patient.status)}`} title={patient.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-4 h-4" />
          <span>Age {patient.age}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Day {patient.daysSinceSurgery}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Activity className="w-4 h-4" />
          <span>Score: {patient.riskScore}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{new Date(patient.lastCheckIn).toLocaleDateString()}</span>
        </div>
      </div>

      {patient.assignedClinician && (
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <Stethoscope className="w-3 h-3" />
          <span>{patient.assignedClinician}</span>
        </div>
      )}

      <div className="mt-3 flex items-center text-primary-600 text-sm font-medium">
        View Details
        <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recovery Monitoring Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor and manage post-surgery patient recovery</p>
            </div>
            {criticalAlerts.length > 0 && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-semibold">{criticalAlerts.length} Critical Alert{criticalAlerts.length !== 1 ? 's' : ''}</span>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-primary-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Risk</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.highRisk}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Needs Attention</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{stats.needsAttention}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{unacknowledgedAlerts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search patients by name or surgery type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'all')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Risk Levels</option>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="needs-attention">Needs Attention</option>
                <option value="at-risk">At Risk</option>
                <option value="recovering">Recovering</option>
                <option value="stable">Stable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Risk-Stratified Patient Lists */}
        <div className="space-y-6">
          {/* High Risk Patients */}
          {patientsByRisk.high.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">High Risk Patients ({patientsByRisk.high.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patientsByRisk.high.map(patient => (
                  <PatientCard key={patient.id} patient={patient} />
                ))}
              </div>
            </section>
          )}

          {/* Medium Risk Patients */}
          {patientsByRisk.medium.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-yellow-600" />
                <h2 className="text-xl font-semibold text-gray-900">Medium Risk Patients ({patientsByRisk.medium.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patientsByRisk.medium.map(patient => (
                  <PatientCard key={patient.id} patient={patient} />
                ))}
              </div>
            </section>
          )}

          {/* Low Risk Patients */}
          {patientsByRisk.low.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Low Risk Patients ({patientsByRisk.low.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patientsByRisk.low.map(patient => (
                  <PatientCard key={patient.id} patient={patient} />
                ))}
              </div>
            </section>
          )}

          {filteredPatients.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No patients found matching your filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;


