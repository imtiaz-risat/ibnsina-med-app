export function SearchBox({ onSearch }) {
  return (
    <div className="w-full max-w-lg">
      <input
        type="text"
        placeholder="Search patients by id, name, phone or note..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
      />
    </div>
  );
}
