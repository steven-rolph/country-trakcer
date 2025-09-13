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
- Track trips for two people (Cheryl & Nigel)
- Switch between travelers with a clean toggle interface
- Separate statistics and trip histories for each person
- Visual traveler indicators on all trip entries

### 📊 Smart Statistics
- Real-time day counting for current year
- Separate statistics per traveler per country
- Automatic calculation including start and end dates
- Visual breakdown by country (Greece/UK currently supported)
- Year-by-year filtering and analysis

### ☁️ Redis Cloud Storage
- Store data securely in Redis cloud database
- Automatic backup and sync across devices
- API-based data persistence
- Complete offline capability with local storage fallback

### 🔐 Data Management
- **Import/Export**: JSON file backup and restore
- **Reset Functionality**: Complete data wipe with admin password protection
- **Redis Integration**: Cloud storage and sync via API
- **Data Migration**: Automatic handling of legacy data formats
- **Activity Logging**: Track all data operations

### 📱 Mobile Optimized
- Responsive design works on all devices
- Progressive Web App (PWA) support
- Save to home screen on iOS/Android
- Touch-friendly interface

### 📄 PDF Export
- Generate comprehensive travel summaries
- Multi-year reports with detailed breakdowns
- Professional formatting for visa applications
- Automatic day calculations per country per year

### 🛡️ Security Features
- Data stored in secure Redis cloud database
- Admin password protection for data reset operations
- Secure confirmation for destructive actions
- Local-first with optional cloud sync
- Activity logging for audit trails

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

### Redis Cloud Integration
The app automatically connects to a Redis cloud database for data persistence. All data operations include:
- Automatic sync to cloud storage
- Local storage fallback for offline use
- Activity logging for audit trails
- Admin password protection for sensitive operations

### Adding Countries
Currently supports Greece and UK. To add more countries, modify:
- `src/types.ts` - Update the country union type
- Component forms and displays - Add new country options
- `src/utils/pdfGenerator.ts` - Update PDF generation for new countries

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **PDF Generation**: jsPDF + jsPDF-AutoTable
- **Cloud Storage**: Redis
- **Deployment**: Static hosting compatible

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx          # Main header with actions
│   ├── UserSelector.tsx    # Switch between users (Cheryl/Nigel)
│   ├── YearSelector.tsx    # Year filtering
│   ├── StatsCards.tsx      # Statistics display
│   ├── TripForm.tsx        # Add new trips
│   ├── TripList.tsx        # Trip history
│   ├── TripEditor.tsx      # Edit existing trips
│   ├── LoadingSpinner.tsx  # Loading states
│   ├── ResetConfirmationModal.tsx # Reset confirmation
│   └── index.ts           # Component exports
├── services/           # External services
│   └── redis.ts           # Redis cloud storage service
├── utils/             # Utility functions
│   └── pdfGenerator.ts    # PDF export functionality
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
      "user": "Cheryl",
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

### Key Features Usage
- **PDF Export**: Click the download icon in the header to generate travel summaries
- **Year Filtering**: Use the year selector to view data for specific years
- **Data Reset**: Access via settings with admin password protection
- **User Switching**: Toggle between Cheryl and Nigel using the user selector

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

**Built with ❤️ for Cheryl and Nigel to track their travel days and maintain residence compliance.**