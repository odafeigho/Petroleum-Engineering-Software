# Reservoir Data Harmonizer

Professional petroleum engineering software for data harmonization and integration. Process logs, seismic, production, and core data with industry-leading accuracy.

## 🚀 Features

- **Multi-format Data Support**: Upload CSV, Excel, JSON, and XML files
- **Advanced Normalization**: Z-Score, Min-Max, Robust, and Quantile algorithms
- **Real-time Processing**: Live progress tracking and notifications
- **Data Integration**: Unified model generation with conflict resolution
- **Quality Assessment**: Comprehensive data quality metrics
- **Professional UI**: Petroleum industry-themed interface
- **PWA Support**: Offline functionality and native app experience
- **Multi-language**: 11 languages with RTL support
- **Export Capabilities**: Download processed data in multiple formats

## 🛠 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom petroleum theme
- **UI Components**: Radix UI with shadcn/ui
- **Charts**: Recharts for data visualization
- **PWA**: Service Worker with offline support
- **Internationalization**: Custom i18n implementation
- **Notifications**: Browser notifications with sound support

## 📱 Progressive Web App

The application is a fully-featured PWA with:
- Offline functionality
- Push notifications
- App installation prompts
- Background sync
- Service worker caching

## 🌍 Internationalization

Supported languages:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Chinese (zh)
- Arabic (ar) - with RTL support
- Portuguese (pt)
- Russian (ru)
- Italian (it)
- Xhosa (xh)
- Sanskrit (sa)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/reservoir-data-harmonizer/app.git
cd reservoir-data-harmonizer
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

\`\`\`bash
npm run build
npm start
\`\`\`

## 📊 Algorithm Implementation

The core data harmonization algorithm follows this mathematical model:

### Normalization Formula
For dataset D = {d₁, d₂, ..., dₙ}, normalization is applied as:

**Z-Score Normalization:**
\`\`\`
d_i^norm = (d_i - μ_i) / σ_i
\`\`\`

**Integration Process:**
\`\`\`
M = ⋃(i=1 to n) T(d_i^norm)
\`\`\`

Where T is the transformation function matching the unified schema.

## 🏗 Project Structure

\`\`\`
reservoir-data-harmonizer/
├── app/                    # Next.js app directory
│   ├── components/         # Page-specific components
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── manifest.json     # PWA manifest
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility libraries
│   ├── i18n/            # Internationalization
│   └── notifications/   # Notification system
├── public/              # Static assets
│   ├── icons/          # PWA icons
│   ├── flags/          # Country flags
│   └── images/         # Images
└── ...                 # Config files
\`\`\`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

\`\`\`env
NEXT_PUBLIC_APP_NAME="Reservoir Data Harmonizer"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
\`\`\`

### PWA Configuration

The PWA is configured in `app/manifest.json` with:
- App icons for all device sizes
- Offline capabilities
- App shortcuts
- Theme colors

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with each push

### Manual Deployment

\`\`\`bash
npm run build
npm start
\`\`\`

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Bundle Size**: Optimized with code splitting
- **Caching**: Service worker with intelligent caching strategy

## 🔒 Security

- Content Security Policy headers
- XSS protection
- CSRF protection
- Secure data handling
- Input validation and sanitization

## 🧪 Testing

\`\`\`bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
\`\`\`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Visit our documentation
- Contact the development team

## 🎯 Roadmap

- [ ] Advanced machine learning algorithms
- [ ] Real-time collaboration features
- [ ] Enhanced data visualization
- [ ] API integration capabilities
- [ ] Mobile app development
- [ ] Cloud storage integration

---

**Reservoir Data Harmonizer** - Professional Petroleum Engineering Software
