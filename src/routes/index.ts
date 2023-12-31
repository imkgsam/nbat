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
import employee from './entities/employee';

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
router.use('/test',tests);
router.use('/roles',roles);
router.use('/entity',entity);
router.use('/department',department)
router.use('/employee',employee)

export default router;
