# Travel Day Tracker

A modern web application for tracking travel days across multiple countries to help with residence requirements, visa compliance, and tax obligations.

## 🎯 Purpose

This application helps individuals and couples track their days spent in different countries throughout the year. It's particularly useful for:

- **Residence Requirements**: Track days for citizenship, permanent residence, or visa compliance
- **Tax Obligations**: Monitor residence status for tax purposes (183-day rules, etc.)
- **Visa Compliance**: Ensure you don't overstay tourist visa limits
- **Dual Residence**: Manage complex residence requirements across multiple countries

## ✨ Features

### 👥 Multi-Traveler Support
- Track trips for two people (Person 1 & Person 2)
- Switch between travelers with a clean toggle interface
- Separate statistics and trip histories for each person
- Visual traveler indicators on all trip entries

### 📊 Smart Statistics
- Real-time day counting for current year
- Separate statistics per traveler per country
- Automatic calculation including start and end dates
- Visual breakdown by country (Greece/UK currently supported)

### ☁️ GitHub Sync
- Store data securely in your private GitHub repository
- Automatic backup and sync across devices
- Manual save/load functionality
- Complete offline capability with local storage

### 🔐 Data Management
- **Import/Export**: JSON file backup and restore
- **Reset Functionality**: Complete data wipe with confirmation
- **GitHub Integration**: Optional cloud storage and sync
- **Data Migration**: Automatic handling of legacy data formats

### 📱 Mobile Optimized
- Responsive design works on all devices
- Progressive Web App (PWA) support
- Save to home screen on iOS/Android
- Touch-friendly interface

### 🛡️ Security Features
- Data stored in your own GitHub repository
- No external services or data collection
- Secure confirmation for destructive actions
- Local-first with optional cloud sync

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd country-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview  # Preview production build locally
```

## 📱 Mobile Web App Setup

### iOS (iPhone/iPad)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will appear with a custom icon and run fullscreen

### Android
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home screen"
4. The app will be added to your home screen

## ⚙️ Configuration

### GitHub Integration (Optional)
1. Create a GitHub Personal Access Token with repo permissions
2. Click the settings gear in the app header
3. Enter your GitHub details:
   - **Token**: Your personal access token
   - **Owner**: Your GitHub username
   - **Repository**: Repository name for data storage
   - **Filename**: Name for the data file (default: country-tracker-data.json)

### Adding Countries
Currently supports Greece and UK. To add more countries, modify:
- `src/types.ts` - Update the country union type
- Component forms and displays - Add new country options

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Static hosting compatible

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx          # Main header with actions
│   ├── TravelerSelector.tsx # Switch between travelers
│   ├── StatsCards.tsx      # Statistics display
│   ├── TripForm.tsx        # Add new trips
│   ├── TripList.tsx        # Trip history
│   ├── TripEditor.tsx      # Edit existing trips
│   ├── GitHubSettings.tsx  # GitHub configuration
│   ├── LoadingSpinner.tsx  # Loading states
│   ├── ResetConfirmationModal.tsx # Reset confirmation
│   └── index.ts           # Component exports
├── types.ts            # TypeScript definitions
├── country-tracker.tsx # Main application component
├── App.tsx            # App root
└── main.tsx          # Entry point
```

### Key Components
- **Modular Design**: Each feature is a separate component
- **Type Safety**: Full TypeScript coverage
- **Clean Architecture**: Separation of concerns
- **Reusable**: Components can be easily extended

## 🗂️ Data Format

Trip data is stored as JSON:
```json
{
  "trips": [
    {
      "id": "1701234567890",
      "traveler": "Person 1",
      "country": "Greece",
      "departureDate": "2024-06-15",
      "arrivalDate": "2024-08-30",
      "notes": "Summer vacation"
    }
  ],
  "lastUpdated": "2024-09-12T10:30:00.000Z"
}
```

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding Features
1. Create new components in `src/components/`
2. Export from `src/components/index.ts`
3. Import and use in main component
4. Update types in `src/types.ts` if needed

## 🚀 Deployment

Ready for deployment on any static hosting platform:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

No server-side requirements - pure static site.

## 📄 License

This project is private and not licensed for public use.

## 🤝 Contributing

This is a personal project. For suggestions or issues, please create an issue in the repository.

---

**Built with ❤️ for tracking travel days and maintaining residence compliance.**