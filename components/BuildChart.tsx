import React from 'react';
import { Build } from '../lib/models';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BuildChartProps {
    builds: Build[];
}

export default function BuildChart({ builds }: BuildChartProps) {
    // Aggregate average duration per repo
    const repoStats: Record<string, { name: string; avgDuration: number; success: number; failed: number }> = {};
    builds.forEach(build => {
        const repoId = build.repoId.toString();
        if (!repoStats[repoId]) {
            repoStats[repoId] = { name: repoId, avgDuration: 0, success: 0, failed: 0 };
        }
        repoStats[repoId].avgDuration += build.duration;
        if (build.status === 'success') repoStats[repoId].success++;
        else repoStats[repoId].failed++;
    });
    const data = Object.values(repoStats).map(stat => ({
        name: stat.name,
        avgDuration: stat.avgDuration / (stat.success + stat.failed),
        success: stat.success,
        failed: stat.failed,
    }));

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgDuration" fill="#8884d8" name="Avg Duration (ms)" />
                    <Bar dataKey="success" fill="#4ade80" name="Success" />
                    <Bar dataKey="failed" fill="#f87171" name="Failed" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
