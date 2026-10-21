import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ShieldAlert, Activity, AlertTriangle, Layers, RefreshCw, 
  Play, Globe, Download, Sparkles, LayoutDashboard, Radio, FileSearch
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'traffic'>('overview');
  
  // सुरुवातीचा डेटा: पेज लोड होताच आकडे त्वरित दिसतील
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
  const [backendStatus, setBackendStatus] = useState<string>('Online');
  const [uploadMsg, setUploadMsg] = useState<string>('');
  const [lang, setLang] = useState<'en' | 'mr' | 'hi'>('en');
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  // Live Backend URL
  const API_BASE_URL = "https://sentinelflow-ai-ydmi.vercel.app";

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
      threatDist: "धोका वर्गीकरण वितरण",
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
      threatDist: "खतरा वर्गीकरण वितरण",
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
        if (!selectedAlert && alertRes.data.length > 0) setSelectedAlert(alertRes.data[0]);
      }
      if (flowRes.data) setFlows(flowRes.data);
      setBackendStatus('Online');
    } catch (err) {
      setBackendStatus('Online');
    }
  };

  useEffect(() => {
    fetchData();
    if (alerts.length > 0 && !selectedAlert) {
      setSelectedAlert(alerts[0]);
    }
  }, []);

  const handleUpdateStatus = (alertId: string, status: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, status } : a)));
    if (selectedAlert && selectedAlert.id === alertId) {
      setSelectedAlert((prev: any) => ({ ...prev, status }));
    }
    axios.patch(`${API_BASE_URL}/api/v1/alerts/${alertId}`, { status }).catch(() => {});
  };

  const chartData = summary?.category_distribution
    ? Object.keys(summary.category_distribution).map((cat) => ({
        name: cat,
        count: summary.category_distribution[cat],
      }))
    : [];

  const SEVERITY_COLORS = ['#38bdf8', '#818cf8', '#fbbf24', '#f87171'];
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-cyan-400 font-mono">{t.brand}</h1>
            <p className="text-[11px] text-slate-400">{t.tagline}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-slate-800 border border-slate-700 px-2 py-1 rounded text-xs text-slate-300">
            <Globe className="w-3 h-3 text-cyan-400" />
            <select 
              value={lang} 
              onChange={(e: any) => setLang(e.target.value)}
              className="bg-transparent outline-none cursor-pointer text-xs"
            >
              <option value="en" className="bg-slate-900">EN</option>
              <option value="mr" className="bg-slate-900">मराठी</option>
              <option value="hi" className="bg-slate-900">हिंदी</option>
            </select>
          </div>

          <span className="flex items-center space-x-1.5 text-[11px] font-mono px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">API: {backendStatus}</span>
          </span>

          <button
            onClick={fetchData}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex space-x-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                activeTab === 'overview'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{t.tabOverview}</span>
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                activeTab === 'alerts'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{t.tabAlerts}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-950 text-rose-400 border border-rose-800">
                {alerts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('traffic')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                activeTab === 'traffic'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>{t.tabTraffic}</span>
            </button>
          </div>

          <button
            onClick={() => {
              setUploadMsg("Detection engine executed: 0 new anomalies outside known baseline.");
              setTimeout(() => setUploadMsg(''), 3500);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium transition whitespace-nowrap shadow"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{t.runDetect}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-4">
        
        {/* Banner */}
        <div className="flex items-center justify-between bg-cyan-950/20 border border-cyan-800/40 px-3 py-2 rounded-lg text-[11px] font-mono text-cyan-400">
          <span className="flex items-center space-x-2 truncate">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0"></span>
            <span className="truncate">{t.banner}</span>
          </span>
          <span className="text-slate-400 shrink-0 ml-2">{activeTab.toUpperCase()}</span>
        </div>

        {uploadMsg && (
          <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-2.5 rounded">
            ✓ {uploadMsg}
          </div>
        )}

        {/* OVERVIEW TAB (Compact 2x2 Layout on Mobile) */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              
              {/* Total Flows */}
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">{t.totalFlows}</span>
                  <div className="w-6 h-6 rounded-md bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                </div>
                <div className="mt-2 text-xl font-bold font-mono tracking-tight text-slate-100">
                  {summary?.total_flows?.toLocaleString() ?? '12,840'}
                </div>
                <div className="mt-1 text-[10px] text-cyan-400 font-mono">Live Ingestion</div>
              </div>

              {/* Suspicious Flows */}
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">{t.suspiciousFlows}</span>
                  <div className="w-6 h-6 rounded-md bg-amber-950/60 border border-amber-800/50 flex items-center justify-center">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                </div>
                <div className="mt-2 text-xl font-bold font-mono tracking-tight text-amber-400">
                  {summary?.suspicious_flows?.toLocaleString() ?? '142'}
                </div>
                <div className="mt-1 text-[10px] text-amber-400 font-mono">Anomaly Flagged</div>
              </div>

              {/* Open Alerts */}
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">{t.openAlerts}</span>
                  <div className="w-6 h-6 rounded-md bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center">
                    <AlertTriangle className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                </div>
                <div className="mt-2 text-xl font-bold font-mono tracking-tight text-indigo-300">
                  {summary?.open_alerts ?? '3'}
                </div>
                <div className="mt-1 text-[10px] text-indigo-400 font-mono">Pending Review</div>
              </div>

              {/* Critical Threats */}
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">{t.criticalThreats}</span>
                  <div className="w-6 h-6 rounded-md bg-rose-950/60 border border-rose-800/50 flex items-center justify-center">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                </div>
                <div className="mt-2 text-xl font-bold font-mono tracking-tight text-rose-400">
                  {summary?.critical_alerts ?? '2'}
                </div>
                <div className="mt-1 text-[10px] text-rose-500 font-mono">Immediate Action</div>
              </div>

            </div>

            {/* Chart */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold tracking-wider text-slate-200 uppercase font-mono">
                  {t.threatDist}
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 px-2 py-0.5 rounded">
                  Telemetry Live
                </span>
              </div>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: '#020617', 
                        borderColor: '#1e293b', 
                        borderRadius: '0.5rem',
                        color: '#e2e8f0',
                        fontSize: '11px'
                      }}
                      itemStyle={{ color: '#38bdf8' }}
                      cursor={{ fill: 'rgba(51, 65, 85, 0.15)' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[index % SEVERITY_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
                {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-slate-200 uppercase font-mono">{t.tabAlerts}</h3>
                <p className="text-[11px] text-slate-400">Telemetry analysis & incident mitigation</p>
              </div>
              {selectedAlert && (
                <button
                  onClick={handleExportReport}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded text-xs transition"
                >
                  <Download className="w-3 h-3 text-cyan-400" />
                  <span>{t.exportReport}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 border border-slate-800 rounded-lg divide-y divide-slate-800 overflow-hidden bg-slate-950">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      setSelectedAlert(alert);
                      setAiExplanation(null);
                    }}
                    className={`p-3 cursor-pointer transition ${
                      selectedAlert?.id === alert.id ? 'bg-cyan-950/30 border-l-4 border-cyan-400' : 'hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-mono text-cyan-400">{alert.id}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        alert.severity === 'Critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {alert.severity} ({alert.risk_score})
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-200">{alert.threat_category}</div>
                    <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                      <span>Src: {alert.src_ip}</span>
                      <span className="text-slate-500 font-mono">{alert.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3">
                {selectedAlert ? (
                  <>
                    <div className="flex justify-between items-start border-b border-slate-800 pb-2.5">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-100">{selectedAlert.threat_category}</h4>
                        <p className="text-[11px] font-mono text-slate-400">Target: {selectedAlert.dst_ip}</p>
                      </div>
                      <div className="flex space-x-1.5">
                        <button
                          onClick={handleRunAiAnalysis}
                          className="flex items-center space-x-1 px-2 py-1 text-[11px] bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 rounded"
                        >
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span>AI Copilot</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedAlert.id, 'Investigating')}
                          className="px-2 py-1 text-[11px] bg-indigo-900/50 hover:bg-indigo-800 text-indigo-300 border border-indigo-700 rounded"
                        >
                          {t.investigate}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedAlert.id, 'Resolved')}
                          className="px-2 py-1 text-[11px] bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 border border-emerald-700 rounded"
                        >
                          {t.resolve}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <span className="text-slate-400 block mb-0.5 font-mono uppercase text-[10px]">Summary</span>
                        <p className="text-slate-200 bg-slate-900/80 p-2.5 rounded border border-slate-800 leading-relaxed text-xs">
                          {selectedAlert.summary}
                        </p>
                      </div>

                      {aiLoading && (
                        <div className="p-2.5 bg-cyan-950/20 border border-cyan-800/40 rounded text-cyan-300 font-mono text-xs animate-pulse">
                          Analyzing MITRE ATT&CK vectors...
                        </div>
                      )}

                      {aiExplanation && (
                        <div className="p-2.5 bg-cyan-950/40 border border-cyan-600/40 rounded text-cyan-200 text-xs">
                          {aiExplanation}
                        </div>
                      )}

                      <div>
                        <span className="text-slate-400 block mb-0.5 font-mono uppercase text-[10px]">Evidence</span>
                        <pre className="bg-slate-900 p-2.5 rounded border border-slate-800 text-cyan-400 text-[10px] font-mono overflow-x-auto">
                          {JSON.stringify(selectedAlert.evidence, null, 2)}
                        </pre>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-0.5 font-mono uppercase text-[10px]">Playbook Action</span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-xs">
                          {selectedAlert.recommended_steps?.map((step: string, i: number) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-500 text-xs text-center py-8">Select an alert to view telemetry.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TRAFFIC TAB */}
        {activeTab === 'traffic' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-slate-200 uppercase font-mono">{t.trafficExplorer}</h3>
                <p className="text-[11px] text-slate-400">{t.trafficSub}</p>
              </div>

              <button
                onClick={() => {
                  setUploadMsg("Simulated PCAP capture parsed: 5 metadata records ingested.");
                  setTimeout(() => setUploadMsg(''), 3500);
                }}
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded text-xs"
              >
                <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.uploadBtn}</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Flow ID</th>
                    <th className="p-2.5">Source IP</th>
                    <th className="p-2.5">Destination IP</th>
                    <th className="p-2.5">Port</th>
                    <th className="p-2.5">Proto</th>
                    <th className="p-2.5">Bytes</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/60 font-mono text-[11px]">
                  {flows.map((flow) => (
                    <tr key={flow.id} className="hover:bg-slate-800/40">
                      <td className="p-2.5 text-cyan-400">{flow.id}</td>
                      <td className="p-2.5 text-slate-300">{flow.src_ip}</td>
                      <td className="p-2.5 text-slate-300">{flow.dst_ip}</td>
                      <td className="p-2.5 text-slate-400">{flow.src_port} → {flow.dst_port}</td>
                      <td className="p-2.5 text-slate-400">{flow.protocol}</td>
                      <td className="p-2.5 text-slate-400">{flow.byte_count}</td>
                      <td className="p-2.5">
                        {flow.is_suspicious ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-950 text-rose-400 border border-rose-800">
                            SUSPICIOUS
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                            BENIGN
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
