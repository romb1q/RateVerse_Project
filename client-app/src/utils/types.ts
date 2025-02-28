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
  
  export type SortOption = 'rating' | 'popularity' | 'releaseDate';
  