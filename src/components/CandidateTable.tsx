interface Candidate {
  id: number;
  name: string;
  email: string;
  parcel_dispatched: boolean;
}

export default function CandidateTable({ candidates }: { candidates: Candidate[] }) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-4 text-black">Name</th>
            <th className="p-4 text-black">Email</th>
            <th className="p-4 text-black">Status</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-4 text-black">{c.name}</td>
              <td className="p-4 text-black">{c.email}</td>
              <td className="p-4 text-black">
                <span className={`px-2 py-1 rounded text-xs font-medium ${c.parcel_dispatched ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {c.parcel_dispatched ? 'Dispatched' : 'Pending'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
