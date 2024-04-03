import express from 'express';

import Group from './group';
import Item from './item';

const router = express.Router();

router.use('/item',Group)
router.use('/group',Item)


export default router;
