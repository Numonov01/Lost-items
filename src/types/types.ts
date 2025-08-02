export interface Item {
  id: string;
  imageUrl: string;
  title: string;
  location: string;
  date: string;
  type: boolean; //"lost" | "found"
  status: boolean; //"active" | "done"
}
