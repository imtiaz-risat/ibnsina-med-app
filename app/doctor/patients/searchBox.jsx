import { FiSearch } from "react-icons/fi";

export function SearchBox({ onSearch }) {
  return (
    <div className="w-full flex-1 relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <FiSearch className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search patients by ID, name, phone or note..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm placeholder:text-gray-400"
      />
    </div>
  );
}
