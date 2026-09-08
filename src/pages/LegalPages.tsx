import React, { useState } from 'react';
import { ShieldCheck, FileText, AlertCircle, Info, Lock } from 'lucide-react';

interface LegalPagesProps {
  initialSection?: string;
  onNavigate: (view: string) => void;
}

export const LegalPages: React.FC<LegalPagesProps> = ({
  initialSection = 'privacy',
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialSection);

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: Lock },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'dmca', label: 'DMCA & Copyright', icon: ShieldCheck },
    { id: 'about', label: 'About MovieLot', icon: Info }
  ];

  return (
    <div id="legal-compliance-page" className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Legal & Platform Compliance
        </h1>
        <p className="text-sm text-zinc-400">
          Transparency, copyright compliance, and privacy policies for MovieLot.com.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-zinc-800">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 border-b-2 font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#0f131c] border border-zinc-800/80 leading-relaxed text-zinc-300 text-sm space-y-6">
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Lock className="text-amber-500" size={20} />
              Privacy Policy
            </h2>
            <p className="text-xs text-zinc-400">Last updated: September 2026</p>
            <p>
              MovieLot (&ldquo;MovieLot.com&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) prioritizes user privacy and security. This Privacy Policy details how we handle user data and information across our web platform.
            </p>
            <h3 className="text-base font-bold text-zinc-100">1. Client-Side Data Storage</h3>
            <p>
              MovieLot provides full movie and TV show discovery without requiring an account. Features such as your <strong>Personal Watchlist</strong> and viewing preferences are stored locally on your device via standard browser <code>localStorage</code>. No personal profile data or credentials are submitted to our servers.
            </p>
            <h3 className="text-base font-bold text-zinc-100">2. AI Assistance and Query Processing</h3>
            <p>
              When using the MovieLot AI assistant or recommendation engine, queries are processed securely on the server via Google Gemini API integrations without transmitting personally identifiable credentials.
            </p>
            <h3 className="text-base font-bold text-zinc-100">3. Third-Party Services & Analytics</h3>
            <p>
              We do not sell, rent, or monetize your personal information. If third-party advertising or media preview players (such as YouTube embeds) are accessed, their respective privacy policies apply.
            </p>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="text-amber-500" size={20} />
              Terms of Service
            </h2>
            <p className="text-xs text-zinc-400">Last updated: September 2026</p>
            <p>
              By accessing or using MovieLot.com, you agree to comply with and be bound by the following terms and conditions.
            </p>
            <h3 className="text-base font-bold text-zinc-100">1. Purpose of the Service</h3>
            <p>
              MovieLot is an entertainment metadata discovery, review, and recommendation platform. We provide synopsis details, casting credits, release schedules, and video previews to assist movie and television enthusiasts.
            </p>
            <h3 className="text-base font-bold text-zinc-100">2. Permitted Use</h3>
            <p>
              You agree to use MovieLot solely for personal, non-commercial entertainment discovery purposes in accordance with all applicable international and local laws.
            </p>
            <h3 className="text-base font-bold text-zinc-100">3. Content Accuracy</h3>
            <p>
              While we strive for precision across box office revenues, casting logs, and air dates, media schedules and release windows are subject to studio and distributor alterations.
            </p>
          </div>
        )}

        {activeTab === 'dmca' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={20} />
              DMCA / Copyright Notice
            </h2>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>
                <strong>Zero-Hosting Compliance:</strong> MovieLot.com does NOT host, upload, re-transmit, or provide direct download links to full-length copyright protected media.
              </span>
            </div>
            <p>
              MovieLot operates as an index and discovery platform. Video previews and trailers accessible on this service are embedded from legitimate, official studio channels using YouTube&apos;s public embedding APIs and Terms of Service.
            </p>
            <h3 className="text-base font-bold text-zinc-100">Copyright Inquiries</h3>
            <p>
              If you represent a copyright owner and believe that any promotional thumbnail, synopsis, or embed violates intellectual property regulations, please submit a formal notification with the exact URL to:
            </p>
            <div className="p-3 bg-zinc-900 rounded-xl font-mono text-xs text-amber-400">
              legal@movielot.com
            </div>
            <p className="text-xs text-zinc-400">
              Valid notices are processed expediently in compliance with the Digital Millennium Copyright Act (17 U.S.C. § 512).
            </p>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Info className="text-amber-500" size={20} />
              About MovieLot.com
            </h2>
            <p>
              MovieLot.com was conceived by passionate film connoisseurs and software engineers seeking a cleaner, faster, and more cinematic discovery platform.
            </p>
            <p>
              Our platform bridges the gap between massive entertainment catalogs and personal taste through high-fidelity visual design, verified casting metadata, and cutting-edge Google Gemini AI intelligence.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                Start Exploring Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
