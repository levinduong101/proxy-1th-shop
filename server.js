// server.js
import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3001;
const TARGET_URL = process.env.TARGET_URL || "https://merch-base.prowerb.digital";

// Allow CORS for all origins
app.use(cors({
    origin: true,
    credentials: true
}));

const proxyOptions = {
    target: TARGET_URL,
    changeOrigin: true,
    secure: true,
    logLevel: 'debug',
    logger: console,
    on: {
        proxyReq: (proxyReq, req, res) => {
            console.log('=== PROXY REQUEST ===');
            console.log('Method:', req.method);
            console.log('URL:', req.url);
            console.log('Target:', `${TARGET_URL}${req.url}`);
            
            // Add Auth header
            const token = process.env.ACCESS_UPLOAD_TOKEN;
            
            if (token) {
                proxyReq.setHeader("Authorization", `Bearer ${token}`);
                console.log("✅ Authorization header added");
            } else {
                console.log("❌ WARNING: No token found in environment variables");
            }
            
            const headers = proxyReq.getHeaders();
            console.log('===================');
        },
        proxyRes: (proxyRes, req, res) => {
            console.log('=== PROXY RESPONSE ===');
            console.log('Status:', proxyRes.statusCode);
            console.log('Status Message:', proxyRes.statusMessage);
            console.log('====================');
        },
        error: (err, req, res) => {
            console.error('=== PROXY ERROR ===');
            console.error('Error:', err.message);
            console.error('Request URL:', req.url);
            console.error('==================');
        }
    }
};

app.use("/", createProxyMiddleware(proxyOptions));

app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
    console.log(`Proxying to: ${TARGET_URL}`);
});