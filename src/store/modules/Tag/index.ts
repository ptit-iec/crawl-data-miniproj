export interface Tag {
  id: string;
  name: string;
  description: string;
}

export interface ApiResponse<T> {
  items: T[];
}

export interface RawTag {
  id: string;
  name: string;
  description?: string;
}