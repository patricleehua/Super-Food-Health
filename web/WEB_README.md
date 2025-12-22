# HealthTrack Pro - Web Application

A comprehensive health tracking web application built with Next.js, React, and TypeScript. This application provides users with powerful tools to track nutrition, set health goals, manage privacy, and generate detailed health reports.

## 🎯 Features

### 📊 Data Dashboard

- **Weight Trend Visualization**: Track weight changes over time with interactive charts
- **Green Score Metrics**: Monitor health scores with component breakdown (Structure, Excess Control, Processing)
- **Nutritional Intake History**: Track calories, protein, sugar, sodium, and fiber with trend indicators
- **Trigger Foods Analysis**: Identify foods that negatively impact health scores
- **Trigger Times**: Analyze when unhealthy consumption patterns occur

### 🎯 Goal Simulation & Path

- **Interactive Parameter Controls**: Adjust weight goals, workout frequency, daily steps, and dietary habits
- **Weight Loss Projection**: Visualize projected weight trajectory over weeks/months
- **Feasibility Analysis**: Get real-time feedback on plan sustainability (92% feasibility score)
- **Daily Targets**: Receive personalized calorie and protein recommendations
- **Sustainability Advice**: Get AI-powered insights on achieving goals safely

### 🔒 Privacy & Data Management

- **Data Export**: Download complete health records in CSV, JSON, or PDF format
- **Third-Party App Management**: Control access for connected fitness apps (Google Fit, Strava)
- **Consent Log**: Track all privacy consents and authorizations
- **Data Deletion**: Delete specific date ranges or entire account
- **Compliance Resources**: Quick access to Privacy Policy, Terms, and GDPR info

### 📄 Report Export & Share

- **Custom Report Generation**: Select date ranges and specific health metrics
- **Live Preview**: See report layout before exporting
- **Desensitized Mode**: Share trends without exposing raw data
- **Coach Access Management**: Grant view-only access to nutritionists and trainers
- **Automatic Link Expiration**: Generated web links expire after 7 days for security

## 🛠️ Technology Stack

- **Framework**: Next.js 16.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Font**: Manrope (Google Fonts)
- **Date Handling**: date-fns
- **Utilities**: clsx for conditional classNames

## 📁 Project Structure

```
web/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── dashboard/            # Data Dashboard page
│   │   ├── goal-simulation/      # Goal Simulation & Path page
│   │   ├── privacy/              # Privacy & Data Management page
│   │   ├── reports/              # Report Export & Share page
│   │   ├── settings/             # Settings page
│   │   ├── layout.tsx            # Root layout with fonts
│   │   ├── page.tsx              # Home page (redirects to dashboard)
│   │   └── globals.css           # Global styles and Tailwind config
│   ├── components/
│   │   └── sidebar.tsx           # Shared navigation sidebar
│   └── lib/
│       ├── utils.ts              # Utility functions
│       └── mock-data.ts          # Mock data for all pages
├── package.json
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

1. Navigate to the web directory:

```bash
cd web
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Design System

### Color Palette

- **Primary**: `#13ec80` (Green) - Main brand color
- **Background Light**: `#f6f8f7` - Light mode background
- **Background Dark**: `#102219` - Dark mode background
- **Text Main**: `#111814` - Primary text color
- **Text Muted**: `#618975` - Secondary text color

### Typography

- **Font Family**: Manrope
- **Weights**: 200, 300, 400, 500, 600, 700, 800
- **Headings**: Bold (700-800) with tight tracking
- **Body**: Medium (400-500)

## 📱 Responsive Design

All pages are fully responsive with breakpoints:

- **Mobile**: < 768px (1 column layouts)
- **Tablet**: 768px - 1024px (Sidebar hidden, 2 column layouts)
- **Desktop**: > 1024px (Sidebar visible, multi-column layouts)

## 🔄 Mock Data

Currently, all data is mocked for demonstration purposes. The mock data includes:

- Weight trend data (6 weeks)
- Green score trends
- Nutritional intake history (5 nutrients)
- Trigger foods and times
- Goal simulation parameters
- Privacy consent logs
- Third-party app connections
- Coach access permissions

**To integrate with backend**: Replace imports from `@/lib/mock-data.ts` with actual API calls.

## 🌙 Dark Mode

Dark mode is supported across all pages:

- Automatically detects system preference
- Smooth transitions between themes
- Carefully selected dark mode color palette
- All charts and visualizations adapt to theme

## 🎯 Future Enhancements

### Backend Integration

1. Replace mock data with API calls
2. Implement authentication (JWT/OAuth)
3. Add real-time data synchronization
4. Set up WebSocket for live updates

### New Features

1. **Food Diary**: Daily meal logging with photo upload
2. **Exercise Tracking**: Integration with fitness devices
3. **Social Features**: Share achievements, join challenges
4. **AI Insights**: Personalized nutrition recommendations
5. **Meal Planning**: AI-generated meal plans based on goals

### Performance

1. Implement data caching with SWR or React Query
2. Add loading states and skeletons
3. Optimize chart rendering
4. Lazy load heavy components

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

This is a demonstration project. For production use:

1. Replace mock data with real API integration
2. Implement proper authentication
3. Add comprehensive error handling
4. Include loading states
5. Add unit and integration tests
6. Implement proper form validation

## 📄 License

This project is part of the HealthTrack Pro MVP. See main README for licensing information.

## 🐛 Known Issues

1. Recharts hydration warnings on initial load (cosmetic only)
2. Dark mode requires page reload in some cases
3. Mobile sidebar needs hamburger menu implementation

## 📞 Support

For issues or questions about the web application, please refer to the main project documentation.

---

Built with ❤️ using Next.js and Tailwind CSS
