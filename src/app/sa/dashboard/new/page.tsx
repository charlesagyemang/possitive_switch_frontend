'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function NewCandidate() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    contract_date: '',
    job_title: '',
    reporting_date: '',
    salary: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/candidates', { candidate: form });
      setMessage('🎉 Onboarding triggered & HelloSign sent!');
      setForm({
        name: '',
        email: '',
        contract_date: '',
        job_title: '',
        reporting_date: '',
        salary: '',
      });
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Something went wrong.');
    }
  };

  return (
    <div>
      <h1 className="text-xl text-black font-bold mb-4">New Candidate</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Candidate Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 border rounded text-black"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Candidate Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border rounded text-black"
          required
        />
        <input
          type="date"
          name="contract_date"
          placeholder="Contract Date"
          value={form.contract_date}
          onChange={handleChange}
          className="w-full p-3 border rounded text-black"
          required
        />
        <input
          type="text"
          name="job_title"
          placeholder="Job Title"
          value={form.job_title}
          onChange={handleChange}
          className="w-full p-3 border rounded text-black"
          required
        />
        <input
          type="date"
          name="reporting_date"
          placeholder="Reporting Date"
          value={form.reporting_date}
          onChange={handleChange}
          className="w-full p-3 border rounded text-black"
          required
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
          className="w-full p-3 border rounded text-black"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          Send Offer & Trigger HelloSign
        </button>
      </form>

      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
}
