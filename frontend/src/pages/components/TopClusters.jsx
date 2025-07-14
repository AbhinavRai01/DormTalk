export default function TopClusters() {
  const clusters = ["programming", "campuslife", "gaming", "startups"];
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <h3 className="font-semibold mb-3">Top Clusters</h3>
      <ul className="space-y-2">
        {clusters.map((c, i) => (
          <li key={i} className="text-blue-600">d/{c}</li>
        ))}
      </ul>
      <button className="mt-4 w-full bg-blue-600 text-white py-1 rounded">View All</button>
    </div>
  );
}