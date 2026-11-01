const mongoose = require('mongoose');
const Student = require('../models/Student');

// Handle asynchronous errors
const wrap = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// CREATE STUDENT
exports.createStudent = wrap(async (req, res) => {
  console.log('Received student data:', req.body);

  const {
    name,
    email,
    prn,
    mobile,
    course,
    department,
    year
  } = req.body;

  const data = await Student.create({
    name,
    email,
    prn: String(prn || '').trim(),
    mobile: String(mobile || '').trim(),
    course,
    department,
    year: Number(year)
  });

  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data
  });
});

// GET ALL STUDENTS (Search, Filter, Sort, Pagination)
exports.getAllStudents = wrap(async (req, res) => {
  const {
    search = '',
    course = '',
    sort = 'newest'
  } = req.query;

  const page = Math.max(
    parseInt(req.query.page, 10) || 1,
    1
  );

  const limit = Math.min(
    Math.max(parseInt(req.query.limit, 10) || 10, 1),
    100
  );

  const filter = {};

  if (course) {
    filter.course = course;
  }

  if (search.trim()) {
    const searchTerm = search.trim();

    filter.$or = [
      { name: { $regex: searchTerm, $options: 'i' } },
      { email: { $regex: searchTerm, $options: 'i' } },
      { prn: { $regex: searchTerm, $options: 'i' } }
    ];
  }

  const sorts = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    name_asc: { name: 1 },
    name_desc: { name: -1 }
  };

  const [data, total] = await Promise.all([
    Student.find(filter)
      .sort(sorts[sort] || sorts.newest)
      .skip((page - 1) * limit)
      .limit(limit),

    Student.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    count: data.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data
  });
});

// GET STUDENT BY ID
exports.getStudentById = wrap(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid student ID format'
    });
  }

  const data = await Student.findById(req.params.id);

  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }

  res.status(200).json({
    success: true,
    data
  });
});

// UPDATE STUDENT
exports.updateStudent = wrap(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid student ID format'
    });
  }

  const data = await Student.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      prn: String(req.body.prn || '').trim(),
      mobile: String(req.body.mobile || '').trim(),
      year: Number(req.body.year)
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Student updated successfully',
    data
  });
});

// DELETE STUDENT
exports.deleteStudent = wrap(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid student ID format'
    });
  }

  const data = await Student.findByIdAndDelete(req.params.id);

  if (!data) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Student deleted successfully',
    data
  });
});
