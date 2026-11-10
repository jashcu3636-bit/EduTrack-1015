const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentStats,
  getAtRiskStudents,
  getStudentById,
  createStudent,
  updateStudent,
  addOrUpdateGrade,
  deleteStudent,
  seedStudents,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All student routes require JWT Authentication
router.use(protect);

router.route('/stats').get(getStudentStats);
router.route('/at-risk').get(getAtRiskStudents);
router.route('/seed').post(seedStudents);

router.route('/').get(getStudents).post(createStudent);

router.route('/:id/grades').post(addOrUpdateGrade);

router
  .route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(authorize('admin'), deleteStudent);

module.exports = router;
