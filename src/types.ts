export interface User {
  id: number;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface SimMovie {
  id: number;
  title: string;
  genre: string;
  duration: number; // in minutes
  description: string;
  posterUrl: string;
  language: string;
  showtimes: SimShowTime[];
}

export interface SimShowTime {
  id: number;
  movieId: number;
  theater: string;
  date: string;
  time: string;
  price: number;
}

export interface SimBooking {
  id: number;
  movieTitle: string;
  theater: string;
  date: string;
  time: string;
  seats: string[];
  totalPrice: number;
  bookingDate: string;
  username: string;
}

export interface JavaFile {
  path: string;
  language: string;
  description: string;
  content: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
