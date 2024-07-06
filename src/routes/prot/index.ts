import express from 'express';
//ace:240531:好像不是这么用的吧x-api-key，暂停使用
// import apikey from '../auth/apikey';
// import permission from '../helpers/permission';
// import { Permission } from '../database/model/ApiKey';
import user from './currentUser';
import token from './token';
import credential from './credential';
import profile from './profile';
import roles from './roles';
import department from './department';
import entity from './entities';
import attribute from './item/attribute';
import item from './item';
import route from './routes';
import inccode from './inccode';
import account from './account';
import employee from './employee';
import mold from './mold';
import location from './location';
import authentication from '../../auth/authentication';

const router = express.Router();

/*---------------------------------------------------------*/
// router.use(apikey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
// router.use(permission(Permission.GENERAL));
/*---------------------------------------------------------*/
router.use('/token', token);

//----------------------------------------------------------------
router.use(authentication);
//----------------------------------------------------------------

router.use('/user', user);
router.use('/credential', credential);
router.use('/profile', profile);
router.use('/roles',roles);
router.use('/entity',entity);
router.use('/department',department)
router.use('/attribute',attribute)
router.use('/item',item)
router.use('/route',route)
router.use('/inccode',inccode)
router.use('/employee',employee)
router.use('/account',account)
router.use('/mold',mold)
router.use('/location',location)

export default router;
