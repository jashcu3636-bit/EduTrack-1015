const Student = require('../models/Student');

// Helper to calculate grade letter and points
const calculateGradePoint = (marks) => {
  if (marks >= 90) return { grade: 'A+', points: 10.0 };
  if (marks >= 80) return { grade: 'A', points: 9.0 };
  if (marks >= 70) return { grade: 'B+', points: 8.0 };
  if (marks >= 60) return { grade: 'B', points: 7.0 };
  if (marks >= 50) return { grade: 'C', points: 6.0 };
  if (marks >= 40) return { grade: 'D', points: 5.0 };
  return { grade: 'F', points: 0.0 };
};

// @desc    Get all students with search, filters, pagination, and sorting
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res, next) => {
  try {
    const {
      search,
      department,
      semester,
      status,
      feeStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Search by studentId, firstName, lastName, email
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { studentId: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }

    // Filter by department
    if (department && department !== 'All') {
      query.department = department;
    }

    // Filter by semester
    if (semester && semester !== 'All') {
      query.semester = Number(semester);
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by feeStatus
    if (feeStatus && feeStatus !== 'All') {
      query.feeStatus = feeStatus;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const totalStudents = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email role');

    res.status(200).json({
      success: true,
      count: students.length,
      totalStudents,
      totalPages: Math.ceil(totalStudents / limitNum) || 1,
      currentPage: pageNum,
      students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics & statistical overview
// @route   GET /api/students/stats
// @access  Private
const getStudentStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'Active' });
    const atRiskCount = await Student.countDocuments({
      status: 'Active',
      $or: [{ attendanceRate: { $lt: 75 } }, { cgpa: { $lt: 6.0 } }],
    });

    // Aggregate average CGPA & attendance
    const cgpaAgg = await Student.aggregate([
      {
        $group: {
          _id: null,
          avgCgpa: { $avg: '$cgpa' },
          avgAttendance: { $avg: '$attendanceRate' },
        },
      },
    ]);

    const avgCgpa = cgpaAgg.length > 0 ? cgpaAgg[0].avgCgpa.toFixed(2) : '0.00';
    const avgAttendance =
      cgpaAgg.length > 0 ? cgpaAgg[0].avgAttendance.toFixed(1) : '0';

    // Department breakdown
    const departmentStats = await Student.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Status breakdown
    const statusStats = await Student.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Top performers (CGPA >= 8.5)
    const topPerformers = await Student.find({ status: 'Active' })
      .sort({ cgpa: -1 })
      .limit(5)
      .select('studentId firstName lastName department semester cgpa attendanceRate avatar');

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        atRiskCount,
        avgCgpa: parseFloat(avgCgpa),
        avgAttendance: parseFloat(avgAttendance),
        departmentBreakdown: departmentStats.map((item) => ({
          department: item._id || 'Unassigned',
          count: item.count,
        })),
        statusBreakdown: statusStats.map((item) => ({
          status: item._id || 'Unknown',
          count: item.count,
        })),
        topPerformers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get at-risk students (Attendance < 75% or CGPA < 6.0)
// @route   GET /api/students/at-risk
// @access  Private
const getAtRiskStudents = async (req, res, next) => {
  try {
    const atRiskStudents = await Student.find({
      status: 'Active',
      $or: [{ attendanceRate: { $lt: 75 } }, { cgpa: { $lt: 6.0 } }],
    }).sort({ attendanceRate: 1, cgpa: 1 });

    res.status(200).json({
      success: true,
      count: atRiskStudents.length,
      students: atRiskStudents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('attendanceRecords.markedBy', 'name role');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new student
// @route   POST /api/students
// @access  Private
const createStudent = async (req, res, next) => {
  try {
    const {
      studentId,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      department,
      semester,
      section,
      cgpa,
      attendanceRate,
      status,
      feeStatus,
      address,
      guardian,
    } = req.body;

    const existingStudent = await Student.findOne({
      $or: [{ studentId: studentId.toUpperCase() }, { email: email.toLowerCase() }],
    });

    if (existingStudent) {
      const matchField =
        existingStudent.studentId === studentId.toUpperCase()
          ? 'Student ID / Roll No'
          : 'Email address';
      return res.status(400).json({
        success: false,
        message: `${matchField} already registered to another student.`,
      });
    }

    const student = await Student.create({
      studentId,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      department,
      semester,
      section: section || 'A',
      cgpa: cgpa !== undefined ? Number(cgpa) : 0,
      attendanceRate: attendanceRate !== undefined ? Number(attendanceRate) : 85,
      status: status || 'Active',
      feeStatus: feeStatus || 'Paid',
      address: address || {},
      guardian: guardian || {},
      createdBy: req.user ? req.user._id : null,
    });

    res.status(201).json({
      success: true,
      message: 'Student added successfully!',
      student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student details
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = async (req, res, next) => {
  try {
    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    // Check unique constraints if studentId or email changed
    if (req.body.studentId && req.body.studentId.toUpperCase() !== student.studentId) {
      const idExists = await Student.findOne({
        studentId: req.body.studentId.toUpperCase(),
        _id: { $ne: req.params.id },
      });
      if (idExists) {
        return res.status(400).json({
          success: false,
          message: 'Student ID / Roll No is already in use by another student.',
        });
      }
    }

    if (req.body.email && req.body.email.toLowerCase() !== student.email) {
      const emailExists = await Student.findOne({
        email: req.body.email.toLowerCase(),
        _id: { $ne: req.params.id },
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email address is already in use by another student.',
        });
      }
    }

    student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Student record updated successfully!',
      student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update subject grade and recalculate CGPA
// @route   POST /api/students/:id/grades
// @access  Private (Faculty & Admin)
const addOrUpdateGrade = async (req, res, next) => {
  try {
    const { subjectCode, subjectName, marks, credits = 3, semester } = req.body;

    if (!subjectCode || !subjectName || marks === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject code, subject name, and marks (0-100).',
      });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    const { grade, points } = calculateGradePoint(Number(marks));

    // Check if grade for this subject code already exists
    const existingIndex = student.grades.findIndex(
      (g) => g.subjectCode.toUpperCase() === subjectCode.toUpperCase()
    );

    const gradeEntry = {
      subjectCode: subjectCode.toUpperCase().trim(),
      subjectName: subjectName.trim(),
      marks: Number(marks),
      grade,
      credits: Number(credits) || 3,
      semester: Number(semester) || student.semester,
      addedAt: new Date(),
    };

    if (existingIndex !== -1) {
      student.grades[existingIndex] = gradeEntry;
    } else {
      student.grades.push(gradeEntry);
    }

    // Automatically recalculate student's CGPA based on weighted credits
    let totalWeightedPoints = 0;
    let totalCredits = 0;

    for (const g of student.grades) {
      const p = calculateGradePoint(g.marks).points;
      const c = g.credits || 3;
      totalWeightedPoints += p * c;
      totalCredits += c;
    }

    if (totalCredits > 0) {
      student.cgpa = parseFloat((totalWeightedPoints / totalCredits).toFixed(2));
    }

    await student.save();

    res.status(200).json({
      success: true,
      message: `Grade for ${subjectCode.toUpperCase()} saved! Updated CGPA: ${student.cgpa}`,
      grades: student.grades,
      cgpa: student.cgpa,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student record (Admin Only)
// @route   DELETE /api/students/:id
// @access  Private (Admin Role Enforced)
const deleteStudent = async (req, res, next) => {
  try {
    // RBAC: Only Admin can delete student records
    if (req.user && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message:
          'Access Denied: Only Admins have permission to permanently delete student records. Faculty members have attendance and evaluation rights.',
      });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Student '${student.firstName} ${student.lastName}' (${student.studentId}) removed successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed demo student data for testing/demo
// @route   POST /api/students/seed
// @access  Private
const seedStudents = async (req, res, next) => {
  try {
    const getLocalDate = (d = new Date()) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const d0 = getLocalDate(new Date()); // Today (2026-11-04)
    const d1 = getLocalDate(new Date(Date.now() - 1 * 86400000));
    const d2 = getLocalDate(new Date(Date.now() - 2 * 86400000));
    const d3 = getLocalDate(new Date(Date.now() - 3 * 86400000));
    const d4 = getLocalDate(new Date(Date.now() - 4 * 86400000));

    const demoStudents = [
      {
        studentId: 'CS2024-001',
        firstName: 'Aarav',
        lastName: 'Sharma',
        email: 'aarav.sharma@example.edu',
        phone: '+91 98765 43210',
        dateOfBirth: '2003-05-14',
        gender: 'Male',
        department: 'Computer Science',
        semester: 6,
        section: 'A',
        cgpa: 9.2,
        attendanceRate: 95,
        status: 'Active',
        feeStatus: 'Paid',
        address: { city: 'Bengaluru', state: 'Karnataka', zipCode: '560001' },
        guardian: { name: 'Rajesh Sharma', relation: 'Father', phone: '+91 98765 00001' },
        grades: [
          { subjectCode: 'CS601', subjectName: 'Cloud Computing', marks: 94, grade: 'A+', credits: 4, semester: 6 },
          { subjectCode: 'CS602', subjectName: 'Machine Learning', marks: 89, grade: 'A', credits: 4, semester: 6 },
        ],
        attendanceRecords: [
          { date: d0, status: 'Present' },
          { date: d1, status: 'Present' },
          { date: d2, status: 'Present' },
          { date: d3, status: 'Present' },
          { date: d4, status: 'Late', remarks: 'Bus delay' },
        ],
      },
      {
        studentId: 'IT2024-015',
        firstName: 'Ananya',
        lastName: 'Patel',
        email: 'ananya.patel@example.edu',
        phone: '+91 98123 45678',
        dateOfBirth: '2004-02-20',
        gender: 'Female',
        department: 'Information Technology',
        semester: 4,
        section: 'B',
        cgpa: 8.8,
        attendanceRate: 85,
        status: 'Active',
        feeStatus: 'Paid',
        address: { city: 'Ahmedabad', state: 'Gujarat', zipCode: '380001' },
        guardian: { name: 'Vikram Patel', relation: 'Father', phone: '+91 98123 00002' },
        grades: [
          { subjectCode: 'IT401', subjectName: 'Operating Systems', marks: 88, grade: 'A', credits: 4, semester: 4 },
        ],
        attendanceRecords: [
          { date: d0, status: 'Present' },
          { date: d1, status: 'Late' },
          { date: d2, status: 'Present' },
          { date: d3, status: 'Absent', remarks: 'Family function' },
          { date: d4, status: 'Present' },
        ],
      },
      {
        studentId: 'AI2024-042',
        firstName: 'Rohan',
        lastName: 'Verma',
        email: 'rohan.verma@example.edu',
        phone: '+91 98234 56789',
        dateOfBirth: '2003-11-09',
        gender: 'Male',
        department: 'Data Science & AI',
        semester: 6,
        section: 'A',
        cgpa: 9.6,
        attendanceRate: 100,
        status: 'Active',
        feeStatus: 'Paid',
        address: { city: 'Pune', state: 'Maharashtra', zipCode: '411001' },
        guardian: { name: 'Sunita Verma', relation: 'Mother', phone: '+91 98234 00003' },
        grades: [
          { subjectCode: 'AI601', subjectName: 'Deep Neural Networks', marks: 98, grade: 'A+', credits: 4, semester: 6 },
        ],
        attendanceRecords: [
          { date: d0, status: 'Present' },
          { date: d1, status: 'Present' },
          { date: d2, status: 'Present' },
          { date: d3, status: 'Present' },
          { date: d4, status: 'Present' },
        ],
      },
      {
        studentId: 'EC2024-108',
        firstName: 'Diya',
        lastName: 'Nair',
        email: 'diya.nair@example.edu',
        phone: '+91 98345 67890',
        dateOfBirth: '2004-07-25',
        gender: 'Female',
        department: 'Electronics & Comm.',
        semester: 4,
        section: 'A',
        cgpa: 8.4,
        attendanceRate: 90,
        status: 'Active',
        feeStatus: 'Pending',
        address: { city: 'Kochi', state: 'Kerala', zipCode: '682001' },
        guardian: { name: 'Murugan Nair', relation: 'Father', phone: '+91 98345 00004' },
        attendanceRecords: [
          { date: d0, status: 'Present' },
          { date: d1, status: 'Present' },
          { date: d2, status: 'Present' },
          { date: d3, status: 'Late' },
          { date: d4, status: 'Present' },
        ],
      },
      {
        studentId: 'ME2024-071',
        firstName: 'Dev',
        lastName: 'Kapoor',
        email: 'dev.kapoor@example.edu',
        phone: '+91 98456 11223',
        dateOfBirth: '2003-10-10',
        gender: 'Male',
        department: 'Mechanical Engineering',
        semester: 4,
        section: 'A',
        cgpa: 5.7,
        attendanceRate: 50,
        status: 'Active',
        feeStatus: 'Overdue',
        address: { city: 'Delhi', state: 'Delhi', zipCode: '110001' },
        guardian: { name: 'Sunil Kapoor', relation: 'Father', phone: '+91 98456 00010' },
        attendanceRecords: [
          { date: d0, status: 'Absent', remarks: 'Unexcused' },
          { date: d1, status: 'Absent', remarks: 'Unexcused' },
          { date: d2, status: 'Present' },
          { date: d3, status: 'Absent' },
          { date: d4, status: 'Present' },
        ],
      },
      {
        studentId: 'CS2024-055',
        firstName: 'Priya',
        lastName: 'Sundaram',
        email: 'priya.sundaram@example.edu',
        phone: '+91 98567 89012',
        dateOfBirth: '2004-01-30',
        gender: 'Female',
        department: 'Computer Science',
        semester: 2,
        section: 'C',
        cgpa: 9.1,
        attendanceRate: 95,
        status: 'Active',
        feeStatus: 'Paid',
        address: { city: 'Chennai', state: 'Tamil Nadu', zipCode: '600001' },
        guardian: { name: 'G. Sundaram', relation: 'Father', phone: '+91 98567 00006' },
        attendanceRecords: [
          { date: d0, status: 'Present' },
          { date: d1, status: 'Present' },
          { date: d2, status: 'Present' },
          { date: d3, status: 'Present' },
          { date: d4, status: 'Present' },
        ],
      },
    ];

    for (const studentData of demoStudents) {
      await Student.findOneAndUpdate(
        { studentId: studentData.studentId },
        { ...studentData, createdBy: req.user ? req.user._id : null },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'Demo students with grades and attendance seeded successfully!',
      count: demoStudents.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudentStats,
  getAtRiskStudents,
  getStudentById,
  createStudent,
  updateStudent,
  addOrUpdateGrade,
  deleteStudent,
  seedStudents,
};
