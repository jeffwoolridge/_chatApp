import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";

// Base Middleware Setup
export default function applyBaseMiddleware(app) {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static("public"));

    // Session Middleware
    app.use(
        session({
            secret: "supersecretkey",
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/chatapp"
            })
        })
    );
}
