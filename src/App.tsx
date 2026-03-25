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
  Globe
} from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import ReactMarkdown from 'react-markdown';

// --- Types ---
type Panel = 'dashboard' | 'ai' | 'files' | 'automation' | 'apps' | 'predict' | 'terminal' | 'settings' | 'python';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
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
      <div className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">
        AI Operating System v1.0 · by Himanshu Shukla
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

export default function App() {
  const [booting, setBooting] = useState(true);
  const [pythonCode, setPythonCode] = useState("print('Hello from ORIGIN-AI Python Engine!')\nimport sys\nprint(f'Python version: {sys.version}')");
  const [pythonOutput, setPythonOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [activePanel, setActivePanel] = useState<Panel>('dashboard');
  const [time, setTime] = useState(new Date());
  const [assistantMode, setAssistantMode] = useState<'jarvis' | 'siri'>('jarvis');
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
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);
  const lastErrorRef = useRef<string | null>(null);
  const restartTimeoutRef = useRef<any>(null);

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
      // Small delay to ensure any previous instance has fully cleaned up
      const timer = setTimeout(() => {
        startListening();
      }, 100);
      return () => clearTimeout(timer);
    }
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, [booting, isSpeaking, isTyping, manualStop]);

  const startListening = () => {
    if (isListening || isSpeaking || isTyping || booting || manualStop) {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }

    if (recognitionRef.current) {
      try { 
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop(); 
      } catch (e) {}
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
        if (error === 'network') {
          console.warn(`Voice system: Network issue detected. Retrying...`);
          setVoiceStatus("Network connection unstable. Retrying in 5s...");
        } else {
          console.error(`Voice system: Error -> ${error}`);
          if (error === 'not-allowed') {
            setVoiceStatus("Microphone access denied.");
          } else {
            setVoiceStatus(`Voice error: ${error}`);
          }
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
        
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
        
        restartTimeoutRef.current = setTimeout(() => {
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
      console.warn("Voice system: Failed to start", e);
      setIsListening(false);
    }
  };

  const toggleListening = () => {
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
    <div className="flex h-screen w-full bg-bg text-white overflow-hidden font-body">
      {/* Sidebar */}
      <aside className="w-16 md:w-20 bg-surface border-r border-border-subtle flex flex-col items-center py-6 gap-2 z-50">
        <div className="font-display text-xl font-black text-accent mb-6 cursor-pointer hover:scale-110 transition-transform">O</div>
        <SidebarButton icon={LayoutGrid} label="Home" active={activePanel === 'dashboard'} onClick={() => setActivePanel('dashboard')} />
        <SidebarButton icon={MessageSquare} label="AI" active={activePanel === 'ai'} onClick={() => setActivePanel('ai')} />
        <SidebarButton icon={Folder} label="Files" active={activePanel === 'files'} onClick={() => setActivePanel('files')} />
        <SidebarButton icon={Zap} label="Auto" active={activePanel === 'automation'} onClick={() => setActivePanel('automation')} />
        <SidebarButton icon={Box} label="Apps" active={activePanel === 'apps'} onClick={() => setActivePanel('apps')} />
        <SidebarButton icon={Target} label="Pred" active={activePanel === 'predict'} onClick={() => setActivePanel('predict')} />
        <SidebarButton icon={TerminalIcon} label="Term" active={activePanel === 'terminal'} onClick={() => setActivePanel('terminal')} />
        <SidebarButton icon={Cpu} label="Py" active={activePanel === 'python'} onClick={() => setActivePanel('python')} />
        
        <div className="mt-auto flex flex-col items-center gap-4">
          <SidebarButton icon={Settings} label="Set" active={activePanel === 'settings'} onClick={() => setActivePanel('settings')} />
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-cyan flex items-center justify-center font-display font-bold text-xs cursor-pointer hover:ring-2 ring-accent/50 transition-all">
            H
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Taskbar */}
        <header className="h-14 bg-surface border-b border-border-subtle flex items-center px-6 justify-between z-40">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-sm font-bold tracking-tight uppercase">
              {activePanel.charAt(0).toUpperCase() + activePanel.slice(1)}
            </h1>
            <span className="text-[10px] font-mono text-text-muted">/ ORIGIN-AI OS</span>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300 ${
              isListening ? 'bg-red/10 border-red/30 text-red' : 
              isSpeaking ? 'bg-accent/10 border-accent/30 text-accent' :
              'bg-surface-hover border-border-subtle text-text-muted'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red animate-pulse' : isSpeaking ? 'bg-accent animate-bounce' : 'bg-text-muted/30'}`} />
              <span className="text-[10px] font-bold tracking-widest uppercase">
                {isListening ? 'Listening' : isSpeaking ? 'Speaking' : 'Standby'}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-4 px-4 py-1.5 rounded-full bg-surface-hover border border-border-subtle text-[11px] font-mono text-text-muted">
              <button 
                onClick={() => setAssistantMode(prev => prev === 'jarvis' ? 'siri' : 'jarvis')}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <div className={`w-1.5 h-1.5 rounded-full ${assistantMode === 'jarvis' ? 'bg-accent' : 'bg-cyan'} animate-pulse`} />
                <span className="text-white uppercase tracking-tighter">{assistantMode === 'jarvis' ? 'JARVIS' : 'SIRI'}</span>
              </button>
              <div className="w-[1px] h-3 bg-border-subtle" />
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                <span className="text-white">AI Online</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi size={12} />
                <span>Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <Battery size={12} />
                <span>98%</span>
              </div>
            </div>
            <div className="font-mono text-xs font-medium min-w-[70px] text-right">
              {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activePanel === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto h-full"
              >
                <Card title="AI Tasks Today" badge="+24%" metric="1,284" sub="tasks processed" accent="accent">
                  <div className="h-12 flex items-end gap-1 mt-4">
                    {[40, 55, 48, 70, 60, 85, 78, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-accent/30 rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </Card>
                <Card title="System Health" badge="Optimal" metric="99.9%" sub="uptime · 0 errors" accent="cyan">
                  <div className="w-full h-1.5 bg-surface-hover rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green to-cyan w-[99.9%]" />
                  </div>
                </Card>
                <Card title="Automations" badge="12 active" metric="47" sub="flows configured" accent="green">
                  <div className="flex gap-2 mt-4">
                    <div className="px-2 py-1 rounded bg-surface-hover text-[9px] font-mono text-green border border-green/20">Payment</div>
                    <div className="px-2 py-1 rounded bg-surface-hover text-[9px] font-mono text-cyan border border-cyan/20">Browser</div>
                    <div className="px-2 py-1 rounded bg-surface-hover text-[9px] font-mono text-accent border border-accent/20">Voice</div>
                  </div>
                </Card>

                <div className="md:col-span-2 glass rounded-2xl p-6 border-accent/10">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-lg font-bold">System Activity</h2>
                    <button className="text-[10px] font-mono text-accent hover:underline">View All Logs</button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { icon: Zap, text: 'Email automation sorted 23 messages', time: '2s ago', color: 'text-green' },
                      { icon: Search, text: 'Browser agent scraped market data', time: '12s ago', color: 'text-cyan' },
                      { icon: ShieldCheck, text: 'Security scan completed: No threats', time: '45s ago', color: 'text-accent' },
                      { icon: Database, text: 'Database synchronized with Cloud', time: '2m ago', color: 'text-amber' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-surface-hover/50 border border-border-subtle">
                        <item.icon size={16} className={item.color} />
                        <span className="flex-1 text-xs text-text-muted font-mono">{item.text}</span>
                        <span className="text-[10px] text-text-muted font-mono">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-2xl p-6 border-cyan/10 flex flex-col">
                  <h2 className="font-display text-lg font-bold mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 gap-2">
                    <button 
                      onClick={() => setActivePanel('ai')}
                      className="flex items-center gap-3 p-3 rounded-xl bg-surface-hover hover:bg-accent/10 hover:border-accent/30 border border-border-subtle transition-all text-left group"
                    >
                      <MessageSquare size={16} className="text-accent" />
                      <span className="text-xs font-medium">Ask AI anything</span>
                    </button>
                    <button 
                      onClick={() => setActivePanel('automation')}
                      className="flex items-center gap-3 p-3 rounded-xl bg-surface-hover hover:bg-cyan/10 hover:border-cyan/30 border border-border-subtle transition-all text-left group"
                    >
                      <Zap size={16} className="text-cyan" />
                      <span className="text-xs font-medium">New automation</span>
                    </button>
                    <button 
                      onClick={() => setActivePanel('apps')}
                      className="flex items-center gap-3 p-3 rounded-xl bg-surface-hover hover:bg-green/10 hover:border-green/30 border border-border-subtle transition-all text-left group"
                    >
                      <Folder size={16} className="text-green" />
                      <span className="text-xs font-medium">Open file explorer</span>
                    </button>
                    <button 
                      onClick={() => setActivePanel('apps')}
                      className="flex items-center gap-3 p-3 rounded-xl bg-surface-hover hover:bg-amber/10 hover:border-amber/30 border border-border-subtle transition-all text-left group"
                    >
                      <Box size={16} className="text-amber" />
                      <span className="text-xs font-medium">Launch Applications</span>
                    </button>
                  </div>
                  <div className="mt-auto pt-6 border-t border-border-subtle">
                    <div className="flex items-center justify-between text-[10px] font-mono text-text-muted mb-2">
                      <span>CPU LOAD</span>
                      <span>42%</span>
                    </div>
                    <div className="w-full h-1 bg-surface-hover rounded-full overflow-hidden">
                      <div className="h-full bg-accent w-[42%]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activePanel === 'ai' && (
              <motion.div 
                key="ai"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-full"
              >
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
                    {isSTTSupported && (
                      <button 
                        onClick={toggleListening}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          isListening 
                            ? 'bg-red text-white animate-pulse' 
                            : 'bg-surface-hover text-text-muted hover:text-accent border border-border-subtle'
                        }`}
                        title={isListening ? "Stop Listening" : "Start Voice Input"}
                      >
                        <Mic size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleSend()}
                      disabled={isTyping || !input.trim()}
                      className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center hover:bg-accent-hover transition-colors disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activePanel === 'python' && (
              <motion.div 
                key="python"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 p-6 flex flex-col gap-6 overflow-auto"
              >
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
              </motion.div>
            )}

            {activePanel === 'apps' && (
              <motion.div 
                key="apps"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 h-full overflow-y-auto"
              >
                <div className="max-w-6xl mx-auto">
                  <div className="flex flex-col gap-2 mb-8">
                    <h2 className="font-display text-3xl font-bold tracking-tight">Application Hub</h2>
                    <p className="text-text-muted text-sm font-mono uppercase tracking-[0.2em]">Connected Ecosystem · v1.0</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <AppCard 
                      name="YouTube" 
                      icon={Youtube} 
                      color="text-red" 
                      url="https://youtube.com" 
                      description="Stream, explore, and share video content across the globe."
                    />
                    <AppCard 
                      name="WhatsApp" 
                      icon={MessageCircle} 
                      color="text-green" 
                      url="https://web.whatsapp.com" 
                      description="Connect instantly with friends and family via secure messaging."
                    />
                    <AppCard 
                      name="Instagram" 
                      icon={Instagram} 
                      color="text-accent" 
                      url="https://instagram.com" 
                      description="Share your moments and discover visual inspiration."
                    />
                    <AppCard 
                      name="Facebook" 
                      icon={Facebook} 
                      color="text-cyan" 
                      url="https://facebook.com" 
                      description="Stay connected with your community and discover what's new."
                    />
                    <AppCard 
                      name="Twitter" 
                      icon={Twitter} 
                      color="text-white" 
                      url="https://twitter.com" 
                      description="Join the conversation and stay updated with real-time news."
                    />
                    <AppCard 
                      name="LinkedIn" 
                      icon={Linkedin} 
                      color="text-cyan" 
                      url="https://linkedin.com" 
                      description="Manage your professional identity and build your network."
                    />
                    <AppCard 
                      name="Google" 
                      icon={Globe} 
                      color="text-amber" 
                      url="https://google.com" 
                      description="Access the world's information with the ultimate search engine."
                    />
                    <AppCard 
                      name="GitHub" 
                      icon={Github} 
                      color="text-white" 
                      url="https://github.com" 
                      description="The world's leading AI-powered developer platform."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Other panels can be implemented similarly */}
            {activePanel !== 'dashboard' && activePanel !== 'ai' && activePanel !== 'python' && activePanel !== 'apps' && (
              <div className="flex items-center justify-center h-full text-text-muted font-mono text-sm">
                <div className="text-center">
                  <TerminalIcon size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Panel "{activePanel}" is under development in v1.0</p>
                  <p className="text-[10px] mt-2">Check back soon for the full ORIGIN-AI experience.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer / Copyright */}
        <footer className="h-8 bg-surface border-t border-border-subtle flex items-center px-6 justify-between text-[10px] font-mono text-text-muted">
          <div className="flex items-center gap-2">
            Copyright © Himanshu Shukla, Founder and CEO · ORIGIN-AI
            <a 
              href="https://www.linkedin.com/in/himanshu-shukla-3a54b2273?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-accent hover:text-accent-hover transition-colors ml-2"
            >
              <Linkedin size={10} />
              LinkedIn Profile
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><ShieldCheck size={10} /> Secure</span>
            <span className="flex items-center gap-1"><Database size={10} /> MongoDB v7.0</span>
            <span className="flex items-center gap-1"><Cpu size={10} /> Node.js v20</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
