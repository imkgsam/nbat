import express from 'express';
const router = express.Router();

import email from './email'
import phone from './phone'

router.use('/email',email)
router.use('/phone', phone);

export default router;
