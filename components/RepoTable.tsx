import React from 'react';
import { Repo } from '../lib/models';

interface RepoTableProps {
    repos: Repo[];
}

const statusBadge = (status: string) => {
    const base = 'px-2 py-1 rounded text-xs font-bold';
    if (status === 'success') return <span className={base + ' bg-green-100 text-green-800'}>✅ Success</span>;
    if (status === 'failed') return <span className={base + ' bg-red-100 text-red-800'}>❌ Failed</span>;
    return <span className={base + ' bg-gray-100 text-gray-800'}>Unknown</span>;
};

export default function RepoTable({ repos }: RepoTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Repo Name</th>
                        <th className="px-4 py-2">Last Build Status</th>
                        <th className="px-4 py-2">Last Build Time</th>
                    </tr>
                </thead>
                <tbody>
                    {repos.map(repo => (
                        <tr key={repo._id?.toString() || repo.name}>
                            <td className="border px-4 py-2">{repo.name}</td>
                            <td className="border px-4 py-2">{statusBadge(repo.lastBuildStatus)}</td>
                            <td className="border px-4 py-2">{new Date(repo.lastBuildTime).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
