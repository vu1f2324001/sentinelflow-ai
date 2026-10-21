# <div align="center">🛡️ SentinelFlow AI</div>

<div align="center">

**Next-Generation Network Threat Intelligence & Autonomous Multi-View SOC Platform**

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MITRE ATT&CK](https://img.shields.io/badge/MITRE_ATT%26CK-v14-red?style=for-the-badge)](https://attack.mitre.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <i>Detect Threats · Dissect Anomalies · Accelerate Triage · Automate Containment</i>
</p>

</div>

---

## 📌 Executive Summary

Modern Security Operations Centers (SOCs) are constantly flooded with voluminous, fragmented log streams. Triage fatigue and delayed remediation often widen the dwell time of adversaries inside enterprise networks.

**SentinelFlow AI** is a full-stack, enterprise-grade threat intelligence and investigative console designed to ingest passive IP network flows, detect behavioral anomalies, correlate telemetry directly against the **MITRE ATT&CK® matrix**, and generate instant defensive containment policies.

---

## 🌟 Key Architectural Highlights

| Feature | Operational Capability | Impact |
| :--- | :--- | :--- |
| **🗂️ 3-Tier Multi-View Workspace** | Decoupled views: Overview Dashboard, Alert Triage Studio, and Traffic Forensics | Zero UI clutter; targeted workflows for L1, L2 & L3 analysts |
| **🧠 Explainable AI Copilot** | LLM-assisted behavioral anomaly reasoning on raw flow telemetry | Plain-language verdicts eliminating manual guesswork |
| **🗺️ MITRE ATT&CK Alignment** | Automated mapping to Tactics *(TA0043, TA0011)* and Techniques *(T1046, T1071)* | Industry-standardized classification of adversary intent |
| **⚡ 1-Click Containment Rule** | Dynamic, syntax-validated firewall generation (`iptables` / Cisco ACLs) | Drastically reduces Mean Time to Remediate (MTTR) to seconds |
| **🌐 Native Trilingual Localization** | Seamless real-time switching across **English**, **मराठी (Marathi)**, and **हिंदी (Hindi)** | Accessible, high-tempo security operations |
| **📄 1-Click SOC Dossier Export** | Exports forensic JSON dossiers containing evidence, metadata & recommended steps | Audit-ready documentation for incident response teams |

---

## 🏗️ System Architecture

```text
                    [ Ingested Network Traffic / PCAP / NetFlow ]
                                         │
                                         ▼
   ┌──────────────────────────────────────────────────────────────────────────┐
   │                     FastAPI Ingestion & Detection Engine                 │
   │   • Flow Metadata Parsing (Source/Dest IP, L4 Ports, Byte Volumes)       │
   │   • Anomaly & Heuristic Classification Engine                            │
   │   • RESTful Alert Lifecycle Machine (New ➔ Investigating ➔ Resolved)     │
   └─────────────────────────────────────┬────────────────────────────────────┘
                                         │ JSON Stream / REST APIs
                                         ▼
   ┌──────────────────────────────────────────────────────────────────────────┐
   │                     React 18 + Vite Enterprise SOC UI                    │
   │   • Multi-Tab Workspace (Overview / Alerts Studio / Traffic Forensics)    │
   │   • Interactive Source-to-Target Attack Vector Graph                     │
   │   • MITRE ATT&CK Matrix Auto-Mapping Visualizer                          │
   │   • Explainable AI Threat Copilot Drawer                                 │
   │   • Automated Iptables Containment Generator                             │
   └──────────────────────────────────────────────────────────────────────────┘
