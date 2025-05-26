'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function NewCandidate() {
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
    } catch {
      setMessage('⚠️ Something went wrong.');
    }
  };

  return (
    <div>
      <h1 className="text-xl text-black font-bold mb-4">New Candidate</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <input
          type="text"
          placeholder="Candidate Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded text-black"
          required
        />
        <input
          type="email"
          placeholder="Candidate Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded text-black"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          Send Welcome Email
        </button>
      </form>

      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
}
