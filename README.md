🛡️ SentinelFlow AI

AI-Powered Network Threat Intelligence & Security Operations Center

Adaptive Network Flow Analysis · MITRE ATT&CK Mapping · Explainable Threat Detection · SOC Investigation

SentinelFlow AI is an AI-assisted Security Operations Center (SOC) platform designed to analyze network flow metadata, identify suspicious activity, map potential threats to the MITRE ATT&CK framework, and support security analysts with explainable alerts and incident response workflows.

«Discover threats. Understand attacks. Investigate faster. Respond smarter.»

---

📌 Table of Contents

- "Overview" (#-overview)
- "Problem Statement" (#-problem-statement)
- "Our Solution" (#-our-solution)
- "Key Features" (#-key-features)
- "System Architecture" (#-system-architecture)
- "Technology Stack" (#-technology-stack)
- "Project Structure" (#-project-structure)
- "Installation and Setup" (#-installation-and-setup)
- "Environment Variables" (#-environment-variables)
- "API Documentation" (#-api-documentation)
- "Threat Detection Workflow" (#-threat-detection-workflow)
- "Deployment" (#-deployment)
- "Security and Responsible Use" (#-security-and-responsible-use)
- "Future Enhancements" (#-future-enhancements)
- "Contributing" (#-contributing)
- "Team" (#-team)
- "License" (#-license)

---

🎯 Overview

Modern networks generate large volumes of traffic that are difficult to monitor and investigate manually. Suspicious communication, port scanning, unusual traffic patterns, and potential command-and-control activity can be difficult to identify without a centralized security monitoring system.

SentinelFlow AI aims to simplify network security investigation through a modular SOC dashboard that combines network flow analysis, anomaly detection, MITRE ATT&CK context, and incident management in one interface.

The platform is designed to support security analysts by presenting relevant evidence, explaining suspicious behavior, and providing structured investigation workflows.

Project Domain: Cybersecurity · AI-Assisted Threat Intelligence · Network Security · SOC Automation

---

🚨 Problem Statement

Security teams face several challenges:

- Large volumes of network traffic make manual investigation time-consuming.
- Suspicious activity can remain unnoticed without effective monitoring.
- Security alerts often lack understandable explanations.
- Mapping detected behavior to established threat frameworks requires additional effort.
- Incident investigation and response workflows are frequently fragmented.
- Security teams need clear evidence before taking containment actions.

💡 Our Solution

SentinelFlow AI brings network telemetry, threat analysis, and incident investigation together in a single platform.

The proposed solution enables users to:

1. Import supported network flow datasets.
2. Analyze source and destination IP addresses, ports, protocols, and traffic statistics.
3. Identify suspicious patterns using detection rules and anomaly scoring.
4. Associate potential threats with relevant MITRE ATT&CK techniques.
5. Review explainable alerts through a centralized SOC dashboard.
6. Track investigation and resolution status.
7. Export incident information for reporting and further analysis.

Note: Detection accuracy and automated integrations depend on the implemented backend, configured models, and available data sources.

---

✨ Key Features

📊 1. SOC Dashboard

- Total network flows and monitored records.
- Active and resolved security alerts.
- Severity-based threat distribution.
- Traffic and alert trend visualizations.
- Responsive dashboard for desktop and mobile screens.

🚨 2. Alert Investigation Studio

- Centralized security alert listing.
- Severity, source, destination, and timestamp details.
- Investigation status management.
- Filtering and sorting of alerts.
- Structured incident review workflow.

🔍 3. Network Traffic Forensics

- Support for importing configured CSV and JSON flow datasets.
- Extensible architecture for PCAP processing.
- Source and destination metadata analysis.
- Protocol, port, packet, and byte statistics where available.
- Suspicious traffic pattern identification.

🧠 4. Explainable AI Threat Copilot

The proposed AI-assisted investigation module helps analysts understand:

- Why a flow or event was flagged.
- Which traffic characteristics appear suspicious.
- What additional evidence should be investigated.
- Which defensive actions may be appropriate.

AI-generated explanations must be treated as investigative assistance rather than definitive proof of malicious activity.

🗺️ 5. MITRE ATT&CK Mapping

Potentially suspicious behaviors can be associated with relevant MITRE ATT&CK tactics and techniques.

Observed behavior| Potential mapping
Network port scanning| Reconnaissance — TA0043; Network Service Discovery — T1046
Suspicious application-layer communication| Command and Control — TA0011; Application Layer Protocol — T1071
Unusual authentication activity| Requires evidence-based technique classification

Mappings are hypotheses based on observed evidence, not proof that an attack has occurred.

Reference: "MITRE ATT&CK" (https://attack.mitre.org/)

⚡ 6. Incident Response Support

- Alert investigation and resolution tracking.
- Suggested containment actions.
- Structured incident reports.
- Human approval before consequential response actions.
- Exportable incident data in JSON format, when implemented.

🌐 7. Multilingual SOC Interface

The interface is designed to support English, Marathi, and Hindi, helping users access security information in their preferred language.

📄 8. Incident Reporting

Generate structured reports containing relevant alert details, network metadata, severity, investigation notes, and associated threat classifications.

---

🏗️ System Architecture

             NETWORK FLOW DATA
             CSV / JSON / PCAP*
                     |
                     v
          +------------------------+
          |  Data Ingestion Layer  |
          |  Validation & Parsing  |
          +-----------+------------+
                      |
                      v
          +------------------------+
          |  Detection Engine      |
          |  Rules & Anomaly Score |
          +-----------+------------+
                      |
                      v
          +------------------------+
          | Threat Classification  |
          | MITRE ATT&CK Context   |
          +-----------+------------+
                      |
                      v
          +------------------------+
          | FastAPI REST Backend   |
          | Alerts / Flows / Stats |
          +-----------+------------+
                      |
                JSON over HTTP
                      |
                      v
          +------------------------+
          | React + Vite SOC UI    |
          | Dashboard & Charts     |
          +-----------+------------+
                      |
                      v
          +------------------------+
          | Investigation & Report |
          | Human-Approved Actions |
          +------------------------+

*PCAP support requires a configured packet-capture
processing implementation.

Data Flow

1. Network flow data is submitted through a supported ingestion endpoint.
2. The backend validates and normalizes the input.
3. Detection rules or configured anomaly models analyze the records.
4. Potentially suspicious events are classified and assigned relevant context.
5. Alerts and summary statistics are exposed through REST APIs.
6. The frontend presents the results for human investigation.
7. Approved response actions and incident reports are handled through configured workflows.

---

🛠️ Technology Stack

Layer| Technologies
Frontend| React, TypeScript, Vite
UI Styling| CSS / Tailwind CSS, depending on implementation
Data Visualization| Recharts
Icons| Lucide Icons
Backend| Python, FastAPI
API Validation| Pydantic
Server| Uvicorn
Threat Intelligence| MITRE ATT&CK framework
Data Input| CSV, JSON; PCAP through an appropriate parser
Version Control| Git and GitHub
Deployment| Vercel for supported frontend workloads; suitable Python hosting for the backend

Only technologies and integrations actually configured in the repository should be represented as implemented features.

---

📁 Project Structure

The following is a suggested structure for the complete application. Adjust it to match the files actually present in your repository.

SentinelFlow-AI/
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

---

🚀 Installation and Setup

Prerequisites

Install the following tools before running the application:

- "Node.js" (https://nodejs.org/) — compatible with the frontend dependencies.
- "Python" (https://www.python.org/) — version supported by the backend dependencies.
- "Git" (https://git-scm.com/).

Step 1: Clone the Repository

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd SentinelFlow-AI

Replace the placeholder with your actual repository URL.

Step 2: Configure the Backend

Open a terminal in the project root:

cd backend
python -m venv venv

Windows CMD:

venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

macOS / Linux:

source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

Backend API:

"http://127.0.0.1:8000"

Interactive API documentation:

"http://127.0.0.1:8000/docs"

Keep the backend terminal running.

Step 3: Configure the Frontend

Open a second terminal in the project root:

cd frontend
npm install
npm run dev

Open the local URL displayed by Vite, typically:

"http://localhost:5173"

Step 4: Connect the Frontend and Backend

Configure the frontend API base URL to point to the running backend.

For example, in a Vite application, an environment variable may be used:

VITE_API_BASE_URL=http://localhost:8000

The frontend must read this variable in its API client. Ensure that the backend CORS configuration allows the frontend development origin.

---

🔐 Environment Variables

Create environment files locally where required by the application.

Example frontend ".env":

VITE_API_BASE_URL=http://localhost:8000

Example backend ".env":

APP_ENV=development

Add additional variables only when the corresponding integration is implemented.

Security requirements:

- Never commit real API keys, cloud credentials, passwords, or private tokens.
- Add ".env" files and virtual environments to ".gitignore".
- Keep production secrets in the hosting provider's environment settings.
- Validate and restrict uploaded file types and sizes.
- Do not expose sensitive network data in public logs or reports.

---

📡 API Documentation

The following endpoints describe the proposed API contract. Verify the actual route names and response formats against the running backend.

Method| Endpoint| Purpose
GET| "/api/v1/dashboard/summary"| Retrieve dashboard statistics
GET| "/api/v1/alerts"| List security alerts
GET| "/api/v1/alerts/{id}"| Retrieve an alert's details
PATCH| "/api/v1/alerts/{id}"| Update alert status
GET| "/api/v1/flows"| Retrieve network flow records
POST| "/api/v1/flows/import"| Import a supported flow dataset
GET| "/health"| Check backend service health

Example Alert Lifecycle

New Alert
    |
    v
Under Investigation
    |
    v
Evidence Review
    |
    v
Resolved / False Positive

Actual statuses and endpoint behavior depend on the backend implementation.

For a FastAPI backend, use "/docs" to inspect the available routes and test supported requests.

---

🧪 Threat Detection Workflow

Example: Potential Port Scanning

Input: A flow dataset containing repeated connection attempts to multiple destination ports.

Analysis:

1. Validate and normalize flow records.
2. Group connections by source and destination.
3. Calculate relevant connection counts and port diversity.
4. Apply configured detection thresholds.
5. Generate an alert if the evidence meets the detection criteria.
6. Associate the event with relevant MITRE ATT&CK context.
7. Present the evidence and recommended investigation steps.

Expected output: A structured alert with observed metadata, detection rationale, severity, and a suggested next step.

This is an illustrative workflow. Detection depends on the rules, thresholds, and data actually implemented.

---

☁️ Deployment

Frontend Deployment on Vercel

1. Push the project to GitHub.
2. Import the repository into "Vercel" (https://vercel.com/).
3. Set the frontend root directory to "frontend" if deploying from a monorepo.
4. Configure the build command as "npm run build".
5. Configure the output directory as "dist".
6. Set "VITE_API_BASE_URL" to the deployed backend's public HTTPS URL.
7. Deploy and test all routes and API requests.

For a single-page application, configure a suitable Vercel rewrite if client-side routes need fallback handling.

Backend Deployment

The FastAPI backend needs a Python-compatible hosting environment.

1. Deploy the "backend" directory to a suitable Python hosting provider.
2. Install dependencies from "requirements.txt".
3. Start the service using the provider's required command.
4. Configure CORS for the deployed frontend origin.
5. Set production environment variables.
6. Verify the health endpoint and API documentation.

Important: Deploying the frontend to Vercel does not automatically deploy the FastAPI backend. Both services must be configured and connected separately, unless the backend is deliberately adapted to a supported serverless architecture.

---

🛡️ Security and Responsible Use

SentinelFlow AI is intended for authorized network monitoring, defensive security research, and incident investigation.

- Analyze only network data you are authorized to access.
- Treat anomaly scores and AI-generated classifications as indicators requiring verification.
- Require human review before blocking IP addresses or modifying firewall rules.
- Never execute generated firewall commands automatically without appropriate authorization and safeguards.
- Protect uploaded traffic datasets because they may contain sensitive infrastructure information.
- Keep audit records for consequential incident-response actions.
- Verify threat classifications against current authoritative references.

The platform must not claim real-time monitoring, production-grade AI detection, or automatic firewall enforcement unless those capabilities have been implemented and tested.

---

🔮 Future Enhancements

- [ ] Production-ready database and persistent incident storage.
- [ ] PCAP parsing and flow extraction.
- [ ] Machine-learning-based anomaly detection with evaluated metrics.
- [ ] AI-assisted investigation using a configured model provider.
- [ ] Evidence-backed MITRE ATT&CK mapping.
- [ ] Live telemetry ingestion and alert streaming.
- [ ] Role-based access control and audit logging.
- [ ] Human-approved containment integrations.
- [ ] PDF and JSON incident report generation.
- [ ] Automated tests, CI/CD, and deployment health monitoring.
- [ ] Marathi, Hindi, and English localization.

---

🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement and test your changes.
4. Submit a pull request describing the changes.

Please avoid including real credentials, sensitive traffic captures, or private incident data in commits and pull requests.

---

👥 Team

Project: SentinelFlow AI
Domain: Cyber Defense, Threat Intelligence & Security Operations

Developed as a cybersecurity project focused on making network threat investigation more accessible, explainable, and efficient.

Add the verified names, roles, and GitHub profiles of all team members here.

---

📜 License

Choose and add an appropriate open-source license before distributing the project. For example, the "MIT License" (https://opensource.org/license/mit) may be suitable if its terms match your project requirements.

---

<p align="center">
  <b>SentinelFlow AI — Discover Threats. Investigate with Confidence. Defend Smarter.</b>
</p>
