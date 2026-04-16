const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const dns = require('dns');
const { startCronJobs } = require('./services/cronJobs');
const initChatSocket = require('./socket/chatSocket');
const { globalApiLimiter } = require('./middleware/security');
const { apiCache, getCacheStats, clearCache } = require('./middleware/apiCache');
const {
    compressionMiddleware,
    hppMiddleware,
    mongoSanitizeMiddleware,
    requestHardening
} = require('./middleware/requestHardening');
let metricsManager = null;
try {
    metricsManager = require('./utils/prometheusMetrics');
} catch (err) {
    console.warn('⚠️ Prometheus metrics disabled:', err.message);
}

console.log('🚀 Starting server...');

// DNS Fix for MongoDB Atlas SRV lookups
const currentServers = dns.getServers();
if (currentServers && currentServers.includes("127.0.0.1")) {
  console.warn(
    "Local DNS server 127.0.0.1 detected — switching to public DNS for SRV lookups",
  );
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

// Always load env from this folder, regardless of where the process was started.
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);
const ROOT_DIR = path.resolve(__dirname, '..');
app.set('trust proxy', Number(process.env.TRUST_PROXY || 1));
const envOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
const defaultOrigins = [
    'https://roomhy.com',
    'https://www.roomhy.com',
    'https://admin.roomhy.com',
    'https://app.roomhy.com',
    'https://api.roomhy.com',
    'https://roohmy-frontend.vercel.app'
];
const localOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:5001',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:5001',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
    ,
    'http://127.0.0.1:5175',
    'http://127.0.0.1:5176',
    'http://127.0.0.1:5177'
];
const allowedOrigins = Array.from(new Set([...(envOrigins.length ? envOrigins : defaultOrigins), ...localOrigins]));
const corsOptions = {
    origin: function (origin, callback) {
        // Allow all origins temporarily
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
};
const io = new Server(server, {
    cors: corsOptions
});

initChatSocket(io);

// Enhanced Helmet Security Configuration
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            connectSrc: ["'self'", "https:"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'", "https:"],
            frameSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    crossOriginEmbedderPolicy: false, // Allow embedding for compatibility
    crossOriginResourcePolicy: { policy: "cross-origin" },
    dnsPrefetchControl: { allow: true },
    frameguard: { action: 'deny' }, // X-Frame-Options
    hidePoweredBy: true, // Remove X-Powered-By header
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    },
    ieNoOpen: true, // X-Download-Options
    noSniff: true, // X-Content-Type-Options
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true, // X-XSS-Protection
}));

// Additional Security Headers Middleware
app.use((req, res, next) => {
    // Prevent caching of sensitive API responses
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(self), microphone=(), camera=()');
    
    // API Response Caching Headers for GET requests
    if (req.method === 'GET' && req.path.startsWith('/api/')) {
        // Cache public data for 5 minutes, private data no cache
        if (req.path.includes('/api/cities') || req.path.includes('/api/property-types') || req.path.includes('/api/approved-properties')) {
            res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
        } else if (!req.path.includes('/api/auth')) {
            res.setHeader('Cache-Control', 'private, no-cache, must-revalidate');
        }
    }
    
    next();
});

app.use(compressionMiddleware);

// Optimized JSON parsing with size limits
app.use(express.json({ 
    limit: '50mb',
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Security middlewares
app.use(mongoSanitizeMiddleware);
app.use(hppMiddleware);
app.use(requestHardening);
app.use(cors(corsOptions));
app.use('/api', globalApiLimiter);

// API Response Caching - Speeds up frequently accessed data
app.use('/api', apiCache);

// Connection Keep-Alive for better performance
app.use((req, res, next) => {
    res.setHeader('Keep-Alive', 'timeout=5, max=1000');
    next();
});
if (metricsManager && typeof metricsManager.init === 'function') {
    metricsManager.init(app);
}

console.log('✅ Middleware configured');

// Request logging middleware
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
});

// Optimized Database Connection
const mongoOptions = {
    serverSelectionTimeoutMS: 5000, // Reduced for faster fail
    socketTimeoutMS: 30000,
    connectTimeoutMS: 5000,
    maxPoolSize: 50, // Increased for concurrent requests
    minPoolSize: 10,
    maxIdleTimeMS: 30000,
    waitQueueTimeoutMS: 5000,
    readPreference: 'primaryPreferred', // Read from primary, fallback to secondary
    retryWrites: true,
    w: 'majority',
    // Enable query caching at driver level
    autoIndex: false, // Disable auto-indexing in production for faster startup
    autoCreate: false
};

console.log('🔗 Connecting to MongoDB...');

// Check if MONGO_URI is defined and fix encoding issues
let mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.log('⚠️  MONGO_URI not found in .env file');
    console.error('❌ Please set MONGO_URI in your .env file');
} else {
    console.log('📍 URI length:', mongoUri.length);
    console.log('🔍 URI preview:', mongoUri.substring(0, 50) + '...');
}

// Connect to MongoDB
mongoose.connect(mongoUri, mongoOptions)
    .then(() => {
        console.log('✅ MongoDB Connected');
        startServer();
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.warn('⚠️ Starting server anyway; API calls may fail until DB reconnects');
        startServer();
    });

// Handle serverless environment
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    // For serverless, we need to handle the connection differently
    console.log('🌐 Serverless environment detected');
    
    // Export the app for Vercel
    module.exports = async (req, res) => {
        // Ensure MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            try {
                await mongoose.connect(mongoUri, mongoOptions);
                console.log('✅ MongoDB Connected (serverless)');
            } catch (err) {
                console.error('❌ MongoDB connection error (serverless):', err.message);
                return res.status(500).json({
                    success: false,
                    message: 'Database connection failed'
                });
            }
        }
        
        // Handle the request
        app(req, res);
    };
}

mongoose.connection.on('connected', () => console.log('✅ Mongoose connected'));
mongoose.connection.on('error', (err) => console.error('❌ Mongoose error', err && err.message));
mongoose.connection.on('disconnected', () => console.warn('⚠️ Mongoose disconnected'));
mongoose.connection.on('reconnected', () => console.log('✅ Mongoose reconnected'));

// Routes (API Endpoints)
console.log('📍 Loading routes...');

try {
    app.use('/api/auth', require('./routes/authRoutes'));
    console.log('  ✓ authRoutes');
    app.use('/api/properties', require('./routes/propertyRoutes'));
    console.log('  ✓ propertyRoutes');
    app.use('/api/admin', require('./routes/adminRoutes'));
    console.log('  ✓ adminRoutes');
    app.use('/api/tenants', require('./routes/tenantRoutes'));
    console.log('  ✓ tenantRoutes');
    app.use('/api/visits', require('./routes/visitDataRoutes'));
    console.log('  ✓ visitDataRoutes');
    app.use('/api/rooms', require('./routes/roomRoutes'));
    console.log('  ✓ roomRoutes');
    app.use('/api/notifications', require('./routes/notificationRoutes'));
    console.log('  ✓ notificationRoutes');
    app.use('/api/owners', require('./routes/ownerRoutes'));
    console.log('  ✓ ownerRoutes');
    app.use('/api/employees', require('./routes/employeeRoutes'));
    console.log('  ✓ employeeRoutes');
    app.use('/api/complaints', require('./routes/complaintRoutes'));
    console.log('  ✓ complaintRoutes');
    app.use('/api/booking', require('./routes/bookingRoutes'));
    console.log('  ✓ bookingRoutes (as /api/booking)');
    app.use('/api/bookings', require('./routes/bookingRoutes'));
    console.log('  ✓ bookingRoutes (as /api/bookings)');
    app.use('/api/favorites', require('./routes/favoritesRoutes'));
    console.log('  ✓ favoritesRoutes');
    app.use('/api/bids', require('./routes/bidsRoutes'));
    console.log('  ✓ bidsRoutes');
    app.use('/api/kyc', require('./routes/kycRoutes'));
    console.log('  ✓ kycRoutes');
    app.use('/api/signups', require('./routes/kycRoutes'));
    console.log('  ✓ kycRoutes (as /api/signups)');
    app.use('/api/cities', require('./routes/citiesRoutes'));
    console.log('  ✓ citiesRoutes');
    app.use('/api/property-types', require('./routes/propertyTypeRoutes'));
    console.log('  ✓ propertyTypeRoutes');
    app.use('/api/locations', require('./routes/locationRoutes'));
    console.log('  ✓ locationRoutes');
    app.use('/api/website-enquiry', require('./routes/websiteEnquiryRoutes'));
    console.log('  ✓ websiteEnquiryRoutes (as /api/website-enquiry)');
    app.use('/api/website-enquiries', require('./routes/websiteEnquiryRoutes'));
    console.log('  ✓ websiteEnquiryRoutes (as /api/website-enquiries)');
    app.use('/api/approved-properties', require('./routes/approvedPropertiesRoutes'));
    console.log('  ✓ approvedPropertiesRoutes');
    app.use('/api/approvals', require('./routes/approvedPropertiesRoutes'));
    console.log('  ✓ approvedPropertiesRoutes (as /api/approvals)');
    app.use('/api/website-property-data', require('./routes/websitePropertyDataRoutes'));
    console.log('  ✓ websitePropertyDataRoutes');
    
    try { 
        app.use('/api/website-properties', require('./routes/websitePropertyRoutes'));
        console.log('  ✓ websitePropertyRoutes');
    } catch(e) { 
        console.log('  ⚠️  websitePropertyRoutes not loaded:', e.message); 
    }
    
    app.use('/api/chat', require('./routes/chatRoutes'));
    console.log('  ✓ chatRoutes');
    app.use('/api/email', require('./routes/emailRoutes'));
    console.log('  ✓ emailRoutes');
    app.use('/api/checkin', require('./routes/checkinRoutes'));
    console.log('  ✓ checkinRoutes');
    app.use('/api/colleges', require('./routes/collegeRoutes'));
    console.log('  ✓ collegeRoutes');
    app.use('/api/property-colleges', require('./routes/propertyColleges'));
    console.log('  ✓ propertyColleges');
    app.use('/api/reviews', require('./routes/reviewRoutes'));
    console.log('  ✓ reviewRoutes');
    app.use('/api/rents', require('./routes/rentRoutes'));
    console.log('  ✓ rentRoutes');
    app.use('/api/user', require('./routes/userRoutes'));
    console.log('  ✓ userRoutes');
    app.use('/api', require('./routes/uploadRoutes'));
    console.log('  ✓ uploadRoutes');
    
    console.log('✅ All routes loaded');
} catch (err) {
    console.error('❌ Error loading routes:', err.message);
    console.error(err.stack);
    process.exit(1);
}

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        service: 'roomhy-backend',
        env: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        cache: getCacheStats()
    });
});

// Cache management endpoints (admin only - add auth later)
app.get('/api/admin/cache-stats', (req, res) => {
    res.json({
        success: true,
        cache: getCacheStats()
    });
});

app.post('/api/admin/clear-cache', (req, res) => {
    const { path } = req.body || {};
    clearCache(path);
    res.json({
        success: true,
        message: path ? `Cache cleared for: ${path}` : 'All cache cleared',
        cache: getCacheStats()
    });
});

// Root route handler for Vercel
app.get('/', (req, res) => {
    res.json({
        success: true,
        service: 'roomhy-backend API',
        version: '1.0.1',
        status: 'running - CORS Fixed',
        timestamp: new Date().toISOString(),
        cors: 'All origins allowed'
    });
});

// Favicon handler
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// Handle preflight requests for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// Static File Serving (MUST come AFTER API routes)
console.log('📁 Configuring static files...');
app.use(express.static(ROOT_DIR));
app.use('/Areamanager', express.static(path.join(ROOT_DIR, 'Areamanager')));
app.use('/propertyowner', express.static(path.join(ROOT_DIR, 'propertyowner')));
app.use('/tenant', express.static(path.join(ROOT_DIR, 'tenant')));
app.use('/superadmin', express.static(path.join(ROOT_DIR, 'superadmin')));
app.use('/website', express.static(path.join(ROOT_DIR, 'website')));
app.use('/images', express.static(path.join(ROOT_DIR, 'images')));
app.use('/js', express.static(path.join(ROOT_DIR, 'js')));
console.log('✅ Static files configured');

// Global error handlers
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

app.use((err, req, res, next) => {
    console.error('Express Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// 404 handler for unmatched routes
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            success: false,
            message: 'API endpoint not found'
        });
    }
    res.status(404).send('Not Found');
});

const PORT = process.env.PORT || 5001;

function startServer() {
    // Don't start server in Vercel serverless environment
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
        console.log('🌐 Running in serverless environment, skipping server start');
        return;
    }
    
    if (server.listening) return;
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`\n✅ Backend API running on http://localhost:${PORT}\n`);
        
        // Start cron jobs for automated rent reminders
        try {
            startCronJobs();
        } catch (err) {
            console.warn('⚠️  Cron jobs failed to start:', err.message);
        }
    });
}

// Vercel serverless function export
if (process.env.VERCEL) {
    module.exports = app;
} else {
    // Local development
    startServer();
}
