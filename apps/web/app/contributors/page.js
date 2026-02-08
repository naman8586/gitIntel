"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, GitPullRequest, Bug } from 'lucide-react';
import Link from 'next/link';

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

export default function ContributorsPage() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/contributors')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setContributors(data.contributors || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch contributors:', err);
        setError(err.message);
        setContributors([]);
        setLoading(false);
      });
  }, []);

  const getMedalColor = (index) => {
    if (index === 0) return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
    if (index === 1) return 'bg-gradient-to-br from-gray-300 to-gray-400';
    if (index === 2) return 'bg-gradient-to-br from-orange-400 to-orange-600';
    return 'bg-gradient-to-br from-slate-600 to-slate-700';
  };

  return (
    <div className="min-h-screen bg-[#F8F9F3] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-50 via-white to-blue-50 text-slate-900 p-6">
      
      {/* Header */}
      <header className="max-w-[1200px] mx-auto mb-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-slate-600 hover:text-slate-900 transition">
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-400 rounded-2xl">
            <Trophy size={32} />
          </div>
          <div>
            <h1 className="text-5xl font-medium tracking-tight">Leaderboard</h1>
            <p className="text-slate-500 mt-1">Top contributors ranked by impact score</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1200px] mx-auto">
        {loading ? (
          <div className="text-center text-slate-500 py-20">Loading contributors...</div>
        ) : error ? (
          <GlassCard className="text-center py-20">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-red-300" />
            <p className="text-red-500 text-lg mb-2">Error loading contributors</p>
            <p className="text-slate-500 text-sm">{error}</p>
          </GlassCard>
        ) : contributors.length === 0 ? (
          <GlassCard className="text-center py-20">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 text-lg">No contributors yet. Start contributing!</p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {contributors.map((contributor, index) => (
              <GlassCard 
                key={contributor.id}
                className="hover:border-yellow-400 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Rank Badge */}
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white ${getMedalColor(index)} shadow-lg`}>
                      {index + 1}
                    </div>
                    
                    {/* Contributor Info */}
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{contributor.contributorKey}</h3>
                      <p className="text-sm text-slate-500">{contributor.repository?.fullName || 'Unknown repo'}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-blue-500 mb-1">
                        <GitPullRequest size={16} />
                        <span className="font-bold">{contributor.mergedPRs || 0}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Merged PRs</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-1 text-orange-500 mb-1">
                        <Bug size={16} />
                        <span className="font-bold">{contributor.bugFixPRs || 0}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Bug Fixes</p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span className="text-3xl font-bold text-yellow-500">{contributor.totalScore?.toFixed(2) || '0.00'}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Impact Score</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}