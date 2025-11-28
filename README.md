<div align="center">

# ⏰ The Chronoscope

### A Temporal Rendering Engine for Historical Exploration

*Journey through spacetime. Witness history as it unfolds.*

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://chronoscope-amber.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/BioInfo/chronoscope?style=for-the-badge)](https://github.com/BioInfo/chronoscope/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/BioInfo/chronoscope?style=for-the-badge)](https://github.com/BioInfo/chronoscope/issues)

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-3%20Pro-8E75B2?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)

![Chronoscope Banner](https://via.placeholder.com/1200x400/1a1a2e/00d9ff?text=THE+CHRONOSCOPE+%E2%80%A2+TEMPORAL+RENDERING+ENGINE)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-configuration) • [Contributing](#-contributing)

</div>

---

## 🌟 Features

### 🎯 Core Capabilities

- **4D Navigation System** - Navigate through spacetime using precise spatial (latitude/longitude) and temporal (year/month/day/hour) coordinates
- **Historical Scene Rendering** - Algorithmically generates rich historical context including environmental conditions, anthropological data, and safety metrics
- **Curated Waypoints** - 8 pivotal moments in history from Pompeii (79 AD) to the Fall of the Berlin Wall (1989)
- **AI Image Generation** - Photorealistic historical scene generation powered by Google Gemini 3 Pro Image
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices
- **Real-time Data Visualization** - Detailed metrics including weather, population density, technology era, and hazard levels

### 🎨 Technical Highlights

- **Modern React Architecture** - Context + Reducer pattern for centralized state management
- **Type-Safe TypeScript** - Comprehensive type system covering all domain concepts
- **Era Classification** - 11 historical periods from Stone Age to Space Age
- **Historical Accuracy** - Era-specific prompt engineering for authentic AI-generated imagery
- **Zero Dependencies Required** - Works without API key for scene rendering; optional Gemini integration for images

---

## 📸 Demo

Visit the live application: **[chronoscope-amber.vercel.app](https://chronoscope-amber.vercel.app)**

### Example Waypoints

| Location | Date | Significance |
|----------|------|--------------|
| 🚀 **Sea of Tranquility** | July 20, 1969 | First human landing on the Moon |
| 🌋 **Pompeii** | August 24, 79 AD | Vesuvius eruption destroys Roman city |
| ☢️ **Hiroshima** | August 6, 1945 | First atomic bomb deployment |
| ✈️ **Kitty Hawk** | December 17, 1903 | Wright Brothers' first powered flight |
| 🧱 **Berlin** | November 9, 1989 | Fall of the Berlin Wall |

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Git** for version control
- **(Optional)** [Google Gemini API Key](https://aistudio.google.com/apikey) for image generation

### Quick Start

```bash
# Clone the repository
git clone https://github.com/BioInfo/chronoscope.git
cd chronoscope

# Install dependencies
npm install

# Start development server (opens at http://localhost:3000)
npm run dev
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

---

## 📖 Usage

### Basic Navigation

1. **Enter Coordinates**: Use the Control Plane to input spatial (latitude/longitude) and temporal (year/month/day/hour) coordinates
2. **Render Scene**: Click "Render Scene" to generate historical data for your chosen spacetime location
3. **View Data**: Examine environmental conditions, anthropological context, and safety metrics in the Data Stream panel

### Quick Navigation with Waypoints

Click any curated waypoint card to instantly jump to a significant historical moment with pre-computed scene data.

### AI Image Generation (Optional)

1. Configure your Gemini API key in **Settings** (top-right corner)
2. Render any scene
3. Click **"Generate Image"** to create a photorealistic visualization
4. View the AI-generated historical scene in the viewport

---

## 🔑 API Configuration

### Gemini API Key Setup

The Chronoscope works fully without an API key for scene rendering. Image generation requires a free Google Gemini API key:

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Generate a free API key
3. Add to `.env` file (optional):
   ```bash
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
4. Or configure via **Settings UI** (stored in browser localStorage)

**Note**: API keys stored via Settings UI are saved locally and never transmitted except to Google's Gemini API.

---

## 🏗️ Architecture

### Project Structure

```
chronoscope/
├── src/
│   ├── components/       # React UI components
│   │   ├── ControlPlane.tsx
│   │   ├── Viewport.tsx
│   │   ├── DataStream.tsx
│   │   ├── Waypoints.tsx
│   │   ├── Header.tsx
│   │   └── Settings.tsx
│   ├── context/          # State management
│   │   └── ChronoscopeContext.tsx
│   ├── data/             # Curated content
│   │   └── waypoints.ts
│   ├── services/         # External integrations
│   │   └── geminiService.ts
│   ├── types/            # TypeScript definitions
│   │   └── index.ts
│   ├── utils/            # Helper functions
│   │   ├── sceneGenerator.ts
│   │   └── validation.ts
│   ├── App.tsx
│   └── main.tsx
├── public/               # Static assets
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### Key Technologies

- **React 19** - Latest React with concurrent features
- **TypeScript 5.9** - Type-safe development
- **Vite 7** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **Lucide React** - Beautiful icon library
- **Google Gemini 3 Pro Image** - State-of-the-art AI image generation

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Areas for Contribution

- 🗺️ **Additional Waypoints** - Expand the curated historical moments
- 🌍 **Geocoding Integration** - Real location name lookup from coordinates
- 📚 **Historical Database** - Connect to real historical events API
- 🎨 **UI Enhancements** - Improve visualizations and user experience
- 🧪 **Testing** - Add unit and integration tests
- 📖 **Documentation** - Improve guides and API documentation

### Code Guidelines

- Follow existing TypeScript patterns and type definitions
- Use functional components with hooks
- Maintain responsive design for all screen sizes
- Write clear commit messages following conventional commits
- See [CLAUDE.md](CLAUDE.md) for architecture details

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Historical Data** - Algorithmically generated; not backed by real historical databases
- **AI Generation** - Powered by [Google Gemini 3 Pro Image](https://ai.google.dev)
- **Design Inspiration** - Sci-fi interfaces and temporal navigation concepts
- **Icons** - [Lucide Icons](https://lucide.dev)

---

## 🔗 Links

- **Live Demo**: [chronoscope-amber.vercel.app](https://chronoscope-amber.vercel.app)
- **GitHub Repository**: [github.com/BioInfo/chronoscope](https://github.com/BioInfo/chronoscope)
- **Issue Tracker**: [github.com/BioInfo/chronoscope/issues](https://github.com/BioInfo/chronoscope/issues)
- **Gemini API**: [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

---

<div align="center">

**Made with ⏰ by [Justin Johnson](https://github.com/BioInfo)**

⭐ **Star this repo if you find it interesting!**

[![GitHub followers](https://img.shields.io/github/followers/BioInfo?style=social)](https://github.com/BioInfo)

</div>
