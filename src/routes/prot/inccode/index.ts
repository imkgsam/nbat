import express from 'express';

import Item from './item';
import Type from './type';

const router = express.Router();

router.use('/item',Item)
router.use('/type',Type)


export default router;
