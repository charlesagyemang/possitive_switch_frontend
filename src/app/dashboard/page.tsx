'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Candidate {
  id: number;
  name: string;
  email: string;
  parcel_dispatched: boolean;
}

export default function Dashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    api.get('/candidates').then((res) => {
      setCandidates(res.data);
    });
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Candidate Dashboard</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Dispatched</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.email}</td>
              <td className="border p-2">{c.parcel_dispatched ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
