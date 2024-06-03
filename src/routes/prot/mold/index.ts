import express from 'express';

import Group from './group';
import Item from './item';

const router = express.Router();

router.use('/item',Item)
router.use('/group',Group)


export default router;
