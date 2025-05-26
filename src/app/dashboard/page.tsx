'use client';

interface Candidate {
  id: number;
  name: string;
  email: string;
  parcel_dispatched: boolean;
}


import { useEffect, useState } from 'react';
import { UserGroupIcon, EnvelopeIcon, TruckIcon } from '@heroicons/react/24/outline';
import api from '@/lib/api';
import StatCard from '@/components/StatCard';
import CandidateTable from '@/components/CandidateTable';

export default function Dashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    api.get('/candidates').then((res) => {
      setCandidates(res.data);
    });
  }, []);

  const total = candidates.length;
  const dispatched = candidates.filter((c) => c.parcel_dispatched).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Candidates" value={total} icon={<UserGroupIcon className="h-6 w-6" />} />
        <StatCard label="Emails Sent" value={total} icon={<EnvelopeIcon className="h-6 w-6" />} />
        <StatCard label="Parcels Dispatched" value={dispatched} icon={<TruckIcon className="h-6 w-6" />} />
      </div>

      <CandidateTable candidates={candidates} />
    </div>
  );
}
