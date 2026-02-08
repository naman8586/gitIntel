"use client";

import React, { useState, useEffect } from 'react';
import { 
  GitPullRequest, Zap, CheckCircle2, 
  Clock, Trophy, GitMerge, Terminal, 
  Github, Settings, Search, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/40 backdrop-blur-md border border-white/60 rounded-4xl p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seconds, setSeconds] = useState(5);
  const [recentEvents] = useState([
    { type: "PR MERGED", repo: "ChaiCode", time: "Just now", icon: <GitMerge size={14}/>, color: "text-green-400" },
    { type: "PUSH", repo: "ChaiCode", time: "2m ago", icon: <Zap size={14}/>, color: "text-yellow-400" },
    { type: "PR OPENED", repo: "Material-UI", time: "5m ago", icon: <GitPullRequest size={14}/>, color: "text-blue-400" },
    { type: "SCORE UPDATED", repo: "naman8586", time: "8m ago", icon: <Trophy size={14}/>, color: "text-purple-400" },
  ]);

  // Fetch dashboard stats
  useEffect(() => {
    fetch('/api/stats')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch stats:', err);
        setError(err.message);
        // Set default values
        setStats({
          totalRepos: 0,
          totalPRs: 0,
          totalEvents: 0,
          topContributors: []
        });
        setLoading(false);
      });
  }, []);

  // Poll interval countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev <= 1 ? 5 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9F3] bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-yellow-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-2xl font-medium text-slate-600">Loading Dashboard...</div>
      </div>
    );
  }

  const topContributor = stats?.topContributors?.[0];
  const avgScore = stats?.topContributors?.length > 0
    ? stats.topContributors.reduce((sum, c) => sum + (c.totalScore || 0), 0) / stats.topContributors.length
    : 0;
  const mergedRate = topContributor?.totalPRs > 0
    ? Math.round((topContributor.mergedPRs / topContributor.totalPRs) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#F8F9F3] bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-yellow-50 via-white to-blue-50 text-slate-900 p-6 font-sans">
      
      {/* --- HEADER --- */}
      <header className="flex justify-between items-center max-w-7xl mx-auto mb-10">
        <div className="flex items-center gap-2 bg-white px-6 py-2 rounded-full border border-slate-200 font-bold text-xl tracking-tight shadow-sm">
          <Github size={24} /> GitIntel
        </div>
        
        <nav className="hidden md:flex bg-black text-white px-2 py-1.5 rounded-full items-center gap-1 shadow-lg">
          <Link href="/" className="bg-zinc-800 px-4 py-1.5 rounded-full text-sm font-medium">Analytics</Link>
          <Link href="/repositories" className="px-4 py-1.5 text-zinc-400 text-sm hover:text-white transition-colors">Repositories</Link>
          <Link href="/contributors" className="px-4 py-1.5 text-zinc-400 text-sm hover:text-white transition-colors">Leaderboard</Link>
          <button className="px-4 py-1.5 text-zinc-400 text-sm hover:text-white transition-colors">Webhooks</button>
          <button className="px-4 py-1.5 text-zinc-400 text-sm hover:text-white transition-colors">Worker</button>
        </nav>

        <div className="flex gap-3">
          <div className="p-2 bg-white rounded-full border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition">
            <Settings size={20} />
          </div>
          <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white border border-white shadow-md font-bold cursor-pointer hover:bg-slate-800 transition">
            NS
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">
            ⚠️ Error loading stats: {error}. Showing default values.
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto">
        {/* --- DYNAMIC DATA ROW --- */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-8 gap-6">
          <div>
            <h1 className="text-5xl font-medium tracking-tight mb-2">Platform Overview</h1>
            <div className="flex gap-8 mt-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Merged Rate</p>
                <div className="w-16 h-8 bg-zinc-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {mergedRate}%
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Bug Fixes</p>
                <div className="w-16 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black text-xs font-bold">
                  {topContributor?.bugFixPRs || 0}
                </div>
              </div>
              <div className="flex-1 min-w-50">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Database Health</p>
                <div className="h-8 bg-white rounded-full border border-slate-100 overflow-hidden flex shadow-inner">
                  <div 
                    className="h-full bg-slate-200/50 w-[95%]" 
                    style={{
                      backgroundImage: 'linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.05) 75%, transparent 75%, transparent)',
                      backgroundSize: '12px 12px'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-12 pb-2">
            <div className="text-center">
              <p className="text-4xl font-medium">{stats?.totalPRs || 0}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Total PRs</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-medium text-yellow-500">{avgScore?.toFixed(2) || '0.00'}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Avg Score</p>
            </div>
          </div>
        </div>

        {/* --- BENTO GRID --- */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* TOP CONTRIBUTOR CARD */}
          <div className="col-span-12 lg:col-span-3">
            <div className="relative h-full min-h-87.5 rounded-[40px] overflow-hidden group shadow-xl bg-gradient-to-br from-slate-900 to-slate-700">
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute top-8 left-8 right-8">
                <Trophy className="w-12 h-12 text-yellow-400" />
              </div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-1">Top Contributor</p>
                <p className="text-2xl font-medium">{topContributor?.contributorKey || 'N/A'}</p>
                <p className="text-white/60 text-sm">{topContributor?.repository?.name || 'No repo'}</p>
                <div className="mt-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full py-1.5 px-5 inline-block text-sm font-medium">
                  {topContributor?.totalScore?.toFixed(2) || '0.00'} Score
                </div>
              </div>
            </div>
          </div>

          {/* SCORE VELOCITY */}
          <GlassCard className="col-span-12 lg:col-span-3">
            <div className="flex justify-between mb-8">
              <h3 className="text-xl font-medium">Score Velocity</h3>
              <div className="p-2 bg-white rounded-full shadow-sm text-yellow-500"><Zap size={16} /></div>
            </div>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-4xl font-medium tracking-tighter">+{avgScore.toFixed(1)}</span>
              <div className="flex flex-col ml-2">
                <span className="text-slate-400 text-[10px] font-bold uppercase leading-none">Pts Today</span>
              </div>
            </div>
            {/* Activity Chart */}
            <div className="flex items-end gap-2 h-24 mt-8">
               {[20, 45, 30, 80, 50, 90, 40].map((h, i) => (
                 <div 
                   key={i} 
                   className={`flex-1 rounded-full transition-all duration-500 cursor-pointer ${i === 5 ? 'bg-yellow-400' : 'bg-zinc-900 hover:bg-zinc-700'}`} 
                   style={{ height: `${h}%` }}
                 />
               ))}
            </div>
            <div className="flex justify-between mt-2 px-1">
              {['S','M','T','W','T','F','S'].map((day, i) => (
                <span key={i} className="text-[10px] font-bold text-slate-300 uppercase">{day}</span>
              ))}
            </div>
          </GlassCard>

          {/* WORKER BEAT */}
          <GlassCard className="col-span-12 lg:col-span-3 flex flex-col items-center justify-center relative overflow-hidden text-center">
            <div className="absolute top-6 left-6 text-xl font-medium">Worker Beat</div>
            
            <div className="relative flex items-center justify-center w-44 h-44">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                <circle 
                  cx="88" cy="88" r="80" 
                  stroke="currentColor" strokeWidth="10" fill="transparent" 
                  className="text-black transition-all duration-1000" 
                  strokeDasharray={502} 
                  strokeDashoffset={502 - (502 * (seconds / 5))} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-medium tracking-tighter">00:0{seconds}</span>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest mt-1">Next Poll</span>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100"><Terminal size={18} /></div>
              <div className="p-3 bg-green-500 text-white rounded-full shadow-lg"><CheckCircle2 size={18} /></div>
            </div>
          </GlassCard>

          {/* LIVE WEBHOOK FEED */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
             <GlassCard className="p-5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">Events Handled</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-medium">{stats?.totalEvents || 0}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-black rounded-full uppercase">Active</span>
                  </div>
                </div>
             </GlassCard>

             <div className="bg-zinc-900 rounded-4xl p-6 text-white flex-1 shadow-2xl relative">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Live Stream</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-zinc-500 text-xs font-medium uppercase tracking-tighter">Live</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {recentEvents.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border border-zinc-800 bg-zinc-800/50 ${item.color}`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.type}</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">{item.repo} • {item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <Link href="/repositories" className="group">
              <GlassCard className="h-full hover:border-blue-400 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-medium mb-2">Browse Repositories</h3>
                    <p className="text-sm text-slate-500">View all {stats?.totalRepos || 0} tracked repositories</p>
                  </div>
                  <div className="p-3 bg-blue-500 text-white rounded-full group-hover:scale-110 transition-transform">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </GlassCard>
            </Link>

            <Link href="/contributors" className="group">
              <GlassCard className="h-full hover:border-purple-400 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-medium mb-2">Leaderboard</h3>
                    <p className="text-sm text-slate-500">See top contributors ranked by impact</p>
                  </div>
                  <div className="p-3 bg-purple-500 text-white rounded-full group-hover:scale-110 transition-transform">
                    <Trophy size={20} />
                  </div>
                </div>
              </GlassCard>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}