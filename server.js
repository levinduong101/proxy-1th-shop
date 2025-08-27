// server.js
import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const TARGET_URL = process.env.TARGET_URL || "https://merch-base.prowerb.digital";

// Allow CORS for all origins
app.use(cors());

// Proxy middleware
app.use(
    "/",
    createProxyMiddleware({
        target: TARGET_URL,
        changeOrigin: true,
        secure: true,
        selfHandleResponse: false,
        onProxyReq: (proxyReq, req) => {
            // Add Auth header
            const token = process.env.ACCESS_UPLOAD_TOKEN;
            if (token) {
                proxyReq.setHeader("Authorization", `Bearer ${token}`);
            }
        },
        pathRewrite: (path) => path,
    })
);

app.listen(PORT, () => {
    console.log(`Proxy server running at port ${PORT}, target at ${TARGET_URL}`);
});
