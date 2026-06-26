import { useState, useEffect, useRef } from 'react';
import {
  Sparkles, TrendingUp, TrendingDown, Minus, ArrowRight,
  AlertCircle, X, Loader2, Megaphone, Menu,
} from 'lucide-react';
import { supabase, Campaign, Persona } from './lib/supabase';
import PersonaCard from './components/PersonaCard';
import Sidebar from './components/Sidebar';

const STATS = [
  { label: 'Active Campaigns', value: '12', delta: '+2 this week', direction: 'up' as const },
  { label: 'Personas Generated', value: '8,420', delta: '+412 (7d)', direction: 'up' as const },
  { label: 'API Credits', value: '62,108', delta: '-1,840 (7d)', direction: 'down' as const },
  { label: 'Reports Ready', value: '7', delta: '3 awaiting review', direction: 'neutral' as const },
];

function StatCard({ label, value, delta, direction }: { label: string; value: string; delta: string; direction: 'up' | 'down' | 'neutral' }) {
  const deltaColor = direction === 'up' ? 'text-neon-mint' : direction === 'down' ? 'text-neon-coral' : 'text-slate-500';
  const DeltaIcon = direction === 'up' ? TrendingUp : direction === 'down' ? TrendingDown : Minus;
  return (
    <div className="glass-panel px-5 py-5 hover:border-white/[0.12] transition-all duration-500 hover:shadow-[0_0_40px_rgba(201,181,240,0.06)]">
      <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-3">{label}</p>
      <div className="flex items-end justify-between gap-4">
        <span className="text-white text-3xl font-bold leading-none tracking-tight">{value}</span>
        <div className={`flex items-center gap-1.5 ${deltaColor} text-xs font-semibold mb-0.5`}>
          <DeltaIcon size={14} />
          <span>{delta}</span>
        </div>
      </div>
    </div>
  );
}

function CampaignsView({ campaigns, activeCampaignId, onCampaignClick }: { campaigns: Campaign[]; activeCampaignId: string | null; onCampaignClick: (id: string) => void }) {
  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-2">Campaigns</p>
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">Your Campaigns</h1>
        <p className="text-slate-400 text-base leading-relaxed">All your synthetic research studies in one place.</p>
      </div>
      {campaigns.length === 0 ? (
        <div className="glass-panel px-5 py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-lavender/10 to-neon-mint/10 border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <Megaphone size={24} className="text-slate-500" />
          </div>
          <p className="text-slate-500 text-sm font-medium">No campaigns yet. Create one from the Dashboard.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {campaigns.map((campaign) => (
            <button
              key={campaign.id}
              onClick={() => onCampaignClick(campaign.id)}
              className={`glass-panel px-5 py-5 text-left transition-all duration-500 w-full hover:shadow-[0_0_40px_rgba(201,181,240,0.06)] ${activeCampaignId === campaign.id ? 'border-neon-lavender/30 shadow-[0_0_40px_rgba(201,181,240,0.08)]' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{campaign.product_description}</p>
                  <p className="text-slate-500 text-xs mt-1.5 line-clamp-2">{campaign.target_audience}</p>
                </div>
                <span className="flex-shrink-0 text-[10px] font-semibold text-slate-500 bg-white/[0.04] px-3 py-1.5 rounded-xl whitespace-nowrap border border-white/[0.06]">
                  {new Date(campaign.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsView() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-2">Settings</p>
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">Settings</h1>
        <p className="text-slate-400 text-base leading-relaxed">Configure your Clarivo Pro workspace.</p>
      </div>
      <div className="glass-panel p-6">
        <p className="text-slate-500 text-sm">Settings panel coming soon.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [productDesc, setProductDesc] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('Dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const personaGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) setCampaigns(data as Campaign[]);
  }

  async function loadPersonasForCampaign(campaignId: string) {
    const { data, error: dbErr } = await supabase
      .from('personas')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: true });
    if (!dbErr && data) setPersonas(data as Persona[]);
  }

  async function handleGenerate() {
    if (!productDesc.trim() || !targetAudience.trim()) {
      setError('Please fill in both fields before generating.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPersonas([]);
    setActiveCampaignId(null);

    try {
      // Create the campaign record first
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({ product_description: productDesc.trim(), target_audience: targetAudience.trim() })
        .select()
        .single();

      if (campaignError) throw new Error(campaignError.message);

      // Invoke the edge function
      const { data: payload, error: fnError } = await supabase.functions.invoke('generate-personas', {
        body: {
          campaign_id: campaign.id,
          product_description: productDesc.trim(),
          target_audience: targetAudience.trim(),
        },
      });

      if (fnError) throw new Error(fnError.message);

      if (!payload?.personas || !Array.isArray(payload.personas) || payload.personas.length === 0) {
        throw new Error('No personas were returned. Check your edge function logs.');
      }

      setPersonas(payload.personas as Persona[]);
      setActiveCampaignId(campaign.id);
      await loadCampaigns();

      setTimeout(() => {
        personaGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleCampaignClick(campaignId: string) {
    setActiveCampaignId(campaignId);
    loadPersonasForCampaign(campaignId);
    setActiveView('Dashboard');
    setTimeout(() => personaGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }

  return (
    <div className="min-h-screen bg-midnight-900 text-white flex relative overflow-x-hidden">
      {/* Floating gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="gradient-orb w-[600px] h-[600px] bg-neon-lavender/20 top-[-100px] left-[-100px] animate-float" />
        <div className="gradient-orb w-[500px] h-[500px] bg-neon-mint/15 top-[400px] right-[-150px] animate-float-slow" />
        <div className="gradient-orb w-[400px] h-[400px] bg-neon-coral/10 bottom-[100px] left-[300px] animate-float" style={{ animationDelay: '-4s' }} />
        <div className="gradient-orb w-[350px] h-[350px] bg-neon-sky/10 top-[200px] left-[50%] animate-float-slow" style={{ animationDelay: '-2s' }} />
      </div>

      <Sidebar
        activeItem={activeView}
        onItemClick={setActiveView}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]" style={{ background: 'rgba(7, 8, 27, 0.8)', backdropFilter: 'blur(20px)' }}>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all border border-white/[0.06]"
        >
          {mobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div className="w-px h-5 bg-white/10" />
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-sm tracking-tight">Clarivo</span>
          <span className="text-neon-lavender text-[10px] font-bold bg-neon-lavender/10 px-1.5 py-0.5 rounded-md border border-neon-lavender/20">PRO</span>
        </div>
      </div>

      <main className="flex-1 lg:ml-[260px] min-h-screen relative z-10">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 pb-16 pt-[72px] lg:pt-0">

          {activeView === 'Dashboard' && (
            <>
              {/* Workspace header */}
              <div className="pt-8 lg:pt-14 pb-8">
                <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-3">Workspace</p>
                <h1 className="text-4xl lg:text-[56px] font-bold text-white mb-4 tracking-tight leading-[1.1]">
                  Clarivo <span className="text-gradient">Pro</span>
                </h1>
                <p className="text-slate-400 text-base leading-relaxed max-w-lg">
                  Design a product brief, describe your audience, and spin up a synthetic focus group in seconds.
                </p>
              </div>

              {/* Campaign Setup card */}
              <div className="glass-panel mb-8 overflow-hidden hover:border-white/[0.12] transition-all duration-500 hover:shadow-[0_0_60px_rgba(201,181,240,0.06)]">
                <div className="px-6 pt-6 pb-5 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-lavender/20 to-neon-mint/20 border border-white/[0.08] flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(201,181,240,0.15)]">
                      <Sparkles size={18} className="text-neon-lavender" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-base tracking-tight">Campaign Setup</h2>
                      <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">
                        Generate a synthetic focus group tailored to your product and audience.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-6 flex flex-col gap-6">
                  {/* Persistent inline error banner */}
                  {error && (
                    <div className="flex items-start gap-3 px-4 py-4 rounded-2xl bg-neon-coral/10 border border-neon-coral/30">
                      <AlertCircle size={18} className="text-neon-coral flex-shrink-0 mt-0.5" />
                      <p className="text-neon-coral text-sm font-medium leading-relaxed flex-1">{error}</p>
                      <button onClick={() => setError(null)} className="text-neon-coral/60 hover:text-neon-coral transition-colors flex-shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-3">
                      Product Description
                    </label>
                    <textarea
                      value={productDesc}
                      onChange={(e) => setProductDesc(e.target.value)}
                      placeholder="An AI co-pilot for boutique law firms that drafts contracts in minutes."
                      rows={3}
                      disabled={isLoading}
                      className="w-full bg-midnight-800 border border-white/[0.08] rounded-2xl px-4 py-3.5 text-slate-200 placeholder-slate-600 text-sm resize-none focus:outline-none focus:border-neon-lavender/30 focus:ring-1 focus:ring-neon-lavender/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-3">
                      Target Audience
                    </label>
                    <textarea
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="Solo & 2-partner US law firms, $250k–$1M annual revenue."
                      rows={3}
                      disabled={isLoading}
                      className="w-full bg-midnight-800 border border-white/[0.08] rounded-2xl px-4 py-3.5 text-slate-200 placeholder-slate-600 text-sm resize-none focus:outline-none focus:border-neon-lavender/30 focus:ring-1 focus:ring-neon-lavender/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-4">
                      Powered by Clarivo&apos;s synthetic persona engine. Results appear below.
                    </p>
                    <button
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="primary-btn w-full flex items-center justify-center gap-2.5 py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Synthesizing personas with AI...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} />
                          <span>Generate Focus Group</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Persona grid — only shown when data is returned */}
              {personas.length > 0 && (
                <div ref={personaGridRef} className="mb-8 animate-slide-up">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-neon-lavender to-neon-mint" />
                    <div>
                      <h2 className="text-white font-bold text-2xl tracking-tight">Focus Group Results</h2>
                      <p className="text-slate-400 text-sm mt-0.5">
                        {personas.length} synthetic personas generated for this campaign.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {personas.map((persona) => (
                      <PersonaCard key={persona.id} persona={persona} />
                    ))}
                  </div>
                </div>
              )}

              {/* Stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {STATS.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>

              {/* Recent Campaigns */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-slate-500 to-slate-600" />
                  <div>
                    <h2 className="text-white font-bold text-2xl tracking-tight">Recent Campaigns</h2>
                    <p className="text-slate-400 text-sm mt-0.5">Your most recently updated synthetic research studies.</p>
                  </div>
                </div>
                {campaigns.length === 0 ? (
                  <div className="glass-panel px-5 py-16 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-lavender/10 to-neon-mint/10 border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                      <Megaphone size={24} className="text-slate-500" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">No campaigns yet. Run your first focus group above to get started.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {campaigns.map((campaign) => (
                      <button
                        key={campaign.id}
                        onClick={() => handleCampaignClick(campaign.id)}
                        className={`glass-panel px-6 py-5 text-left transition-all duration-500 w-full hover:shadow-[0_0_40px_rgba(201,181,240,0.06)] ${activeCampaignId === campaign.id ? 'border-neon-lavender/30 shadow-[0_0_40px_rgba(201,181,240,0.08)]' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-white text-sm font-semibold truncate">{campaign.product_description}</p>
                            <p className="text-slate-500 text-xs mt-1.5 line-clamp-2">{campaign.target_audience}</p>
                          </div>
                          <span className="flex-shrink-0 text-[10px] font-semibold text-slate-500 bg-white/[0.04] px-3 py-1.5 rounded-xl whitespace-nowrap border border-white/[0.06]">
                            {new Date(campaign.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeView === 'Campaigns' && (
            <div className="pt-8 lg:pt-14">
              <CampaignsView campaigns={campaigns} activeCampaignId={activeCampaignId} onCampaignClick={handleCampaignClick} />
            </div>
          )}

          {activeView === 'Settings' && (
            <div className="pt-8 lg:pt-14">
              <SettingsView />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
