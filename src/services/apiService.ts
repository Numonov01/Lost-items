import type { Item } from "../types/types";

const API_URL = "https://688d0bebcd9d22dda5cf49e2.mockapi.io/ap1/v1/board";

export const fetchItems = async (): Promise<Item[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }
  return response.json();
};

export const addItem = async (item: Omit<Item, "id">): Promise<Item> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to add item");
  }
  return response.json();
};

export const updateItemStatus = async (id: string): Promise<Item> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: true }), //type: true ni ham yuborsa bo'ladi
  });

  if (!response.ok) {
    throw new Error(`Failed to update item status. Status: ${response.status}`);
  }

  return response.json();
};
