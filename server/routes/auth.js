import express from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'academic_portal_secret_key_2026';
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'admin2026';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// 1. Student Login
router.post('/student/login', (req, res) => {
  const { identifier, password } = req.body; // email or studentId
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Please provide Student Roll No / Email and password.' });
  }

  const users = db.getUsers();
  const student = users.find(
    u => u.role === 'student' && 
    (u.email.toLowerCase() === identifier.toLowerCase() || (u.studentId && u.studentId.toLowerCase() === identifier.toLowerCase()))
  );

  if (!student || student.password !== password) {
    return res.status(401).json({ error: 'Invalid Student credentials. (Default demo: hari@campus.edu or CS2026-042 / student123)' });
  }

  const token = generateToken(student);
  const { password: _, ...userSafe } = student;
  res.json({ success: true, user: userSafe, token, role: 'student' });
});

// Student Registration
router.post('/student/register', (req, res) => {
  const { name, email, studentId, department, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const users = db.getUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const newStudent = {
    id: `usr-student-${Date.now()}`,
    name,
    email,
    password,
    role: 'student',
    studentId: studentId || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
    department: department || 'General Sciences',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  };

  users.push(newStudent);
  db.saveUsers(users);

  const token = generateToken(newStudent);
  const { password: _, ...userSafe } = newStudent;
  res.status(201).json({ success: true, user: userSafe, token, role: 'student' });
});

// 2. Faculty Login
router.post('/faculty/login', (req, res) => {
  const { identifier, password } = req.body; // email or staffId
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Please provide Faculty Staff ID / Email and password.' });
  }

  const users = db.getUsers();
  const faculty = users.find(
    u => u.role === 'faculty' && 
    (u.email.toLowerCase() === identifier.toLowerCase() || (u.staffId && u.staffId.toLowerCase() === identifier.toLowerCase()))
  );

  if (!faculty || faculty.password !== password) {
    return res.status(401).json({ error: 'Invalid Faculty credentials. (Default demo: svance@campus.edu or FAC-AI-108 / faculty123)' });
  }

  const token = generateToken(faculty);
  const { password: _, ...userSafe } = faculty;
  res.json({ success: true, user: userSafe, token, role: 'faculty' });
});

// Faculty Registration
router.post('/faculty/register', (req, res) => {
  const { name, email, staffId, department, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const users = db.getUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const newFaculty = {
    id: `usr-faculty-${Date.now()}`,
    name,
    email,
    password,
    role: 'faculty',
    staffId: staffId || `FAC-${Math.floor(100 + Math.random() * 900)}`,
    department: department || 'Department of Computing & AI',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  };

  users.push(newFaculty);
  db.saveUsers(users);

  const token = generateToken(newFaculty);
  const { password: _, ...userSafe } = newFaculty;
  res.status(201).json({ success: true, user: userSafe, token, role: 'faculty' });
});

// 3. Admin Login (Requires Administrator Key / Credentials)
router.post('/admin/login', (req, res) => {
  const { email, password, adminKey } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Administrator email and password required.' });
  }

  if (adminKey && adminKey !== ADMIN_SECRET_KEY) {
    return res.status(403).json({ error: 'Invalid Administrator Security Key.' });
  }

  const users = db.getUsers();
  const admin = users.find(
    u => u.role === 'admin' && u.email.toLowerCase() === email.toLowerCase()
  );

  if (!admin || admin.password !== password) {
    return res.status(401).json({ error: 'Invalid Administrator credentials. (Default demo: admin@campus.edu / admin123 with key: admin2026)' });
  }

  const token = generateToken(admin);
  const { password: _, ...userSafe } = admin;
  res.json({ success: true, user: userSafe, token, role: 'admin' });
});

export default router;
