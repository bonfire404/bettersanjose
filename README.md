# 🏛️ Better San Jose (BetterSJ)

A community-led, open-source portal designed to make the government of the **Municipality of San Jose de Buenavista, Antique** accessible, transparent, and user-friendly.

This project is a municipal-focused civic portal for San Jose de Buenavista, Antique, built to empower citizens with easy access to municipal services, transparency data, and local governance information.

---
### Inspirations

- BetterGov.PH https://github.com/bettergovph/bettergov
- BetterSolano.org https://github.com/BetterSolano/bettersolano
- Betterlocalgov https://github.com/iyanski/betterlocalgov

### Portal Features
BetterSJ provides San Jose de Buenavista with:
- **Public Services Directory**: Comprehensive guide to municipal services with requirements, fees, and step-by-step processes
- **Legislative Portal**: Access to ordinances, resolutions, and executive orders from the Sangguniang Bayan
- **Transparency Dashboard**: Financial data, procurement bids, and infrastructure projects
- **Government Directory**: Contact information for all municipal departments and officials
- **Multi-language Support**: English and Filipino translations
- **24/7 San Jose News Crawler**: Automated updates on local San Jose news and announcements

---

## 🔄 Forking for Your LGU

BetterSJ is designed to be easily adapted for any Local Government Unit (LGU) in the Philippines.

## Quick Start for Other LGUs

1. **Edit Configuration**: Update `/config/lgu.config.json` with your LGU details
2. **Update Translations**: Modify `/public/locales/en/common.json` for LGU-specific text
3. **Add Your Data**: Replace data files in `/src/data/` with your municipality's information
4. **Build and Test**: Run `npm install && npm run build`

### Configuration Files to Edit

| File | What to Change |
|------|------------------|
| `/config/lgu.config.json` | All LGU settings (name, province, coordinates, branding, transparency config) |
| `/public/locales/en/common.json` | UI text strings (hero title, footer copyright, government section) |
| `/src/data/directory/departments.json` | Municipal departments and offices |
| `/src/data/directory/barangays.json` | Barangay information |
| `/src/data/services/categories/*.json` | Public services data by category |

### Key Configuration Fields

| Field | Description | Example (San Jose, Antique) |
|-------|-------------|---------------------|
| `lgu.name` | Short municipality name | "San Jose" |
| `lgu.fullName` | Full official name | "Municipality of San Jose de Buenavista" |
| `lgu.province` | Province name | "Antique" |
| `lgu.region` | Region name | "Region VI" |
| `lgu.regionCode` | Region code | "WESTERN VISAYAS" |
| `lgu.type` | LGU type | "municipality" or "city" |
| `lgu.officialWebsite` | Official LGU website | "https://sanjosedebuenavista.gov.ph" |
| `portal.name` | Portal name | "BetterSJ" |
| `portal.baseUrl` | Portal base URL | "https://bettersj.org" |
| `portal.tagline` | Portal tagline | "Community Powered San Jose, Antique Portal" |

**Note:** See [`FORKING.md`](./FORKING.md) for comprehensive forking instructions including database setup for legislative data.

## Technical Stack
*   **Frontend**: React 19, Vite, TypeScript (Strict mode)
*   **Styling**: Tailwind CSS v4 (CSS variables, high-contrast tokens)
*   **Backend**: Cloudflare Pages Functions (TypeScript)
*   **Data**: Structured JSON (Modular category-based architecture)
*   **Search**: Meilisearch with Fuse.js fuzzy search
*   **Localization**: i18next with English & Filipino support
*   **Maps**: Leaflet for geospatial visualizations
*   **Data Pipeline**: Python scripts for legislative document processing
*   **Testing**: Playwright (E2E tests across multiple browsers)
*   **Code Quality**: ESLint, Prettier, Husky pre-commit hooks

---

## Project Structure

```
bettersanjose/
├── e2e/                         # End-to-end tests
│   └── utils/                   # Test helpers and shared testing logic
├── functions/                   # Serverless / backend functions (Cloudflare Pages)
│   └── api/                     # API endpoints and handlers
├── pipeline/                    # Data processing pipeline (Python side)
│   ├── data/                    # Structured source documents
│   │   └── pdfs/                # Source legislative PDFs
│   │       ├── executive_orders/
│   │       ├── ordinances/
│   │       └── resolutions/
│   └── __pycache__/             # Python cache (auto-generated)
├── public/                      # Static public assets
│   ├── assets/                  # General media assets
│   ├── locales/                 # Translation files (en, fil)
│   └── logos/                   # Logo exports
├── raw_data/                    # Unprocessed data before pipeline cleanup
├── scripts/                     # Automation, maintenance, and build scripts
├── src/                         # Main application source code
│   ├── components/              # Reusable UI components
│   │   ├── data-display/        # Tables, cards, and record viewers
│   │   ├── home/                # Homepage-specific components
│   │   ├── layout/              # Layout wrappers, grids, headers, footers
│   │   ├── map/                 # Map visualizations and geospatial UI
│   │   ├── navigation/          # Menus, navbars, breadcrumbs
│   │   ├── search/              # Search bars, filters, query UI
│   │   ├── ui/                  # Generic UI elements (buttons, modals, etc.)
│   │   └── widgets/             # Small reusable info widgets
│   ├── constants/               # App-wide constant values and config
│   ├── data/                    # Structured frontend data layer
│   │   ├── about/               # About page content
│   │   ├── directory/           # Government directory datasets
│   │   │   └── schema/          # Data schemas for directory records
│   │   ├── legislation/         # Legislative data
│   │   │   ├── committees/
│   │   │   ├── documents/
│   │   │   ├── persons/         # Councilors, authors, sponsors
│   │   │   └── sessions/        # Legislative sessions
│   │   ├── schema/              # Global data schemas
│   │   ├── services/            # Public service datasets
│   │   │   └── categories/      # Service classifications
│   │   ├── statistics/          # Municipality statistics datasets
│   │   └── transparency/        # Transparency and governance data
│   ├── hooks/                   # Custom reusable frontend hooks
│   ├── i18n/                    # Internationalization setup and config
│   │   ├── languages.ts         # Language definitions (English, Filipino)
│   │   └── README.md            # Translation guide
│   ├── lib/                     # Utility libraries and helpers
│   ├── pages/                   # Route-level pages (site sections)
│   └── types/                   # Type definitions (TypeScript or schemas)
└── (root config files)          # package.json, build configs, .env files
```

### Key Components
- **Service Directory**: Categorized services from `src/data/services/categories/`
- **Legislative Portal**: Ordinances, resolutions, executive orders with document parsing
- **Transparency Portal**: Financial data, procurement, bids, infrastructure projects
- **Search Integration**: Meilisearch-powered search with real-time indexing
- **Internationalization**: Multi-language support with i18next

### San Jose, Antique Data

BetterSJ includes structured data for San Jose de Buenavista:

| Data Type | Location | Description |
|-----------|----------|-------------|
| **Departments** | `/src/data/directory/departments.json` | Municipal departments and offices with contact info |
| **Barangays** | `/src/data/directory/barangays.json` | Barangay profiles and officials |
| **Services** | `/src/data/services/categories/*.json` | Public services by category (BPLO, Assessor, Engineering, etc.) |
| **Citizens Charter** | `/src/data/citizens-charter/citizens-charter.json` | Service requirements, fees, and client steps |
| **Legislation** | Cloudflare D1 Database | Ordinances, resolutions, executive orders |
| **Statistics** | `/src/data/statistics/` | Municipal demographics and indicators |

---

## 🚀 How to Run Locally

### 1. Clone and Install
```bash
git clone https://github.com/bonfire404/bettersanjose.git
cd bettersanjose
npm install
```

### 2. Prepare Data
Since the service directory is split into manageable category files, you must merge them before running the app:
```bash
python3 scripts/merge_services.py
```

### 3. Start Development Server
```bash
npm run dev
```
**Access the portal at:** `http://localhost:5173`

### 4. Running Tests
```bash
npm run test:e2e        # Run all end-to-end tests
npm run lint            # Check code quality (max warnings = 0)
npm run format          # Format code with Prettier
```

### 5. Building for Production
```bash
npm run build           # Combines merge_services, TypeScript, and Vite build
```

---

## 🏛️ San Jose de Buenavista Government Structure

### Executive Branch
- **Mayor**: Chief executive officer of the municipality
- **Vice Mayor**: Presiding officer of the Sangguniang Bayan and mayoral successor
- **Municipal Departments**: Administrative offices implementing municipal programs

### Legislative Branch (Sangguniang Bayan)
The Sangguniang Bayan is the legislative body of San Jose de Buenavista.

### Key Departments
- **BPLO**: Business Permit and Licensing Office
- **MTO**: Municipal Treasurer's Office
- **Assessor's Office**: Property assessment and taxation
- **Engineering Office**: Infrastructure and public works
- **MPDC**: Municipal Planning and Development Coordinator
- **LCR**: Local Civil Registry
- **Municipal Health Office**: Public health services
- **Municipal Agriculture Office**: Agricultural programs

---

## Join the Grassroots Movement
We are looking for passionate volunteers who want to make San Jose de Buenavista a better place. You don't need to be a developer to help!

### Development Workflow
- Follow [Conventional Commits](https://www.conventionalcommits.org/) (enforced via commitlint)
- All PRs run ESLint and Prettier automatically

---

## 🚢 Deployment

### Production Deployment (BetterSJ)

BetterSJ is deployed on **Cloudflare Pages** with:
- **Frontend**: Vite build automatically deployed on push to `main` branch
- **Backend**: Cloudflare Pages Functions for API endpoints
- **Database**: Cloudflare D1 (`bettersj_openlgu`) for legislative data

---

## License and Data Sources

### Code License
This project is released under the [Creative Commons CC0](https://creativecommons.org/publicdomain/zero/1.0/) dedication.

### Data Attribution
BetterSJ aggregates data from multiple sources:
- **Municipality of San Jose de Buenavista**
- **Philippine Government Procurement Portal (PhilGEPS)**
- **Department of Budget and Management (DBM)**
- **Department of Public Works and Highways (DPWH)**

---

## 📞 Contact and Support

- **Website**: https://bettersj.org
- **GitHub Repository**: [github.com/bonfire404/bettersanjose](https://github.com/bonfire404/bettersanjose)
