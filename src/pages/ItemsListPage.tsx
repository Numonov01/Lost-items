import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import type { Item } from "../types/types";
import debounce from "lodash.debounce";

interface ItemsListPageProps {
  items: Item[];
  updateItemStatus: (id: string) => Promise<void>;
}

const ItemsListPage: React.FC<ItemsListPageProps> = ({
  items,
  updateItemStatus,
}) => {
  const [filteredItems, setFilteredItems] = useState<Item[]>(items);
  const [typeFilter, setTypeFilter] = useState<"all" | "lost" | "found">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "done">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  useEffect(() => {
    let result = [...items];

    // Type filter
    if (typeFilter !== "all") {
      result = result.filter((item) =>
        typeFilter === "found" ? item.type : !item.type
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((item) =>
        statusFilter === "done" ? item.status : !item.status
      );
    }

    // Search term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerSearch) ||
          item.location.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredItems(result);
  }, [items, typeFilter, statusFilter, searchTerm]);

  const handleStatusUpdate = async (id: string) => {
    setLoadingId(id);
    try {
      await updateItemStatus(id);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6 bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold text-gray-800">Buyumlar Ro'yxati</h1>
        <Link
          to="/add"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add new
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as "all" | "lost" | "found")
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "active" | "done")
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-1">Location: {item.location}</p>
                <p className="text-gray-600 mb-3">
                  Date: {new Date(item.date).toLocaleDateString()}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      item.type
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.type ? "Found" : "Lost"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      item.status
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item.status ? "Done" : "Active"}
                  </span>
                </div>

                {!item.status && (
                  <button
                    onClick={() => handleStatusUpdate(item.id)}
                    disabled={loadingId === item.id}
                    className="w-full bg-gray-500 text-white py-2 px-3 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                  >
                    {loadingId === item.id ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        In process...
                      </>
                    ) : (
                      "Mark as completed"
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No items found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemsListPage;
