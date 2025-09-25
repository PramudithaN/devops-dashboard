"use client";
import React, { useEffect, useState } from 'react';
import RepoTable from '../../../components/RepoTable';
import BuildChart from '../../../components/BuildChart';
import { Repo, Build } from '../../../lib/models';

export default function DashboardPage() {
    const [repos, setRepos] = useState<Repo[]>([]);
    const [builds, setBuilds] = useState<Build[]>([]);
    const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');

    useEffect(() => {
        fetch('/api/repos').then(res => res.json()).then(setRepos);
        fetch('/api/builds').then(res => res.json()).then(setBuilds);
    }, []);

    const filteredBuilds = builds.filter(b =>
        filter === 'all' ? true : b.status === filter
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">DevOps Dashboard</h1>
            <div className="mb-4 flex gap-2">
                <button className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setFilter('all')}>All</button>
                <button className={`px-3 py-1 rounded ${filter === 'success' ? 'bg-green-500 text-white' : 'bg-gray-200'}`} onClick={() => setFilter('success')}>Success</button>
                <button className={`px-3 py-1 rounded ${filter === 'failed' ? 'bg-red-500 text-white' : 'bg-gray-200'}`} onClick={() => setFilter('failed')}>Failed</button>
            </div>
            <RepoTable repos={repos} />
            <h2 className="text-xl font-semibold mt-8 mb-4">Build Logs & Charts</h2>
            <BuildChart builds={filteredBuilds} />
        </div>
    );
}
