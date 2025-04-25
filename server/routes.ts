import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';

// Multer setup for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.cwd(), 'uploads'));
    },
    filename: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDFs and images
    if (file.mimetype === 'application/pdf' || 
        file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and images are allowed.') as any);
    }
  }
});

// Ensure uploads directory exists
(async () => {
  try {
    await fs.mkdir(path.join(process.cwd(), 'uploads'), { recursive: true });
  } catch (error) {
    console.error('Error creating uploads directory:', error);
  }
})();

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'hostel-management-secret-key';

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize storage
  await storage.init();

  // Authentication middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };

  // Role-based authorization middleware
  const authorize = (roles: string[]) => {
    return (req: any, res: any, next: any) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access forbidden' });
      }
      next();
    };
  };

  // API Routes
  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password, role, rollNo } = req.body;
      
      // Validate input
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const userId = await storage.createUser({
        name,
        email,
        password: hashedPassword,
        role,
        rollNo: role === 'student' ? rollNo : undefined
      });
      
      return res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Server error during registration' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password, role } = req.body;
      
      // Validate input
      if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password and role are required' });
      }
      
      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user || user.role !== role) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Create token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      // Return user info (excluding password)
      const { password: _, ...userInfo } = user;
      return res.status(200).json(userInfo);
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Server error during login' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully' });
  });

  app.get('/api/auth/current-user', authenticate, (req: any, res) => {
    return res.status(200).json(req.user);
  });

  // Student routes
  app.get('/api/student/dashboard', authenticate, authorize(['student']), async (req: any, res) => {
    try {
      // Get student details
      const student = await storage.getStudentById(req.user.id);
      
      // Get application if exists
      const application = await storage.getApplicationByStudentId(req.user.id);
      
      // Get allotment if exists
      const allotment = await storage.getAllotmentByStudentId(req.user.id);
      
      // Get notices
      const notices = await storage.getNotices();
      
      return res.status(200).json({
        student,
        application,
        allotment,
        notices
      });
    } catch (error) {
      console.error('Error fetching student dashboard:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/student/application', authenticate, authorize(['student']), upload.single('marksheet'), async (req: any, res) => {
    try {
      const { name, class: className, rollNo, cgpa, address, mobileNumber, parentMobile, email, category, agreeToRules } = req.body;
      
      // Validate input
      if (!name || !className || !rollNo || !cgpa || !address || !mobileNumber || !parentMobile || !email || !category) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      
      if (agreeToRules !== 'true') {
        return res.status(400).json({ message: 'You must agree to the rules and regulations' });
      }
      
      // Check if student already has an application
      const existingApplication = await storage.getApplicationByStudentId(req.user.id);
      if (existingApplication) {
        return res.status(409).json({ message: 'You have already submitted an application' });
      }
      
      // Generate application ID
      const applicationId = `HOSTEL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Get file path if uploaded
      const marksheetUrl = req.file ? `/uploads/${req.file.filename}` : null;
      
      // Create application
      const application = await storage.createApplication({
        studentId: req.user.id,
        applicationId,
        name,
        class: className,
        rollNo,
        cgpa: parseFloat(cgpa),
        address,
        mobileNumber,
        parentMobile,
        email,
        category,
        marksheetUrl,
        status: 'pending',
        createdAt: new Date()
      });
      
      return res.status(201).json(application);
    } catch (error) {
      console.error('Error submitting application:', error);
      return res.status(500).json({ message: 'Server error during application submission' });
    }
  });

  app.post('/api/student/complaint', authenticate, authorize(['student']), async (req: any, res) => {
    try {
      const { subject, category, description, roomNumber, priority } = req.body;
      
      // Validate input
      if (!subject || !category || !description || !priority) {
        return res.status(400).json({ message: 'Subject, category, description and priority are required' });
      }
      
      // Create complaint
      const complaint = await storage.createComplaint({
        studentId: req.user.id,
        studentName: req.user.name,
        subject,
        category,
        description,
        roomNumber: roomNumber || null,
        priority,
        status: 'pending',
        createdAt: new Date()
      });
      
      return res.status(201).json(complaint);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      return res.status(500).json({ message: 'Server error during complaint submission' });
    }
  });

  app.post('/api/student/contact-rector', authenticate, authorize(['student']), async (req: any, res) => {
    try {
      const { subject, messageType, message } = req.body;
      
      // Validate input
      if (!subject || !messageType || !message) {
        return res.status(400).json({ message: 'Subject, message type and message are required' });
      }
      
      // Create message
      const contactMessage = await storage.createRectorMessage({
        studentId: req.user.id,
        studentName: req.user.name,
        subject,
        messageType,
        message,
        status: 'unread',
        createdAt: new Date()
      });
      
      return res.status(201).json(contactMessage);
    } catch (error) {
      console.error('Error sending message to rector:', error);
      return res.status(500).json({ message: 'Server error during message submission' });
    }
  });

  app.post('/api/student/help-question', authenticate, authorize(['student']), async (req: any, res) => {
    try {
      const { subject, question } = req.body;
      
      // Validate input
      if (!subject || !question) {
        return res.status(400).json({ message: 'Subject and question are required' });
      }
      
      // Create help question
      const helpQuestion = await storage.createHelpQuestion({
        studentId: req.user.id,
        studentName: req.user.name,
        subject,
        question,
        status: 'pending',
        createdAt: new Date()
      });
      
      return res.status(201).json(helpQuestion);
    } catch (error) {
      console.error('Error submitting help question:', error);
      return res.status(500).json({ message: 'Server error during question submission' });
    }
  });

  app.post('/api/profile/upload-image', authenticate, upload.single('profileImage'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
      }
      
      const profileImageUrl = `/uploads/${req.file.filename}`;
      
      // Update user profile image
      await storage.updateUserProfileImage(req.user.id, profileImageUrl);
      
      return res.status(200).json({ profileImage: profileImageUrl });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return res.status(500).json({ message: 'Server error during image upload' });
    }
  });

  // Faculty routes
  app.get('/api/faculty/dashboard', authenticate, authorize(['faculty']), async (req, res) => {
    try {
      // Get dashboard stats
      const stats = {
        pendingApplications: await storage.countPendingApplications(),
        totalAllottedStudents: await storage.countAllottedStudents(),
        unresolvedComplaints: await storage.countUnresolvedComplaints()
      };
      
      // Get recent applications
      const recentApplications = await storage.getRecentApplications();
      
      // Get room statistics
      const roomStats = {
        totalRooms: 100, // Example data, replace with actual data from storage
        occupiedRooms: 65,
        partiallyOccupiedRooms: 15,
        vacantRooms: 20,
        blocks: [
          { name: 'A Block', occupancyPercentage: 90 },
          { name: 'B Block', occupancyPercentage: 85 },
          { name: 'C Block', occupancyPercentage: 70 },
          { name: 'D Block', occupancyPercentage: 60 }
        ]
      };
      
      // Get notifications
      const notifications = await storage.getNotifications();
      
      return res.status(200).json({
        stats,
        recentApplications,
        roomStats,
        notifications
      });
    } catch (error) {
      console.error('Error fetching faculty dashboard:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/faculty/applications/:status?', authenticate, authorize(['faculty']), async (req, res) => {
    try {
      const status = req.params.status;
      
      // Get applications based on status
      const applications = await storage.getApplicationsByStatus(status);
      
      // Get application summary
      const summary = {
        pending: await storage.countPendingApplications(),
        allotted: await storage.countAllottedStudents(),
        availableBeds: 300 - await storage.countAllottedStudents(), // Example, replace with actual calculation
        totalStudents: await storage.countTotalStudents()
      };
      
      return res.status(200).json({
        applications,
        summary
      });
    } catch (error) {
      console.error('Error fetching applications:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/faculty/applications/:id', authenticate, authorize(['faculty']), async (req, res) => {
    try {
      const applicationId = req.params.id;
      
      // Get application details
      const application = await storage.getApplicationById(applicationId);
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      return res.status(200).json(application);
    } catch (error) {
      console.error('Error fetching application details:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/faculty/allot-room/:applicationId', authenticate, authorize(['faculty']), async (req: any, res) => {
    try {
      const { applicationId } = req.params;
      const { hostelBuilding, roomNumber, bedNumber } = req.body;
      
      // Validate input
      if (!hostelBuilding || !roomNumber || !bedNumber) {
        return res.status(400).json({ message: 'Hostel building, room number, and bed number are required' });
      }
      
      // Get application
      const application = await storage.getApplicationById(applicationId);
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      // Check if application is already allotted
      if (application.status === 'approved') {
        return res.status(409).json({ message: 'Application is already allotted' });
      }
      
      // Check if room/bed is available
      const isAvailable = await storage.checkRoomAvailability(hostelBuilding, roomNumber, bedNumber);
      if (!isAvailable) {
        return res.status(409).json({ message: 'Room or bed is already occupied' });
      }
      
      // Create allotment
      const allotment = await storage.createAllotment({
        studentId: application.studentId,
        applicationId,
        hostelBuilding,
        roomNumber,
        bedNumber,
        floor: roomNumber.charAt(0), // Assuming room number format is like "101" where first digit is floor
        allotmentDate: new Date(),
        status: 'active'
      });
      
      // Update application status
      await storage.updateApplicationStatus(applicationId, 'approved');
      
      return res.status(201).json(allotment);
    } catch (error) {
      console.error('Error allotting room:', error);
      return res.status(500).json({ message: 'Server error during room allotment' });
    }
  });

  app.get('/api/faculty/complaints/:status?', authenticate, authorize(['faculty']), async (req, res) => {
    try {
      const status = req.params.status;
      
      // Get complaints based on status
      const complaints = await storage.getComplaintsByStatus(status);
      
      // Get complaint summary
      const summary = {
        pending: await storage.countComplaintsByStatus('pending'),
        inProgress: await storage.countComplaintsByStatus('in-progress'),
        resolved: await storage.countComplaintsByStatus('resolved'),
        cancelled: await storage.countComplaintsByStatus('cancelled')
      };
      
      return res.status(200).json({
        complaints,
        summary
      });
    } catch (error) {
      console.error('Error fetching complaints:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  app.patch('/api/faculty/complaints/:complaintId', authenticate, authorize(['faculty']), async (req, res) => {
    try {
      const { complaintId } = req.params;
      const { status, response } = req.body;
      
      // Validate input
      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }
      
      // Update complaint
      const updatedComplaint = await storage.updateComplaint(complaintId, {
        status,
        response,
        resolvedAt: status === 'resolved' ? new Date() : undefined
      });
      
      return res.status(200).json(updatedComplaint);
    } catch (error) {
      console.error('Error updating complaint:', error);
      return res.status(500).json({ message: 'Server error during complaint update' });
    }
  });

  // Contact form on homepage
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      // Validate input
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      
      // Store contact message
      const contactMessage = await storage.createContactMessage({
        name,
        email,
        subject,
        message,
        status: 'unread',
        createdAt: new Date()
      });
      
      return res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error('Error sending contact message:', error);
      return res.status(500).json({ message: 'Server error during message submission' });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  const httpServer = createServer(app);
  
  return httpServer;
}
