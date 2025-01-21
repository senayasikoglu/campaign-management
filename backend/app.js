/**
 * App Entry Point
 * Initializes Express app
 */

const express = require("express");
const cors = require("cors");

const campaignRoutes = require('./routes/campaignRoutes');
const authRoutes = require('./routes/auth');

const app = express();

// CORS middleware configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());
 
app.use('/api/auth', authRoutes);

app.use('/api/campaigns', campaignRoutes);


module.exports = app;
