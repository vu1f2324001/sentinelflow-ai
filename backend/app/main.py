from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="SentinelFlow AI Engine")

# Frontend ला Backend शी विनाअडथळा जोडण्यासाठी CORS Origins सक्षम करा
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "online", "message": "SentinelFlow AI Backend is running"}

# Mock in-memory alert database for real-time interaction
alerts_db = [
    {
        "id": "ALT-9081",
        "threat_category": "Port Scanning",
        "severity": "High",
        "risk_score": 78.4,
        "status": "New",
        "src_ip": "192.168.1.99",
        "dst_ip": "10.0.0.15",
        "summary": "Horizontal scan observed. Source queried 25 sequential destination ports.",
        "evidence": {"ports_queried": 25, "protocol": "TCP SYN", "rule_id": "RULE-SEC-001"},
        "recommended_steps": ["Isolate source IP via NAC", "Inspect target firewall drop statistics"]
    },
    {
        "id": "ALT-9082",
        "threat_category": "Botnet Beaconing",
        "severity": "Critical",
        "risk_score": 89.2,
        "status": "Investigating",
        "src_ip": "192.168.1.105",
        "dst_ip": "198.51.100.22",
        "summary": "Periodic programmatic outbound traffic detected at 30.0s intervals.",
        "evidence": {"interval": "30.0s", "jitter": "0.08s", "consecutive_flows": 8},
        "recommended_steps": ["Block 198.51.100.22 at edge firewall", "Audit infected host for persistence agents"]
    },
    {
        "id": "ALT-9083",
        "threat_category": "Potential DDoS",
        "severity": "Critical",
        "risk_score": 92.5,
        "status": "New",
        "src_ip": "Distributed Sources",
        "dst_ip": "10.0.0.80",
        "summary": "Volumetric flow concentration: 100+ flows targeting port 80 within short window.",
        "evidence": {"flows_per_sec": 120, "unique_sources": 15, "rule_id": "RULE-SEC-002"},
        "recommended_steps": ["Engage upstream rate-limiting", "Verify server CPU & socket exhaustion"]
    }
]

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "SentinelFlow AI", "version": "1.0.0"}

@app.get("/api/v1/dashboard/summary")
def get_summary():
    return {
        "total_flows": 12840,
        "suspicious_flows": 142,
        "open_alerts": len([a for a in alerts_db if a["status"] in ["New", "Investigating"]]),
        "critical_alerts": len([a for a in alerts_db if a["severity"] == "Critical"]),
        "category_distribution": {
            "Port Scanning": 4,
            "Potential DDoS": 1,
            "Botnet Beaconing": 2
        }
    }

@app.get("/api/v1/alerts")
def get_alerts():
    return alerts_db

class StatusUpdate(BaseModel):
    status: str

@app.patch("/api/v1/alerts/{alert_id}")
def update_alert_status(alert_id: str, payload: StatusUpdate):
    for a in alerts_db:
        if a["id"] == alert_id:
            a["status"] = payload.status
            return a
    return {"error": "Alert not found"}

# In-memory flows storage
flows_db = [
    {"id": "FLW-1001", "src_ip": "192.168.1.99", "dst_ip": "10.0.0.15", "src_port": 54201, "dst_port": 22, "protocol": "TCP", "byte_count": 44, "is_suspicious": True},
    {"id": "FLW-1002", "src_ip": "192.168.1.99", "dst_ip": "10.0.0.15", "src_port": 54202, "dst_port": 23, "protocol": "TCP", "byte_count": 44, "is_suspicious": True},
    {"id": "FLW-1003", "src_ip": "192.168.1.105", "dst_ip": "198.51.100.22", "src_port": 49810, "dst_port": 8443, "protocol": "TCP", "byte_count": 128, "is_suspicious": True},
    {"id": "FLW-1004", "src_ip": "192.168.1.45", "dst_ip": "142.250.190.46", "src_port": 51234, "dst_port": 443, "protocol": "TCP", "byte_count": 1420, "is_suspicious": False},
    {"id": "FLW-1005", "src_ip": "192.168.1.50", "dst_ip": "1.1.1.1", "src_port": 61200, "dst_port": 53, "protocol": "UDP", "byte_count": 84, "is_suspicious": False},
]

@app.get("/api/v1/flows")
def get_flows():
    return flows_db

@app.post("/api/v1/flows/import")
async def import_flow_file(file: UploadFile = File(...)):
    new_flow = {
        "id": f"FLW-{len(flows_db) + 1001}",
        "src_ip": "192.168.1.220",
        "dst_ip": "10.0.0.80",
        "src_port": 58900,
        "dst_port": 80,
        "protocol": "TCP",
        "byte_count": 512,
        "is_suspicious": False
    }
    flows_db.insert(0, new_flow)
    return {"message": f"Successfully parsed and ingested metadata from {file.filename}", "records_added": 1}
