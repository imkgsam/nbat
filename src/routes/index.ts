import express from 'express';
//ace:240531:好像不是这么用的吧x-api-key，暂停使用
// import apikey from '../auth/apikey';
// import permission from '../helpers/permission';
// import { Permission } from '../database/model/ApiKey';
import requestInsepctor from '../helpers/request';
import publics from './public/publics'
import prot from './prot'
import test from './test'


const router = express.Router();

/*---------------------------------------------------------*/
// router.use(apikey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
// router.use(permission(Permission.GENERAL));
/*---------------------------------------------------------*/
router.use(requestInsepctor)
/*---------------------------------------------------------*/


router.use('/public',publics)
router.use('/prot',prot)
router.use('/test',test)

export default router;
