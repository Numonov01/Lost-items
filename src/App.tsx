import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddItemPage from "./pages/AddItemPage";
import ItemsListPage from "./pages/ItemsListPage";
import type { Item } from "./types/types";
import {
  fetchItems,
  addItem as apiAddItem,
  updateItemStatus as apiUpdateItemStatus,
} from "./services/apiService";

function App() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchItems();
        setItems(data);
      } catch (error) {
        console.error("Error loading items:", error);
      }
    };
    loadItems();
  }, []);

  const handleAddItem = async (newItem: Omit<Item, "id">) => {
    try {
      const createdItem = await apiAddItem(newItem);
      setItems([...items, createdItem]);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleUpdateItemStatus = async (id: string) => {
    try {
      await apiUpdateItemStatus(id);
      setItems(
        items.map((item) => (item.id === id ? { ...item, status: true } : item))
      );
    } catch (error) {
      console.error("Error updating item status:", error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/add" element={<AddItemPage addItem={handleAddItem} />} />
        <Route
          path="/"
          element={
            <ItemsListPage
              items={items}
              updateItemStatus={handleUpdateItemStatus}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
