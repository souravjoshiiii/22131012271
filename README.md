# URL Shortener

A modern, responsive URL shortening application built with React, TypeScript, and native CSS. Create short, memorable links for your long URLs with comprehensive analytics and tracking.

## Features

- **URL Shortening**: Create short, memorable links for long URLs
- **Custom Short Codes**: Option to create custom short codes
- **Expiry Dates**: Set expiration dates for shortened URLs
- **Analytics Dashboard**: Track clicks, referrers, countries, and devices
- **Click Analytics**: Detailed click tracking with user agent and location data
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Local Storage**: Persists URLs locally for convenience
- **Error Handling**: Comprehensive error boundaries and validation
- **TypeScript**: Full type safety throughout the application

## Technology Stack

- **Frontend**: React 19.1.0 with TypeScript
- **Routing**: React Router DOM 7.6.2
- **HTTP Client**: Axios 1.10.0
- **Styling**: Native CSS with custom utility classes
- **State Management**: React Hooks
- **Storage**: Browser localStorage
- **Logging**: Custom logger with different log levels

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.tsx
│   ├── Navigation.tsx
│   ├── UrlForm.tsx
│   ├── UrlCard.tsx
│   ├── StatisticsCard.tsx
│   ├── ClickTable.tsx
│   └── RedirectHandler.tsx
├── pages/              # Page components
│   ├── UrlShortener.tsx
│   └── Statistics.tsx
├── services/           # API and external services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── logger.ts
│   ├── storage.ts
│   └── validation.ts
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css           # Global styles and utility classes
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd url-shortener
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Usage

### Creating Short URLs

1. Navigate to the home page
2. Enter your long URL in the form
3. Optionally set a custom short code and expiry date
4. Click "Shorten URL" to create your short link

### Viewing Analytics

1. Click on "Statistics" in the navigation
2. View comprehensive analytics including:
   - Total and unique clicks
   - Average clicks per day
   - Top referrers and countries
   - Click trends over time
   - Detailed click data with device and browser information

### Managing URLs

- View your recent shortened URLs on the home page
- Copy URLs to clipboard with one click
- Delete individual URLs or clear all URLs
- Visit original URLs directly from the app

## API Integration

The application currently uses mock data for demonstration purposes. To integrate with a real backend API:

1. Update the `REACT_APP_API_URL` environment variable
2. Modify the API service methods in `src/services/api.ts`
3. Ensure your backend implements the expected endpoints:
   - `POST /urls` - Create shortened URL
   - `GET /urls/:shortCode/stats` - Get URL statistics
   - `GET /urls/:shortCode` - Get original URL for redirect
   - `DELETE /urls/:id` - Delete shortened URL

## Customization

### Styling

The application uses a custom CSS framework with utility classes. Main styling is in `src/index.css`:

- Grid system: `.grid`, `.grid-1`, `.grid-2`, etc.
- Flexbox utilities: `.flex`, `.flex-center`, `.flex-between`
- Spacing: `.m-1`, `.p-2`, `.mt-3`, etc.
- Colors: `.text-primary`, `.text-secondary`, `.text-error`
- Components: `.btn`, `.card`, `.form-input`, `.alert`

### Configuration

- Update `public/manifest.json` for PWA settings
- Modify `public/index.html` for meta tags and title
- Adjust TypeScript configuration in `tsconfig.json`

## Browser Support

The application supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with Create React App
- Icons and styling inspired by modern web design principles
- Error handling patterns from React best practices
