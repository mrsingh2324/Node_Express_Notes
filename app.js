// /**
//  * BookVault API - A simple Express + SQLite3 application with JWT authentication
//  * 
//  * Setup:
//  * npm init -y
//  * npm install express better-sqlite3 bcrypt jsonwebtoken body-parser morgan
//  * 
//  * Start server:
//  * node app.js
//  * 
//  * The server will create data/app.db on first run with sample data.
//  */


// // Required dependencies

const express = require('express');
const Database = require('better-sqlite3');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const bodyParser = require('body-parser');
// const morgan = require('morgan');
// const fs = require('fs');
// const path = require('path');
// const dotenv = require('dotenv');

// const mongoURL = process.env.MONGO_URL;

// dotenv.config();

// // Configuration
// const PORT = process.env.PORT || 3000;
// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_for_demo'; // In production, use environment variables
// const SALT_ROUNDS = 10;

// // Initialize Express app
// const app = express();


// // Middleware setup
// app.use(bodyParser.json());

// // Custom logger middleware
// const loggerMiddleware = (req, res, next) => {
//     const logData = {
//         timestamp: new Date().toISOString(),
//         method: req.method,
//         path: req.path,
//         ip: req.ip,
//         body: { ...req.body }
//     };
    
//     // Remove password from logs for security
//     if (logData.body.password) {
//         logData.body.password = '***REDACTED***';
//     }
    
//     console.log('[REQUEST]', JSON.stringify(logData, null, 2));
//     next();
// };

// // Use morgan for HTTP request logging
// app.use(morgan('dev'));

// // Apply custom logger middleware to all routes
// app.use(loggerMiddleware);

// // Database setup
// const dbPath = path.join(mongoURL);
// const db = new Database(dbPath);

// // Initialize database with tables and sample data
// function initializeDatabase() {
//     // Create users table
//     db.prepare(`
//         CREATE TABLE IF NOT EXISTS users (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             username TEXT UNIQUE NOT NULL,
//             password_hash TEXT NOT NULL,
//             email TEXT UNIQUE,
//             created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//         )
//     `).run();

//     // Create books table
//     db.prepare(`
//         CREATE TABLE IF NOT EXISTS books (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             title TEXT NOT NULL,
//             author TEXT,
//             user_id INTEGER REFERENCES users(id),
//             created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//         )
//     `).run();

//     // Check if we need to seed data
//     const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    
//     if (userCount === 0) {
//         console.log('Seeding initial data...');
//         const passwordHash = bcrypt.hashSync('password123', SALT_ROUNDS);
        
//         // Insert sample user
//         const { lastInsertRowid: userId } = db.prepare(`
//             INSERT INTO users (username, password_hash, email)
//             VALUES (?, ?, ?)
//         `).run('alice', passwordHash, 'alice@example.com');
        
//         // Insert sample books
//         const insertBook = db.prepare(`
//             INSERT INTO books (title, author, user_id)
//             VALUES (?, ?, ?)
//         `);
        
//         insertBook.run('The Great Gatsby', 'F. Scott Fitzgerald', userId);
//         insertBook.run('To Kill a Mockingbird', 'Harper Lee', userId);
        
//         console.log('Sample data seeded successfully');
//     }
// }

// // Authentication middleware
// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
    
//     if (!token) {
//         return res.status(401).json({ error: 'Access token is required' });
//     }
    
//     jwt.verify(token, JWT_SECRET, (err, user) => {
//         if (err) {
//             return res.status(403).json({ error: 'Invalid or expired token' });
//         }
        
//         // Verify user exists in database
//         const dbUser = db.prepare('SELECT id, username, email FROM users WHERE id = ?').get(user.userId);
//         if (!dbUser) {
//             return res.status(403).json({ error: 'User not found' });
//         }
        
//         req.user = dbUser;
//         next();
//     });
// }

// // Error handling middleware
// function errorHandler(err, req, res, next) {
//     console.error('Error:', err);
//     res.status(500).json({ 
//         error: 'Internal Server Error',
//         message: err.message 
//     });
// }

// // Apply error handler
// app.use(errorHandler);

// // Routes
// app.post('/register', async (req, res) => {
//     try {
//         const { username, password, email } = req.body;
        
//         // Input validation
//         if (!username || !password) {
//             return res.status(400).json({ error: 'Username and password are required' });
//         }
        
//         // Check if user exists
//         const existingUser = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(username, email);
//         if (existingUser) {
//             return res.status(409).json({ 
//                 error: 'User with this username or email already exists' 
//             });
//         }
        
//         // Hash password
//         const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        
//         // Create user
//         const result = db.prepare(`
//             INSERT INTO users (username, password_hash, email)
//             VALUES (?, ?, ?)
//         `).run(username, passwordHash, email || null);
        
//         res.status(201).json({ 
//             message: 'User registered successfully',
//             userId: result.lastInsertRowid 
//         });
        
//     } catch (error) {
//         next(error);
//     }
// });

// app.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
        
//         // Input validation
//         if (!username || !password) {
//             return res.status(400).json({ error: 'Username and password are required' });
//         }
        
//         // Find user
//         const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
//         if (!user) {
//             return res.status(401).json({ error: 'Invalid username or password' });
//         }
        
//         // Verify password
//         const isValid = await bcrypt.compare(password, user.password_hash);
//         if (!isValid) {
//             return res.status(401).json({ error: 'Invalid password' });
//         }
        
//         // Generate JWT
//         const token = jwt.sign(
//             { userId: user.id, username: user.username },
//             JWT_SECRET,
//             { expiresIn: '1h' }
//         );
        
//         res.json({ 
//             accessToken: token,
//             tokenType: 'Bearer',
//             expiresIn: 3600 
//         });
        
//     } catch (error) {
//         next(error);
//     }
// });

// // Protected routes
// app.get('/profile', authenticateToken, (req, res) => {
//     try {
//         // User is already attached to req by authenticateToken middleware
//         res.json({
//             id: req.user.id,
//             username: req.user.username,
//             email: req.user.email,
//             createdAt: req.user.created_at
//         });
//     } catch (error) {
//         next(error);
//     }
// });


// app.get('/books', authenticateToken, (req, res) => {
//     try {
//         const { mine } = req.query;
//         let query = 'SELECT id, title, author, created_at FROM books';
//         let params = [];
        
//         if (mine === 'true') {
//             query += ' WHERE user_id = ?';
//             params.push(req.user.id);
//         }
        
//         const books = db.prepare(query).all(...params);
//         res.json(books);
//     } catch (error) {
//         next(error);
//     }
// });

// app.post('/books', authenticateToken, (req, res) => {
//     try {
//         const { title, author } = req.body;
        
//         if (!title) {
//             return res.status(400).json({ error: 'Title is required' });
//         }
        
//         const result = db.prepare(`
//             INSERT INTO books (title, author, user_id)
//             VALUES (?, ?, ?)
//         `).run(title, author || null, req.user.id);
        
//         res.status(201).json({
//             id: result.lastInsertRowid,
//             title,
//             author,
//             userId: req.user.id
//         });
//     } catch (error) {
//         next(error);
//     }
// });

// // Start server
// function startServer() {
//     // Ensure data directory exists
//     if (!fs.existsSync('data')) {
//         fs.mkdirSync('data');
//     }
    
//     // Initialize database
//     initializeDatabase();
    
//     // Start listening
//     app.listen(PORT, () => {
//         console.log(`Server running on http://localhost:${PORT}`);
//         console.log(`Database file: ${path.resolve(dbPath)}`);
//     });
// }

// startServer();

// // Export for testing
// module.exports = { app, db };

// /**
//  * =============================================
//  * TOKEN AUTHENTICATION & JWT EXPLANATION
//  * =============================================
//  * 
//  * How it works:
//  * 1. User logs in with username/password
//  * 2. Server verifies credentials and issues a JWT
//  * 3. Client stores the JWT (typically in localStorage or HTTP-only cookie)
//  * 4. For subsequent requests, client includes JWT in Authorization header:
//  *    Authorization: Bearer <token>
//  * 5. Server verifies JWT signature and extracts user data
//  * 
//  * JWT Structure:
//  * - Header: Algorithm and token type
//  * - Payload: Claims (user ID, username, expiration, etc.)
//  * - Signature: Ensures token wasn't tampered with
//  * 
//  * Token vs Session Authentication:
//  * - Token: Stateless, contains all needed data, works well with distributed systems
//  * - Session: Stateful, requires server-side session storage, simpler to invalidate
//  * 
//  * =============================================
//  * EXAMPLE CURL COMMANDS FOR TESTING
//  * =============================================
//  * 
//  * # 1. Register a new user
//  * curl -X POST http://localhost:3000/register \
//  *   -H "Content-Type: application/json" \
//  *   -d '{"username":"bob","password":"bobspassword","email":"bob@example.com"}'
//  * 
//  * # 2. Login and get token
//  * curl -X POST http://localhost:3000/login \
//  *   -H "Content-Type: application/json" \
//  *   -d '{"username":"alice","password":"password123"}'
//  * 
//  * # 3. Get all books (requires authentication)
//  * curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
//  *   http://localhost:3000/books
//  * 
//  * # 4. Get only my books
//  * curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
//  *   "http://localhost:3000/books?mine=true"
//  * 
//  * # 5. Get user profile
//  * curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
//  *   http://localhost:3000/profile
//  * 
//  * # 6. Add a new book
//  * curl -X POST http://localhost:3000/books \
//  *   -H "Content-Type: application/json" \
//  *   -H "Authorization: Bearer YOUR_TOKEN_HERE" \
//  *   -d '{"title":"New Book","author":"Author Name"}'
//  */


// // npm install express better-sqlite3 bcrypt jsonwebtoken body-parser morgan
// // npm install -g nodemon
// // npm run dev
