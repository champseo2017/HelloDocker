import express, { Express, urlencoded, json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import path from 'path';

dotenv.config();
const url = process.env.URL_DEV;
const allowedOrigins = [url];

const middlewaresConfig = (app: Express) => {
  // Serve static files from the "uploads" directory
  app.use('/uploads', express.static(path.join(__dirname, '../controllers/product/uploads')));

  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(cookieParser());
  app.use(compression());
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(helmet.frameguard({ action: "deny" }));
  app.disable("x-powered-by");
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          var msg =
            "The CORS policy for this site does not " +
            "allow access from the specified Origin.";
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      credentials: true,
    })
  );
};

export default middlewaresConfig;