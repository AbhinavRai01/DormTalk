export default function TopProfiles() {
  const profiles = ["@intern_buddy", "@placement_guru", "@hostel_hacks"];
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="font-semibold mb-3">Top Profiles</h3>
      <div className="flex flex-wrap gap-2">
        {profiles.map((tag, i) => (
          <span
            key={i}
            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}