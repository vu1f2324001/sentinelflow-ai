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
  const [summary, setSummary] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [flows, setFlows] = useState<any[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [backendStatus, setBackendStatus] = useState<string>('Connecting...');
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
        axios.get('http://127.0.0.1:8000/api/v1/dashboard/summary'),
        axios.get('http://127.0.0.1:8000/api/v1/alerts'),
        axios.get('http://127.0.0.1:8000/api/v1/flows')
      ]);
      setSummary(sumRes.data);
      setAlerts(alertRes.data);
      setFlows(flowRes.data);
      if (alertRes.data.length > 0 && !selectedAlert) {
        setSelectedAlert(alertRes.data[0]);
      }
      setBackendStatus('Operational');
    } catch (err) {
      console.error(err);
      setBackendStatus('Backend Offline');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (alertId: string, status: string) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/v1/alerts/${alertId}`, { status });
      fetchData();
      if (selectedAlert && selectedAlert.id === alertId) {
        setSelectedAlert({ ...selectedAlert, status });
      }
    } catch (err) {
      console.error(err);
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16">
      
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-wider text-cyan-400 font-mono">{t.brand}</h1>
            <p className="text-xs text-slate-400">{t.tagline}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-slate-800 border border-slate-700 px-2 py-1 rounded text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <select 
              value={lang} 
              onChange={(e: any) => setLang(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="en" className="bg-slate-900">EN</option>
              <option value="mr" className="bg-slate-900">मराठी (MR)</option>
              <option value="hi" className="bg-slate-900">हिंदी (HI)</option>
            </select>
          </div>

          <span className="flex items-center space-x-1.5 text-xs font-mono px-3 py-1 bg-slate-800 border border-slate-700 rounded-full">
            <span className={`w-2 h-2 rounded-full ${backendStatus === 'Operational' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="text-slate-300">API: {backendStatus}</span>
          </span>

          <button
            onClick={fetchData}
            className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-200 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      {/* Main Tab Switcher Bar */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition ${
                activeTab === 'overview'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.tabOverview}</span>
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition ${
                activeTab === 'alerts'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>{t.tabAlerts}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-950 text-rose-400 border border-rose-800">
                {alerts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('traffic')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition ${
                activeTab === 'traffic'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileSearch className="w-4 h-4" />
              <span>{t.tabTraffic}</span>
            </button>
          </div>

          <button
            onClick={() => {
              setUploadMsg("Detection engine executed: 0 new anomalies outside known baseline.");
              setTimeout(() => setUploadMsg(''), 3500);
            }}
            className="flex items-center space-x-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium transition shadow"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{t.runDetect}</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        
        {/* Banner */}
        <div className="flex flex-wrap items-center justify-between bg-cyan-950/20 border border-cyan-800/40 px-4 py-2.5 rounded-lg text-xs font-mono text-cyan-400">
          <span className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>{t.banner}</span>
          </span>
          <span className="text-slate-400">Active View: {activeTab.toUpperCase()}</span>
        </div>

        {uploadMsg && (
          <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-2.5 rounded">
            ✓ {uploadMsg}
          </div>
        )}

        {/* ================= PAGE 1: OVERVIEW DASHBOARD ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs uppercase font-mono tracking-wider">{t.totalFlows}</span>
                  <Layers className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="mt-3 text-3xl font-semibold text-slate-100">{summary?.total_flows ?? '...'}</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs uppercase font-mono tracking-wider">{t.suspiciousFlows}</span>
                  <Activity className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-3 text-3xl font-semibold text-amber-400">{summary?.suspicious_flows ?? '...'}</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs uppercase font-mono tracking-wider">{t.openAlerts}</span>
                  <AlertTriangle className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="mt-3 text-3xl font-semibold text-indigo-400">{summary?.open_alerts ?? '...'}</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-lg">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs uppercase font-mono tracking-wider">{t.criticalThreats}</span>
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                </div>
                <div className="mt-3 text-3xl font-semibold text-rose-500">{summary?.critical_alerts ?? '...'}</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
              <h3 className="text-xs font-semibold tracking-wider text-slate-300 mb-4 uppercase font-mono">
                {t.threatDist}
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: '#020617', 
                        borderColor: '#1e293b', 
                        borderRadius: '0.375rem',
                        color: '#e2e8f0'
                      }}
                      itemStyle={{ color: '#38bdf8' }}
                      wrapperStyle={{ outline: 'none' }}
                      cursor={{ fill: 'rgba(51, 65, 85, 0.2)' }}
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
        {/* ================= PAGE 2: SOC INVESTIGATION STUDIO ================= */}
        {activeTab === 'alerts' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-slate-300 uppercase font-mono">
                  {t.tabAlerts}
                </h3>
                <p className="text-xs text-slate-400">Deep telemetry analysis, MITRE matrix & dynamic remediation</p>
              </div>
              {selectedAlert && (
                <button
                  onClick={handleExportReport}
                  className="flex items-center space-x-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded text-xs transition"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.exportReport}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Alert List */}
              <div className="md:col-span-5 border border-slate-800 rounded-lg divide-y divide-slate-800 overflow-hidden bg-slate-950">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      setSelectedAlert(alert);
                      setAiExplanation(null);
                    }}
                    className={`p-4 cursor-pointer transition ${
                      selectedAlert?.id === alert.id ? 'bg-cyan-950/30 border-l-4 border-cyan-400' : 'hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-mono text-cyan-400">{alert.id}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        alert.severity === 'Critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {alert.severity} ({alert.risk_score})
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-200">{alert.threat_category}</div>
                    <div className="text-xs text-slate-400 mt-1 flex justify-between">
                      <span>Src: {alert.src_ip}</span>
                      <span className="text-slate-500 font-mono">Status: {alert.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alert Detail Drawer */}
              <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-4">
                {selectedAlert ? (
                  <>
                    <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                      <div>
                        <h4 className="text-base font-semibold text-slate-100">{selectedAlert.threat_category}</h4>
                        <p className="text-xs font-mono text-slate-400 mt-0.5">Target: {selectedAlert.dst_ip}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleRunAiAnalysis}
                          className="flex items-center space-x-1 px-2.5 py-1 text-xs bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 rounded transition shadow"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{t.copilotBtn}</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedAlert.id, 'Investigating')}
                          className="px-2.5 py-1 text-xs bg-indigo-900/50 hover:bg-indigo-800 text-indigo-300 border border-indigo-700 rounded transition"
                        >
                          {t.investigate}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedAlert.id, 'Resolved')}
                          className="px-2.5 py-1 text-xs bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 border border-emerald-700 rounded transition"
                        >
                          {t.resolve}
                        </button>
                      </div>
                    </div>

                    {/* Vector Node */}
                    <div className="bg-slate-900/80 border border-slate-800/80 p-3 rounded-lg flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center space-x-2 text-rose-400">
                        <Laptop className="w-4 h-4" />
                        <span>{selectedAlert.src_ip}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500">
                        <span className="w-8 h-0.5 bg-rose-500/50"></span>
                        <ArrowRight className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                      </div>
                      <div className="flex items-center space-x-2 text-cyan-400">
                        <Server className="w-4 h-4" />
                        <span>{selectedAlert.dst_ip}</span>
                      </div>
                    </div>

                    {/* MITRE ATT&CK Mapping */}
                    <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-1.5">
                      <div className="text-[11px] font-mono uppercase text-indigo-400 font-semibold flex items-center space-x-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>MITRE ATT&CK Mapping</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-mono">
                        <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                          Tactic: {selectedAlert.threat_category === 'Port Scanning' ? 'Reconnaissance (TA0043)' : 'Command & Control (TA0011)'}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                          Technique: {selectedAlert.threat_category === 'Port Scanning' ? 'Network Service Discovery (T1046)' : 'Application Layer Protocol (T1071)'}
                        </span>
                      </div>
                    </div>

                    {/* Firewall Rule */}
                    <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-1.5">
                      <div className="text-[11px] font-mono uppercase text-amber-400 font-semibold flex items-center space-x-1.5">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Instant Containment Rule (iptables)</span>
                      </div>
                      <pre className="text-xs font-mono bg-slate-950 p-2 rounded text-emerald-400 border border-slate-800 select-all overflow-x-auto">
                        iptables -A INPUT -s {selectedAlert.src_ip} -j DROP
                      </pre>
                    </div>

                    {/* AI Copilot Explanation */}
                    {aiLoading && (
                      <div className="text-xs font-mono text-cyan-300 bg-cyan-950/30 border border-cyan-800/50 p-3 rounded animate-pulse">
                        Synthesizing network telemetry and behavioral anomaly reasoning...
                      </div>
                    )}

                    {aiExplanation && (
                      <div className="text-xs font-mono text-cyan-200 bg-cyan-950/50 border border-cyan-600/50 p-3.5 rounded space-y-1 shadow-lg">
                        <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Sentinel AI Explainer</span>
                        </div>
                        <p className="leading-relaxed">{aiExplanation}</p>
                      </div>
                    )}

                    <div>
                      <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Context & Evidence:</span>
                      <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800 mt-1 leading-relaxed">
                        {selectedAlert.summary}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Telemetry Parameters:</span>
                      <pre className="text-xs font-mono bg-slate-900 text-cyan-400 p-2.5 rounded border border-slate-800 mt-1 overflow-x-auto">
                        {JSON.stringify(selectedAlert.evidence, null, 2)}
                      </pre>
                    </div>

                    <div>
                      <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Recommended Remediation:</span>
                      <ul className="mt-1 space-y-1">
                        {selectedAlert.recommended_steps.map((step: string, i: number) => (
                          <li key={i} className="flex items-center space-x-1.5 text-xs text-slate-300">
                            <ChevronRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-500 py-12 text-sm">Select an alert to inspect evidence</div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* ================= PAGE 3: TRAFFIC FORENSICS & INGESTION ================= */}
        {activeTab === 'traffic' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-slate-200 uppercase font-mono">
                  {t.trafficExplorer}
                </h3>
                <p className="text-xs text-slate-400">{t.trafficSub}</p>
              </div>
              <div>
                <label className="flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded text-xs text-white font-medium cursor-pointer transition shadow">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{t.uploadBtn}</span>
                  <input type="file" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                      const res = await axios.post('http://127.0.0.1:8000/api/v1/flows/import', formData);
                      setUploadMsg(res.data.message);
                      fetchData();
                      setTimeout(() => setUploadMsg(''), 4000);
                    } catch (err) {
                      console.error(err);
                    }
                  }} className="hidden" accept=".pcap,.csv,.json" />
                </label>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs font-mono text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Flow ID</th>
                    <th className="p-3">Source IP</th>
                    <th className="p-3">Destination IP</th>
                    <th className="p-3">Dst Port</th>
                    <th className="p-3">Protocol</th>
                    <th className="p-3">Bytes</th>
                    <th className="p-3">Analysis Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                  {flows.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 text-cyan-400">{f.id}</td>
                      <td className="p-3">{f.src_ip}</td>
                      <td className="p-3">{f.dst_ip}</td>
                      <td className="p-3">{f.dst_port}</td>
                      <td className="p-3">{f.protocol}</td>
                      <td className="p-3">{f.byte_count} B</td>
                      <td className="p-3">
                        {f.is_suspicious ? (
                          <span className="text-amber-400 bg-amber-950/50 border border-amber-800 px-2 py-0.5 rounded text-[10px]">
                            Suspicious
                          </span>
                        ) : (
                          <span className="text-emerald-400 bg-emerald-950/50 border border-emerald-800 px-2 py-0.5 rounded text-[10px]">
                            Normal
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
