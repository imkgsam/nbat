import express from 'express';
const router = express.Router();

import loginRoute from './auth/index';
import signupRoute from './signup/index';


router.use('/login',loginRoute)
router.use('/signup',signupRoute)

export default router;
