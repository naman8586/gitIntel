"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, GitBranch, GitPullRequest, Star, Users } from 'lucide-react';
import Link from 'next/link';

const GlassCard = ({ children, className = "" }) => (
  <div className={`bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

export default function RepositoriesPage() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/repositories')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setRepos(data.repositories || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch repositories:', err);
        setError(err.message);
        setRepos([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9F3] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-50 via-white to-blue-50 text-slate-900 p-6">
      
      {/* Header */}
      <header className="max-w-[1400px] mx-auto mb-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-slate-600 hover:text-slate-900 transition">
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500 text-white rounded-2xl">
            <GitBranch size={32} />
          </div>
          <div>
            <h1 className="text-5xl font-medium tracking-tight">Repositories</h1>
            <p className="text-slate-500 mt-1">All tracked repositories with analytics</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1400px] mx-auto">
        {loading ? (
          <div className="text-center text-slate-500 py-20">Loading repositories...</div>
        ) : error ? (
          <GlassCard className="text-center py-20">
            <GitBranch className="w-16 h-16 mx-auto mb-4 text-red-300" />
            <p className="text-red-500 text-lg mb-2">Error loading repositories</p>
            <p className="text-slate-500 text-sm">{error}</p>
          </GlassCard>
        ) : repos.length === 0 ? (
          <GlassCard className="text-center py-20">
            <GitBranch className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 text-lg">No repositories tracked yet</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map(repo => (
              <Link key={repo.id} href={`/repositories/${repo.id}`}>
                <GlassCard className="h-full hover:border-blue-400 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-xl mb-1 group-hover:text-blue-600 transition">{repo.name}</h3>
                      <p className="text-sm text-slate-500">{repo.fullName}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={16} className="fill-yellow-500" />
                      <span className="text-sm font-bold">{repo.stars}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-6">
                    <div className="flex items-center gap-2 text-slate-600">
                      <GitPullRequest size={18} />
                      <span className="font-medium">{repo._count?.pullRequests || 0}</span>
                      <span className="text-xs text-slate-400">PRs</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users size={18} />
                      <span className="font-medium">{repo._count?.scores || 0}</span>
                      <span className="text-xs text-slate-400">Contributors</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-xs">
                      <GitBranch size={14} className="text-slate-400" />
                      <span className="text-slate-500 font-medium">{repo.defaultBranch}</span>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}