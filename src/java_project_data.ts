export interface JavaFile {
  path: string;
  language: string;
  description: string;
  content: string;
}

export const javaProjectFiles: JavaFile[] = [
  {
    path: "db/schema.sql",
    language: "sql",
    description: "MySQL database schema initialization script including tables for users, movies, showtimes, bookings, and seed data.",
    content: `-- Movie Ticket Booking System Database Setup
CREATE DATABASE IF NOT EXISTS movie_booking_db;
USE movie_booking_db;

-- 1. Users table for authentication and profile management
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Stored as plain-text/hash for educational purposes
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) DEFAULT 'USER', -- USER, ADMIN
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Movies table to hold metadata about available films
CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    duration INT NOT NULL, -- in minutes
    description TEXT,
    poster_url VARCHAR(255),
    language VARCHAR(50) NOT NULL
);

-- 3. Showtimes table to link movies with theaters, times, and pricing
CREATE TABLE IF NOT EXISTS showtimes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    theater VARCHAR(100) NOT NULL,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);

-- 4. Bookings table to log successful reservations and client accounts
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    showtime_id INT NOT NULL,
    seats_booked VARCHAR(255) NOT NULL, -- Comma-separated list of selected seats (e.g. "A1,A2,B3")
    total_price DECIMAL(10, 2) NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (showtime_id) REFERENCES showtimes(id) ON DELETE CASCADE
);

-- Insert Default Administrative & Customer Seed Accounts
INSERT INTO users (username, password, email, role) VALUES 
('admin', 'admin123', 'admin@cinema.com', 'ADMIN'),
('user', 'user123', 'user@cinema.com', 'USER')
ON DUPLICATE KEY UPDATE id=id;

-- Seed Movie Catalog
INSERT INTO movies (title, genre, duration, description, poster_url, language) VALUES 
('Inception', 'Sci-Fi / Thriller', 148, 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500', 'English'),
('The Dark Knight', 'Action / Crime', 152, 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=500', 'English'),
('Interstellar', 'Sci-Fi / Adventure', 169, 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\\'s survival on a dying Earth.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500', 'English')
ON DUPLICATE KEY UPDATE id=id;

-- Seed Scheduled Showtimes (Set for upcoming theater sessions)
INSERT INTO showtimes (movie_id, theater, show_date, show_time, price) VALUES 
(1, 'Screen 1 - Grand Plaza', '2026-08-15', '14:30:00', 12.50),
(1, 'Screen 2 - Luxe Cinema', '2026-08-15', '18:00:00', 15.00),
(2, 'Screen 1 - Grand Plaza', '2026-08-16', '15:00:00', 12.50),
(2, 'IMAX Theatre - Megaplex', '2026-08-16', '21:00:00', 18.50),
(3, 'IMAX Theatre - Megaplex', '2026-08-17', '19:30:00', 18.50)
ON DUPLICATE KEY UPDATE id=id;
`
  },
  {
    path: "src/main/java/com/moviebook/model/User.java",
    language: "java",
    description: "User model class containing properties for system users, constructors, and getters/setters.",
    content: `package com.moviebook.model;

import java.io.Serializable;
import java.sql.Timestamp;

public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private int id;
    private String username;
    private String password;
    private String email;
    private String role;
    private Timestamp createdAt;

    public User() {}

    public User(int id, String username, String password, String email, String role, Timestamp createdAt) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
`
  },
  {
    path: "src/main/java/com/moviebook/model/Movie.java",
    language: "java",
    description: "Movie model class encapsulating cinematic details and poster mapping assets.",
    content: `package com.moviebook.model;

import java.io.Serializable;

public class Movie implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private String title;
    private String genre;
    private int duration;
    private String description;
    private String posterUrl;
    private String language;

    public Movie() {}

    public Movie(int id, String title, String genre, int duration, String description, String posterUrl, String language) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.duration = duration;
        this.description = description;
        this.posterUrl = posterUrl;
        this.language = language;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
`
  },
  {
    path: "src/main/java/com/moviebook/model/ShowTime.java",
    language: "java",
    description: "ShowTime model representing specific theater screening occurrences, dates, times, and pricing schemas.",
    content: `package com.moviebook.model;

import java.io.Serializable;
import java.sql.Date;
import java.sql.Time;

public class ShowTime implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int movieId;
    private String movieTitle; // Joined attribute for convenience
    private String theater;
    private Date showDate;
    private Time showTime;
    private double price;

    public ShowTime() {}

    public ShowTime(int id, int movieId, String theater, Date showDate, Time showTime, double price) {
        this.id = id;
        this.movieId = movieId;
        this.theater = theater;
        this.showDate = showDate;
        this.showTime = showTime;
        this.price = price;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getMovieId() { return movieId; }
    public void setMovieId(int movieId) { this.movieId = movieId; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }

    public String getTheater() { return theater; }
    public void setTheater(String theater) { this.theater = theater; }

    public Date getShowDate() { return showDate; }
    public void setShowDate(Date showDate) { this.showDate = showDate; }

    public Time getShowTime() { return showTime; }
    public void setShowTime(Time showTime) { this.showTime = showTime; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}
`
  },
  {
    path: "src/main/java/com/moviebook/model/Booking.java",
    language: "java",
    description: "Booking model tracking successful client transaction bookings, custom seats, total cost, and logs.",
    content: `package com.moviebook.model;

import java.io.Serializable;
import java.sql.Timestamp;

public class Booking implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int userId;
    private String username;       // Joined for convenience
    private int showtimeId;
    private String movieTitle;     // Joined for convenience
    private String theater;        // Joined for convenience
    private String showDate;       // Joined for convenience
    private String showTime;       // Joined for convenience
    private String seatsBooked;    // Comma-separated seats list (e.g., "A3,A4")
    private double totalPrice;
    private Timestamp bookingDate;

    public Booking() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public int getShowtimeId() { return showtimeId; }
    public void setShowtimeId(int showtimeId) { this.showtimeId = showtimeId; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }

    public String getTheater() { return theater; }
    public void setTheater(String theater) { this.theater = theater; }

    public String getShowDate() { return showDate; }
    public void setShowDate(String showDate) { this.showDate = showDate; }

    public String getShowTime() { return showTime; }
    public void setShowTime(String showTime) { this.showTime = showTime; }

    public String getSeatsBooked() { return seatsBooked; }
    public void setSeatsBooked(String seatsBooked) { this.seatsBooked = seatsBooked; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public Timestamp getBookingDate() { return bookingDate; }
    public void setBookingDate(Timestamp bookingDate) { this.bookingDate = bookingDate; }
}
`
  },
  {
    path: "src/main/java/com/moviebook/dao/DBConnection.java",
    language: "java",
    description: "Utility class to establish connection pools with MySQL server utilizing JDBC standard configurations.",
    content: `package com.moviebook.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    // Database URL, Port, and Schema Name
    private static final String URL = "jdbc:mysql://localhost:3306/movie_booking_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "password"; // Set your local database root password

    static {
        try {
            // Explicitly load the MySQL JDBC Driver class (Required for dynamic runtime mapping)
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("Error: MySQL JDBC Driver not found on classpath!");
            e.printStackTrace();
        }
    }

    /**
     * Connects to MySQL server. Ensure MySQL is running on port 3306.
     * @return Connection object
     * @throws SQLException
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
`
  },
  {
    path: "src/main/java/com/moviebook/dao/UserDAO.java",
    language: "java",
    description: "Database Access Object for Users. Handles credentials verification, duplicate lookups, and account signups.",
    content: `package com.moviebook.dao;

import com.moviebook.model.User;
import java.sql.*;

public class UserDAO {

    /**
     * Authenticate user login credentials.
     */
    public User login(String username, String password) {
        String query = "SELECT * FROM users WHERE username = ? AND password = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            
            ps.setString(1, username);
            ps.setString(2, password);
            
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return extractUserFromResultSet(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Registers a new user into database.
     */
    public boolean register(User user) {
        String query = "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, 'USER')";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getPassword()); // Stored directly or can be hashed locally
            ps.setString(3, user.getEmail());
            
            int rowsAffected = ps.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Validates if a username or email is already taken.
     */
    public boolean isUsernameOrEmailExists(String username, String email) {
        String query = "SELECT id FROM users WHERE username = ? OR email = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            
            ps.setString(1, username);
            ps.setString(2, email);
            
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private User extractUserFromResultSet(ResultSet rs) throws SQLException {
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setUsername(rs.getString("username"));
        user.setPassword(rs.getString("password"));
        user.setEmail(rs.getString("email"));
        user.setRole(rs.getString("role"));
        user.setCreatedAt(rs.getTimestamp("created_at"));
        return user;
    }
}
`
  },
  {
    path: "src/main/java/com/moviebook/dao/MovieDAO.java",
    language: "java",
    description: "Database Access Object managing CRUD queries for movies as well as associated date and screening intervals.",
    content: `package com.moviebook.dao;

import com.moviebook.model.Movie;
import com.moviebook.model.ShowTime;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MovieDAO {

    // --- Movie Catalog Management (Admin + General) ---

    public List<Movie> getAllMovies() {
        List<Movie> list = new ArrayList<>();
        String query = "SELECT * FROM movies ORDER BY id DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query);
             ResultSet rs = ps.executeQuery()) {
            
            while (rs.next()) {
                list.add(extractMovieFromResultSet(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public Movie getMovieById(int id) {
        String query = "SELECT * FROM movies WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return extractMovieFromResultSet(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean addMovie(Movie movie) {
        String query = "INSERT INTO movies (title, genre, duration, description, poster_url, language) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            
            ps.setString(1, movie.getTitle());
            ps.setString(2, movie.getGenre());
            ps.setInt(3, movie.getDuration());
            ps.setString(4, movie.getDescription());
            ps.setString(5, movie.getPosterUrl());
            ps.setString(6, movie.getLanguage());
            
            int rows = ps.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateMovie(Movie movie) {
        String query = "UPDATE movies SET title=?, genre=?, duration=?, description=?, poster_url=?, language=? WHERE id=?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            
            ps.setString(1, movie.getTitle());
            ps.setString(2, movie.getGenre());
            ps.setInt(3, movie.getDuration());
            ps.setString(4, movie.getDescription());
            ps.setString(5, movie.getPosterUrl());
            ps.setString(6, movie.getLanguage());
            ps.setInt(7, movie.getId());
            
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteMovie(int id) {
        String query = "DELETE FROM movies WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // --- Showtimes Management ---

    public List<ShowTime> getShowtimesByMovieId(int movieId) {
        List<ShowTime> list = new ArrayList<>();
        String query = "SELECT s.*, m.title as movie_title FROM showtimes s " +
                       "JOIN movies m ON s.movie_id = m.id WHERE s.movie_id = ? " +
                       "ORDER BY s.show_date, s.show_time";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setInt(1, movieId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    ShowTime st = extractShowtimeFromResultSet(rs);
                    st.setMovieTitle(rs.getString("movie_title"));
                    list.add(st);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public ShowTime getShowtimeById(int showtimeId) {
        String query = "SELECT s.*, m.title as movie_title FROM showtimes s " +
                       "JOIN movies m ON s.movie_id = m.id WHERE s.id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setInt(1, showtimeId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    ShowTime st = extractShowtimeFromResultSet(rs);
                    st.setMovieTitle(rs.getString("movie_title"));
                    return st;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean addShowtime(ShowTime st) {
        String query = "INSERT INTO showtimes (movie_id, theater, show_date, show_time, price) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            
            ps.setInt(1, st.getMovieId());
            ps.setString(2, st.getTheater());
            ps.setDate(3, st.getShowDate());
            ps.setTime(4, st.getShowTime());
            ps.setDouble(5, st.getPrice());
            
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteShowtime(int id) {
        String query = "DELETE FROM showtimes WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    private Movie extractMovieFromResultSet(ResultSet rs) throws SQLException {
        return new Movie(
            rs.getInt("id"),
            rs.getString("title"),
            rs.getString("genre"),
            rs.getInt("duration"),
            rs.getString("description"),
            rs.getString("poster_url"),
            rs.getString("language")
        );
    }

    private ShowTime extractShowtimeFromResultSet(ResultSet rs) throws SQLException {
        return new ShowTime(
            rs.getInt("id"),
            rs.getInt("movie_id"),
            rs.getString("theater"),
            rs.getDate("show_date"),
            rs.getTime("show_time"),
            rs.getDouble("price")
        );
    }
}
`
  },
  {
    path: "src/main/java/com/moviebook/dao/BookingDAO.java",
    language: "java",
    description: "Database Access Object handling movie seat allocations, reservation bookings, transaction locks, and history audits.",
    content: `package com.moviebook.dao;

import com.moviebook.model.Booking;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BookingDAO {

    /**
     * Retrieve all reserved seat coordinates for a specific screening session.
     * @param showtimeId Specific session primary ID
     * @return List of occupied seat codes (e.g. ["A1", "A2", "B4"])
     */
    public List<String> getBookedSeats(int showtimeId) {
        List<String> bookedSeats = new ArrayList<>();
        String query = "SELECT seats_booked FROM bookings WHERE showtime_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            ps.setInt(1, showtimeId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    String seatsString = rs.getString("seats_booked");
                    if (seatsString != null && !seatsString.trim().isEmpty()) {
                        String[] seatsArray = seatsString.split(",");
                        for (String seat : seatsArray) {
                            bookedSeats.add(seat.trim());
                        }
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return bookedSeats;
    }

    /**
     * Create a secure transaction booking entry and log details.
     */
    public boolean createBooking(Booking booking) {
        String query = "INSERT INTO bookings (user_id, showtime_id, seats_booked, total_price) VALUES (?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)) {
            
            ps.setInt(1, booking.getUserId());
            ps.setInt(2, booking.getShowtimeId());
            ps.setString(3, booking.getSeatsBooked());
            ps.setDouble(4, booking.getTotalPrice());
            
            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        booking.setId(generatedKeys.getInt(1));
                    }
                }
                return true;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Get the transaction logging list for a specific registered client account.
     */
    public List<Booking> getBookingsByUserId(int userId) {
        List<Booking> list = new ArrayList<>();
        String query = "SELECT b.*, m.title as movie_title, s.theater, s.show_date, s.show_time, u.username " +
                       "FROM bookings b " +
                       "JOIN showtimes s ON b.showtime_id = s.id " +
                       "JOIN movies m ON s.movie_id = m.id " +
                       "JOIN users u ON b.user_id = u.id " +
                       "WHERE b.user_id = ? " +
                       "ORDER BY b.booking_date DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {
            
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Booking b = new Booking();
                    b.setId(rs.getInt("id"));
                    b.setUserId(rs.getInt("user_id"));
                    b.setUsername(rs.getString("username"));
                    b.setShowtimeId(rs.getInt("showtime_id"));
                    b.setMovieTitle(rs.getString("movie_title"));
                    b.setTheater(rs.getString("theater"));
                    b.setShowDate(rs.getDate("show_date").toString());
                    b.setShowTime(rs.getTime("show_time").toString());
                    b.setSeatsBooked(rs.getString("seats_booked"));
                    b.setTotalPrice(rs.getDouble("total_price"));
                    b.setBookingDate(rs.getTimestamp("booking_date"));
                    list.add(b);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
}
`
  },
  {
    path: "src/main/java/com/moviebook/servlet/LoginServlet.java",
    language: "java",
    description: "Servlet handling POST login submissions, setting active user parameters inside session context, and routing requests.",
    content: `package com.moviebook.servlet;

import com.moviebook.dao.UserDAO;
import com.moviebook.model.User;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private UserDAO userDAO;

    @Override
    public void init() throws ServletException {
        userDAO = new UserDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Render login page
        request.getRequestDispatcher("/login.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String username = request.getParameter("username");
        String password =  request.getParameter("password");

        // Simple validation checks
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            request.setAttribute("errorMessage", "Username and Password cannot be blank.");
            request.getRequestDispatcher("/login.jsp").forward(request, response);
            return;
        }

        // Authenticate user via DAO layer
        User user = userDAO.login(username.trim(), password.trim());

        if (user != null) {
            // Initiate valid HTTP Session and persist active User profile
            HttpSession session = request.getSession(true);
            session.setAttribute("currentUser", user);

            // Redirect based on administrative access role
            if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                response.sendRedirect(request.getContextPath() + "/admin/dashboard");
            } else {
                response.sendRedirect(request.getContextPath() + "/movies");
            }
        } else {
            // Authentication Failed
            request.setAttribute("errorMessage", "Invalid username or password configuration.");
            request.getRequestDispatcher("/login.jsp").forward(request, response);
        }
    }
}
`
  },
  {
    path: "src/main/java/com/moviebook/servlet/RegisterServlet.java",
    language: "java",
    description: "Servlet managing client signup validations, ensuring credential uniqueness, and registering profiles.",
    content: `package com.moviebook.servlet;

import com.moviebook.dao.UserDAO;
import com.moviebook.model.User;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private UserDAO userDAO;

    @Override
    public void init() throws ServletException {
        userDAO = new UserDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Forward client to register view
        request.getRequestDispatcher("/register.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String username = request.getParameter("username");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");

        // Input validations
        if (username == null || username.trim().isEmpty() ||
            email == null || email.trim().isEmpty() ||
            password == null || password.trim().isEmpty()) {
            request.setAttribute("errorMessage", "Please populate all registration inputs.");
            request.getRequestDispatcher("/register.jsp").forward(request, response);
            return;
        }

        if (!password.equals(confirmPassword)) {
            request.setAttribute("errorMessage", "Passwords do not match.");
            request.getRequestDispatcher("/register.jsp").forward(request, response);
            return;
        }

        // Duplicate checks
        if (userDAO.isUsernameOrEmailExists(username.trim(), email.trim())) {
            request.setAttribute("errorMessage", "Username or Email address already taken.");
            request.getRequestDispatcher("/register.jsp").forward(request, response);
            return;
        }

        // Initialize User object model
        User newUser = new User();
        newUser.setUsername(username.trim());
        newUser.setEmail(email.trim());
        newUser.setPassword(password.trim()); // For real app, consider encrypting with bcrypt

        boolean success = userDAO.register(newUser);

        if (success) {
            // Sign-up success, forward to login screen with confirmation
            HttpSession session = request.getSession();
            session.setAttribute("successMessage", "Account created successfully! Please log in.");
            response.sendRedirect(request.getContextPath() + "/login");
        } else {
            request.setAttribute("errorMessage", "System error occurred during profile registration.");
            request.getRequestDispatcher("/register.jsp").forward(request, response);
        }
    }
}
`
  },
  {
    path: "src/main/java/com/moviebook/servlet/MovieServlet.java",
    language: "java",
    description: "Servlet for exploring available film titles, movie grids, and details mapping schedules.",
    content: `package com.moviebook.servlet;

import com.moviebook.dao.MovieDAO;
import com.moviebook.model.Movie;
import com.moviebook.model.ShowTime;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/movies")
public class MovieServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private MovieDAO movieDAO;

    @Override
    public void init() throws ServletException {
        movieDAO = new MovieDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String idParam = request.getParameter("id");
        
        if (idParam != null) {
            // Render specific movie page and fetch schedule timings
            try {
                int movieId = Integer.parseInt(idParam);
                Movie movie = movieDAO.getMovieById(movieId);
                
                if (movie != null) {
                    List<ShowTime> showtimes = movieDAO.getShowtimesByMovieId(movieId);
                    request.setAttribute("movie", movie);
                    request.setAttribute("showtimes", showtimes);
                    request.getRequestDispatcher("/movie-details.jsp").forward(request, response);
                } else {
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "Selected Film not found.");
                }
            } catch (NumberFormatException e) {
                response.sendRedirect(request.getContextPath() + "/movies");
            }
        } else {
            // List all movies in index/grid page
            List<Movie> movieList = movieDAO.getAllMovies();
            request.setAttribute("movies", movieList);
            request.getRequestDispatcher("/index.jsp").forward(request, response);
        }
    }
}
`
  },
  {
    path: "src/main/java/com/moviebook/servlet/BookingServlet.java",
    language: "java",
    description: "Servlet handling seat map inquiries, checkout processing, and generating bookings records.",
    content: `package com.moviebook.servlet;

import com.moviebook.dao.BookingDAO;
import com.moviebook.dao.MovieDAO;
import com.moviebook.model.Booking;
import com.moviebook.model.ShowTime;
import com.moviebook.model.User;
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/booking")
public class BookingServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private MovieDAO movieDAO;
    private BookingDAO bookingDAO;

    @Override
    public void init() throws ServletException {
        movieDAO = new MovieDAO();
        bookingDAO = new BookingDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Ensure user is logged in
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("currentUser") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        String showtimeIdParam = request.getParameter("showtimeId");
        if (showtimeIdParam == null || showtimeIdParam.trim().isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/movies");
            return;
        }

        try {
            int showtimeId = Integer.parseInt(showtimeIdParam);
            ShowTime showtime = movieDAO.getShowtimeById(showtimeId);
            
            if (showtime != null) {
                // Fetch already reserved seats for seat map rendering
                List<String> bookedSeats = bookingDAO.getBookedSeats(showtimeId);
                
                request.setAttribute("showtime", showtime);
                request.setAttribute("bookedSeats", bookedSeats);
                request.getRequestDispatcher("/seat-selection.jsp").forward(request, response);
            } else {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Showtime session expired.");
            }
        } catch (NumberFormatException e) {
            response.sendRedirect(request.getContextPath() + "/movies");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Ensure user is authenticated
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("currentUser") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        User user = (User) session.getAttribute("currentUser");
        String showtimeIdParam = request.getParameter("showtimeId");
        String selectedSeats = request.getParameter("selectedSeats"); // Comma-separated list e.g. "A1,A2"

        if (showtimeIdParam == null || selectedSeats == null || selectedSeats.trim().isEmpty()) {
            request.setAttribute("errorMessage", "Please select at least one seat to proceed with reservation.");
            response.sendRedirect(request.getContextPath() + "/movies");
            return;
        }

        try {
            int showtimeId = Integer.parseInt(showtimeIdParam);
            ShowTime showtime = movieDAO.getShowtimeById(showtimeId);
            
            if (showtime == null) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Showtime session does not exist.");
                return;
            }

            // Calculate price based on selected seats count
            String[] seatsArray = selectedSeats.split(",");
            int seatsCount = seatsArray.length;
            double totalPrice = seatsCount * showtime.getPrice();

            // Set up a new Booking instance
            Booking booking = new Booking();
            booking.setUserId(user.getId());
            booking.setShowtimeId(showtimeId);
            booking.setSeatsBooked(selectedSeats);
            booking.setTotalPrice(totalPrice);

            // Complete transaction booking
            boolean success = bookingDAO.createBooking(booking);

            if (success) {
                // Booking successful! Save the booking state and show payment details
                request.setAttribute("booking", booking);
                request.setAttribute("showtime", showtime);
                request.getRequestDispatcher("/payment.jsp").forward(request, response);
            } else {
                request.setAttribute("errorMessage", "Error locking seat configurations. Seats may have been reserved simultaneously.");
                response.sendRedirect(request.getContextPath() + "/booking?showtimeId=" + showtimeId);
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/movies");
        }
    }
}
`
  },
  {
    path: "src/main/java/com/moviebook/servlet/AdminServlet.java",
    language: "java",
    description: "Servlet controlling administrative dashboards, adding/editing movies, and managing showtime configurations.",
    content: `package com.moviebook.servlet;

import com.moviebook.dao.MovieDAO;
import com.moviebook.model.Movie;
import com.moviebook.model.ShowTime;
import com.moviebook.model.User;
import java.io.IOException;
import java.sql.Date;
import java.sql.Time;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/admin/*")
public class AdminServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private MovieDAO movieDAO;

    @Override
    public void init() throws ServletException {
        movieDAO = new MovieDAO();
    }

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // Verify User Role is ADMIN before allowing any access
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("currentUser") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        User user = (User) session.getAttribute("currentUser");
        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied: Administrative Clearance Required.");
            return;
        }

        super.service(request, response);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String pathInfo = request.getPathInfo();
        
        if (pathInfo == null || "/dashboard".equals(pathInfo)) {
            // Fetch everything and dispatch to dashboard
            List<Movie> movies = movieDAO.getAllMovies();
            request.setAttribute("movies", movies);
            request.getRequestDispatcher("/admin-dashboard.jsp").forward(request, response);
        } else if ("/deleteMovie".equals(pathInfo)) {
            int id = Integer.parseInt(request.getParameter("id"));
            movieDAO.deleteMovie(id);
            response.sendRedirect(request.getContextPath() + "/admin/dashboard");
        } else if ("/deleteShowtime".equals(pathInfo)) {
            int id = Integer.parseInt(request.getParameter("id"));
            int movieId = Integer.parseInt(request.getParameter("movieId"));
            movieDAO.deleteShowtime(id);
            response.sendRedirect(request.getContextPath() + "/movies?id=" + movieId);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String pathInfo = request.getPathInfo();
        
        if ("/addMovie".equals(pathInfo)) {
            String title = request.getParameter("title");
            String genre = request.getParameter("genre");
            int duration = Integer.parseInt(request.getParameter("duration"));
            String description = request.getParameter("description");
            String posterUrl = request.getParameter("posterUrl");
            String language = request.getParameter("language");

            Movie m = new Movie(0, title, genre, duration, description, posterUrl, language);
            movieDAO.addMovie(m);
            response.sendRedirect(request.getContextPath() + "/admin/dashboard");
            
        } else if ("/addShowtime".equals(pathInfo)) {
            int movieId = Integer.parseInt(request.getParameter("movieId"));
            String theater = request.getParameter("theater");
            Date showDate = Date.valueOf(request.getParameter("showDate"));
            Time showTime = Time.valueOf(request.getParameter("showTime") + ":00");
            double price = Double.parseDouble(request.getParameter("price"));

            ShowTime st = new ShowTime(0, movieId, theater, showDate, showTime, price);
            movieDAO.addShowtime(st);
            response.sendRedirect(request.getContextPath() + "/movies?id=" + movieId);
        }
    }
}
`
  },
  {
    path: "src/main/webapp/index.jsp",
    language: "html",
    description: "JSP homepage layout displaying the grid of all active, selectable movies.",
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="com.moviebook.model.Movie" %>
<%@ page import="com.moviebook.model.User" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grand Cinema - Movie Ticket Booking</title>
    <!-- Tailwind CSS Integration for Beautiful Layout styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; }
    </style>
</head>
<body class="min-h-screen flex flex-col justify-between">
    
    <!-- Top Navigation Bar -->
    <nav class="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <a href="\${pageContext.request.contextPath}/movies" class="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span class="text-indigo-500">🎬</span> Grand Cinema
        </a>
        <div class="flex items-center gap-6">
            <% 
                User user = (User) session.getAttribute("currentUser");
                if (user != null) { 
            %>
                <span class="text-sm text-slate-400">Welcome, <strong class="text-white">\${currentUser.username}</strong></span>
                <a href="\${pageContext.request.contextPath}/bookings/history" class="text-sm font-medium hover:text-indigo-400 transition">My Bookings</a>
                <% if ("ADMIN".equalsIgnoreCase(user.getRole())) { %>
                    <a href="\${pageContext.request.contextPath}/admin/dashboard" class="bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-semibold py-2 px-4 rounded transition">Admin Control</a>
                <% } %>
                <a href="\${pageContext.request.contextPath}/logout" class="text-sm font-medium text-red-400 hover:text-red-300 transition">Logout</a>
            <% } else { %>
                <a href="\${pageContext.request.contextPath}/login" class="text-sm font-medium hover:text-indigo-400 transition">Login</a>
                <a href="\${pageContext.request.contextPath}/register" class="bg-indigo-600 hover:bg-indigo-500 text-sm text-white font-medium py-2 px-5 rounded-lg transition shadow-lg shadow-indigo-500/20">Sign Up</a>
            <% } %>
        </div>
    </nav>

    <!-- Main Movie Listings Page Content -->
    <main class="max-w-7xl mx-auto w-full px-6 py-12 flex-grow">
        <div class="mb-10 text-center sm:text-left">
            <h1 class="text-4xl font-extrabold tracking-tight text-white mb-2">Now Showing</h1>
            <p class="text-slate-400 text-lg">Explore popular releases and reserve your preferred show seats now.</p>
        </div>

        <!-- Movie Catalog Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <% 
                List<Movie> movies = (List<Movie>) request.getAttribute("movies");
                if (movies != null && !movies.isEmpty()) {
                    for (Movie movie : movies) {
            %>
                <div class="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition duration-300 flex flex-col justify-between shadow-xl">
                    <div class="relative overflow-hidden aspect-[2/3]">
                        <img src="<%= movie.getPosterUrl() %>" alt="<%= movie.getTitle() %>" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent opacity-60"></div>
                        <span class="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-xs font-semibold py-1 px-3 rounded-full border border-slate-700">
                            <%= movie.getLanguage() %>
                        </span>
                    </div>
                    <div class="p-5 flex-grow flex flex-col justify-between">
                        <div>
                            <span class="text-xs font-semibold text-indigo-400 uppercase tracking-wider"><%= movie.getGenre() %></span>
                            <h3 class="text-xl font-bold text-white mt-1 group-hover:text-indigo-400 transition"><%= movie.getTitle() %></h3>
                            <p class="text-xs text-slate-400 mt-2 line-clamp-3"><%= movie.getDescription() %></p>
                        </div>
                        <div class="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                            <span class="text-xs font-medium text-slate-500">⏱ <%= movie.getDuration() %> mins</span>
                            <a href="\${pageContext.request.contextPath}/movies?id=<%= movie.getId() %>" class="bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-semibold py-2 px-4 rounded-lg transition">
                                Book Tickets
                            </a>
                        </div>
                    </div>
                </div>
            <% 
                    }
                } else { 
            %>
                <div class="col-span-full py-20 text-center">
                    <div class="text-slate-600 text-5xl mb-4">📭</div>
                    <h3 class="text-xl font-semibold text-slate-300">No Movies Found</h3>
                    <p class="text-slate-500 mt-1">Check back later for current listings.</p>
                </div>
            <% } %>
        </div>
    </main>

    <!-- Footer Area -->
    <footer class="border-t border-slate-800 bg-slate-950 py-8 px-6 text-center text-sm text-slate-500">
        <p>&copy; 2026 Grand Cinema Hall. Powered by Java Web MVC technology.</p>
    </footer>

</body>
</html>
`
  },
  {
    path: "src/main/webapp/movie-details.jsp",
    language: "html",
    description: "JSP layout for visualizing detailed information about a movie and showing list of schedules.",
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.moviebook.model.Movie" %>
<%@ page import="com.moviebook.model.ShowTime" %>
<%@ page import="java.util.List" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>\${movie.title} - Grand Cinema</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; }
    </style>
</head>
<body class="min-h-screen flex flex-col justify-between">

    <nav class="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <a href="\${pageContext.request.contextPath}/movies" class="text-2xl font-bold tracking-tight text-white">
            <span class="text-indigo-500">🎬</span> Grand Cinema
        </a>
        <a href="\${pageContext.request.contextPath}/movies" class="text-sm font-medium hover:text-indigo-400 transition">← Back to Movies</a>
    </nav>

    <main class="max-w-6xl mx-auto w-full px-6 py-12 flex-grow">
        <% 
            Movie movie = (Movie) request.getAttribute("movie");
            if (movie != null) {
        %>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                <!-- Movie Poster Panel -->
                <div class="rounded-2xl overflow-hidden border border-slate-800 aspect-[2/3] shadow-2xl">
                    <img src="<%= movie.getPosterUrl() %>" alt="<%= movie.getTitle() %>" class="w-full h-full object-cover">
                </div>
                
                <!-- Movie Information & Schedule Selection -->
                <div class="md:col-span-2 flex flex-col justify-between">
                    <div>
                        <div class="flex flex-wrap items-center gap-3 mb-4">
                            <span class="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold px-3 py-1 rounded-full"><%= movie.getGenre() %></span>
                            <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold px-3 py-1 rounded-full"><%= movie.getLanguage() %></span>
                            <span class="text-sm text-slate-400">⏱ <%= movie.getDuration() %> Mins</span>
                        </div>
                        <h1 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6"><%= movie.getTitle() %></h1>
                        <p class="text-slate-300 leading-relaxed text-lg mb-8"><%= movie.getDescription() %></p>
                    </div>

                    <!-- Showtime selection container -->
                    <div class="mt-8 border-t border-slate-800 pt-8">
                        <h3 class="text-2xl font-bold text-white mb-6">Select Theater Session & Timing</h3>
                        
                        <div class="space-y-4">
                            <% 
                                List<ShowTime> showtimes = (List<ShowTime>) request.getAttribute("showtimes");
                                if (showtimes != null && !showtimes.isEmpty()) {
                                    for (ShowTime st : showtimes) {
                            %>
                                <div class="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-indigo-500/50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <h4 class="font-bold text-white text-lg"><%= st.getTheater() %></h4>
                                        <p class="text-slate-400 text-sm mt-1">Date: <%= st.getShowDate() %> | Start: <strong class="text-white"><%= st.getShowTime() %></strong></p>
                                    </div>
                                    <div class="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                        <span class="text-xl font-bold text-indigo-400">$<%= String.format("%.2f", st.getPrice()) %></span>
                                        <a href="\${pageContext.request.contextPath}/booking?showtimeId=<%= st.getId() %>" class="bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white py-2 px-5 rounded-lg transition whitespace-nowrap">
                                            Select Seats
                                        </a>
                                    </div>
                                </div>
                            <% 
                                    }
                                } else { 
                            %>
                                <div class="bg-slate-900/50 border border-slate-800 border-dashed rounded-xl p-8 text-center text-slate-500">
                                    No active screening timers configured for this release.
                                </div>
                            <% } %>
                        </div>
                    </div>
                </div>
            </div>
        <% } %>
    </main>

    <footer class="border-t border-slate-800 bg-slate-950 py-8 px-6 text-center text-sm text-slate-500">
        <p>&copy; 2026 Grand Cinema Hall. Powered by Java Web MVC technology.</p>
    </footer>

</body>
</html>
`
  },
  {
    path: "src/main/webapp/register.jsp",
    language: "html",
    description: "JSP registration screen containing customized inputs and secure confirmPassword matching scripts.",
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Grand Cinema - Create Account</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #0b1329; }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-6">

    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        <div class="text-center mb-8">
            <a href="\${pageContext.request.contextPath}/movies" class="text-3xl font-extrabold text-white">🎬 Cinema<span class="text-indigo-500">Book</span></a>
            <h2 class="text-xl font-semibold text-slate-300 mt-4">Create Your Profile Account</h2>
            <p class="text-slate-500 text-sm mt-1">Unlock seamless booking mechanics instantly</p>
        </div>

        <%-- Output Error Validation notifications --%>
        <% if (request.getAttribute("errorMessage") != null) { %>
            <div class="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6">
                <%= request.getAttribute("errorMessage") %>
            </div>
        <% } %>

        <form action="\${pageContext.request.contextPath}/register" method="POST" class="space-y-5">
            <div>
                <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Username</label>
                <input type="text" name="username" required placeholder="e.g. janesmith" 
                       class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition">
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" name="email" required placeholder="e.g. jane@company.com" 
                       class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition">
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                <input type="password" name="password" required placeholder="••••••••" 
                       class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition">
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
                <input type="password" name="confirmPassword" required placeholder="••••••••" 
                       class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition">
            </div>

            <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-indigo-500/25 mt-6">
                Register Account
            </button>
        </form>

        <div class="text-center mt-8 pt-6 border-t border-slate-800/80 text-sm text-slate-400">
            Already have a profile? 
            <a href="\${pageContext.request.contextPath}/login" class="text-indigo-400 font-semibold hover:underline">Log In</a>
        </div>

    </div>

</body>
</html>
`
  },
  {
    path: "src/main/webapp/login.jsp",
    language: "html",
    description: "JSP credentials authentication gateway showing helpful mock login credentials.",
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Grand Cinema - Secure Login</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #0b1329; }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-6">

    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        
        <div class="text-center mb-8">
            <a href="\${pageContext.request.contextPath}/movies" class="text-3xl font-extrabold text-white">🎬 Cinema<span class="text-indigo-500">Book</span></a>
            <h2 class="text-xl font-semibold text-slate-300 mt-4">Welcome Back</h2>
            <p class="text-slate-500 text-sm mt-1">Authenticate credentials to secure tickets</p>
        </div>

        <%-- Show account creation success feedback --%>
        <% if (session.getAttribute("successMessage") != null) { %>
            <div class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-4 rounded-xl mb-6">
                <%= session.getAttribute("successMessage") %>
                <% session.removeAttribute("successMessage"); %>
            </div>
        <% } %>

        <%-- Output validation credentials errors --%>
        <% if (request.getAttribute("errorMessage") != null) { %>
            <div class="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6">
                <%= request.getAttribute("errorMessage") %>
            </div>
        <% } %>

        <form action="\${pageContext.request.contextPath}/login" method="POST" class="space-y-5">
            <div>
                <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Username</label>
                <input type="text" name="username" required placeholder="Username" 
                       class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition">
            </div>

            <div>
                <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                <input type="password" name="password" required placeholder="••••••••" 
                       class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition">
            </div>

            <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg shadow-indigo-500/25 mt-4">
                Secure Log In
            </button>
        </form>

        <!-- Informative Demo Credentials helper block -->
        <div class="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-1">
            <strong class="text-white block mb-1">💡 Demo Accounts:</strong>
            <p>• Admin Access: <code class="text-indigo-400">admin</code> / <code class="text-indigo-400">admin123</code></p>
            <p>• Standard User: <code class="text-indigo-400">user</code> / <code class="text-indigo-400">user123</code></p>
        </div>

        <div class="text-center mt-8 pt-6 border-t border-slate-800/80 text-sm text-slate-400">
            Don't have a profile yet? 
            <a href="\${pageContext.request.contextPath}/register" class="text-indigo-400 font-semibold hover:underline">Sign Up Now</a>
        </div>

    </div>

</body>
</html>
`
  },
  {
    path: "src/main/webapp/seat-selection.jsp",
    language: "html",
    description: "JSP interactive seats matrix featuring reactive JavaScript mappings, cost summaries, and booking submissions.",
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.moviebook.model.ShowTime" %>
<%@ page import="java.util.List" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Reserve Seats - Grand Cinema</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; }
    </style>
</head>
<body class="min-h-screen flex flex-col justify-between">

    <nav class="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <a href="\${pageContext.request.contextPath}/movies" class="text-2xl font-bold text-white">🎬 Grand Cinema</a>
        <span class="text-sm text-slate-400">Interactive Seat Selection Matrix</span>
    </nav>

    <main class="max-w-4xl mx-auto w-full px-6 py-12 flex-grow">
        
        <div class="text-center mb-10">
            <h1 class="text-3xl font-extrabold text-white mb-2">\${showtime.movieTitle}</h1>
            <p class="text-indigo-400 font-medium text-sm">\${showtime.theater} | \${showtime.showDate} @ \${showtime.showTime}</p>
        </div>

        <!-- Cinema Screen Curve Indicator -->
        <div class="w-full mb-12 flex flex-col items-center">
            <div class="w-3/4 h-2 bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-500 rounded-full shadow-[0_4px_20px_rgba(99,102,241,0.5)]"></div>
            <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-2">CINEMA SCREEN DIRECTION</span>
        </div>

        <!-- Interactive Grid Map -->
        <div class="flex flex-col items-center gap-4 mb-10">
            <% 
                List<String> bookedSeats = (List<String>) request.getAttribute("bookedSeats");
                String[] rows = {"A", "B", "C", "D", "E", "F"};
                int colsCount = 10;
            %>
            <div class="grid grid-cols-10 gap-3 max-w-lg w-full">
                <% 
                    for (String r : rows) {
                        for (int c = 1; c <= colsCount; c++) {
                            String seatId = r + c;
                            boolean isReserved = bookedSeats != null && bookedSeats.contains(seatId);
                %>
                    <button type="button" 
                            id="seat-<%= seatId %>" 
                            data-seat="<%= seatId %>"
                            <%= isReserved ? "disabled" : "" %>
                            class="aspect-square flex items-center justify-center text-xs font-bold rounded-lg transition duration-200 
                            <%= isReserved 
                                ? "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-800/80" 
                                : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800 hover:border-slate-600 cursor-pointer" %>">
                        <%= seatId %>
                    </button>
                <% 
                        }
                    } 
                %>
            </div>
        </div>

        <!-- Seat Color Coding Legends -->
        <div class="flex justify-center gap-8 mb-12 text-sm">
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-slate-900 border border-slate-800 rounded"></div>
                <span class="text-slate-400 text-xs">Available</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-indigo-600 rounded"></div>
                <span class="text-slate-400 text-xs">Your Choice</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-slate-800 border border-slate-800 rounded"></div>
                <span class="text-slate-400 text-xs">Already Booked</span>
            </div>
        </div>

        <!-- Checkout Selection Details Box -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-500 uppercase tracking-widest">Active reservation</p>
                <div class="flex items-center gap-4 flex-wrap">
                    <p class="text-sm text-slate-300">Selected Seats: <strong id="selected-labels-text" class="text-white">None Selected</strong></p>
                    <span class="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full">Price per seat: $\${showtime.price}</span>
                </div>
            </div>
            <div class="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                <div class="text-right">
                    <p class="text-xs text-slate-500">Gross Total Cost</p>
                    <p class="text-2xl font-extrabold text-indigo-400">$<span id="price-total-number">0.00</span></p>
                </div>
                
                <!-- Submission processing wrapper form -->
                <form id="seats-submit-form" action="\${pageContext.request.contextPath}/booking" method="POST">
                    <input type="hidden" name="showtimeId" value="\${showtime.id}">
                    <input type="hidden" name="selectedSeats" id="selected-seats-input" value="">
                    <button type="submit" id="reserve-btn-element" disabled
                            class="bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg opacity-50 cursor-not-allowed">
                        Proceed to Payment
                    </button>
                </form>
            </div>
        </div>

    </main>

    <!-- Reactive Script logic to record selections dynamically -->
    <script>
        const selectedSeats = new Set();
        const basePrice = parseFloat("\${showtime.price}");
        const seatsInput = document.getElementById("selected-seats-input");
        const labelsText = document.getElementById("selected-labels-text");
        const priceText = document.getElementById("price-total-number");
        const reserveBtn = document.getElementById("reserve-btn-element");

        document.querySelectorAll("[id^='seat-']").forEach(btn => {
            if (btn.disabled) return;
            btn.addEventListener("click", () => {
                const seatCode = btn.getAttribute("data-seat");
                if (selectedSeats.has(seatCode)) {
                    selectedSeats.delete(seatCode);
                    btn.classList.replace("bg-indigo-600", "bg-slate-900");
                    btn.classList.add("text-slate-300");
                } else {
                    selectedSeats.add(seatCode);
                    btn.classList.replace("bg-slate-900", "bg-indigo-600");
                    btn.classList.remove("text-slate-300");
                }
                updateSelectionState();
            });
        });

        function updateSelectionState() {
            const list = Array.from(selectedSeats);
            if (list.length > 0) {
                labelsText.textContent = list.join(", ");
                priceText.textContent = (list.length * basePrice).toFixed(2);
                seatsInput.value = list.join(",");
                reserveBtn.disabled = false;
                reserveBtn.classList.remove("opacity-50", "cursor-not-allowed");
                reserveBtn.classList.add("hover:bg-indigo-500", "shadow-indigo-500/25");
            } else {
                labelsText.textContent = "None Selected";
                priceText.textContent = "0.00";
                seatsInput.value = "";
                reserveBtn.disabled = true;
                reserveBtn.classList.add("opacity-50", "cursor-not-allowed");
                reserveBtn.classList.remove("hover:bg-indigo-500", "shadow-indigo-500/25");
            }
        }
    </script>

    <footer class="border-t border-slate-800 bg-slate-950 py-8 px-6 text-center text-sm text-slate-500">
        <p>&copy; 2026 Grand Cinema Hall. Powered by Java Web MVC technology.</p>
    </footer>

</body>
</html>
`
  },
  {
    path: "src/main/webapp/payment.jsp",
    language: "html",
    description: "JSP mock payment screen mimicking credit card verification gateway schemas.",
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.moviebook.model.Booking" %>
<%@ page import="com.moviebook.model.ShowTime" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Secure Check-Out - Grand Cinema</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #0b1329; color: #f8fafc; }
    </style>
</head>
<body class="min-h-screen flex flex-col justify-between">

    <nav class="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <a href="\${pageContext.request.contextPath}/movies" class="text-2xl font-bold tracking-tight text-white">🎬 Grand Cinema</a>
    </nav>

    <main class="max-w-4xl mx-auto w-full px-6 py-12 flex-grow grid grid-cols-1 md:grid-cols-2 gap-10">
        
        <!-- Booking details Summary box -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col justify-between">
            <div>
                <span class="text-xs font-semibold text-indigo-400 uppercase tracking-widest">TRANSACTION SUMMARY</span>
                <h1 class="text-3xl font-extrabold text-white mt-2 mb-6">\${showtime.movieTitle}</h1>
                
                <div class="space-y-4 border-t border-b border-slate-800/80 py-6 mb-6">
                    <div class="flex justify-between text-sm">
                        <span class="text-slate-400">Theater Complex:</span>
                        <span class="text-white font-medium">\${showtime.theater}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-slate-400">Screening Schedule:</span>
                        <span class="text-white font-medium">\${showtime.showDate} | \${showtime.showTime}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-slate-400">Allocated Seats:</span>
                        <span class="text-indigo-400 font-bold">\${booking.seatsBooked}</span>
                    </div>
                </div>
            </div>

            <div class="flex justify-between items-center bg-slate-950 border border-slate-800/60 p-4 rounded-xl">
                <span class="text-sm text-slate-400">Order Gross Total:</span>
                <span class="text-2xl font-extrabold text-white">$<strong class="text-emerald-400">\${booking.totalPrice}</strong></span>
            </div>
        </div>

        <!-- Secure Card Entry Panel Mockup -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-6">SECURE PAYMENT DISPATCH</span>
            
            <form action="\${pageContext.request.contextPath}/movies" method="GET" class="space-y-5">
                <div>
                    <label class="block text-xs font-semibold text-slate-400 mb-2">CARDHOLDER NAME</label>
                    <input type="text" required placeholder="e.g. Jane Smith" 
                           class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-slate-400 mb-2">CREDIT CARD NUMBER</label>
                    <input type="text" required placeholder="4111 •••• •••• 1111" maxlength="19"
                           class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition">
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-400 mb-2">EXPIRATION DATE</label>
                        <input type="text" required placeholder="MM/YY" maxlength="5"
                               class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-400 mb-2">CVV SECURITY CODE</label>
                        <input type="password" required placeholder="•••" maxlength="3"
                               class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition">
                    </div>
                </div>

                <div class="flex items-center gap-3 pt-2 text-xs text-slate-400">
                    <span class="text-indigo-400">🛡️</span> Secure SSL Encrypted 256-bit Transaction protocol
                </div>

                <!-- Submit and return to dashboard, simulating success -->
                <button type="submit" 
                        onclick="alert('Payment Authorized Successfully! Reservation code is logged inside booking-history.');"
                        class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-4 rounded-xl transition shadow-lg shadow-emerald-500/20 mt-6">
                    Authorize Payment ($<strong class="text-white">\${booking.totalPrice}</strong>)
                </button>
            </form>
        </div>

    </main>

    <footer class="border-t border-slate-800 bg-slate-950 py-8 px-6 text-center text-sm text-slate-500">
        <p>&copy; 2026 Grand Cinema Hall. Powered by Java Web MVC technology.</p>
    </footer>

</body>
</html>
`
  },
  {
    path: "src/main/webapp/booking-history.jsp",
    language: "html",
    description: "JSP list mapping past and active reservation entries for user profile audit logs.",
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="com.moviebook.model.Booking" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Booking History - Grand Cinema</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; }
    </style>
</head>
<body class="min-h-screen flex flex-col justify-between">

    <nav class="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <a href="\${pageContext.request.contextPath}/movies" class="text-2xl font-bold tracking-tight text-white">🎬 Grand Cinema</a>
        <a href="\${pageContext.request.contextPath}/movies" class="text-sm font-medium text-slate-400 hover:text-white transition">← Back to Catalog</a>
    </nav>

    <main class="max-w-4xl mx-auto w-full px-6 py-12 flex-grow">
        <div class="mb-10">
            <h1 class="text-3xl font-extrabold tracking-tight text-white">Reservation Records</h1>
            <p class="text-slate-400 mt-1">Audit log of your purchased movie tickets.</p>
        </div>

        <div class="space-y-6">
            <% 
                List<Booking> list = (List<Booking>) request.getAttribute("bookings");
                if (list != null && !list.isEmpty()) {
                    for (Booking booking : list) {
            %>
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div class="space-y-3">
                        <div class="flex items-center gap-3">
                            <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold py-1 px-3 rounded-full">✓ AUTHORIZED</span>
                            <span class="text-xs text-slate-500">Order ID: #REC-00<%= booking.getId() %></span>
                        </div>
                        <h3 class="text-2xl font-bold text-white"><%= booking.getMovieTitle() %></h3>
                        <p class="text-slate-400 text-sm">Complex: <strong><%= booking.getTheater() %></strong> | Allocated Seats: <strong class="text-indigo-400"><%= booking.getSeatsBooked() %></strong></p>
                    </div>
                    <div class="flex md:flex-col justify-between items-center md:items-end border-t md:border-t-0 border-slate-800/80 pt-4 md:pt-0 gap-2">
                        <span class="text-xs text-slate-500">Booking Time: <%= booking.getBookingDate().toString().substring(0, 16) %></span>
                        <p class="text-2xl font-extrabold text-white">$<%= String.format("%.2f", booking.getTotalPrice()) %></p>
                    </div>
                </div>
            <% 
                    }
                } else { 
            %>
                <div class="bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl p-16 text-center text-slate-500">
                    <p class="text-4xl mb-3">🎫</p>
                    <h3 class="text-lg font-bold text-slate-300">No Reservations Found</h3>
                    <p class="text-sm text-slate-500 mt-1">When you book tickets, your purchase details appear here.</p>
                    <a href="\${pageContext.request.contextPath}/movies" class="inline-block bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-semibold py-2 px-6 rounded-lg mt-6 transition">
                        Explore Show Times
                    </a>
                </div>
            <% } %>
        </div>
    </main>

    <footer class="border-t border-slate-800 bg-slate-950 py-8 px-6 text-center text-sm text-slate-500">
        <p>&copy; 2026 Grand Cinema Hall. Powered by Java Web MVC technology.</p>
    </footer>

</body>
</html>
`
  },
  {
    path: "src/main/webapp/admin-dashboard.jsp",
    language: "html",
    description: "JSP admin dashboard enabling movies listing editing, adding showtimes, and deleting catalog records.",
    content: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="com.moviebook.model.Movie" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Dashboard - Cinema Controls</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; }
    </style>
</head>
<body class="min-h-screen flex flex-col justify-between">

    <nav class="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <a href="\${pageContext.request.contextPath}/movies" class="text-2xl font-bold text-white">🎬 Grand Cinema Admin</a>
        <a href="\${pageContext.request.contextPath}/movies" class="text-sm font-semibold hover:text-indigo-400 transition">← Movie Catalog</a>
    </nav>

    <main class="max-w-6xl mx-auto w-full px-6 py-12 flex-grow grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <!-- Left 2 Cols: Movie List Grid -->
        <div class="lg:col-span-2 space-y-6">
            <h2 class="text-2xl font-extrabold text-white mb-6">Manage Cinematic Titles</h2>
            
            <div class="space-y-4">
                <% 
                    List<Movie> movies = (List<Movie>) request.getAttribute("movies");
                    if (movies != null && !movies.isEmpty()) {
                        for (Movie m : movies) {
                %>
                    <div class="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-5 shadow-lg">
                        <img src="<%= m.getPosterUrl() %>" alt="<%= m.getTitle() %>" class="w-16 h-24 object-cover rounded-xl border border-slate-800">
                        <div class="flex-grow">
                            <h3 class="font-bold text-white text-lg"><%= m.getTitle() %></h3>
                            <p class="text-xs text-slate-400 mt-1">Genre: <%= m.getGenre() %> | <%= m.getLanguage() %> | <%= m.getDuration() %> Mins</p>
                            
                            <!-- Internal configuration controls -->
                            <div class="flex items-center gap-4 mt-4 text-xs">
                                <a href="\${pageContext.request.contextPath}/movies?id=<%= m.getId() %>" class="text-indigo-400 hover:underline">Schedules</a>
                                <a href="\${pageContext.request.contextPath}/admin/deleteMovie?id=<%= m.getId() %>" 
                                   onclick="return confirm('Permanently remove this film and associated screening session?');"
                                   class="text-red-400 hover:underline">Delete Film</a>
                            </div>
                        </div>
                    </div>
                <% 
                        }
                    } else { 
                %>
                    <div class="bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl p-12 text-center text-slate-500">
                        No movie list loaded. Pop a title on the right panel.
                    </div>
                <% } %>
            </div>
        </div>

        <!-- Right Col: Add New Film Form -->
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl h-fit">
            <h2 class="text-xl font-bold text-white mb-6">Create Movie Entry</h2>
            
            <form action="\${pageContext.request.contextPath}/admin/addMovie" method="POST" class="space-y-4 text-sm">
                <div>
                    <label class="block text-xs font-semibold text-slate-400 mb-1">MOVIE TITLE</label>
                    <input type="text" name="title" required placeholder="e.g. Inception"
                           class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-400 mb-1">GENRE CATEGORY</label>
                    <input type="text" name="genre" required placeholder="e.g. Sci-Fi / Action"
                           class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-400 mb-1">DURATION (MIN)</label>
                        <input type="number" name="duration" required placeholder="148"
                               class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-400 mb-1">LANGUAGE</label>
                        <input type="text" name="language" required placeholder="English"
                               class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-400 mb-1">POSTER ASSET URL</label>
                    <input type="url" name="posterUrl" required placeholder="https://unsplash.com/..."
                           class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-400 mb-1">SYNOPSIS SUMMARY</label>
                    <textarea name="description" rows="3" required placeholder="Describe film storyline..."
                              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500"></textarea>
                </div>

                <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg shadow-indigo-500/10 mt-2">
                    Publish Movie
                </button>
            </form>
        </div>

    </main>

    <footer class="border-t border-slate-800 bg-slate-950 py-8 px-6 text-center text-sm text-slate-500">
        <p>&copy; 2026 Grand Cinema Hall. Powered by Java Web MVC technology.</p>
    </footer>

</body>
</html>
`
  },
  {
    path: "src/main/webapp/WEB-INF/web.xml",
    language: "xml",
    description: "Web deployment descriptor web.xml detailing Servlet mappings, session configurations, and resource limits.",
    content: `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <display-name>Movie Ticket Booking System</display-name>

    <!-- Welcome File List -->
    <welcome-file-list>
        <welcome-file>movies</welcome-file>
    </welcome-file-list>

    <!-- Servlet Declarations -->
    <servlet>
        <servlet-name>LoginServlet</servlet-name>
        <servlet-class>com.moviebook.servlet.LoginServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>LoginServlet</servlet-name>
        <url-pattern>/login</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>RegisterServlet</servlet-name>
        <servlet-class>com.moviebook.servlet.RegisterServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>RegisterServlet</servlet-name>
        <url-pattern>/register</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>MovieServlet</servlet-name>
        <servlet-class>com.moviebook.servlet.MovieServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>MovieServlet</servlet-name>
        <url-pattern>/movies</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>BookingServlet</servlet-name>
        <servlet-class>com.moviebook.servlet.BookingServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>BookingServlet</servlet-name>
        <url-pattern>/booking</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>AdminServlet</servlet-name>
        <servlet-class>com.moviebook.servlet.AdminServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>AdminServlet</servlet-name>
        <url-pattern>/admin/*</url-pattern>
    </servlet-mapping>

    <!-- Session Configuration (Default timeouts mapping 30 minutes) -->
    <session-config>
        <session-timeout>30</session-timeout>
    </session-config>

</web-app>
`
  },
  {
    path: "README.md",
    language: "markdown",
    description: "Detailed setup manual outlining JDK installation, Apache Tomcat deployment, and MySQL schema creation.",
    content: `# Java Servlet / JSP Movie Ticket Booking System - Manual

This is a complete, industry-standard Model-View-Controller (MVC) Java Web Application for movie ticket booking, integrated with MySQL and deployed over Apache Tomcat.

## 🛠️ Technological Stack
- **Java SE Development Kit (JDK 11+)**
- **Java Servlets & JavaServer Pages (JSP v4.0)**
- **JDBC Driver v8.0**
- **Apache Tomcat Server v9.0+**
- **MySQL Database Server v8.0+**
- **Tailwind CSS Grid system (responsive UI)**

---

## 🚀 Setup & Execution Guide

### Step 1: Pre-requisites & Local Environment Prep
1. **Install JDK**: Download and set up JDK 11 (or above) on your local operating system. Verify pathing on shell:
   \`\`\`bash
   java -version
   javac -version
   \`\`\`
2. **Download Apache Tomcat**: Obtain Tomcat 9.x zip/tarball. Unpack onto local directory.
3. **Download MySQL Server**: Install MySQL, noting down port (usually \`3306\`) and root \`password\`.

---

### Step 2: Database Setup & Seed Execution
1. Open your terminal or MySQL Workbench, connect, and run the schema file located in \`db/schema.sql\`:
   \`\`\`bash
   mysql -u root -p < db/schema.sql
   \`\`\`
2. If your database credentials differ from \`root\` with password \`password\`, locate and adjust the constants inside \`src/main/java/com/moviebook/dao/DBConnection.java\`.

---

### Step 3: Project Structure & Compiling
Import this project as a **Dynamic Web Project** in Eclipse IDE or IntelliJ IDEA Ultimate:
1. File -> Import -> General -> Existing Projects into Workspace (or Dynamic Web Project).
2. Set Target Runtime to your installed **Apache Tomcat** version.
3. Add MySQL JDBC Driver (\`mysql-connector-j-8.x.jar\`) to the classpath. In web applications, ensure this JAR is copied directly inside \`src/main/webapp/WEB-INF/lib/\`.

---

### Step 4: Local Compile and Build (Maven / WAR)
To pack manually as a WAR file, compile and bundle:
- Build file targetting \`moviebooking.war\` and copy it directly inside the Tomcat \`webapps/\` directory.
- Start Apache Tomcat:
  - Windows: \`bin/startup.bat\`
  - Mac/Linux: \`./bin/startup.sh\`

---

### Step 5: Live Navigation Access
Open browser context and direct routing to:
\`\`\`text
http://localhost:8080/moviebooking/movies
\`\`\`

#### 👥 Demo Login Credentials
- **Standard User**: username: \`user\` | password: \`user123\`
- **Admin Clearance**: username: \`admin\` | password: \`admin123\`
`
  }
];
