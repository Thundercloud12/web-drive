
import express from 'express';
import { getStats } from '../controllers/statController.js';
const router = express.Router();

router.get('/', getStats);
export default router;
