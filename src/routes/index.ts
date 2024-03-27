import express from 'express';
import apikey from '../auth/apikey';
import permission from '../helpers/permission';
import { Permission } from '../database/model/ApiKey';
import requestInsepctor from '../helpers/request';
import user from './access/user';
import token from './access/token';
import credential from './access/credential';
import blog from './blog';
import blogs from './blogs';
import profile from './profile';
import tests from './test';
import roles from './roles';
import department from './department';
import entity from './entities/entity';
import users from './entities/user'
import employee from './entities/employee';
import attribute from './item/attribute';
import item from './item';
import route from './routes';
import barcode from './barcode';

const router = express.Router();


/*---------------------------------------------------------*/
// router.use(apikey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
// router.use(permission(Permission.GENERAL));
/*---------------------------------------------------------*/
router.use(requestInsepctor)
/*---------------------------------------------------------*/

router.use('/user', user);

router.use('/token', token);
router.use('/credential', credential);
router.use('/profile', profile);
router.use('/blog', blog);
router.use('/blogs', blogs);
router.use('/roles',roles);
router.use('/entity',entity);
router.use('/department',department)
router.use('/employee',employee)
router.use('/users',users)
router.use('/attribute',attribute)
router.use('/item',item)
router.use('/route',route)
router.use('/barcode',barcode)

router.use('/test',tests);

export default router;
