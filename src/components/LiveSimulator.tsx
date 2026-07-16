import React, { useState, useEffect } from "react";
import { User, SimMovie, SimShowTime, SimBooking } from "../types";
import { 
  Film, Calendar, Clock, CreditCard, ChevronRight, Check, History, 
  Trash2, Plus, LogIn, LogOut, ShieldAlert, CheckCircle2, Ticket 
} from "lucide-react";

export default function LiveSimulator() {
  // 1. Session State (Defaults to logged out)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("MB_session");
    return saved ? JSON.parse(saved) : null;
  });

  // 2. Movie Catalog State
  const [movies, setMovies] = useState<SimMovie[]>(() => {
    const saved = localStorage.getItem("MB_movies");
    if (saved) return JSON.parse(saved);
    
    // Default Catalog Seeds
    return [
      {
        id: 1,
        title: "Inception",
        genre: "Sci-Fi / Thriller",
        duration: 148,
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500",
        language: "English",
        showtimes: [
          { id: 101, movieId: 1, theater: "Screen 1 - Grand Plaza", date: "2026-08-15", time: "14:30", price: 12.50 },
          { id: 102, movieId: 1, theater: "Screen 2 - Luxe Cinema", date: "2026-08-15", time: "18:00", price: 15.00 },
        ]
      },
      {
        id: 2,
        title: "The Dark Knight",
        genre: "Action / Crime",
        duration: 152,
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests.",
        posterUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500",
        language: "English",
        showtimes: [
          { id: 201, movieId: 2, theater: "Screen 1 - Grand Plaza", date: "2026-08-16", time: "15:00", price: 12.50 },
          { id: 202, movieId: 2, theater: "IMAX Theatre - Megaplex", date: "2026-08-16", time: "21:00", price: 18.50 },
        ]
      },
      {
        id: 3,
        title: "Interstellar",
        genre: "Sci-Fi / Adventure",
        duration: 169,
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival on a dying Earth.",
        posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500",
        language: "English",
        showtimes: [
          { id: 301, movieId: 3, theater: "IMAX Theatre - Megaplex", date: "2026-08-17", time: "19:30", price: 18.50 },
        ]
      }
    ];
  });

  // 3. User Bookings state (stored in localstorage for persistence)
  const [bookings, setBookings] = useState<SimBooking[]>(() => {
    const saved = localStorage.getItem("MB_bookings");
    return saved ? JSON.parse(saved) : [];
  });

  // 4. Booking Steps and Active Selections
  const [activeStep, setActiveStep] = useState<"movies" | "details" | "seats" | "payment" | "history" | "admin" | "auth">("movies");
  const [selectedMovie, setSelectedMovie] = useState<SimMovie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<SimShowTime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  // 5. Authentication inputs
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // 6. Payment inputs
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // 7. Admin Panel states
  const [newTitle, setNewTitle] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [newDuration, setNewDuration] = useState(120);
  const [newDescription, setNewDescription] = useState("");
  const [newPoster, setNewPoster] = useState("");
  const [newLanguage, setNewLanguage] = useState("English");

  const [stMovieId, setStMovieId] = useState<number>(1);
  const [stTheater, setStTheater] = useState("Screen 1 - Grand Plaza");
  const [stDate, setStDate] = useState("2026-08-20");
  const [stTime, setStTime] = useState("18:30");
  const [stPrice, setStPrice] = useState(12.50);

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem("MB_movies", JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem("MB_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("MB_session", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("MB_session");
    }
  }, [currentUser]);

  // Handle Login submission
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (authMode === "login") {
      // Simulate login
      if (usernameInput.trim().toLowerCase() === "admin" && passwordInput === "admin123") {
        const user: User = { id: 1, username: "admin", email: "admin@cinema.com", role: "ADMIN" };
        setCurrentUser(user);
        setActiveStep("movies");
      } else if (usernameInput.trim().toLowerCase() === "user" && passwordInput === "user123") {
        const user: User = { id: 2, username: "user", email: "user@cinema.com", role: "USER" };
        setCurrentUser(user);
        setActiveStep("movies");
      } else {
        setAuthError("Invalid credentials. Try admin/admin123 or user/user123.");
      }
    } else {
      // Simulate registration
      if (!usernameInput.trim() || !emailInput.trim() || !passwordInput) {
        setAuthError("All inputs must be populated.");
        return;
      }
      const newUser: User = {
        id: Date.now(),
        username: usernameInput.trim(),
        email: emailInput.trim(),
        role: "USER"
      };
      setCurrentUser(newUser);
      setActiveStep("movies");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedSeats([]);
    setActiveStep("movies");
  };

  // Seat matrix selection mapping
  const toggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Secure final booking completion
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setActiveStep("auth");
      return;
    }

    const newBooking: SimBooking = {
      id: Math.floor(100000 + Math.random() * 900000),
      movieTitle: selectedMovie?.title || "",
      theater: selectedShowtime?.theater || "",
      date: selectedShowtime?.date || "",
      time: selectedShowtime?.time || "",
      seats: selectedSeats,
      totalPrice: selectedSeats.length * (selectedShowtime?.price || 0),
      bookingDate: new Date().toISOString().substring(0, 16).replace("T", " "),
      username: currentUser.username
    };

    setBookings([newBooking, ...bookings]);
    alert(`🎉 Ticket Booking Authorized Successfully!\nReservation Code: #REC-${newBooking.id}\nEnjoy your screening session.`);
    
    // Clean states and dispatch to history tab
    setSelectedSeats([]);
    setActiveStep("history");
  };

  // Admin: Create Movie catalog listing
  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    const poster = newPoster.trim() || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500";
    const newMovie: SimMovie = {
      id: Date.now(),
      title: newTitle.trim(),
      genre: newGenre.trim(),
      duration: newDuration,
      description: newDescription.trim() || "No synopsis recorded yet.",
      posterUrl: poster,
      language: newLanguage,
      showtimes: []
    };

    setMovies([...movies, newMovie]);
    setNewTitle("");
    setNewGenre("");
    setNewDescription("");
    setNewPoster("");
    alert(`Success: Movie '${newMovie.title}' added to list!`);
  };

  // Admin: Create Showtime allocation
  const handleAddShowtime = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMovie = movies.find(m => m.id === Number(stMovieId));
    if (!targetMovie) return;

    const newSt: SimShowTime = {
      id: Date.now(),
      movieId: targetMovie.id,
      theater: stTheater,
      date: stDate,
      time: stTime,
      price: stPrice
    };

    setMovies(movies.map(m => {
      if (m.id === targetMovie.id) {
        return { ...m, showtimes: [...m.showtimes, newSt] };
      }
      return m;
    }));

    alert(`Showtime added successfully for '${targetMovie.title}'!`);
  };

  // Admin: Delete Movie
  const handleDeleteMovie = (id: number) => {
    if (confirm("Are you sure you want to permanently remove this movie and all its scheduled showtimes?")) {
      setMovies(movies.filter(m => m.id !== id));
    }
  };

  // Pre-configured occupied seats for seats selection map
  const mockOccupiedSeats = ["A3", "A4", "B6", "C2", "C3", "D8"];

  return (
    <div id="booking-system-hub" className="space-y-6 max-w-6xl mx-auto py-2">
      
      {/* Dynamic Simulation Header & Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎬</span>
          <div className="text-center sm:text-left">
            <h1 className="text-xl font-extrabold text-white tracking-tight">Grand Cinema Hall</h1>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Live Mockup Simulator</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActiveStep("movies")}
            className={`text-xs font-semibold py-2 px-4 rounded-xl transition ${
              activeStep === "movies" || activeStep === "details" || activeStep === "seats" || activeStep === "payment"
                ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🎥 Movie Catalog
          </button>
          
          <button
            onClick={() => setActiveStep("history")}
            className={`text-xs font-semibold py-2 px-4 rounded-xl flex items-center gap-1.5 transition ${
              activeStep === "history"
                ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <History className="w-3.5 h-3.5" /> Bookings Log
          </button>

          {currentUser?.role === "ADMIN" && (
            <button
              onClick={() => setActiveStep("admin")}
              className={`text-xs font-semibold py-2 px-4 rounded-xl flex items-center gap-1.5 transition ${
                activeStep === "admin"
                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  : "text-rose-400/80 hover:text-rose-300"
              }`}
            >
              🛠️ Admin Board
            </button>
          )}

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                Welcome, <strong className="text-white font-semibold">{currentUser.username}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode("login");
                setActiveStep("auth");
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white py-2 px-5 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" /> User Log In
            </button>
          )}
        </div>
      </div>

      {/* STEP 1: Movie Catalog Explorer */}
      {activeStep === "movies" && (
        <div className="space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Now Showing</h2>
            <p className="text-slate-400 text-xs">Reserve preferred theater seats and timings instantly.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {movies.map((m) => (
              <div
                key={m.id}
                className="group bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-2xl overflow-hidden transition duration-300 flex flex-col justify-between shadow-xl"
              >
                <div className="relative aspect-[1.8/2] overflow-hidden">
                  <img
                    src={m.posterUrl}
                    alt={m.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent opacity-60"></div>
                  <span className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold tracking-wider py-1 px-3 rounded-full border border-slate-800 text-indigo-400">
                    {m.language}
                  </span>
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">{m.genre}</span>
                    <h3 className="text-lg font-bold text-white tracking-tight mt-1">{m.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-3 mt-2">{m.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      ⏱ {m.duration} mins
                    </span>
                    <button
                      onClick={() => {
                        setSelectedMovie(m);
                        setActiveStep("details");
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white py-2 px-4 rounded-lg flex items-center gap-1 transition shadow-lg shadow-indigo-500/15 cursor-pointer"
                    >
                      <span>Show Times</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Movie details & Showtime timings Selection */}
      {activeStep === "details" && selectedMovie && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
          <button
            onClick={() => setActiveStep("movies")}
            className="text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1"
          >
            ← Return to Catalog
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl overflow-hidden border border-slate-800 aspect-[2/3] shadow-xl">
              <img
                src={selectedMovie.posterUrl}
                alt={selectedMovie.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    {selectedMovie.genre}
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    {selectedMovie.language}
                  </span>
                  <span className="text-xs text-slate-400">
                    ⏱ {selectedMovie.duration} mins
                  </span>
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">{selectedMovie.title}</h2>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">{selectedMovie.description}</p>

              <div className="pt-6 border-t border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" /> Choose Screening Session
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  {selectedMovie.showtimes.length > 0 ? (
                    selectedMovie.showtimes.map((st) => (
                      <div
                        key={st.id}
                        className="bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition"
                      >
                        <div className="space-y-1">
                          <h5 className="font-bold text-white text-sm">{st.theater}</h5>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {st.date}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-indigo-400" /> <strong>{st.time}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
                          <span className="text-base font-extrabold text-indigo-400">${st.price.toFixed(2)}</span>
                          <button
                            onClick={() => {
                              setSelectedShowtime(st);
                              setSelectedSeats([]);
                              setActiveStep("seats");
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white py-2.5 px-4 rounded-lg transition cursor-pointer"
                          >
                            Reserve Seats
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 border border-slate-800 border-dashed rounded-xl text-slate-500 text-xs">
                      No showtime screening sessions configured for this film. Login as Admin to add some timings.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Seat selection matrix map */}
      {activeStep === "seats" && selectedMovie && selectedShowtime && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <button
              onClick={() => setActiveStep("details")}
              className="text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              ← Back to Details
            </button>
            <span className="text-xs text-slate-400 font-mono">
              {selectedShowtime.theater}
            </span>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">{selectedMovie.title}</h3>
            <p className="text-indigo-400 text-xs font-medium mt-1">
              Screening on {selectedShowtime.date} @ {selectedShowtime.time}
            </p>
          </div>

          {/* Curved Cinema screen layout */}
          <div className="w-full flex flex-col items-center select-none py-2">
            <div className="w-3/4 h-2 bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-500 rounded-full shadow-[0_4px_15px_rgba(99,102,241,0.4)]"></div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-2">FRONT SCREEN DIRECTION</span>
          </div>

          {/* Seat Coordinate Buttons Map */}
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-10 gap-2 max-w-lg w-full">
              {["A", "B", "C", "D", "E"].map((row) => 
                Array.from({ length: 10 }).map((_, colIdx) => {
                  const col = colIdx + 1;
                  const seatId = `${row}${col}`;
                  const isOccupied = mockOccupiedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <button
                      key={seatId}
                      disabled={isOccupied}
                      onClick={() => toggleSeat(seatId)}
                      className={`aspect-square flex items-center justify-center text-[10px] font-bold rounded-lg transition duration-200 cursor-pointer ${
                        isOccupied
                          ? "bg-slate-800 text-slate-600 border border-slate-800 cursor-not-allowed"
                          : isSelected
                            ? "bg-indigo-600 text-white border border-indigo-500 shadow-md shadow-indigo-600/10"
                            : "bg-slate-950 border border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-600"
                      }`}
                    >
                      {seatId}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Color legends */}
          <div className="flex justify-center gap-6 text-xs text-slate-400 select-none">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 bg-slate-950 border border-slate-800 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 bg-indigo-600 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 bg-slate-800 rounded"></div>
              <span>Booked</span>
            </div>
          </div>

          {/* Checkout Bar */}
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-inner">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active selection</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-white font-medium">
                  Seats: {selectedSeats.length > 0 ? (
                    <strong className="text-indigo-400 font-extrabold">{selectedSeats.join(", ")}</strong>
                  ) : (
                    <span className="text-slate-500">None selected</span>
                  )}
                </span>
                <span className="text-xs text-slate-400">• Price/seat: ${selectedShowtime.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-0 border-slate-800/80 pt-4 sm:pt-0">
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase">Gross Cost</p>
                <p className="text-xl font-black text-indigo-400">${(selectedSeats.length * selectedShowtime.price).toFixed(2)}</p>
              </div>

              <button
                disabled={selectedSeats.length === 0}
                onClick={() => {
                  if (!currentUser) {
                    setAuthMode("login");
                    setActiveStep("auth");
                  } else {
                    setActiveStep("payment");
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/30 text-xs font-bold text-white py-3 px-6 rounded-xl transition disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                Continue to Checkout
              </button>
            </div>
          </div>

        </div>
      )}

      {/* STEP 4: Checkout receipt payment panel */}
      {activeStep === "payment" && selectedMovie && selectedShowtime && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reservation breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">TRANSACTION BREAKDOWN</span>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">{selectedMovie.title}</h3>
              
              <div className="space-y-3.5 border-t border-b border-slate-800/80 py-5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Theater:</span>
                  <span className="text-white font-medium">{selectedShowtime.theater}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Time:</span>
                  <span className="text-white font-medium">{selectedShowtime.date} | {selectedShowtime.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Booked Seats:</span>
                  <span className="text-indigo-400 font-bold">{selectedSeats.join(", ")}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
              <span className="text-xs text-slate-400">Order Gross Total:</span>
              <span className="text-xl font-extrabold text-emerald-400">${(selectedSeats.length * selectedShowtime.price).toFixed(2)}</span>
            </div>
          </div>

          {/* Dummy payment credit card input */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-6">SECURE CREDIT GATEWAY</span>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1.5">CARDHOLDER NAME</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="e.g. Jane Smith"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1.5">CREDIT CARD NUMBER</label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4111 •••• •••• 1111"
                  maxLength={19}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1.5">EXPIRATION</label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1.5">CVV SECURITY</label>
                  <input
                    type="password"
                    required
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
                    maxLength={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-[10px] text-slate-500">
                <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
                <span>256-bit Secure Transaction Gateway. Educational sandbox environment.</span>
              </div>

              <button
                type="submit"
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-lg shadow-emerald-500/10 cursor-pointer"
              >
                Authorize Payment (${(selectedSeats.length * selectedShowtime.price).toFixed(2)})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* STEP 5: Booking history log auditing */}
      {activeStep === "history" && (
        <div className="space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Your Purchased Tickets</h2>
            <p className="text-slate-400 text-xs">Verify successfully booked reservations below.</p>
          </div>

          <div className="space-y-4">
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold py-1 px-3 rounded-full flex items-center gap-1 uppercase">
                        <CheckCircle2 className="w-3 h-3" /> Booking Authorized
                      </span>
                      <span className="text-[11px] text-slate-500">Receipt Code: #REC-{b.id}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{b.movieTitle}</h3>
                    <p className="text-xs text-slate-400">
                      Complex: <strong className="text-white font-semibold">{b.theater}</strong> | Allocated Seats: <strong className="text-indigo-400 font-bold">{b.seats.join(", ")}</strong>
                    </p>
                  </div>

                  <div className="flex md:flex-col justify-between items-center md:items-end border-t md:border-0 border-slate-800/80 pt-4 md:pt-0 gap-1.5">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> booked on {b.bookingDate}
                    </span>
                    <p className="text-xl font-extrabold text-white">${b.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl p-16 text-center text-slate-500 space-y-4">
                <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center mx-auto">
                  <Ticket className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-base font-bold text-slate-300">No Reservations Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Once you explore show times, select coordinates, and complete payment authorizations, your digital ticket receipts will populate inside this log.
                </p>
                <button
                  onClick={() => setActiveStep("movies")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-bold py-2.5 px-6 rounded-xl transition inline-block cursor-pointer"
                >
                  Explore Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 6: Administrative Panel Dashboard */}
      {activeStep === "admin" && currentUser?.role === "ADMIN" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* List movies to delete/manage */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Publish Catalog Listings</h3>

            <div className="space-y-3.5">
              {movies.map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl flex items-center gap-4 hover:border-slate-700 transition"
                >
                  <img src={m.posterUrl} alt={m.title} referrerPolicy="no-referrer" className="w-12 h-16 object-cover rounded border border-slate-800" />
                  <div className="flex-grow">
                    <h4 className="font-bold text-white text-sm">{m.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {m.genre} | {m.language} | {m.duration} mins
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[10px] text-indigo-400 font-semibold">{m.showtimes.length} showtimes</span>
                      <button
                        onClick={() => handleDeleteMovie(m.id)}
                        className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-0.5 font-medium transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Remove Movie
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add movie & showtime form panel columns */}
          <div className="space-y-6">
            
            {/* Create Movie */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" /> Create Film Listing
              </h4>

              <form onSubmit={handleAddMovie} className="space-y-3 text-[11px] text-slate-300">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">MOVIE TITLE</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Inception"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">GENRE</label>
                    <input
                      type="text"
                      required
                      value={newGenre}
                      onChange={(e) => setNewGenre(e.target.value)}
                      placeholder="e.g. Sci-Fi"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">LANGUAGE</label>
                    <input
                      type="text"
                      required
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="English"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">DURATION (MIN)</label>
                    <input
                      type="number"
                      required
                      value={newDuration}
                      onChange={(e) => setNewDuration(Number(e.target.value))}
                      placeholder="120"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">POSTER IMAGE URL</label>
                    <input
                      type="text"
                      value={newPoster}
                      onChange={(e) => setNewPoster(e.target.value)}
                      placeholder="Optional"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">SYNOPSIS DESCRIPTION</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={2}
                    placeholder="Enter storyline..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  Publish Movie
                </button>
              </form>
            </div>

            {/* Create Showtime screening */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" /> Allocate Showtime Session
              </h4>

              <form onSubmit={handleAddShowtime} className="space-y-3 text-[11px] text-slate-300">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">SELECT MOVIE</label>
                  <select
                    value={stMovieId}
                    onChange={(e) => setStMovieId(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition"
                  >
                    {movies.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">THEATER COMPLEX</label>
                  <input
                    type="text"
                    required
                    value={stTheater}
                    onChange={(e) => setStTheater(e.target.value)}
                    placeholder="e.g. Screen 1 - Grand Plaza"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">DATE</label>
                    <input
                      type="date"
                      required
                      value={stDate}
                      onChange={(e) => setStDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">TIME</label>
                    <input
                      type="text"
                      required
                      value={stTime}
                      onChange={(e) => setStTime(e.target.value)}
                      placeholder="18:30"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">TICKET PRICE ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={stPrice}
                    onChange={(e) => setStPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  Allocate Showtime
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

      {/* STEP 7: Simple Mock Authenticator screen */}
      {activeStep === "auth" && (
        <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h3 className="text-xl font-extrabold text-white tracking-tight">🎬 Secure Gateway Login</h3>
            <p className="text-slate-500 text-[11px] mt-1 uppercase tracking-widest">Cinema Book Sandbox Environment</p>
          </div>

          {authError && (
            <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs p-3 rounded-xl mb-4 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5 uppercase">Username</label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Username (e.g. admin or user)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {authMode === "register" && (
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="jane@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-400 font-semibold mb-1.5 uppercase">Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-indigo-500/15 mt-2 cursor-pointer"
            >
              {authMode === "login" ? "Secure Log In" : "Register Account"}
            </button>
          </form>

          {/* Simple toggle authMode */}
          <div className="text-center mt-6 pt-5 border-t border-slate-800/80 text-xs text-slate-400">
            {authMode === "login" ? (
              <>
                Don't have a profile yet?{" "}
                <button
                  onClick={() => {
                    setAuthMode("register");
                    setAuthError("");
                  }}
                  className="text-indigo-400 hover:underline font-bold"
                >
                  Register Profile
                </button>
              </>
            ) : (
              <>
                Already have a profile?{" "}
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError("");
                  }}
                  className="text-indigo-400 hover:underline font-bold"
                >
                  Log In
                </button>
              </>
            )}
          </div>

          {/* Informative Demo helper panel */}
          <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800/60 text-[10px] text-slate-500 space-y-1">
            <strong className="text-slate-400 block mb-0.5">💡 Sandboxed Credentials:</strong>
            <p>• Admin Role: <code className="text-indigo-400">admin</code> / <code class="text-indigo-400">admin123</code></p>
            <p>• User Role: <code className="text-indigo-400">user</code> / <code class="text-indigo-400">user123</code></p>
          </div>
        </div>
      )}

    </div>
  );
}
