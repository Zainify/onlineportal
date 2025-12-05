import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.js';
import { createUser, deleteUser, listClasses, listRoles, listSubjects, listUsers, updateUserRole } from '../controllers/admin.controller.js';

const router = Router();

router.use(authenticate, authorize(['admin']));

router.get('/users', listUsers);
router.post('/users', createUser);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);


router.get('/roles', listRoles);
router.get('/subjects', listSubjects);
router.get('/classes', listClasses);

export default router;
