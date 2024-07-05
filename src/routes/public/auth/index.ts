import express from 'express';
const router = express.Router();

import email from './email'
import phone from './phone'
import help from './help'


router.use('/email',email)
router.use('/phone', phone);
router.use('/help',help)

export default router;
