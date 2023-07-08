import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { Product } from "@models/product";
import { displayStatus } from "@utils/displayStatus";