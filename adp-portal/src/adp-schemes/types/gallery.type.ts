export type GalleryItem = {
  id: string;
  imageUrl: string;
  uploadedBy: string;
  uploadedAt: string | null;
  caption: string | null;
};

export type GalleryResponse = {
  items: GalleryItem[];
};