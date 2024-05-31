import express from 'express';
//ace:240531:好像不是这么用的吧x-api-key，暂停使用
// import apikey from '../auth/apikey';
import permission from '../helpers/permission';
import { Permission } from '../database/model/ApiKey';
import requestInsepctor from '../helpers/request';
import user from './access/currentUser';
import token from './access/token';
import credential from './access/credential';
import blog from './blog';
import blogs from './blogs';
import profile from './profile';
import tests from './test';
import roles from './roles';
import department from './department';
import entity from './entities';
import attribute from './item/attribute';
import item from './item';
import route from './routes';
import inccode from './inccode';
import publics from './access/publics'
import account from './account'
import employee from './employee'
import mold from './mold'
import location from './location'

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

router.use('/user', user);

router.use('/token', token);
router.use('/credential', credential);
router.use('/profile', profile);
router.use('/blog', blog);
router.use('/blogs', blogs);
router.use('/roles',roles);
router.use('/entity',entity);
router.use('/department',department)
router.use('/attribute',attribute)
router.use('/item',item)
router.use('/route',route)
router.use('/inccode',inccode)
router.use('/employee',employee)
router.use('/account',account)
router.use('/test',tests);
router.use('/mold',mold)
router.use('/location',location)

export default router;
