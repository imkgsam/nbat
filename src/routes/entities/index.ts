import express from 'express';
import Employee from './employee'
import Company from './company'
import Person from './person'

const router = express.Router();

router.use('/employee',Employee)
router.use('/company',Company)
router.use('/person',Person)

export default router;
