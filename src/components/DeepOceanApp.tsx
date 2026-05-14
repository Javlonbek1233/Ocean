import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Waves, Info, Map as MapIcon, Database, Music, Ship } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { askOceanAssistant } from '../services/geminiService';
import OceanScene from './OceanScene';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function DeepOceanApp() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to DeepOcean X. I am AQUA. The abyss is waiting. What shall we explore today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'explore' | 'encyclopedia' | 'titanic' | 'map'>('explore');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const response = await askOceanAssistant(userMsg, `User is in ${activeTab} mode.`);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-blue-50 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
      {/* 3D Background */}
      <OceanScene />

      {/* Decorative Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.1),transparent_70%)]" />
      
      {/* HUD Header */}
      <header className="relative z-10 border-b border-blue-900/50 backdrop-blur-md bg-[#02040a]/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-blue-500/50 flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Waves className="text-blue-400 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">
              DeepOcean X
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-blue-500/70 font-mono">Exploring the Uncharted Abyss v2.0</p>
          </div>
        </div>

        <nav className="flex items-center gap-1">
          {[
            { id: 'explore', icon: Ship, label: 'Simulator' },
            { id: 'encyclopedia', icon: Database, label: 'Creatures' },
            { id: 'titanic', icon: Info, label: 'Titanic' },
            { id: 'map', icon: MapIcon, label: 'Ocean Map' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                activeTab === tab.id 
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]" 
                  : "text-blue-400/50 hover:bg-blue-500/10 hover:text-blue-300"
              )}
            >
              <tab.icon size={16} />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col md:flex-row gap-6 p-6 max-h-[calc(100vh-80px)]">
        
        {/* Left Side: Active Feature Panel */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              <FeaturePanel type={activeTab} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: AI Assistant Chat */}
        <aside className="w-full md:w-96 flex flex-col border border-blue-900/50 rounded-2xl backdrop-blur-xl bg-[#02040a]/60 shadow-2xl overflow-hidden self-stretch">
          <div className="p-4 border-b border-blue-900/50 bg-blue-900/10 flex items-center gap-2">
            <Bot size={18} className="text-blue-400" />
            <h2 className="text-xs uppercase tracking-widest font-bold text-blue-300">AQUA Assistant</h2>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
                  m.role === 'user' 
                    ? "bg-blue-600 text-white rounded-tr-none" 
                    : "bg-blue-900/40 border border-blue-800/50 text-blue-100 rounded-tl-none"
                )}>
                  <div className="markdown-body">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-blue-900/40 p-3 rounded-2xl rounded-tl-none animate-pulse flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-[#02040a]/80 border-t border-blue-900/50">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask AQUA about the abyss..."
                className="w-full bg-blue-950/50 border border-blue-800/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 pr-12 transition-all"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-400 hover:text-blue-300"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* Background Sound Toggle */}
      <footer className="fixed bottom-4 left-4 z-20">
        <button className="flex items-center gap-2 group">
          <div className="p-2 rounded-full border border-blue-800 bg-[#02040a]/80 group-hover:border-blue-500 transition-colors">
            <Music size={14} className="text-blue-400" />
          </div>
          <span className="text-[10px] uppercase tracking-tighter text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Ambient Audio Active</span>
        </button>
      </footer>
    </div>
  );
}

function FeaturePanel({ type }: { type: string }) {
  switch (type) {
    case 'explore': return <SimulatorPanel />;
    case 'encyclopedia': return <EncyclopediaPanel />;
    case 'titanic': return <TitanicPanel />;
    case 'map': return <MapPanel />;
    default: return null;
  }
}

function SimulatorPanel() {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="space-y-4">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl inline-block"
        >
          <span className="text-[10px] uppercase font-mono text-blue-400 tracking-[0.3em]">Telemetry</span>
          <div className="flex gap-6 mt-2">
            <div><p className="text-xs opacity-50 uppercase">Depth</p><p className="text-xl font-mono text-blue-200">3,420m</p></div>
            <div><p className="text-xs opacity-50 uppercase">Temp</p><p className="text-xl font-mono text-blue-200">2°C</p></div>
            <div><p className="text-xs opacity-50 uppercase">Pressure</p><p className="text-xl font-mono text-blue-200">340 atm</p></div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-end justify-center pb-12">
        <div className="flex gap-4">
          <div className="p-4 border-2 border-blue-500/20 rounded-full animate-spin-slow">
            <div className="w-24 h-24 rounded-full border border-blue-400/30 flex items-center justify-center relative">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,1)]" />
               <span className="text-[10px] font-mono text-blue-400">SONAR</span>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-2">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded text-xs font-bold uppercase tracking-widest transition-colors">Emergency Surface</button>
            <button className="px-6 py-2 border border-blue-600 hover:bg-blue-600/20 rounded text-xs font-bold uppercase tracking-widest transition-colors">Sample Collector</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EncyclopediaPanel() {
  const creatures = [
    { name: "Giant Squid", depth: "1000m", fact: "Eyes as large as dinner plates help it see in the dark." },
    { name: "Anglerfish", depth: "2000m", fact: "Uses a bioluminescent lure to attract curious prey." },
    { name: "Dumbo Octopus", depth: "4000m", fact: "The deepest living of all octopuses, found at extreme depths." },
    { name: "Dragonfish", depth: "1500m", fact: "Has teeth on its tongue and invisible-red light hunting vision." }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-y-auto pr-2 custom-scrollbar">
      {creatures.map((c, i) => (
        <motion.div 
          key={i}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="group relative overflow-hidden rounded-2xl border border-blue-900/50 bg-[#02040a]/40 p-6 hover:border-blue-500/50 transition-all cursor-pointer"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <Database size={48} />
          </div>
          <h3 className="text-xl font-bold text-blue-200 mb-1">{c.name}</h3>
          <p className="text-[10px] uppercase tracking-widest text-blue-500 font-bold mb-4">Habitat: {c.depth}</p>
          <p className="text-sm text-blue-300/80 leading-relaxed">{c.fact}</p>
          <div className="mt-4 flex items-center gap-2 text-blue-400 group-hover:gap-4 transition-all">
            <span className="text-[10px] uppercase font-bold tracking-widest">Detail Dossier</span>
            <div className="h-px flex-1 bg-blue-900 group-hover:bg-blue-500 transition-colors" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function TitanicPanel() {
  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-center text-center">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Ship size={64} className="mx-auto mb-6 text-blue-800 animate-pulse" />
        <h2 className="text-4xl font-serif italic mb-4 text-blue-100">The Silent Giant</h2>
        <div className="h-px w-24 bg-blue-600 mx-auto mb-8" />
        <p className="text-lg text-blue-300/90 leading-relaxed mb-12">
          Resting 3,800 meters below the North Atlantic, the Titanic is a monuments to a bygone era. 
          The pressure here is 380 times that at the surface. Every expedition reveals a bit more...
          and every year, the ocean claims a bit more of it.
        </p>
        <button className="px-12 py-4 bg-blue-950 border border-blue-800 hover:border-blue-400 text-blue-400 rounded-full text-sm font-bold uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95">
          Begin Descent to Wreck Site
        </button>
      </motion.div>
    </div>
  );
}

function MapPanel() {
  return (
    <div className="h-full relative overflow-hidden rounded-3xl border border-blue-900/50 bg-[#02040a]/40 grid place-items-center">
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="text-center space-y-6 relative z-10">
        <div className="w-64 h-64 mx-auto rounded-full border-4 border-blue-900/50 border-t-blue-500 animate-spin-slow relative">
          <div className="absolute inset-4 rounded-full border-2 border-blue-950 flex items-center justify-center">
            <MapIcon size={48} className="text-blue-900" />
          </div>
        </div>
        <p className="text-xs uppercase tracking-[0.5em] text-blue-500 font-bold">Establishing Satellite Link...</p>
        <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
        </div>
      </div>
    </div>
  );
}
