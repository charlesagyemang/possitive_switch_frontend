'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/candidates', {
        candidate: { name, email }
      });
      setMessage('🎉 Onboarding triggered & email sent!');
      setName('');
      setEmail('');
    } catch (err: any) {
      setMessage('⚠️ Failed to submit.');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Trigger Onboarding</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Candidate Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="email"
          placeholder="Candidate Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Send Welcome Email
        </button>
      </form>

      {message && <p className="mt-4 text-lg">{message}</p>}
    </main>
  );
}
