const express = require('express');
const router = express.Router();
const {
  markBulkAttendance,
  getClassAttendance,
  getStudentAttendanceHistory,
  getAllStudentsAttendanceHistory,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/mark-bulk', markBulkAttendance);
router.get('/class', getClassAttendance);
router.get('/history-all', getAllStudentsAttendanceHistory);
router.get('/student/:id', getStudentAttendanceHistory);

module.exports = router;
