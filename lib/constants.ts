// Genre constants for the library application
export const GENRES = {
  FICTION: "Fiction",
  DYSTOPIAN: "Dystopian",
  ROMANCE: "Romance",
  FOLKLORE: "Folklore",
  SCIENCE_FICTION: "Science Fiction",
  FANTASY: "Fantasy",
  RELIGIOUS: "Religious",
  PHILOSOPHICAL: "Philosophical",
} as const;

export type Genre = (typeof GENRES)[keyof typeof GENRES];

// Array of all available genres for dropdowns, validation, etc.
export const GENRE_OPTIONS = Object.values(GENRES);

// Helper function to check if a genre is valid
export const isValidGenre = (genre: string): genre is Genre => {
  return GENRE_OPTIONS.includes(genre as Genre);
};

// Helper function to get genre display name
export const getGenreDisplayName = (genre: string): string => {
  return genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();
};
