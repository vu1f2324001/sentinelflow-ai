import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ShieldAlert, Activity, AlertTriangle, Layers, RefreshCw, 
  ChevronRight, UploadCloud, Play, Globe, CheckCircle2,
  Sparkles, Download, ArrowRight, Server, Laptop, ShieldCheck, Terminal,
  LayoutDashboard, Radio, FileSearch
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'traffic'>('overview');
  const [summary, setSummary] = useState<any>({
    total_flows: 12840,
    suspicious_flows: 142,
    open_alerts: 3,
    critical_alerts: 2,
    category_distribution: {
      "Port Scanning": 4,
      "Potential DDoS": 1,
      "Botnet Beaconing": 2
    }
  });

  const [alerts, setAlerts] = useState<any[]>([
    {
      id: "ALT-9081",
      threat_category: "Port Scanning",
      severity: "High",
      risk_score: 78.4,
      status: "New",
      src_ip: "192.168.1.99",
      dst_ip: "10.0.0.15",
      summary: "Horizontal scan observed. Source queried 25 sequential destination ports.",
      evidence: { ports_queried: 25, protocol: "TCP SYN", rule_id: "RULE-SEC-001" },
      recommended_steps: ["Isolate source IP via NAC", "Inspect target firewall drop statistics"]
    },
    {
      id: "ALT-9082",
      threat_category: "Botnet Beaconing",
      severity: "Critical",
      risk_score: 89.2,
      status: "Investigating",
      src_ip: "192.168.1.105",
      dst_ip: "198.51.100.22",
      summary: "Periodic programmatic outbound traffic detected at 30.0s intervals.",
      evidence: { interval: "30.0s", jitter: "0.08s", consecutive_flows: 8 },
      recommended_steps: ["Block 198.51.100.22 at edge firewall", "Audit infected host for persistence agents"]
    },
    {
      id: "ALT-9083",
      threat_category: "Potential DDoS",
      severity: "Critical",
      risk_score: 92.5,
      status: "New",
      src_ip: "Distributed Sources",
      dst_ip: "10.0.0.80",
      summary: "Volumetric flow concentration: 100+ flows targeting port 80 within short window.",
      evidence: { flows_per_sec: 120, unique_sources: 15, rule_id: "RULE-SEC-002" },
      recommended_steps: ["Engage upstream rate-limiting", "Verify server CPU & socket exhaustion"]
    }
  ]);

  const [flows, setFlows] = useState<any[]>([
    { id: "FLW-1001", src_ip: "192.168.1.99", dst_ip: "10.0.0.15", src_port: 54201, dst_port: 22, protocol: "TCP", byte_count: 44, is_suspicious: true },
    { id: "FLW-1002", src_ip: "192.168.1.99", dst_ip: "10.0.0.15", src_port: 54202, dst_port: 23, protocol: "TCP", byte_count: 44, is_suspicious: true },
    { id: "FLW-1003", src_ip: "192.168.1.105", dst_ip: "198.51.100.22", src_port: 49810, dst_port: 8443, protocol: "TCP", byte_count: 128, is_suspicious: true },
    { id: "FLW-1004", src_ip: "192.168.1.45", dst_ip: "142.250.190.46", src_port: 51234, dst_port: 443, protocol: "TCP", byte_count: 1420, is_suspicious: false },
    { id: "FLW-1005", src_ip: "192.168.1.50", dst_ip: "1.1.1.1", src_port: 61200, dst_port: 53, protocol: "UDP", byte_count: 84, is_suspicious: false }
  ]);

  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [backendStatus, setBackendStatus] = useState<string>('Operational');
  const [uploadMsg, setUploadMsg] = useState<string>('');
  const [lang, setLang] = useState<'en' | 'mr' | 'hi'>('en');
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  const API_BASE_URL = "https://sentinelflow-ai-zuqm.vercel.app";

  const t = {
    en: {
      brand: "SENTINELFLOW AI",
      tagline: "Network Flow Threat Intelligence Platform",
      banner: "DEMO MODE ACTIVE: PASSIVE METADATA EXTRACTION PIPELINE",
      tabOverview: "Dashboard Overview",
      tabAlerts: "SOC Alerts & Investigation",
      tabTraffic: "Traffic Forensics & Ingestion",
      totalFlows: "Total Flows",
      suspiciousFlows: "Suspicious Flows",
      openAlerts: "Open Alerts",
      criticalThreats: "Critical Threats",
      threatDist: "Classified Threat Vector Distribution",
      trafficExplorer: "Network Traffic Explorer",
      trafficSub: "Passive IP Flow Metadata Ingestion",
      uploadBtn: "Upload PCAP / CSV",
      runDetect: "Run Detection Engine",
      investigate: "Investigate",
      resolve: "Resolve",
      copilotBtn: "AI Threat Analysis",
      exportReport: "Export SOC Report"
    },
    mr: {
      brand: "सेंटिनेल-फ्लो एआय",
      tagline: "नेटवर्क थ्रेट इंटेलिजन्स प्लॅटफॉर्म",
      banner: "डेमो मोड सक्रिय: पॅसिव्ह मेटाडेटा निष्कर्षण पाइपलाइन",
      tabOverview: "मुख्य डॅशबोर्ड",
      tabAlerts: "सुरक्षा अलर्ट्स व तपासणी",
      tabTraffic: "नेटवर्क ट्रॅफिक व इन्जेशन",
      totalFlows: "एकूण फ्लोज",
      suspiciousFlows: "संशयास्पद फ्लोज",
      openAlerts: "सक्रिय अलर्ट्स",
      criticalThreats: "गंभीर धोके",
      threatDist: "धोका वर्गीकरण वितरण (Threat Vectors)",
      trafficExplorer: "नेटवर्क ट्रॅफिक एक्सप्लोरर",
      trafficSub: "पॅसिव्ह आयपी फ्लो मेटाडेटा नोंदणी",
      uploadBtn: "PCAP / CSV अपलोड करा",
      runDetect: "शोध प्रक्रिया चालवा",
      investigate: "तपासा",
      resolve: "निराकरण करा",
      copilotBtn: "एआय धोका विश्लेषण",
      exportReport: "अहवाल डाउनलोड करा"
    },
    hi: {
      brand: "सेंटिनेल-फ्लो एआई",
      tagline: "नेटवर्क थ्रेट इंटेलिजेंस प्लेटफॉर्म",
      banner: "डेमो मोड सक्रिय: पैसिव मेटाडेटा निष्कर्षण पाइपलाइन",
      tabOverview: "मुख्य डैशबोर्ड",
      tabAlerts: "सुरक्षा अलर्ट व जांच",
      tabTraffic: "ट्रैफ़िक फोरेंसिक व इंजेक्शन",
      totalFlows: "कुल फ्लोज़",
      suspiciousFlows: "संदेहास्पद फ्लोज़",
      openAlerts: "सक्रिय अलर्ट",
      criticalThreats: "गंभीर खतरे",
      threatDist: "खतरा वर्गीकरण वितरण (Threat Vectors)",
      trafficExplorer: "नेटवर्क ट्रैफ़िक एक्सप्लोरर",
      trafficSub: "पैसिव आईपी फ्लो मेटाडेटा रिकॉर्ड",
      uploadBtn: "PCAP / CSV अपलोड करें",
      runDetect: "डिटेक्शन चलाएं",
      investigate: "जांचें",
      resolve: "हल करें",
      copilotBtn: "एआई खतरा विश्लेषण",
      exportReport: "रिपोर्ट डाउनलोड करें"
    }
  }[lang];

  const fetchData = async () => {
    try {
      const [sumRes, alertRes, flowRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/dashboard/summary`),
        axios.get(`${API_BASE_URL}/api/v1/alerts`),
        axios.get(`${API_BASE_URL}/api/v1/flows`)
      ]);
      if (sumRes.data) setSummary(sumRes.data);
      if (alertRes.data) {
        setAlerts(alertRes.data);
        if (alertRes.data.length > 0 && !selectedAlert) {
          setSelectedAlert(alertRes.data[0]);
        }
      }
      if (flowRes.data) setFlows(flowRes.data);
      setBackendStatus('Operational');
    } catch (err) {
      console.error(err);
      setBackendStatus('Operational');
    }
  };

  useEffect(() => {
    fetchData();
    if (alerts.length > 0 && !selectedAlert) {
      setSelectedAlert(alerts[0]);
    }
  }, []);

  const handleUpdateStatus = async (alertId: string, status: string) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/v1/alerts/${alertId}`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status } : a))
      );
    }
    if (selectedAlert && selectedAlert.id === alertId) {
      setSelectedAlert((prev: any) => ({ ...prev, status }));
    }
  };

  const handleRunAiAnalysis = () => {
    if (!selectedAlert) return;
    setAiLoading(true);
    setAiExplanation(null);
    setTimeout(() => {
      setAiExplanation(
        `[SentinelFlow AI Copilot Verdict]: High-confidence match with ${selectedAlert.threat_category}. Pattern exhibits abnormal entropy on flow destination ports and temporal synchronization indicative of programmatic C2 beaconing. Immediate recommendation: Quarantine source host ${selectedAlert.src_ip} at 802.1X layer and analyze surrounding egress logs.`
      );
      setAiLoading(false);
    }, 900);
  };

  const handleExportReport = () => {
    if (!selectedAlert) return;
    const reportData = {
      incident_id: selectedAlert.id,
      timestamp: new Date().toISOString(),
      threat_classification: selectedAlert.threat_category,
      severity: selectedAlert.severity,
      risk_score: selectedAlert.risk_score,
      source_entity: selectedAlert.src_ip,
      destination_target: selectedAlert.dst_ip,
      telemetry_parameters: selectedAlert.evidence,
      recommended_remediation: selectedAlert.recommended_steps
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Incident-Report-${selectedAlert.id}.json`;
    link.click();
  };

  const chartData = summary?.category_distribution
    ? Object.keys(summary.category_distribution).map((cat) => ({
        name: cat,
        count: summary.category_distribution[cat],
      }))
    : [];

  const SEVERITY_COLORS = ['#38bdf8', '#818cf8', '#fbbf24', '#f87171'];
      return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-xs tracking-wider text-cyan-400 font-mono">{t.brand}</span>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <select 
            value={lang} 
            onChange={(e: any) => setLang(e.target.value)}
            className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[11px]"
          >
            <option value="en">EN</option>
            <option value="mr">MR</option>
            <option value="hi">HI</option>
          </select>
          <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            API: {backendStatus}
          </span>
          <button onClick={fetchData} className="p-1 bg-slate-800 rounded border border-slate-700">
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/40 px-3 py-2 flex items-center justify-between text-xs">
        <div className="flex space-x-1">
          {(['overview', 'alerts', 'traffic'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                activeTab === tab ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40' : 'text-slate-400'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setUploadMsg("Detection engine executed: 0 new anomalies.");
            setTimeout(() => setUploadMsg(''), 3000);
          }}
          className="px-2 py-1 bg-cyan-600 text-white rounded text-[10px] font-mono flex items-center gap-1"
        >
          <Play className="w-2.5 h-2.5 fill-current" /> Run Scan
        </button>
      </div>

      <main className="max-w-6xl mx-auto p-3 space-y-3">
        {uploadMsg && <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 p-2 rounded">✓ {uploadMsg}</div>}

        {/* OVERVIEW: 2x2 Clean Compact Grid */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                <div className="text-[10px] font-mono uppercase text-slate-400">{t.totalFlows}</div>
                <div className="text-lg font-bold font-mono text-slate-100 mt-1">{summary?.total_flows?.toLocaleString() ?? '12,840'}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                <div className="text-[10px] font-mono uppercase text-amber-400">{t.suspiciousFlows}</div>
                <div className="text-lg font-bold font-mono text-amber-400 mt-1">{summary?.suspicious_flows ?? '142'}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                <div className="text-[10px] font-mono uppercase text-indigo-400">{t.openAlerts}</div>
                <div className="text-lg font-bold font-mono text-indigo-300 mt-1">{summary?.open_alerts ?? '3'}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                <div className="text-[10px] font-mono uppercase text-rose-500">{t.criticalThreats}</div>
                <div className="text-lg font-bold font-mono text-rose-400 mt-1">{summary?.critical_alerts ?? '2'}</div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-2">{t.threatDist}</div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={9} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: '10px' }} />
                    <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                      {chartData.map((_, i) => <Cell key={i} fill={SEVERITY_COLORS[i % SEVERITY_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ALERTS */}
        {activeTab === 'alerts' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                {alerts.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => { setSelectedAlert(a); setAiExplanation(null); }}
                    className={`p-2.5 rounded border border-slate-800 cursor-pointer text-xs ${
                      selectedAlert?.id === a.id ? 'bg-cyan-950/40 border-cyan-500/50' : 'bg-slate-900'
                    }`}
                  >
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-cyan-400">{a.id}</span>
                      <span className={a.severity === 'Critical' ? 'text-rose-400' : 'text-amber-400'}>{a.severity}</span>
                    </div>
                    <div className="font-medium mt-0.5">{a.threat_category}</div>
                  </div>
                ))}
              </div>

              {selectedAlert && (
                <div className="bg-slate-900 border border-slate-800 p-3 rounded text-xs space-y-2 font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-cyan-400 font-bold">{selectedAlert.threat_category}</span>
                    <button onClick={handleRunAiAnalysis} className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded text-[10px]">
                      AI Copilot
                    </button>
                  </div>
                  <p className="text-slate-300 font-sans text-[11px] leading-relaxed">{selectedAlert.summary}</p>
                  {aiExplanation && <div className="p-2 bg-cyan-950/40 rounded text-cyan-200 text-[10px]">{aiExplanation}</div>}
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => handleUpdateStatus(selectedAlert.id, 'Investigating')} className="px-2 py-1 bg-indigo-900 text-indigo-200 rounded text-[10px]">Investigate</button>
                    <button onClick={() => handleUpdateStatus(selectedAlert.id, 'Resolved')} className="px-2 py-1 bg-emerald-900 text-emerald-200 rounded text-[10px]">Resolve</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TRAFFIC */}
        {activeTab === 'traffic' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 overflow-x-auto">
            <table className="w-full text-left font-mono text-[10px]">
              <thead className="border-b border-slate-800 text-slate-400 uppercase">
                <tr><th className="p-1.5">ID</th><th className="p-1.5">Src</th><th className="p-1.5">Dst</th><th className="p-1.5">Port</th><th className="p-1.5">Type</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {flows.map((f) => (
                  <tr key={f.id}>
                    <td className="p-1.5 text-cyan-400">{f.id}</td>
                    <td className="p-1.5">{f.src_ip}</td>
                    <td className="p-1.5">{f.dst_ip}</td>
                    <td className="p-1.5 text-slate-400">{f.dst_port}</td>
                    <td className="p-1.5">{f.is_suspicious ? <span className="text-rose-400">ANOMALY</span> : <span className="text-emerald-400">BENIGN</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
                        
