# 🧬 Flux Agent - AI Health Co-pilot

> **Reimagining how consumers understand food ingredients using an AI-native approach.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5%20Flash-blue?logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 🎯 The Problem

Food labels are optimized for **regulatory compliance**, not human understanding. Consumers face:
- Long ingredient lists with unfamiliar chemical names
- Conflicting health guidance
- No personalized context for their health conditions
- Uncertainty at the exact moment of decision

**Flux Agent** transforms this experience by acting as an intelligent co-pilot that interprets, reasons, and explains—so you don't have to.

---

## ✨ Key Features

### 🤖 AI-Native Experience
- **Zero-config scanning** - Snap a photo or paste text, no forms or filters
- **Voice input** - Speak ingredients naturally (English/Hindi supported)
- **Auto-narration** - Results are read aloud automatically
- **Personalized analysis** - Tailored to YOUR health profile (dietary, conditions, allergies, goals)
- **Smart history** - Track all scans with filtering by verdict, AI-generated health insights

### 🧠 Intelligent Reasoning
- **Verdict with confidence** - Safe / Caution / Avoid with transparency
- **Simple explanations** - Complex science explained like a friend would
- **Bilingual support** - English & Hindi with natural language
- **Who should avoid** - Personalized warnings based on health conditions

### 📱 Seamless Experience
- **Mobile-first design** - Works beautifully on phones
- **Desktop optimized** - Full experience on larger screens
- **Camera integration** - Direct label scanning with OCR
- **Offline preferences** - Your health profile stays on your device

---

## 🖼️ Screenshots

| Home Screen | Scan Interface | Analysis Results |
|-------------|----------------|------------------|
| Clean, intent-first design | Camera + Text + Voice input | Personalized health insights |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ HomeScreen  │  │ ScanOverlay │  │  ResultsView    │  │
│  │             │  │  - Camera   │  │  - Verdict      │  │
│  │             │  │  - Voice    │  │  - Reasoning    │  │
│  │             │  │  - Text     │  │  - Bilingual    │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                    API Routes                            │
│  ┌──────────────────┐  ┌──────────────────────────────┐ │
│  │ /api/extract     │  │ /api/analyze                 │ │
│  │ (Image → Text)   │  │ (Ingredients → Insights)     │ │
│  └────────┬─────────┘  └─────────────┬────────────────┘ │
└───────────┼──────────────────────────┼──────────────────┘
            │                          │
            ▼                          ▼
┌─────────────────────────────────────────────────────────┐
│              Gemini 2.5 Flash (Google AI)               │
│  - Vision OCR for label reading                         │
│  - Reasoning about health impact                        │
│  - Bilingual response generation                        │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Gemini API Key ([Get one free](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/flux-agent.git
cd flux-agent

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🎨 Design Decisions

### Why localStorage for Health Preferences?
> "Database scale is not an evaluation criteria. The experience matters more than the data pipeline." — Problem Statement

- **Privacy-first**: Health data stays on user's device
- **Zero friction**: No login required
- **Instant**: No network latency for preferences
- **Demo reliability**: Works offline, no backend dependencies

### Why Gemini 2.5 Flash?
- Fast response times for real-time analysis
- Strong reasoning capabilities
- Excellent multilingual support (English + Hindi)
- Vision capabilities for OCR

### Why Bilingual (English + Hindi)?
- India has 500M+ Hindi speakers
- Many product labels are in English
- Users can understand in their preferred language
- Voice output in both languages

---

## 📊 Judging Criteria Alignment

### 1. AI-Native Experience (50%)
| Criteria | How We Address It |
|----------|-------------------|
| Intelligent co-pilot? | AI reasons about health impact, not just lists data |
| Intent inferred? | Zero forms—just scan/paste/speak |
| Reduces cognitive effort? | Simple verdicts, friend-like explanations, auto-narration |

### 2. Reasoning & Explainability (30%)
| Criteria | How We Address It |
|----------|-------------------|
| Clear logic? | Structured: Good things → Concerns → Advice |
| Honest uncertainty? | Confidence scores, "who should avoid" warnings |
| Justifies conclusions? | Every concern has an explanation |

### 3. Technical Execution (20%)
| Criteria | How We Address It |
|----------|-------------------|
| Clean architecture? | Component-based, API separation, hooks pattern |
| Appropriate tools? | Gemini for reasoning, Next.js for UX, Tailwind for speed |
| Stable prototype? | Error handling, fallbacks, responsive design |

---

## 📁 Project Structure

```
flux-agent/
├── app/
│   ├── api/
│   │   ├── analyze/route.js    # Personalized ingredient analysis
│   │   └── extract/route.js    # Image OCR endpoint
│   ├── globals.css             # Global styles
│   ├── layout.js               # Root layout
│   └── page.js                 # Main app orchestrator
├── components/
│   ├── AnalyzingOverlay.js     # Loading state with steps
│   ├── BottomNavigation.js     # 3-tab mobile nav
│   ├── HealthPreferencesModal.js # Health profile editor
│   ├── HistoryCard.js          # Scan history item
│   ├── HistoryScreen.js        # Full history view with filters
│   ├── HomeScreen.js           # Home view with quick tips
│   ├── ProfileScreen.js        # User profile & health settings
│   ├── ResultsView.js          # Personalized analysis results
│   └── ScanOverlay.js          # Input methods (camera/text/voice)
├── lib/
│   ├── useHealthPreferences.js # Health profile hook (localStorage)
│   ├── useScanHistory.js       # Scan history hook (localStorage)
│   └── mockData.js             # Sample data
└── README.md
```

---

## 🛣️ Roadmap

- [x] Core scanning experience
- [x] Gemini AI integration
- [x] Bilingual support (EN/HI)
- [x] Voice input
- [x] Auto-narration of results
- [x] Responsive design
- [x] Health preferences personalization ✨ NEW
- [x] Scan history with filters & insights ✨ NEW
- [ ] Alternative product suggestions
- [ ] Barcode scanning
- [ ] More languages (Tamil, Telugu, Bengali)

---

## 👥 Team

Built for **ENCODE x UDGIAM – Code To Innovate** hackathon in association with Thesys.

---

## 📄 License

MIT License - feel free to use this for learning and inspiration!

---

<p align="center">
  <strong>Flux Agent</strong> - Making health decisions easier, one scan at a time.
  <br>
  Made with ❤️ for healthier choices
</p>
