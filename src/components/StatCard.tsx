interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded shadow flex items-center gap-4">
      <div className="text-blue-600">{icon}</div>
      <div>
        <div className="text-xl text-black font-bold">{value}</div>
        <div className="text-gray-500">{label}</div>
      </div>
    </div>
  );
}
