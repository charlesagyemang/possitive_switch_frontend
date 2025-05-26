import { UsersIcon, HomeIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r shadow-sm p-6">
      <h2 className="text-xl text-black font-bold mb-8">🧭 Onboarding</h2>
      <nav className="space-y-4">
        <a href="/dashboard/new" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
          <HomeIcon className="h-5 w-5" />
          New Candidate
        </a>
        <a href="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
          <UsersIcon className="h-5 w-5" />
          Dashboard
        </a>
      </nav>
    </div>
  );
}
