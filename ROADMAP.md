# The Chronoscope - Feature Roadmap

**Vision**: Transform from temporal teleportation to comprehensive spacetime exploration platform

📖 **[View Detailed Roadmap](docs/DETAILED_ROADMAP.md)** for implementation details

---

## Legend

- 🔥 **CRITICAL** - Essential UX, do immediately
- 🟠 **HIGH** - Killer features, high impact
- 🟡 **MEDIUM** - Nice to have, good ROI
- 🟢 **LOW** - Future enhancements
- ✅ **DONE** - Completed
- 🚧 **IN PROGRESS** - Currently being built
- 📋 **PLANNED** - Ready to start
- 💡 **IDEA** - Under consideration

**Effort Scale**: ⚡ (hours) ⚡⚡ (days) ⚡⚡⚡ (week+)

---

## ✅ Phase 1: Essential UX Foundations
*Timeline: 1-2 days | Priority: CRITICAL | **COMPLETED***

These features make the current experience sticky and shareable.

| Feature | Status | Priority | Effort | Value | Notes |
|---------|--------|----------|--------|-------|-------|
| **URL-Based Coordinate Sharing** | ✅ | 🔥 | ⚡ | ⭐⭐⭐⭐⭐ | Encode coords in URL for instant sharing |
| **Temporal Journal (Visit History)** | ✅ | 🔥 | ⚡⚡ | ⭐⭐⭐⭐⭐ | localStorage history of visited coords |
| **Image Gallery & Export** | ✅ | 🔥 | ⚡⚡ | ⭐⭐⭐⭐ | Save images to IndexedDB, download PNG |

**Deliverables**:
- ✅ Share button with copy-to-clipboard
- ✅ Journal panel in left sidebar
- ✅ Gallery modal with grid view
- ✅ Download as PNG feature

---

## 🟠 Phase 2: Temporal Navigation
*Timeline: 3-5 days | Priority: HIGH*

Add true temporal movement, not just jumping.

| Feature | Status | Priority | Effort | Value | Notes |
|---------|--------|----------|--------|-------|-------|
| **Temporal Slider (Time-Lapse)** | 📋 | 🟠 | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | **KILLER FEATURE** - Slide through time at one location |
| **Gemini Flash Chatbot** | 🚧 | 🟠 | ⚡⚡ | ⭐⭐⭐⭐⭐ | Context-aware AI assistant for Q&A and feature help |

**Deliverables**:
- Time-lapse mode with scrubbing
- Frame caching system
- Export as GIF/video
- Chat panel below Data Stream
- Context injection for AI
- Quick action buttons

---

## 🟡 Phase 3: Enhanced Discovery
*Timeline: 2-3 days | Priority: MEDIUM*

Help users find and understand interesting moments.

| Feature | Status | Priority | Effort | Value | Notes |
|---------|--------|----------|--------|-------|-------|
| **Historical Event Integration** | 💡 | 🟡 | ⚡⚡⚡ | ⭐⭐⭐⭐ | Real events from Wikipedia/Wikidata API |
| **Random Discovery Mode** | 💡 | 🟡 | ⚡⚡ | ⭐⭐⭐ | "Surprise Me" with smart random generation |
| **Nearby Moments Suggestions** | 💡 | 🟡 | ⚡⚡ | ⭐⭐⭐ | Show related historical moments |

**Deliverables**:
- Event API integration
- Context cards in Data Stream
- Random discovery algorithm
- Suggestion engine

---

## 🟢 Phase 4: Advanced Features
*Timeline: TBD | Priority: LOW*

Future enhancements based on usage patterns.

| Feature | Status | Priority | Effort | Value | Notes |
|---------|--------|----------|--------|-------|-------|
| **AI-Generated Dynamic Waypoints** | 💡 | 🟠 | ⚡⚡ | ⭐⭐⭐⭐⭐ | AI suggests ANY historical moment as clickable coordinates |
| **Hyper-Realistic Image Generation** | 💡 | 🟠 | ⚡⚡ | ⭐⭐⭐⭐⭐ | Enhanced prompts for photorealistic "you are there" imagery |
| **Compare Mode (Split View)** | 💡 | 🟢 | ⚡⚡⚡ | ⭐⭐⭐⭐ | Side-by-side comparison, different times |
| **Real Historical Data** | 💡 | 🟢 | ⚡⚡⚡⚡ | ⭐⭐⭐⭐ | Replace simulated data with real records |
| **Prompt Customization** | 💡 | 🟢 | ⚡⚡ | ⭐⭐⭐ | Advanced mode: tweak generation prompts |
| **Astronomical Accuracy** | 💡 | 🟢 | ⚡⚡⚡ | ⭐⭐⭐ | Real sun/moon positions, accurate sky |
| **Weather History Integration** | 💡 | 🟢 | ⚡⚡⚡ | ⭐⭐⭐ | Real historical weather data |
| **Community Waypoints** | 💡 | 🟢 | ⚡⚡⚡⚡ | ⭐⭐⭐⭐ | User-submitted curated moments |

### AI-Generated Dynamic Waypoints (HIGH PRIORITY)

**Goal**: Allow the AI assistant to suggest ANY historical moment from its knowledge, not just curated waypoints.

**Concept**: The LLM has vast knowledge of historical events with known locations and dates. Every suggestion becomes a clickable coordinate link that renders a new scene.

**Examples of AI-Generated Suggestions**:
- "You might enjoy witnessing the signing of the Magna Carta at [Runnymede, 1215](/?lat=51.4367&lng=-0.5650&year=1215&month=6&day=15&hour=12&minute=0)"
- "Experience the first human-powered flight at [Kitty Hawk](/?lat=36.0176&lng=-75.6716&year=1903&month=12&day=17&hour=10&minute=35)"
- "See the construction of the Colosseum in [Rome, 80 AD](/?lat=41.8902&lng=12.4922&year=80&month=3&day=1&hour=10&minute=0)"

**Implementation**:
1. Update AI context to encourage generating coordinate links for ANY historical event it knows
2. AI extracts lat/lng from its knowledge of famous locations
3. AI constructs proper URL format: `/?lat=X&lng=Y&year=Z&month=M&day=D&hour=H&minute=MM`
4. User clicks link → page navigates → scene renders → AI greets them at new location

**Value**: Transforms the app from 8 curated waypoints to INFINITE explorable moments. The AI becomes a knowledgeable time-travel guide who can take you anywhere in history.

**User Experience**:
- User: "I'm interested in ancient Rome"
- AI: "Let me take you to some incredible moments! Visit [Julius Caesar's assassination](/?lat=41.8925&lng=12.4769&year=-44&month=3&day=15&hour=11&minute=0) at the Theatre of Pompey, or witness [Nero's Great Fire](/?lat=41.8902&lng=12.4853&year=64&month=7&day=19&hour=22&minute=0) engulfing the city..."

---

### Hyper-Realistic Image Generation Details

**Goal**: Transform generated images from "artistic interpretations" to "you were there" photorealistic moments.

**Current Issue**: Images appear cartoonish/illustrated rather than photorealistic documentary-style.

**Proposed Enhancements**:
1. **Enhanced Prompt Engineering**: Add specific photorealism directives
   - "Ultra-high resolution DSLR photograph"
   - "RAW photo, unedited, natural lighting"
   - "Documentary photography style, not illustrated"
   - "Film grain appropriate to era (Kodachrome for 1960s, daguerreotype for 1800s)"

2. **Era-Specific Photography Styles**:
   - Pre-1900: Sepia/B&W, period-appropriate blur and exposure
   - 1900-1950: Early color film look, Autochrome/Kodachrome grain
   - 1950-1980: Saturated film stock, period-accurate color science
   - 1980-2000: Consumer camera aesthetic
   - 2000+: Modern digital photography quality

3. **Environmental Realism**:
   - Atmospheric haze and dust particles
   - Period-accurate pollution/smog levels
   - Weather effects (rain drops on lens, snow accumulation)
   - Time-of-day accurate shadows and sun position
   - Authentic crowd density and clothing details

4. **Negative Prompts**: Explicitly exclude
   - "painting, illustration, cartoon, CGI, render"
   - "artistic interpretation, stylized"
   - "perfect lighting, studio lighting"

---

## ❌ Explicitly Rejected Features

Features that don't align with the app's vision:

- ❌ **User Accounts** - Backend overhead, not needed
- ❌ **Social Features** - Changes app nature
- ❌ **Gamification** - Cheapens experience
- ❌ **Video Generation** - Too slow, too expensive
- ❌ **VR/AR Mode** - Complexity doesn't match value
- ❌ **Real-time Collaboration** - Unnecessary complexity
- ❌ **Blockchain/NFTs** - No

---

## Current Sprint

**Active Sprint**: Phase 2 - Temporal Navigation
**Status**: Ready to start
**Previous Sprint**: Phase 1 - Essential UX Foundations ✅ COMPLETED

### Phase 1 Sprint Summary (Completed)

- [x] 1.1 URL-Based Coordinate Sharing
  - [x] Create urlManager utility
  - [x] Integrate with ChronoscopeContext
  - [x] Add Share button to header
  - [x] Auto-update URL on scene render

- [x] 1.2 Temporal Journal
  - [x] Create temporalJournal utility
  - [x] Build Journal component
  - [x] Add to left sidebar
  - [x] Implement export/import
  - [x] Auto-save on scene render

- [x] 1.3 Image Gallery
  - [x] Set up IndexedDB schema with idb
  - [x] Create galleryService utility
  - [x] Build Gallery modal component
  - [x] Add download functionality
  - [x] Auto-save generated images

---

## Success Metrics

Track these KPIs to guide future development:

### Engagement
- [ ] Sessions per user > 2
- [ ] Average session duration > 5 minutes
- [ ] Return visit rate > 30%
- [ ] Coordinates explored per session > 3

### Feature Adoption
- [ ] URL shares created per day
- [ ] Journal entries > 5 per user
- [ ] Images downloaded per week
- [ ] Time-lapses generated per week
- [ ] Chat messages per session

### Technical
- [ ] API cost per user < $0.10
- [ ] Image generation time p95 < 60s
- [ ] Cache hit rate > 50%
- [ ] Error rate < 1%

### Business
- [ ] Daily active users growth
- [ ] Week 1 retention > 40%
- [ ] Viral coefficient > 0.5

---

## Implementation Notes

### Architecture Decisions
- **Storage**: localStorage for small data, IndexedDB for images
- **State**: Extend ChronoscopeContext, avoid prop drilling
- **AI**: Gemini 3 Pro Image for generation, Gemini 2.0 Flash for chat
- **Caching**: Aggressive caching for cost optimization

### Cost Management
- Time-lapse: Use 1K for scrubbing, 2K for final
- Chat: Gemini Flash is ~$0.0001 per message
- Image generation: ~$0.01-0.05 per image
- Target: < $0.10 per user per session

### Performance Targets
- Image generation: < 60s at p95
- Chat response: < 3s
- Time-lapse frame: < 45s average
- UI interactions: < 100ms

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-28 | Initial app launch with core features |
| 1.1.0 | 2025-11-28 | Phase 1: Essential UX (sharing, history, gallery) ✅ |
| 1.1.1 | 2025-11-28 | Bug fixes: URL sharing coordinates, image display persistence, gallery deduplication ✅ |
| 1.2.0 | 2025-12-01 | Security hardening, refreshed waypoints, UI improvements ✅ |
| 1.3.0 | TBD | Phase 2: Temporal navigation (slider, chat) |
| 2.0.0 | TBD | Phase 3: Enhanced discovery |

---

## Contributing to Roadmap

Have ideas? See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Open an issue with:
- Feature description
- Use case / problem it solves
- Why it aligns with temporal exploration theme
- Implementation complexity estimate

**Review Process**:
1. Community discussion
2. Alignment check with vision
3. Effort/value assessment
4. Priority assignment
5. Add to roadmap

---

## Questions?

- **Detailed Implementation**: See [docs/DETAILED_ROADMAP.md](docs/DETAILED_ROADMAP.md)
- **Architecture Guide**: See [CLAUDE.md](CLAUDE.md)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)

---

---

## Recent Updates (v1.2.0 - 2025-12-01)

### Security Hardening
- **Content Security Policy**: Added comprehensive CSP headers to prevent XSS attacks
- **Security Headers**: Added X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- **API Rate Limiting**: Added 3-second minimum between image generation requests
- **Source Maps Disabled**: Production builds no longer expose source code
- **Input Validation**: Added maxLength to API key input field
- **Console Cleanup**: Removed all console.log statements from production code

### Content Updates
- **Refreshed Waypoints**: Replaced controversial historical moments with inspiring achievements
  - Removed: Hiroshima, Pompeii, Titanic, JFK assassination
  - Added: Independence Day (1776), Great Pyramid (2560 BC), MLK "I Have a Dream" (1963), First Circumnavigation (1522)

### UI Improvements
- **Year Input Field**: Widened to display full 4-digit years without truncation

---

## Previous Updates (v1.1.1 - 2025-11-28)

### Bug Fixes
- **URL Sharing**: Fixed coordinate encoding to use actual scene coordinates instead of default values
- **Image Display**: Generated images now persist in viewport correctly across scene navigation
- **Gallery Duplicates**: Implemented database-level duplicate prevention to avoid saving identical images multiple times

### Technical Improvements
- Modified `renderScene()` to accept optional coordinates parameter for better state management
- Added smart coordinate comparison in reducer to preserve images when appropriate
- Enhanced `saveGalleryImage()` with duplicate detection using image data comparison

*Last updated: 2025-12-01*
