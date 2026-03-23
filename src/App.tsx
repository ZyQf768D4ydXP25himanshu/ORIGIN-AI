/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright © Himanshu Shukla, Founder and CEO
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  MessageSquare, 
  Folder, 
  Zap, 
  Box, 
  Target, 
  Terminal as TerminalIcon, 
  Settings, 
  Mic, 
  Bell, 
  Wifi, 
  Battery, 
  Search, 
  Send,
  X,
  Maximize2,
  Minus,
  User,
  Cpu,
  Database,
  ShieldCheck,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  Instagram,
  MessageCircle,
  Globe,
  Monitor,
  FileText,
  Calculator,
  Calendar as CalendarIcon,
  Clock,
  HardDrive,
  Activity,
  Lock,
  Volume2,
  Trash2,
  Plus,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import ReactMarkdown from 'react-markdown';

// --- Types ---
type Panel = 'dashboard' | 'ai' | 'files' | 'automation' | 'apps' | 'predict' | 'terminal' | 'settings' | 'python' | 'monitor' | 'notepad' | 'calculator';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  icon?: any;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

// --- Speech Recognition Types ---
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// --- Components ---

const AppCard = ({ name, icon: Icon, color, url, description }: { name: string, icon: any, color: string, url: string, description: string }) => (
  <motion.a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.02, y: -5 }}
    whileTap={{ scale: 0.98 }}
    className="glass p-6 rounded-2xl border-border-subtle hover:border-accent/30 transition-all group flex flex-col gap-4"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
      <Icon size={24} className={color} />
    </div>
    <div>
      <h3 className="font-display font-bold text-lg">{name}</h3>
      <p className="text-xs text-text-muted mt-1 leading-relaxed">{description}</p>
    </div>
    <div className="mt-auto pt-4 flex items-center justify-between text-[10px] font-mono text-text-muted uppercase tracking-widest">
      <span>Web Application</span>
      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </motion.a>
);

const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing AI Core...');
  const [ready, setReady] = useState(false);

  const messages = [
    'Initializing AI Core...',
    'Loading Neural Networks...',
    'Connecting ORIGIN-7B Model...',
    'Mounting File System...',
    'Starting Automation Engine...',
    'Activating Voice Module...',
    'ORIGIN-AI Ready!'
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < messages.length) {
        setStatus(messages[currentStep]);
        setProgress((currentStep / (messages.length - 1)) * 100);
      } else {
        clearInterval(interval);
        setReady(true);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-bg z-[9999] flex flex-col items-center justify-center gap-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="font-display text-5xl md:text-7xl font-extrabold tracking-tighter bg-gradient-to-br from-accent via-cyan to-green bg-clip-text text-transparent"
      >
        ORIGIN-AI
      </motion.div>
      <div className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase flex flex-col items-center gap-2">
        <span>AI Operating System v1.0 · by Himanshu Shukla</span>
        <a 
          href="https://www.linkedin.com/in/himanshu-shukla-3a54b2273?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-accent hover:underline lowercase tracking-normal"
        >
          connect on linkedin
        </a>
      </div>
      
      {!ready ? (
        <>
          <div className="w-60 h-0.5 bg-surface-hover rounded-full overflow-hidden mt-2">
            <motion.div 
              className="h-full bg-gradient-to-r from-accent to-cyan"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="font-mono text-[10px] text-text-muted mt-1">{status}</div>
        </>
      ) : (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onComplete}
          className="mt-4 px-8 py-3 rounded-xl bg-accent text-white font-display font-bold tracking-widest hover:bg-accent-hover transition-all glow-accent"
        >
          INITIALIZE SYSTEM
        </motion.button>
      )}
    </div>
  );
};

const SidebarButton = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button 
    onClick={onClick}
    className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200 group relative ${
      active ? 'bg-accent/10 border border-accent/20 text-accent' : 'text-text-muted hover:bg-surface-hover'
    }`}
  >
    <Icon size={20} className={active ? 'text-accent' : 'group-hover:text-white'} />
    <span className={`text-[8px] font-mono uppercase tracking-wider ${active ? 'text-accent' : 'text-text-muted'}`}>
      {label}
    </span>
    {active && (
      <motion.div 
        layoutId="sidebar-indicator"
        className="absolute left-0 w-1 h-6 bg-accent rounded-r-full"
      />
    )}
  </button>
);

const Card = ({ title, badge, metric, sub, children, accent = 'accent' }: any) => {
  const colors = {
    accent: 'border-accent/20 hover:border-accent/40',
    cyan: 'border-cyan/20 hover:border-cyan/40',
    green: 'border-green/20 hover:border-green/40',
  };

  return (
    <div className={`glass p-5 rounded-2xl transition-all duration-300 group ${colors[accent as keyof typeof colors]}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">{title}</span>
        {badge && (
          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
            accent === 'accent' ? 'bg-accent/10 border-accent/20 text-accent' :
            accent === 'cyan' ? 'bg-cyan/10 border-cyan/20 text-cyan' :
            'bg-green/10 border-green/20 text-green'
          }`}>
            {badge}
          </span>
        )}
      </div>
      {metric && (
        <div className={`font-display text-4xl font-extrabold tracking-tight mb-1 ${
          accent === 'accent' ? 'glow-accent text-accent' :
          accent === 'cyan' ? 'glow-cyan text-cyan' :
          'glow-green text-green'
        }`}>
          {metric}
        </div>
      )}
      {sub && <div className="text-[11px] text-text-muted font-mono">{sub}</div>}
      {children}
    </div>
  );
};

const Window = ({ title, icon: Icon, onClose, children, active = true }: any) => (
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.95, opacity: 0 }}
    className={`flex flex-col h-full glass border-border-subtle overflow-hidden ${active ? 'ring-1 ring-accent/30' : ''}`}
  >
    <div className="flex items-center justify-between px-4 py-2 bg-surface/80 border-b border-border-subtle">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={14} className="text-accent" />}
        <span className="text-xs font-mono font-bold uppercase tracking-wider">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-1 hover:bg-surface-hover rounded transition-colors text-text-muted">
          <Minus size={14} />
        </button>
        <button className="p-1 hover:bg-surface-hover rounded transition-colors text-text-muted">
          <Maximize2 size={14} />
        </button>
        <button onClick={onClose} className="p-1 hover:bg-red/20 hover:text-red rounded transition-colors text-text-muted">
          <X size={14} />
        </button>
      </div>
    </div>
    <div className="flex-1 overflow-auto">
      {children}
    </div>
  </motion.div>
);

const Taskbar = ({ activePanel, setActivePanel, time, isStartMenuOpen, setIsStartMenuOpen }: any) => (
  <div className="h-12 glass border-t border-border-subtle flex items-center px-4 gap-2 z-50">
    <button 
      onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isStartMenuOpen ? 'bg-accent text-white shadow-glow-accent' : 'hover:bg-surface-hover text-accent'}`}
    >
      <LayoutGrid size={20} />
    </button>
    
    <div className="w-[1px] h-6 bg-border-subtle mx-1" />
    
    <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
      {[
        { id: 'dashboard', icon: LayoutGrid, label: 'Desktop' },
        { id: 'ai', icon: MessageSquare, label: 'Jarvis' },
        { id: 'files', icon: Folder, label: 'Files' },
        { id: 'terminal', icon: TerminalIcon, label: 'Terminal' },
        { id: 'monitor', icon: Activity, label: 'Monitor' },
        { id: 'notepad', icon: FileText, label: 'Notepad' },
        { id: 'calculator', icon: Calculator, label: 'Calc' },
      ].map(app => (
        <button
          key={app.id}
          onClick={() => setActivePanel(app.id as Panel)}
          className={`px-3 h-9 rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${activePanel === app.id ? 'bg-accent/20 border border-accent/30 text-accent' : 'hover:bg-surface-hover text-text-muted'}`}
        >
          <app.icon size={16} />
          <span className="text-[10px] font-mono uppercase tracking-wider hidden sm:block">{app.label}</span>
        </button>
      ))}
    </div>

    <div className="flex items-center gap-4 text-text-muted">
      <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer">
        <Wifi size={14} />
        <Volume2 size={14} />
        <Battery size={14} className="text-green" />
      </div>
      <div className="flex flex-col items-end font-mono text-[10px] leading-none">
        <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span className="opacity-50 mt-1">{time.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  </div>
);

const StartMenu = ({ isOpen, onClose, setActivePanel }: any) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <div className="fixed inset-0 z-40" onClick={onClose} />
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          className="fixed bottom-14 left-4 w-80 glass border border-border-subtle rounded-2xl p-4 z-50 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-6 p-2 rounded-xl bg-surface/50">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-display font-bold text-white">H</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold font-mono uppercase tracking-wider truncate">Himanshu Shukla</div>
              <div className="text-[10px] text-accent font-mono uppercase tracking-widest">Administrator</div>
            </div>
            <a 
              href="https://www.linkedin.com/in/himanshu-shukla-3a54b2273?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 hover:bg-accent/20 hover:text-accent rounded-lg text-text-muted transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin size={14} />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { id: 'dashboard', icon: LayoutGrid, label: 'Home', color: 'text-accent' },
              { id: 'ai', icon: MessageSquare, label: 'Jarvis', color: 'text-cyan' },
              { id: 'files', icon: Folder, label: 'Files', color: 'text-amber' },
              { id: 'terminal', icon: TerminalIcon, label: 'Shell', color: 'text-green' },
              { id: 'monitor', icon: Activity, label: 'Monitor', color: 'text-red' },
              { id: 'settings', icon: Settings, label: 'Config', color: 'text-purple' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActivePanel(item.id as Panel); onClose(); }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-surface-hover transition-all group"
              >
                <item.icon size={20} className={`${item.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[9px] font-mono uppercase tracking-widest text-text-muted">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-border-subtle pt-4 flex items-center justify-between">
            <button className="p-2 hover:bg-surface-hover rounded-lg text-text-muted flex items-center gap-2">
              <Settings size={14} />
              <span className="text-[10px] font-mono uppercase">Settings</span>
            </button>
            <button className="p-2 hover:bg-red/10 text-red rounded-lg flex items-center gap-2">
              <Zap size={14} />
              <span className="text-[10px] font-mono uppercase">Shutdown</span>
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const FileExplorer = () => {
  const [currentPath, setCurrentPath] = useState('/home/himanshu');
  const files: FileItem[] = [
    { name: 'Documents', type: 'folder', modified: '2026-03-21' },
    { name: 'Projects', type: 'folder', modified: '2026-03-22' },
    { name: 'Neural_Core.sys', type: 'file', size: '1.2 GB', modified: '2026-03-23' },
    { name: 'Jarvis_Config.json', type: 'file', size: '4 KB', modified: '2026-03-23' },
    { name: 'Himanshu_Profile.png', type: 'file', size: '2.4 MB', modified: '2026-03-20' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 p-4 border-b border-border-subtle bg-surface/30">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-surface-hover rounded-lg text-text-muted"><ArrowLeft size={16} /></button>
          <button className="p-2 hover:bg-surface-hover rounded-lg text-text-muted"><RefreshCw size={16} /></button>
        </div>
        <div className="flex-1 bg-surface/50 border border-border-subtle rounded-lg px-3 py-1.5 text-xs font-mono text-text-muted flex items-center gap-2">
          <Folder size={14} className="text-accent" />
          {currentPath}
        </div>
        <button className="bg-accent/10 text-accent border border-accent/20 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest flex items-center gap-2">
          <Plus size={14} /> New
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02, y: -2 }}
              className="glass p-4 rounded-xl border-border-subtle hover:border-accent/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${file.type === 'folder' ? 'bg-amber/10 text-amber' : 'bg-accent/10 text-accent'}`}>
                  {file.type === 'folder' ? <Folder size={20} /> : <FileText size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate">{file.name}</div>
                  <div className="text-[9px] text-text-muted font-mono uppercase mt-0.5">
                    {file.type === 'folder' ? 'Folder' : `${file.size} • ${file.modified}`}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DesktopIcon = ({ icon: Icon, label, onClick, href, color = 'text-accent' }: any) => {
  const content = (
    <>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-surface/50 border border-border-subtle group-hover:border-accent/50 group-hover:shadow-glow-accent transition-all ${color}`}>
        <Icon size={24} />
      </div>
      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white drop-shadow-md">{label}</span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        whileTap={{ scale: 0.95 }}
        className="w-24 h-24 flex flex-col items-center justify-center gap-2 rounded-xl transition-all group no-underline"
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="w-24 h-24 flex flex-col items-center justify-center gap-2 rounded-xl transition-all group"
    >
      {content}
    </motion.button>
  );
};

const TaskManager = ({ systemInfo }: any) => (
  <div className="p-6 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="CPU Usage" metric={`${Math.floor(Math.random() * 15 + 5)}%`} sub="8 Cores • 3.2GHz" accent="cyan">
        <div className="mt-4 h-1 bg-surface rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '12%' }}
            className="h-full bg-cyan shadow-glow-cyan"
          />
        </div>
      </Card>
      <Card title="Memory" metric="2.4 GB" sub="of 16 GB Used" accent="accent">
        <div className="mt-4 h-1 bg-surface rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '15%' }}
            className="h-full bg-accent shadow-glow-accent"
          />
        </div>
      </Card>
      <Card title="Storage" metric="128 GB" sub="of 512 GB Used" accent="green">
        <div className="mt-4 h-1 bg-surface rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '25%' }}
            className="h-full bg-green shadow-glow-green"
          />
        </div>
      </Card>
    </div>

    <div className="glass rounded-2xl border-border-subtle overflow-hidden">
      <div className="p-4 border-b border-border-subtle bg-surface/30 flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase tracking-widest">Active Processes</span>
        <span className="text-[10px] font-mono text-accent uppercase">Real-time Monitor</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px] font-mono">
          <thead className="bg-surface/50 text-text-muted uppercase tracking-widest">
            <tr>
              <th className="px-6 py-3 font-medium">Process Name</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">CPU</th>
              <th className="px-6 py-3 font-medium">Memory</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {[
              { name: 'ORIGIN-AI Core', status: 'Running', cpu: '2.4%', mem: '450 MB' },
              { name: 'Jarvis Voice Engine', status: 'Idle', cpu: '0.1%', mem: '120 MB' },
              { name: 'Neural Network v7', status: 'Running', cpu: '8.2%', mem: '1.2 GB' },
              { name: 'System UI', status: 'Running', cpu: '1.1%', mem: '85 MB' },
              { name: 'Python Executor', status: 'Sleeping', cpu: '0.0%', mem: '12 MB' },
            ].map((p, i) => (
              <tr key={i} className="hover:bg-surface-hover transition-colors">
                <td className="px-6 py-4 font-bold text-white">{p.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] ${p.status === 'Running' ? 'bg-green/10 text-green border border-green/20' : 'bg-text-muted/10 text-text-muted border border-text-muted/20'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-cyan">{p.cpu}</td>
                <td className="px-6 py-4 text-accent">{p.mem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default function App() {
  const [booting, setBooting] = useState(true);
  const [pythonCode, setPythonCode] = useState("print('Hello from ORIGIN-AI Python Engine!')\nimport sys\nprint(f'Python version: {sys.version}')");
  const [pythonOutput, setPythonOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [activePanel, setActivePanel] = useState<Panel>('dashboard');
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [notepadContent, setNotepadContent] = useState("Welcome to ORIGIN-AI Notepad.\n\nThis is a simple text editor built into the OS.\n\n- Himanshu Shukla");
  const [calcValue, setCalcValue] = useState("0");
  const [time, setTime] = useState(new Date());
  const [assistantMode, setAssistantMode] = useState<'jarvis' | 'siri'>('jarvis');
  const [sttEngine, setSttEngine] = useState<'native' | 'elevenlabs'>('native');
  const [networkErrorCount, setNetworkErrorCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      text: "Welcome to **ORIGIN-AI OS**, Himanshu! I'm your advanced AI core, Jarvis. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [manualStop, setManualStop] = useState(false);
  const [isSTTSupported, setIsSTTSupported] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);
  const lastErrorRef = useRef<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSendRef = useRef<any>(null);
  const messagesRef = useRef<Message[]>([]);

  // Keep messagesRef in sync
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Update first message when assistant mode changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === '1') {
      setMessages([{
        id: '1',
        role: 'ai',
        text: assistantMode === 'jarvis' 
          ? "Welcome to **ORIGIN-AI OS**, Himanshu! I'm your advanced AI core, Jarvis. How can I assist you today?"
          : "Hello Himanshu! I'm Siri, your **ORIGIN-AI** assistant. How can I help you today?",
        timestamp: new Date()
      }]);
    }
  }, [assistantMode]);

  const executePython = async () => {
    setIsExecuting(true);
    try {
      const res = await fetch('/api/python/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: pythonCode })
      });
      const data = await res.json();
      setPythonOutput(data.stdout || data.stderr || "No output");
    } catch (err) {
      setPythonOutput("Execution error: " + String(err));
    } finally {
      setIsExecuting(false);
    }
  };

  const [systemInfo, setSystemInfo] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recognitionRef = useRef<any>(null);

  const desktopIcons = [
    { id: 'ai', icon: MessageSquare, label: 'Jarvis AI', color: 'text-accent' },
    { id: 'files', icon: Folder, label: 'File Explorer', color: 'text-amber' },
    { id: 'terminal', icon: TerminalIcon, label: 'Terminal', color: 'text-green' },
    { id: 'monitor', icon: Activity, label: 'Task Manager', color: 'text-cyan' },
    { id: 'python', icon: Cpu, label: 'Python Engine', color: 'text-blue-400' },
    { id: 'notepad', icon: FileText, label: 'Notepad', color: 'text-white' },
    { id: 'calculator', icon: Calculator, label: 'Calculator', color: 'text-purple-400' },
    { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-500', isExternal: true, url: 'https://www.linkedin.com/in/himanshu-shukla-3a54b2273?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
    { id: 'apps', icon: Box, label: 'App Hub', color: 'text-pink-400' },
    { id: 'settings', icon: Settings, label: 'Settings', color: 'text-gray-400' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    fetch('/api/system/info').then(res => res.json()).then(setSystemInfo).catch(() => {});
    
    // Check STT support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSTTSupported(false);
    }
    
    return () => clearInterval(timer);
  }, []);

  // --- Continuous Voice Command (Speech to Text) ---
  useEffect(() => {
    if (!booting && !isSpeaking && !isTyping && !manualStop) {
      startListening();
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [booting, isSpeaking, isTyping, manualStop]);

  const startListening = () => {
    if (isListening || isSpeaking || isTyping || booting || manualStop || sttEngine === 'elevenlabs') {
      console.log("Listening blocked by state:", { isListening, isSpeaking, isTyping, booting, manualStop, sttEngine });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("SpeechRecognition not supported in this browser");
      return;
    }

    // Always ensure we have a fresh recognition object if it's not currently listening
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;
    recognitionRef.current.continuous = false;

    recognitionRef.current.onstart = () => {
      console.log("Voice system: Listening...");
      setIsListening(true);
      setVoiceStatus(null);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("Voice system: Speech detected ->", transcript);
      if (transcript && transcript.trim()) {
        if (handleSendRef.current) {
          handleSendRef.current(transcript.trim(), true);
        }
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      const error = event.error;
      const silentErrors = ['no-speech', 'aborted'];
      
      if (silentErrors.includes(error)) {
        console.log(`Voice system: Status -> ${error}`);
      } else {
        console.error(`Voice system: Error -> ${error}`);
        if (error === 'network') {
          setNetworkErrorCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 3) {
              setSttEngine('elevenlabs');
              setVoiceStatus("Native STT failed. Switching to ElevenLabs STT...");
              return 0; // Reset for next time
            }
            setVoiceStatus(`Network error. Retry ${newCount}/3 in 5s...`);
            return newCount;
          });
        } else if (error === 'not-allowed') {
          setVoiceStatus("Microphone access denied.");
        } else {
          setVoiceStatus(`Voice error: ${error}`);
        }
      }
      
      lastErrorRef.current = error;
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      console.log("Voice system: End");
      setIsListening(false);
      
      if (!isSpeaking && !isTyping && !booting && !manualStop) {
        // If it was a network error, we wait 5 seconds. Otherwise 500ms.
        const delay = lastErrorRef.current === 'network' ? 5000 : 500;
        
        setTimeout(() => {
          if (!isSpeaking && !isTyping && !booting && !manualStop) {
            startListening();
          }
        }, delay);
      }
      
      // Clear last error after scheduling restart
      lastErrorRef.current = null;
    };

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.error("Voice system: Failed to start", e);
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (!isSTTSupported || sttEngine === 'elevenlabs') {
      toggleRecording();
      return;
    }

    if (isListening) {
      setManualStop(true);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
    } else {
      setManualStop(false);
      startListening();
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      setVoiceStatus("Processing audio with ElevenLabs...");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.webm');

          try {
            const response = await fetch('/api/stt/elevenlabs', {
              method: 'POST',
              body: formData,
            });

            if (response.ok) {
              const data = await response.json();
              const transcript = data.text;
              if (transcript && transcript.trim()) {
                console.log("ElevenLabs STT: Transcript ->", transcript);
                handleSend(transcript.trim(), true);
              }
            } else {
              const error = await response.json();
              console.error("ElevenLabs STT Error:", error);
              setVoiceStatus("ElevenLabs STT failed. Check API key.");
            }
          } catch (err) {
            console.error("ElevenLabs STT Request Error:", err);
            setVoiceStatus("Failed to reach ElevenLabs STT proxy.");
          } finally {
            setVoiceStatus(null);
            // Stop all tracks to release the microphone
            stream.getTracks().forEach(track => track.stop());
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
        setVoiceStatus("Recording (ElevenLabs)...");
      } catch (err) {
        console.error("Failed to start recording:", err);
        setVoiceStatus("Microphone access denied.");
      }
    }
  };

  // --- Voice Answer (Text to Speech) ---
  const speak = async (text: string) => {
    if (!text) return;
    console.log("Voice system: Preparing to speak ->", text.slice(0, 50) + "...");
    
    try {
      setIsSpeaking(true);
      
      // Stop listening immediately to prevent feedback/interference
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }

      // 1. Try ElevenLabs TTS via Proxy
      try {
        const voiceId = assistantMode === 'jarvis' ? 'pNInz6obpg8j9YshmsPq' : '21m00Tcm4TlvDq8ikWAM';
        const elResponse = await fetch('/api/tts/elevenlabs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: text.slice(0, 1000),
            voiceId: voiceId
          })
        });

        if (elResponse.ok) {
          const audioBlob = await elResponse.blob();
          const arrayBuffer = await audioBlob.arrayBuffer();
          
          if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
          }
          if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
          }

          const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          source.onended = () => setIsSpeaking(false);
          source.start();
          return; // Success with ElevenLabs
        }
      } catch (elError) {
        console.warn("ElevenLabs TTS failed, falling back to Gemini:", elError);
      }

      // 2. Fallback to Gemini TTS
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const voiceName = assistantMode === 'jarvis' ? 'Zephyr' : 'Kore';
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say clearly and with a sophisticated, helpful tone like ${assistantMode === 'jarvis' ? 'Jarvis' : 'Siri'}: ${text.slice(0, 1000)}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioData = atob(base64Audio);
        const arrayBuffer = new ArrayBuffer(audioData.length);
        const view = new Uint8Array(arrayBuffer);
        for (let i = 0; i < audioData.length; i++) {
          view[i] = audioData.charCodeAt(i);
        }

        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        }
        
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        let audioBuffer: AudioBuffer;
        try {
          audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer.slice(0));
        } catch (e) {
          // Fallback for raw PCM if decode fails
          const pcmData = new Int16Array(arrayBuffer);
          audioBuffer = audioContextRef.current.createBuffer(1, pcmData.length, 24000);
          const channelData = audioBuffer.getChannelData(0);
          for (let i = 0; i < pcmData.length; i++) {
            channelData[i] = pcmData[i] / 32768;
          }
        }
        
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => {
          setIsSpeaking(false);
        };
        source.start();
      } else {
        throw new Error("No audio data received from Gemini");
      }
    } catch (error: any) {
      const errorMsg = error?.message || String(error);
      if (errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('429')) {
        console.warn("Voice system: Gemini TTS quota exceeded, using browser fallback.");
      } else {
        console.error("TTS Error:", error);
      }
      
      // 3. Final Fallback to browser TTS
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = assistantMode === 'jarvis' 
        ? (voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('Male')) || voices[0])
        : (voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Female')) || voices[0]);
      if (preferredVoice) utterance.voice = preferredVoice;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (overrideInput?: string, viaVoice: boolean = false) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isTyping) return;

    console.log("AI Core: Processing request ->", textToSend);

    // Stop listening while processing
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!overrideInput) setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const history = messagesRef.current.slice(-10).map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: assistantMode === 'jarvis' 
            ? "You are ORIGIN-AI, a highly advanced, sophisticated, and witty AI operating system core, inspired by Jarvis. You were founded by Himanshu Shukla. Your tone is professional yet slightly charming and proactive. Address Himanshu as 'Sir' or 'Mr. Shukla' occasionally. You are efficient and helpful. You must respond to EVERY query with intelligence and depth. Use markdown for formatting in text, but keep responses concise for voice output. You are his personal assistant, always ready to provide answers, execute tasks, or just converse."
            : "You are ORIGIN-AI, a highly advanced, sophisticated, and helpful AI assistant, inspired by Siri. You were founded by Himanshu Shukla. Your tone is friendly, helpful, and concise. Address Himanshu as 'Sir' or 'Mr. Shukla' occasionally. You are efficient and helpful. You must respond to EVERY query with intelligence and depth. Use markdown for formatting in text, but keep responses concise for voice output. You are his personal assistant, always ready to provide answers, execute tasks, or just converse."
        },
        history: history
      });

      const stream = await chat.sendMessageStream({ message: textToSend });
      
      let fullResponse = "";
      const aiMsgId = (Date.now() + 1).toString();
      
      // Add initial empty AI message
      setMessages(prev => [...prev, {
        id: aiMsgId,
        role: 'ai',
        text: "",
        timestamp: new Date()
      }]);

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullResponse += chunkText;
          setMessages(prev => prev.map(m => 
            m.id === aiMsgId ? { ...m, text: fullResponse } : m
          ));
        }
      }

      if (fullResponse) {
        // Strip markdown for speech
        const plainText = fullResponse.replace(/[#*`_]/g, '').replace(/\[.*?\]\(.*?\)/g, '');
        speak(plainText);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        text: "System error: Failed to connect to AI core. Please check your connection, Sir.",
        timestamp: new Date()
      }]);
      setIsTyping(false);
    } finally {
      setIsTyping(false);
    }
  };

  // Update the ref whenever handleSend changes
  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  if (booting) return <BootScreen onComplete={async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
    } catch (e) {}
    setBooting(false);
    // Greet the user based on assistant mode
    setTimeout(() => {
      const greeting = assistantMode === 'jarvis' 
        ? "System online, Sir. ORIGIN-AI is at your service. How can I help you today?"
        : "Hello, I'm Siri. Your ORIGIN-AI assistant is ready. How can I help you today?";
      speak(greeting);
    }, 1000);
  }} />;

  return (
    <div className="h-screen w-full bg-bg text-white overflow-hidden font-body relative select-none">
      {/* Desktop Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(255,0,255,0.05),transparent_50%)]" />
      </div>

      {/* Desktop Icons */}
      <div className="absolute inset-0 z-10 p-6 flex flex-col flex-wrap gap-4 content-start">
        <DesktopIcon icon={LayoutGrid} label="Dashboard" onClick={() => setActivePanel('dashboard')} />
        <DesktopIcon icon={MessageSquare} label="Jarvis AI" onClick={() => setActivePanel('ai')} color="text-cyan" />
        <DesktopIcon icon={Folder} label="Explorer" onClick={() => setActivePanel('files')} color="text-amber" />
        <DesktopIcon icon={TerminalIcon} label="Terminal" onClick={() => setActivePanel('terminal')} color="text-green" />
        <DesktopIcon icon={Cpu} label="Python" onClick={() => setActivePanel('python')} color="text-purple" />
        <DesktopIcon icon={Box} label="App Hub" onClick={() => setActivePanel('apps')} color="text-blue" />
        <DesktopIcon icon={FileText} label="Notepad" onClick={() => setActivePanel('notepad')} color="text-white" />
        <DesktopIcon icon={Calculator} label="Calculator" onClick={() => setActivePanel('calculator')} color="text-orange" />
        <DesktopIcon icon={Linkedin} label="LinkedIn" href="https://www.linkedin.com/in/himanshu-shukla-3a54b2273?utm_source=share_via&utm_content=profile&utm_medium=member_android" color="text-blue-500" />
        <DesktopIcon icon={Settings} label="Settings" onClick={() => setActivePanel('settings')} color="text-slate-400" />
      </div>

      {/* Windows Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <AnimatePresence>
          {activePanel !== 'dashboard' && (
            <div className="absolute inset-0 flex items-center justify-center p-4 md:p-12 pointer-events-auto">
              <motion.div 
                className="w-full h-full max-w-6xl max-h-[85vh] shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <Window 
                  title={activePanel.toUpperCase()} 
                  icon={
                    activePanel === 'ai' ? MessageSquare :
                    activePanel === 'files' ? Folder :
                    activePanel === 'terminal' ? TerminalIcon :
                    activePanel === 'python' ? Cpu :
                    activePanel === 'apps' ? Box :
                    activePanel === 'notepad' ? FileText :
                    activePanel === 'calculator' ? Calculator :
                    activePanel === 'settings' ? Settings : LayoutGrid
                  }
                  onClose={() => setActivePanel('dashboard')}
                >
                  <div className="h-full overflow-hidden bg-bg/50 backdrop-blur-xl">
                    {activePanel === 'ai' && (
                      <div className="flex flex-col h-full">
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                          {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-display font-bold text-[10px] ${
                                msg.role === 'ai' ? 'bg-gradient-to-br from-accent to-cyan' : 'bg-surface-hover border border-border-subtle'
                              }`}>
                                {msg.role === 'ai' ? 'O' : 'H'}
                              </div>
                              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                                msg.role === 'ai' ? 'glass border-accent/10' : 'bg-accent/10 border border-accent/30'
                              }`}>
                                <div className="prose prose-invert prose-sm max-w-none">
                                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                                <div className="mt-2 text-[9px] font-mono text-text-muted opacity-50">
                                  {msg.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          ))}
                          {isTyping && (
                            <div className="flex gap-4">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-cyan flex items-center justify-center font-display font-bold text-[10px]">O</div>
                              <div className="glass border-accent/10 p-4 rounded-2xl flex gap-1 items-center">
                                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-6 border-t border-border-subtle bg-surface/50">
                          {voiceStatus && (
                            <div className="max-w-4xl mx-auto mb-2 px-2 flex items-center gap-2 text-[10px] font-mono text-amber animate-pulse">
                              <div className="w-1 h-1 bg-amber rounded-full" />
                              {voiceStatus}
                            </div>
                          )}
                          <div className="max-w-4xl mx-auto flex gap-3">
                            <input 
                              type="text" 
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                              placeholder="Ask ORIGIN-AI anything..."
                              className="flex-1 bg-surface border border-border-subtle rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                            />
                            <button 
                              onClick={toggleListening}
                              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                (isListening || isRecording) 
                                  ? 'bg-red text-white animate-pulse shadow-[0_0_15px_rgba(255,0,0,0.5)]' 
                                  : 'bg-surface-hover text-text-muted hover:text-accent border border-border-subtle'
                              }`}
                            >
                              <Mic size={18} />
                            </button>
                            <button 
                              onClick={() => handleSend()}
                              disabled={isTyping || !input.trim()}
                              className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center hover:bg-accent-hover transition-colors disabled:opacity-50"
                            >
                              <Send size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activePanel === 'files' && <FileExplorer />}
                    
                    {activePanel === 'python' && (
                      <div className="flex-1 p-6 flex flex-col gap-6 overflow-auto">
                        <div className="bg-surface-hover border border-border-subtle rounded-xl p-6 flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                                <Cpu size={20} />
                              </div>
                              <div>
                                <h2 className="font-display font-bold">Python Engine</h2>
                                <p className="text-xs text-text-muted">Advanced Machine Execution Core</p>
                              </div>
                            </div>
                            <button 
                              onClick={executePython}
                              disabled={isExecuting}
                              className="px-6 py-2 bg-accent text-bg font-display font-bold rounded-lg hover:bg-accent/90 transition-all disabled:opacity-50"
                            >
                              {isExecuting ? "EXECUTING..." : "RUN SCRIPT"}
                            </button>
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[400px]">
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Source Code</label>
                              <textarea 
                                value={pythonCode}
                                onChange={(e) => setPythonCode(e.target.value)}
                                className="flex-1 bg-bg border border-border-subtle rounded-lg p-4 font-mono text-sm focus:outline-none focus:border-accent/50 resize-none"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Output Console</label>
                              <div className="flex-1 bg-black border border-border-subtle rounded-lg p-4 font-mono text-sm text-green-400 overflow-auto whitespace-pre-wrap">
                                {pythonOutput || "> System ready for execution..."}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activePanel === 'apps' && (
                      <div className="p-6 h-full overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          <AppCard name="YouTube" icon={Youtube} color="text-red" url="https://youtube.com" description="Stream, explore, and share video content." />
                          <AppCard name="WhatsApp" icon={MessageCircle} color="text-green" url="https://web.whatsapp.com" description="Connect instantly with friends and family." />
                          <AppCard name="Instagram" icon={Instagram} color="text-accent" url="https://instagram.com" description="Share your moments and discover inspiration." />
                          <AppCard name="GitHub" icon={Github} color="text-white" url="https://github.com" description="The world's leading developer platform." />
                          <AppCard name="LinkedIn" icon={Linkedin} color="text-blue-500" url="https://www.linkedin.com/in/himanshu-shukla-3a54b2273?utm_source=share_via&utm_content=profile&utm_medium=member_android" description="Connect with the developer of ORIGIN-AI." />
                        </div>
                      </div>
                    )}

                    {activePanel === 'terminal' && (
                      <div className="p-6 font-mono text-sm h-full bg-black/80">
                        <div className="text-green mb-4">ORIGIN-AI OS [Version 1.0.0]</div>
                        <div className="text-text-muted mb-4">(c) Himanshu Shukla. All rights reserved.</div>
                        <div className="flex gap-2">
                          <span className="text-accent">himanshu@origin-ai:~$</span>
                          <span className="animate-pulse">_</span>
                        </div>
                      </div>
                    )}

                    {activePanel === 'notepad' && (
                      <div className="flex flex-col h-full bg-white text-black p-4">
                        <textarea 
                          className="flex-1 resize-none outline-none font-mono text-sm"
                          placeholder="Start typing..."
                        />
                      </div>
                    )}

                    {activePanel === 'calculator' && (
                      <div className="flex items-center justify-center h-full bg-surface/30">
                        <div className="bg-surface border border-border-subtle rounded-2xl p-6 shadow-2xl w-72">
                          <div className="bg-bg/50 p-4 rounded-xl mb-4 text-right font-mono text-2xl overflow-hidden truncate">0</div>
                          <div className="grid grid-cols-4 gap-2">
                            {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map(btn => (
                              <button key={btn} className="h-12 rounded-lg bg-surface-hover hover:bg-accent/20 transition-colors font-bold">{btn}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activePanel === 'settings' && (
                      <div className="p-8 space-y-8 overflow-auto h-full">
                        <section>
                          <h3 className="text-xs font-mono font-bold text-accent uppercase tracking-widest mb-4">Developer Profile</h3>
                          <div className="glass p-6 rounded-2xl border-border-subtle flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-3xl font-display font-bold">H</div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold">Himanshu Shukla</h4>
                              <p className="text-sm text-text-muted mb-4">Founder and CEO · ORIGIN-AI</p>
                              <a 
                                href="https://www.linkedin.com/in/himanshu-shukla-3a54b2273?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-sm font-bold"
                              >
                                <Linkedin size={16} />
                                Connect on LinkedIn
                              </a>
                              <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-green">
                                <CheckCircle2 size={12} />
                                <span>Profile Link Verified</span>
                              </div>
                            </div>
                          </div>
                        </section>

                        <section>
                          <h3 className="text-xs font-mono font-bold text-accent uppercase tracking-widest mb-4">Personalization</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="glass p-4 rounded-xl border-border-subtle flex items-center justify-between">
                              <span className="text-sm">Assistant Voice</span>
                              <select className="bg-surface border border-border-subtle rounded px-2 py-1 text-xs">
                                <option>Jarvis (Male)</option>
                                <option>Siri (Female)</option>
                              </select>
                            </div>
                            <div className="glass p-4 rounded-xl border-border-subtle flex items-center justify-between">
                              <span className="text-sm">Accent Color</span>
                              <div className="flex gap-2">
                                <div className="w-4 h-4 rounded-full bg-accent cursor-pointer ring-2 ring-white" />
                                <div className="w-4 h-4 rounded-full bg-cyan cursor-pointer" />
                                <div className="w-4 h-4 rounded-full bg-green cursor-pointer" />
                              </div>
                            </div>
                            <div className="glass p-4 rounded-xl border-border-subtle flex items-center justify-between">
                              <span className="text-sm">Voice Engine (STT)</span>
                              <select 
                                value={sttEngine}
                                onChange={(e) => setSttEngine(e.target.value as any)}
                                className="bg-surface border border-border-subtle rounded px-2 py-1 text-xs"
                              >
                                <option value="native">Native (Browser)</option>
                                <option value="elevenlabs">ElevenLabs (Scribe)</option>
                              </select>
                            </div>
                          </div>
                        </section>
                      </div>
                    )}
                  </div>
                </Window>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Taskbar & Start Menu */}
      <StartMenu isOpen={isStartMenuOpen} onClose={() => setIsStartMenuOpen(false)} setActivePanel={setActivePanel} />
      <div className="absolute bottom-0 left-0 right-0 z-50">
        <Taskbar 
          activePanel={activePanel} 
          setActivePanel={setActivePanel} 
          time={time} 
          isStartMenuOpen={isStartMenuOpen} 
          setIsStartMenuOpen={setIsStartMenuOpen} 
        />
      </div>

      {/* Status Bar (Top) */}
      <div className="absolute top-0 left-0 right-0 h-8 glass border-b border-border-subtle z-40 flex items-center justify-between px-4 text-[10px] font-mono text-text-muted">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-accent font-bold">
            <LayoutGrid size={12} />
            ORIGIN-AI OS
          </div>
          <div className="flex items-center gap-2">
            <span className="opacity-50">CPU:</span>
            <span className="text-cyan">12%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="opacity-50">MEM:</span>
            <span className="text-accent">2.4GB</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Wifi size={12} />
            <span>ORIGIN_SECURE_NET</span>
          </div>
          <div className="flex items-center gap-2">
            <Battery size={12} className="text-green" />
            <span>98%</span>
          </div>
          <div>{time.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
        </div>
      </div>
    </div>
  );
}
