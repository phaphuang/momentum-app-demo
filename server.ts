import express from "express";
import { createServer as createViteServer } from "vite";
import { neon } from "@neondatabase/serverless";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/db-test", async (req, res) => {
    try {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        return res.status(500).json({ error: "DATABASE_URL environment variable is not set" });
      }

      const sql = neon(databaseUrl);
      
      // A simple query to test the connection
      const result = await sql`SELECT version()`;
      
      res.json({ 
        success: true, 
        message: "Successfully connected to Neon database!",
        version: result[0].version
      });
    } catch (error) {
      console.error("Database connection error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to connect to database",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.post("/api/seed", async (req, res) => {
    try {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        return res.status(500).json({ error: "DATABASE_URL environment variable is not set" });
      }
      const sql = neon(databaseUrl);

      // Drop existing tables to apply new schema cleanly
      await sql`DROP TABLE IF EXISTS user_challenges CASCADE`;
      await sql`DROP TABLE IF EXISTS challenges CASCADE`;
      await sql`DROP TABLE IF EXISTS energy_snapshots CASCADE`;
      await sql`DROP TABLE IF EXISTS daily_intake CASCADE`;
      await sql`DROP TABLE IF EXISTS mood_logs CASCADE`;
      await sql`DROP TABLE IF EXISTS biometrics CASCADE`;
      await sql`DROP TABLE IF EXISTS activities CASCADE`;
      await sql`DROP TABLE IF EXISTS users CASCADE`;

      await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

      await sql`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          display_name VARCHAR(255) NOT NULL,
          tree_stage VARCHAR(50) DEFAULT 'Seed',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await sql`
        CREATE TABLE activities (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          type VARCHAR(255) NOT NULL,
          duration_minutes INTEGER NOT NULL,
          intensity_level INTEGER CHECK (intensity_level >= 1 AND intensity_level <= 10),
          energy_drain_score DECIMAL,
          logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await sql`
        CREATE TABLE biometrics (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          source VARCHAR(50) NOT NULL,
          heart_rate_avg INTEGER,
          hrv_score INTEGER,
          sleep_minutes INTEGER,
          spo2_level DECIMAL,
          captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await sql`
        CREATE TABLE mood_logs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 5),
          energy_feeling INTEGER CHECK (energy_feeling >= 1 AND energy_feeling <= 5),
          tags JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await sql`
        CREATE TABLE daily_intake (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          water_ml INTEGER DEFAULT 0,
          protein_grams INTEGER DEFAULT 0,
          fiber_grams INTEGER DEFAULT 0,
          date DATE DEFAULT CURRENT_DATE
        )
      `;

      await sql`
        CREATE TABLE energy_snapshots (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          battery_percentage INTEGER CHECK (battery_percentage >= 0 AND battery_percentage <= 100),
          status VARCHAR(50),
          calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await sql`
        CREATE TABLE challenges (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title VARCHAR(255) NOT NULL,
          goal_type VARCHAR(50) NOT NULL,
          start_date DATE,
          end_date DATE
        )
      `;

      await sql`
        CREATE TABLE user_challenges (
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
          current_progress DECIMAL DEFAULT 0,
          is_completed BOOLEAN DEFAULT FALSE,
          PRIMARY KEY (user_id, challenge_id)
        )
      `;

      // Insert mock data
      const user = await sql`
        INSERT INTO users (email, password_hash, display_name, tree_stage)
        VALUES ('alex@example.com', 'hashed_password_mock', 'Alex', 'Sprout')
        RETURNING id
      `;
      const userId = user[0].id;

      await sql`
        INSERT INTO activities (user_id, type, duration_minutes, intensity_level, energy_drain_score)
        VALUES 
          (${userId}, 'Yoga', 45, 4, 15.5),
          (${userId}, 'Running', 30, 8, 45.0)
      `;

      await sql`
        INSERT INTO biometrics (user_id, source, heart_rate_avg, hrv_score, sleep_minutes, spo2_level)
        VALUES 
          (${userId}, 'AppleHealth', 68, 55, 450, 98.5)
      `;

      await sql`
        INSERT INTO mood_logs (user_id, mood_score, energy_feeling, tags)
        VALUES 
          (${userId}, 4, 3, '["#work", "#post-workout"]'::jsonb)
      `;

      await sql`
        INSERT INTO daily_intake (user_id, water_ml, protein_grams, fiber_grams)
        VALUES 
          (${userId}, 1200, 65, 15)
      `;

      await sql`
        INSERT INTO energy_snapshots (user_id, battery_percentage, status)
        VALUES 
          (${userId}, 72, 'Balanced')
      `;

      const challenge = await sql`
        INSERT INTO challenges (title, goal_type, start_date, end_date)
        VALUES ('7 Days of Sleep', 'Sleep', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days')
        RETURNING id
      `;
      const challengeId = challenge[0].id;

      await sql`
        INSERT INTO user_challenges (user_id, challenge_id, current_progress, is_completed)
        VALUES (${userId}, ${challengeId}, 3.5, false)
      `;
      
      return res.json({ success: true, message: "Database seeded successfully with new schema and mockup data!" });
    } catch (error) {
      console.error("Database seed error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to seed database",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        return res.status(500).json({ error: "DATABASE_URL environment variable is not set" });
      }
      const sql = neon(databaseUrl);
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const users = await sql`SELECT * FROM users WHERE email = ${email}`;
      if (users.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const user = users[0];
      // In a real app, we would verify the password hash using bcrypt or similar.
      // For this prototype, we'll just check if the password matches the mock hash or if it's a simple string match.
      // The seed data uses 'hashed_password_mock' for alex@example.com.
      if (user.password_hash !== password && user.password_hash !== 'hashed_password_mock') {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.display_name,
          treeStage: user.tree_stage
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to login",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.post("/api/log-action", async (req, res) => {
    try {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        return res.status(500).json({ error: "DATABASE_URL environment variable is not set" });
      }
      const sql = neon(databaseUrl);
      const { actionType, userId } = req.body;

      let user;
      if (userId) {
        const users = await sql`SELECT * FROM users WHERE id = ${userId}`;
        if (users.length === 0) {
          return res.status(404).json({ error: "User not found." });
        }
        user = users[0];
      } else {
        // Fetch the first user (mockup)
        const users = await sql`SELECT * FROM users LIMIT 1`;
        if (users.length === 0) {
          return res.status(404).json({ error: "No user found. Please seed the database first." });
        }
        user = users[0];
      }

      // Fetch current energy snapshot
      const energySnapshots = await sql`SELECT * FROM energy_snapshots WHERE user_id = ${user.id} ORDER BY calculated_at DESC LIMIT 1`;
      let currentBattery = energySnapshots.length > 0 ? energySnapshots[0].battery_percentage : 50;

      if (actionType === 'water') {
        // Update daily intake
        await sql`
          UPDATE daily_intake 
          SET water_ml = water_ml + 250 
          WHERE user_id = ${user.id} AND date = CURRENT_DATE
        `;
        // If no row was updated, insert one
        const updatedIntake = await sql`SELECT * FROM daily_intake WHERE user_id = ${user.id} AND date = CURRENT_DATE`;
        if (updatedIntake.length === 0) {
          await sql`
            INSERT INTO daily_intake (user_id, water_ml, date) 
            VALUES (${user.id}, 250, CURRENT_DATE)
          `;
        }
        currentBattery = Math.min(100, currentBattery + 5);
      } else if (actionType === 'rest' || actionType === 'break') {
        currentBattery = Math.min(100, currentBattery + 10);
      }

      // Update energy snapshot
      await sql`
        INSERT INTO energy_snapshots (user_id, battery_percentage, status)
        VALUES (${user.id}, ${currentBattery}, 'Balanced')
      `;

      res.json({ success: true, newBattery: currentBattery });
    } catch (error) {
      console.error("Log action error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to log action",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.get("/api/dashboard-data", async (req, res) => {
    try {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        return res.status(500).json({ error: "DATABASE_URL environment variable is not set" });
      }
      const sql = neon(databaseUrl);
      const { userId } = req.query;

      // Check if users table exists before querying
      const tableCheck = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `;

      if (!tableCheck[0].exists) {
        return res.status(404).json({ error: "Database tables not found. Please seed the database first." });
      }

      let user;
      if (userId) {
        const users = await sql`SELECT * FROM users WHERE id = ${userId}`;
        if (users.length === 0) {
          return res.status(404).json({ error: "User not found." });
        }
        user = users[0];
      } else {
        // Fetch the first user (mockup)
        const users = await sql`SELECT * FROM users LIMIT 1`;
        if (users.length === 0) {
          return res.status(404).json({ error: "No user found. Please seed the database first." });
        }
        user = users[0];
      }

      // Fetch related data
      const energySnapshots = await sql`SELECT * FROM energy_snapshots WHERE user_id = ${user.id} ORDER BY calculated_at DESC LIMIT 1`;
      const biometrics = await sql`SELECT * FROM biometrics WHERE user_id = ${user.id} ORDER BY captured_at DESC LIMIT 1`;
      const dailyIntake = await sql`SELECT * FROM daily_intake WHERE user_id = ${user.id} ORDER BY date DESC LIMIT 1`;
      const activities = await sql`SELECT * FROM activities WHERE user_id = ${user.id} ORDER BY logged_at DESC LIMIT 5`;

      res.json({
        success: true,
        data: {
          user,
          energy: energySnapshots.length > 0 ? energySnapshots[0] : null,
          biometrics: biometrics.length > 0 ? biometrics[0] : null,
          intake: dailyIntake.length > 0 ? dailyIntake[0] : null,
          activities
        }
      });
    } catch (error) {
      console.error("Database fetch error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch user data",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
