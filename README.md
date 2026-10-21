
# <div align="center">🛡️ SentinelFlow AI</div>

<div align="center">

**Next-Generation Network Threat Intelligence & Multi-View Security Operations Center**

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![MITRE ATT&CK](https://img.shields.io/badge/MITRE-ATT%26CK-red?style=for-the-badge)](https://attack.mitre.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

*Detect Threats · Investigate Anomalies · Understand Risks · Respond Responsibly*

</div>

---

## 📌 Executive Summary

Modern Security Operations Centers (SOCs) handle large volumes of network telemetry and security alerts. Identifying suspicious behavior, understanding potential threats, and coordinating incident response can be challenging and time-consuming.

**SentinelFlow AI** is a cybersecurity project designed to bring network flow analysis, threat investigation, MITRE ATT&CK context, and incident management together in a unified SOC interface.

The platform aims to help security analysts identify suspicious network behavior, review supporting evidence, understand potential attack techniques, and organize incident response workflows.

> **Discover. Detect. Investigate. Defend.**

## 🎯 Problem Statement

Security teams commonly face the following challenges:

- Large volumes of network traffic make manual investigation difficult.
- Suspicious connection patterns can be overlooked.
- Security alerts may lack clear explanations.
- Mapping observed activity to established threat frameworks takes time.
- Incident investigation and response workflows can be fragmented.
- Consequential defensive actions require reliable evidence and authorization.

## 💡 Our Solution

SentinelFlow AI aims to simplify defensive security operations through a centralized investigation platform.

- Analyze supported network flow datasets.
- Identify potentially suspicious traffic patterns.
- Display security alerts and their severity.
- Associate observed behavior with relevant MITRE ATT&CK techniques.
- Present understandable investigation context.
- Track alert investigation and resolution.
- Organize incident evidence for reporting.
- Support human-reviewed defensive response workflows.

*Actual capabilities depend on the features implemented and integrations configured in the repository.*

---

## 🌟 Key Features

### 📊 1. SOC Dashboard

- Overview of network flows and security alerts.
- Threat severity and alert distribution.
- Traffic statistics and visualizations.
- Summary metrics for investigation workflows.
- Responsive interface for supported screen sizes.

### 🚨 2. SOC Alerts & Investigation Studio

- Centralized security alert listing.
- Source and destination network information.
- Alert severity and investigation status.
- Investigation and resolution workflow.
- Supporting metadata for security analysis.

### 🔍 3. Traffic Forensics & Data Ingestion

- Network flow metadata inspection.
- CSV and JSON dataset ingestion when configured.
- Source and destination IP analysis.
- Protocol, port, packet, and byte statistics where available.
- Extensible architecture for PCAP processing.

### 🧠 4. AI-Assisted Threat Copilot

The proposed investigation assistant can help analysts understand:

- Why a network event was flagged.
- Which observed characteristics appear suspicious.
- What additional evidence should be reviewed.
- Which defensive investigation steps may be appropriate.

AI-generated explanations should be treated as decision support, not definitive proof of an attack.

### 🗺️ 5. MITRE ATT&CK Mapping

Potentially suspicious behaviors can be associated with relevant MITRE ATT&CK tactics and techniques.

| Observed Behavior | Potential MITRE ATT&CK Mapping |
|---|---|
| Network reconnaissance | Reconnaissance — TA0043 |
| Network port discovery | Network Service Discovery — T1046 |
| Suspicious command-and-control activity | Command and Control — TA0011 |
| Application-layer communication | Application Layer Protocol — T1071 |

Reference: [MITRE ATT&CK Framework](https://attack.mitre.org/)

Mappings depend on observed evidence and must be validated during investigation.

### ⚡ 6. Incident Response Support

- Alert lifecycle management.
- Investigation status updates.
- Suggested containment actions.
- Human approval for consequential security actions.
- Structured incident data for reporting.

Example firewall rule for an authorized Linux environment:

```bash
iptables -A INPUT -s <SUSPICIOUS_SRC_IP> -j DROP
```

**Important:** This is an example command, not an automatically executed action. Verify the source IP, network rules, operational impact, and authorization before applying any firewall change.

### 🌐 7. Multilingual Interface

The interface is designed to support localized security operations in:

- English
- मराठी (Marathi)
- हिंदी (Hindi)

Availability depends on the implemented localization features.

### 📄 8. Incident Reporting

The platform is designed to organize investigation details such as:

- Alert identifiers and timestamps.
- Network flow metadata.
- Severity and detection rationale.
- MITRE ATT&CK references.
- Investigation notes and resolution status.

JSON export and other reporting formats require the corresponding implementation.

---

## 🏗️ System Architecture

```text
              NETWORK FLOW DATA
             CSV / JSON / PCAP*
                      |
                      v
          +-------------------------+
          | Data Ingestion Layer    |
          | Validation and Parsing  |
          +------------+------------+
                       |
                       v
          +-------------------------+
          | Threat Detection Engine |
          | Rules and Anomaly Scores|
          +------------+------------+
                       |
                       v
          +-------------------------+
          | Threat Classification   |
          | MITRE ATT&CK Context    |
          +------------+------------+
                       |
                       v
          +-------------------------+
          | FastAPI REST Backend    |
          | Alerts / Flows / Summary|
          +------------+------------+
                       |
                  JSON / REST
                       |
                       v
          +-------------------------+
          | React + TypeScript UI   |
          | Dashboard and Charts    |
          +------------+------------+
                       |
                       v
          +-------------------------+
          | Investigation & Reports |
          | Human-Reviewed Actions  |
          +-------------------------+

*PCAP processing requires an appropriate parser
and a configured ingestion implementation.
```

### Platform Interface

#### 1. Dashboard Overview

- Network traffic summary.
- Alert severity distribution.
- Suspicious activity overview.
- Threat category visualizations.

#### 2. Alerts & Investigation

- Alert details and network metadata.
- Investigation status management.
- Threat classification context.
- Evidence review and suggested next steps.

#### 3. Traffic Forensics

- Network flow inspection.
- Supported file upload and validation.
- Source and destination analysis.
- Suspicious traffic indicators.

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React |
| Programming Language | TypeScript |
| Development Server | Vite |
| Styling | CSS / Tailwind CSS, depending on implementation |
| Data Visualization | Recharts |
| Icons | Lucide Icons |
| Backend | Python, FastAPI |
| API Server | Uvicorn |
| Data Validation | Pydantic |
| Threat Framework | MITRE ATT&CK |
| Version Control | Git and GitHub |
| Frontend Deployment | Vercel |

The technology list should reflect the dependencies and services actually configured in the project.

---

## 📁 Project Structure

The following is a suggested structure. Adapt it to match the actual repository.

```text
sentinelflow-ai/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── services/
│   │   ├── detection/
│   │   ├── schemas/
│   │   └── core/
│   ├── requirements.txt
│   └── tests/
│
├── sample-data/
├── .gitignore
└── README.md
```

---

## ⚡ Quickstart Guide

### Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/)
- npm
- [Python](https://www.python.org/)
- [Git](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/vu1f2324001/sentinelflow-ai.git
cd sentinelflow-ai
```

Make sure the repository URL and directory name match your actual GitHub repository.

### Step 2: Set Up the Backend

Open a terminal in the project root:

```bash
cd backend
python -m venv venv
```

**Windows Command Prompt:**

```cmd
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Linux / macOS:**

```bash
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend URL:

`http://127.0.0.1:8000`

Interactive API documentation:

`http://127.0.0.1:8000/docs`

These commands assume the backend contains `app/main.py` and `requirements.txt`.

### Step 3: Set Up the Frontend

Open a second terminal in the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown in the terminal. Vite commonly uses:

`http://localhost:5173`

### Step 4: Configure the API URL

For a Vite frontend, create a local `.env` file in the frontend directory if the application uses this variable:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Make sure the frontend API client reads the variable and the backend CORS configuration permits the frontend origin.

### Step 5: Build for Production

From the frontend directory:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📡 REST API Specifications

The following endpoints describe a proposed API contract. Confirm the actual paths and behavior against the running backend before relying on them.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/dashboard/summary` | Retrieve dashboard summary metrics |
| GET | `/api/v1/alerts` | Retrieve security alerts |
| GET | `/api/v1/alerts/{id}` | Retrieve an individual alert |
| PATCH | `/api/v1/alerts/{id}` | Update an alert's status |
| GET | `/api/v1/flows` | Retrieve network flow records |
| POST | `/api/v1/flows/import` | Import supported network flow files |
| GET | `/health` | Check backend health, if implemented |

For a FastAPI application, visit `/docs` to inspect the registered endpoints and their request and response schemas.

---

## 🔄 Threat Detection Workflow

### Example: Potential Port Scanning

1. Import a supported network flow dataset.
2. Validate and normalize the records.
3. Group connection attempts by source and destination.
4. Analyze destination port diversity and connection frequency.
5. Apply the configured detection rules or anomaly scoring.
6. Create an alert if the evidence satisfies the detection criteria.
7. Associate the observed behavior with relevant MITRE ATT&CK context.
8. Present the alert for human investigation.

**Expected result:** A structured alert containing relevant network metadata, detection rationale, severity, and investigation guidance.

This is an illustrative workflow. Actual results depend on the implemented detection engine and available telemetry.

---

## ☁️ Deployment

### Frontend Deployment on Vercel

1. Push the project to GitHub.
2. Import the repository into [Vercel](https://vercel.com/).
3. Configure the frontend root directory if the repository is a monorepo.
4. Set the build command to `npm run build`.
5. Set the output directory to `dist`.
6. Configure `VITE_API_BASE_URL` to the deployed backend's HTTPS URL.
7. Deploy and test the application.

For a single-page application, configure an appropriate rewrite if required for client-side routing.

### Backend Deployment

The FastAPI backend needs a Python-compatible hosting environment unless it has been adapted for a supported serverless platform.

1. Deploy the backend directory.
2. Install dependencies from `requirements.txt`.
3. Configure the service's startup command.
4. Set production environment variables.
5. Configure CORS for the deployed frontend origin.
6. Verify the health endpoint and API functionality.

**Note:** Deploying the React frontend on Vercel does not automatically deploy a separate FastAPI backend.

---

## 🔒 Security & Privacy

- Analyze only network traffic you are authorized to inspect.
- Validate uploaded files and restrict their size and permitted formats.
- Avoid storing unnecessary sensitive network information.
- Keep API keys and credentials out of source control.
- Configure authentication and authorization where required.
- Use HTTPS for deployed services.
- Treat AI-generated explanations as recommendations requiring verification.
- Require appropriate human approval before executing firewall changes.
- Maintain audit records for consequential incident-response actions.

Passive metadata analysis can reduce the need to inspect packet payloads, but metadata may still contain sensitive information.

---

## 🧪 Testing

Recommended checks before deployment:

- Validate frontend production builds.
- Test API input validation and error handling.
- Verify alert lifecycle transitions.
- Test valid and invalid uploaded datasets.
- Confirm frontend-to-backend connectivity.
- Test authentication and authorization if implemented.
- Verify responsive layouts and chart rendering.
- Check that sensitive values are not exposed in logs.

---

## 🔮 Future Enhancements

- [ ] Persistent database for flows and incidents.
- [ ] PCAP parsing and network flow extraction.
- [ ] Machine-learning-based anomaly detection.
- [ ] AI-assisted incident investigation.
- [ ] Evidence-backed MITRE ATT&CK classification.
- [ ] Real-time telemetry ingestion.
- [ ] Role-based access control and audit logs.
- [ ] Human-approved firewall containment integrations.
- [ ] JSON and PDF incident report generation.
- [ ] Automated testing and CI/CD.
- [ ] English, Marathi, and Hindi localization.

---

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test the changes.
5. Submit a pull request describing your contribution.

Please do not commit credentials, sensitive network captures, or private incident data.

---

## 📜 License

This project can use the MIT License if its terms suit the project and its contributors.

Before distributing the project under MIT, add a `LICENSE` file containing the appropriate license text.

See the [MIT License](https://opensource.org/license/mit/) for details.

---

## 👥 Project Information

- **Project Name:** SentinelFlow AI
- **Domain:** Cybersecurity and Network Threat Intelligence
- **Focus Area:** AI-Assisted Cyber Defense and SOC Workflows
- **Platform:** Web-Based Security Investigation Dashboard

---

## 🔖 Tags

#SentinelFlowAI #CyberSecurity #ArtificialIntelligence #ThreatIntelligence #NetworkSecurity #SOC #MITREATTACK #React #TypeScript #Vite #Python #FastAPI #CyberDefense #DataVisualization #Hackathon #OpenSource

---

<div align="center">

**SentinelFlow AI**

*Discover Threats. Investigate with Confidence. Defend Smarter.*

Built for defensive security monitoring and cybersecurity innovation.

© 2026 SentinelFlow AI

</div>
