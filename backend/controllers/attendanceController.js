const Student = require('../models/Student');

// Helper to get local date in YYYY-MM-DD
const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// @desc    Mark bulk attendance for a class
// @route   POST /api/attendance/mark-bulk
// @access  Private (Faculty & Admin)
const markBulkAttendance = async (req, res, next) => {
  try {
    const { date, department, semester, records } = req.body;

    if (!date || !records || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date and an array of attendance records.',
      });
    }

    const updatedStudents = [];

    for (const record of records) {
      const student = await Student.findOne({
        $or: [{ _id: record.studentId }, { studentId: record.studentId }],
      });

      if (!student) continue;

      // Check if entry for this date already exists
      const existingIndex = student.attendanceRecords.findIndex(
        (entry) => entry.date === date
      );

      const newRecord = {
        date,
        status: record.status || 'Present',
        remarks: record.remarks || '',
        markedBy: req.user ? req.user._id : null,
      };

      if (existingIndex !== -1) {
        student.attendanceRecords[existingIndex] = newRecord;
      } else {
        student.attendanceRecords.push(newRecord);
      }

      // Automatically recalculate attendance percentage
      const totalDays = student.attendanceRecords.length;
      if (totalDays > 0) {
        const presentCount = student.attendanceRecords.filter(
          (r) => r.status === 'Present'
        ).length;
        const lateCount = student.attendanceRecords.filter(
          (r) => r.status === 'Late'
        ).length;
        const calculatedRate = Math.round(
          ((presentCount + lateCount * 0.5) / totalDays) * 100
        );
        student.attendanceRate = Math.min(100, Math.max(0, calculatedRate));
      }

      await student.save();
      updatedStudents.push({
        _id: student._id,
        studentId: student.studentId,
        fullName: student.fullName,
        attendanceRate: student.attendanceRate,
        statusForDate: record.status,
      });
    }

    res.status(200).json({
      success: true,
      message: `Attendance for ${records.length} students recorded for ${date}!`,
      updatedStudents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get class attendance roster for a specific date
// @route   GET /api/attendance/class
// @access  Private
const getClassAttendance = async (req, res, next) => {
  try {
    const { date, department, semester } = req.query;

    const query = {};
    if (department && department !== 'All') query.department = department;
    if (semester && semester !== 'All') query.semester = Number(semester);
    query.status = 'Active';

    const students = await Student.find(query)
      .select('studentId firstName lastName department semester section attendanceRate attendanceRecords')
      .sort({ studentId: 1 });

    const targetDate = date || getLocalDateString();

    const roster = students.map((s) => {
      const recordForDate = s.attendanceRecords.find((r) => r.date === targetDate);
      return {
        _id: s._id,
        studentId: s.studentId,
        firstName: s.firstName,
        lastName: s.lastName,
        fullName: s.fullName,
        department: s.department,
        semester: s.semester,
        section: s.section,
        attendanceRate: s.attendanceRate,
        statusForDate: recordForDate ? recordForDate.status : 'Not Marked',
        remarks: recordForDate ? recordForDate.remarks : '',
      };
    });

    res.status(200).json({
      success: true,
      date: targetDate,
      count: roster.length,
      roster,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student attendance history
// @route   GET /api/attendance/student/:id
// @access  Private
const getStudentAttendanceHistory = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .select('studentId firstName lastName attendanceRate attendanceRecords')
      .populate('attendanceRecords.markedBy', 'name role');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      studentId: student.studentId,
      fullName: student.fullName,
      attendanceRate: student.attendanceRate,
      history: student.attendanceRecords.sort((a, b) => b.date.localeCompare(a.date)),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get previous attendance of ALL students from MongoDB (History matrix & statistics)
// @route   GET /api/attendance/history-all
// @access  Private
const getAllStudentsAttendanceHistory = async (req, res, next) => {
  try {
    const { department, semester, search } = req.query;

    const query = { status: 'Active' };
    if (department && department !== 'All') query.department = department;
    if (semester && semester !== 'All') query.semester = Number(semester);
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ studentId: regex }, { firstName: regex }, { lastName: regex }];
    }

    const students = await Student.find(query)
      .select('studentId firstName lastName department semester section attendanceRate attendanceRecords')
      .sort({ studentId: 1 });

    // Collect all distinct dates sorted chronologically (latest first)
    const allDatesSet = new Set();
    students.forEach((s) => {
      s.attendanceRecords.forEach((r) => {
        if (r.date) allDatesSet.add(r.date);
      });
    });
    const distinctDates = Array.from(allDatesSet).sort((a, b) => b.localeCompare(a));

    // Calculate aggregated records per student
    const records = students.map((s) => {
      const recordsByDate = {};
      let presentCount = 0;
      let absentCount = 0;
      let lateCount = 0;

      s.attendanceRecords.forEach((r) => {
        recordsByDate[r.date] = r.status;
        if (r.status === 'Present') presentCount++;
        else if (r.status === 'Absent') absentCount++;
        else if (r.status === 'Late') lateCount++;
      });

      return {
        _id: s._id,
        studentId: s.studentId,
        firstName: s.firstName,
        lastName: s.lastName,
        fullName: s.fullName,
        department: s.department,
        semester: s.semester,
        section: s.section,
        attendanceRate: s.attendanceRate,
        totalClasses: s.attendanceRecords.length,
        presentCount,
        absentCount,
        lateCount,
        recordsByDate,
      };
    });

    res.status(200).json({
      success: true,
      dates: distinctDates,
      count: records.length,
      records,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markBulkAttendance,
  getClassAttendance,
  getStudentAttendanceHistory,
  getAllStudentsAttendanceHistory,
};
