import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Zap,
  Shield,
  Users,
  Mic,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronDown,
  Globe,
  Radio,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onOpenApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onSignIn,
  onOpenApp
}) => {
  const { user, loginAsDemoUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does ChatFlow achieve real-time messaging?',
      a: 'ChatFlow leverages bi-directional WebSockets powered by Socket.IO. When you send a message, reaction, or voice note, it is dispatched to connected clients with sub-20ms latency across global clusters.'
    },
    {
      q: 'Is voice note recording supported across all modern browsers?',
      a: 'Yes! ChatFlow integrates browser Web Audio APIs with audio encoding and custom animated waveform visualizations, allowing seamless voice messaging on desktop, tablets, and smartphones.'
    },
    {
      q: 'Can I manage large group channels and assign administrators?',
      a: 'Absolutely. ChatFlow supports group conversations with granular admin controls, participant invitation workflows, pinned announcements, and shared media galleries.'
    },
    {
      q: 'How is user privacy and data security safeguarded?',
      a: 'All data is secured via TLS/SSL transport encryption, bcrypt credential hashing, JWT session verification, and granular user privacy controls (such as invisible status and blocking).'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-indigo-500 selection:text-white">
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Chat</span>
              <span className="text-xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">Flow</span>
            </div>
          </div>

          {/* Center Links (desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#security" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Security</a>
            <a href="#testimonials" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Testimonials</a>
            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={onOpenApp}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2"
              >
                Open ChatFlow <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={onSignIn}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onGetStarted}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5"
                >
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs">
            <Radio className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span>Next-Generation Real-Time Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Every Conversation <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-500">
              Starts Here.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect instantly with private one-to-one chats, high-performance team channels, voice notes, and media sharing. Built for speed, elegance, and reliability.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={user ? onOpenApp : onGetStarted}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              Start Chatting Free <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => loginAsDemoUser('alex')}
              className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-slate-800 dark:text-slate-100 rounded-2xl font-bold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" /> 1-Click Demo Preview
            </button>
          </div>

          {/* Product Interface Preview Mockup */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 sm:p-4 shadow-2xl shadow-indigo-500/10">
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 flex flex-col sm:flex-row text-left border border-slate-800 relative">
                {/* Simulated Left Column */}
                <div className="w-72 border-r border-slate-800 p-4 space-y-3 hidden sm:block bg-slate-900">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-bold text-xs text-white">Active Channels</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-xs text-white">
                    <div className="font-bold flex items-center gap-1.5">
                      <span>🚀 Product Launch 2026</span>
                    </div>
                    <span className="text-[10px] opacity-75">Sophia: Latency sub-15ms!</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/40 text-xs text-slate-400">
                    <div className="font-bold text-slate-300">🎨 Design Sync</div>
                    <span className="text-[10px]">Mockups approved ✨</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/40 text-xs text-slate-400">
                    <div className="font-bold text-slate-300">Marcus Vance</div>
                    <span className="text-[10px]">Cloudinary media hooked up</span>
                  </div>
                </div>

                {/* Simulated Center Chat */}
                <div className="flex-1 p-6 flex flex-col justify-between bg-slate-950">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="" className="w-8 h-8 rounded-full" />
                      <div className="p-3 bg-slate-900 rounded-2xl rounded-tl-xs text-xs text-slate-200 border border-slate-800">
                        <span className="font-bold text-indigo-400 block text-[10px]">Sophia Chen</span>
                        Live WebSockets attached. Sub-15ms roundtrip latency across regions! ⚡
                      </div>
                    </div>

                    <div className="flex items-start justify-end gap-3">
                      <div className="p-3 bg-indigo-600 rounded-2xl rounded-tr-xs text-xs text-white shadow-md">
                        <span className="font-bold text-indigo-200 block text-[10px]">Alex Rivera</span>
                        Audio waveforms and typing indicators are rendering flawlessly. 🎙️
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>Press Enter to dispatch message...</span>
                    <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg font-bold text-[10px]">
                      Send
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Feature Highlights */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Engineered For Modern Teams
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Everything You Need for Effortless Communication
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">Sub-Millisecond Speed</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Socket.IO event streams provide real-time messaging, typing awareness, and presence synchronizations with zero polling lag.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">Voice Notes & Waveforms</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Record and stream crystal-clear audio voice clips with interactive playback progress and visual audio waveforms.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-slate-900 dark:text-white">Rich Group Collaboration</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Create dedicated channels, assign multiple admins, pin vital announcements, and share documents with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Security & Privacy */}
      <section id="security" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold">
              <Shield className="w-4 h-4 text-emerald-400" /> Bank-Grade Security
            </div>
            <h2 className="text-3xl font-black text-white">Your Privacy Always Comes First</h2>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
              Protected by TLS encryption, bcrypt salted password hashing, and granular presence visibility controls. We do not sell your personal data or inspect your chats.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <span className="text-2xl font-black text-emerald-400 block">256-Bit</span>
              <span className="text-xs text-slate-300">SSL Encryption</span>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <span className="text-2xl font-black text-blue-400 block">0ms</span>
              <span className="text-xs text-slate-300">Polling Overhead</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions */}
      <section id="faq" className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Everything you need to know about ChatFlow.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeFaq === idx ? 'rotate-180 text-indigo-600' : ''}`} />
              </button>

              {activeFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">ChatFlow</span>
            <span className="text-slate-500">• Connect Instantly. Communicate Seamlessly.</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onSignIn} className="hover:text-white transition-colors">Sign In</button>
            <button onClick={onGetStarted} className="hover:text-white transition-colors">Register</button>
            <button onClick={() => loginAsDemoUser('admin')} className="text-purple-400 hover:text-purple-300 font-semibold">
              Admin Portal
            </button>
          </div>

          <div>
            &copy; 2026 ChatFlow Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
