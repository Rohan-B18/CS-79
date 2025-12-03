# Recovery Monitoring Platform - Clinician Dashboard

A comprehensive clinician-facing dashboard for monitoring post-surgery patient recovery. This platform provides risk-stratified patient lists, detailed patient views with extensive branching navigation, and visual data displays to help clinicians efficiently monitor and manage patient recovery.

## Features

### Main Dashboard
- **Risk-Stratified Patient Lists**: Patients automatically sorted by risk level (High, Medium, Low)
- **Real-time Statistics**: Overview of total patients, high-risk cases, patients needing attention, and active alerts
- **Advanced Filtering**: Search by name or surgery type, filter by risk level and status
- **Quick Patient Cards**: At-a-glance view of key patient information with easy navigation to detailed views

### Patient Detail Views with Branching Navigation
The platform implements extensive branching to allow clinicians to dive deep into patient data:

1. **Overview View**: 
   - Key metrics summary
   - Latest check-in details
   - Active alerts
   - Quick access to medications and wound photos
   - Branch to: Detailed check-in view, medication details, wound photo details

2. **Metrics & Trends View**:
   - Pain level trend charts
   - Mobility score trends
   - Medication adherence trends
   - Check-in completion statistics

3. **Daily Check-ins View**:
   - List of all patient check-ins
   - Branch to: Individual check-in detail view with full information

4. **Medications View**:
   - List of all medications with adherence rates
   - Branch to: Detailed medication view with adherence history and missed doses

5. **Wound Photos View**:
   - Grid of wound photos with flagged indicators
   - Branch to: Detailed wound photo view with notes and flagging information

6. **Alerts View**:
   - All patient alerts sorted by severity
   - Critical, warning, and info level alerts

7. **Recovery Timeline View**:
   - Chronological view of all recovery events
   - Surgery date, check-ins, and wound photos in timeline format

### Design Features
- **Modern UI/UX**: Clean, professional interface designed for clinical use
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Framer Motion animations for polished interactions
- **Visual Data Displays**: Recharts integration for trend visualization
- **Color-Coded Risk Indicators**: Easy visual identification of patient risk levels
- **Status Indicators**: Quick visual status indicators for patient conditions

## Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation and branching
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Lucide React** for icons

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the dashboard

## Troubleshooting

### "Cannot find module 'node:path'" Error

**Important**: This project requires **Node.js version 14.0.0 or higher**. If you're using Node.js 12.x or earlier, you'll encounter this error.

To check your Node.js version:
```bash
node --version
```

**Solution**: Update to Node.js 14.0.0 or higher (recommended: Node.js 16.x or 18.x LTS).

If you're using [nvm](https://github.com/nvm-sh/nvm):
```bash
nvm install 18
nvm use 18
```

Or download the latest LTS version from [nodejs.org](https://nodejs.org/).

After updating Node.js:

1. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   ```

2. Reinstall dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

```
Project 3/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # Main dashboard with risk-stratified lists
│   │   └── PatientDetail.tsx      # Patient detail view with branching navigation
│   ├── types.ts                   # TypeScript type definitions
│   ├── mockData.ts                # Mock patient data for demonstration
│   ├── App.tsx                    # Main app component with routing
│   ├── index.tsx                  # Entry point
│   └── index.css                  # Global styles
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## Branching Navigation

The platform implements extensive branching to allow clinicians to navigate deeper into patient data:

1. **Dashboard → Patient Detail**: Click any patient card to view full patient details
2. **Overview → Check-in Detail**: Click "View Details" on latest check-in or any check-in in the list
3. **Overview → Medication Detail**: Click any medication to view detailed adherence information
4. **Overview → Wound Photo Detail**: Click any wound photo to view full-size image and notes
5. **Check-ins View → Check-in Detail**: Click any check-in card to view complete information
6. **Medications View → Medication Detail**: Click any medication card for detailed view
7. **Wounds View → Wound Detail**: Click any wound photo for detailed view

Each detail view can be closed to return to the previous view, maintaining navigation context.

## Key Design Decisions

1. **Risk Stratification**: Patients are automatically sorted by risk level to help clinicians prioritize their attention
2. **Progressive Disclosure**: Information is organized hierarchically, allowing clinicians to see overview first, then drill down as needed
3. **Visual Indicators**: Color-coded risk levels and status indicators provide quick visual feedback
4. **Reduced Cognitive Load**: Information is presented in digestible chunks with clear visual hierarchy
5. **Efficient Navigation**: Sidebar navigation allows quick switching between different views of the same patient
6. **Context Preservation**: Breadcrumb-style navigation and back buttons maintain context when drilling into details

## Mock Data

The platform includes comprehensive mock data:
- 8 sample patients with varying risk levels
- Daily check-ins with pain, mobility, and adherence data
- Medication records with adherence tracking
- Wound photos with flagging capabilities
- Patient metrics with trend data
- Alert system with severity levels

## Future Enhancements

Potential additions for production:
- Real-time data integration
- Telehealth integration
- Export capabilities
- Notification system
- Multi-clinician support
- Patient communication tools
- Advanced analytics and reporting

