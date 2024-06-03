import express from 'express';
//ace:240531:好像不是这么用的吧x-api-key，暂停使用
// import apikey from '../auth/apikey';
// import permission from '../helpers/permission';
// import { Permission } from '../database/model/ApiKey';
import account from './account';
import authorization from '../../../auth/authorization';
import { RoleCodeEnum } from '../../../database/model/Role';
const router = express.Router();

/*---------------------------------------------------------*/
// router.use(apikey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
// router.use(permission(Permission.GENERAL));
/*---------------------------------------------------------*/

router.use(authorization(RoleCodeEnum.ADMIN))

router.use('/account',account)

export default router;
