import express from 'express';
const router = express.Router();

import loginRoute from './login/index';
import signupRoute from './signup/index';


router.use('/login',loginRoute)
router.use('/signup',signupRoute)

export default router;
