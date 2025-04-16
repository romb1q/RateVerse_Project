export interface Movie {
    id: number;
    title: string;
    poster: string;
    rating: number;
  }
  
  export interface Filter {
    genre: string;
    year: string;
  }

  export interface ContentType {
    ContentID: number;
    ContentName: string;
    ContentDescription: string;
    ContentGenre: string;
    ContentDate: string;
    ContentImage: string;
    ContentCrew: string;
    rating: number | null;
  }
  
  
  export type SortOption = 'rating' | 'popularity' | 'releaseDate';
  