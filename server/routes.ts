import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
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
    
    // For development: Check if token is a mock token (frontend testing)
    if (token && token.startsWith('mock-jwt-token-')) {
      // Extract role from the mock token
      const role = token.split('-')[3];
      // Create a mock user object
      req.user = {
        id: role === 'student' ? 1 : 2,
        name: role === 'student' ? 'Student User' : 'Faculty Admin',
        role: role
      };
      return next();
    }
    
    // Regular JWT token validation for production
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      // For development: If JWT verification fails, check if it's the dashboard route
      // This is for easier testing without proper JWT
      const path = req.path;
      if (path.includes('/dashboard')) {
        // Return mock data for dashboard development
        return res.status(200).json({
          student: {
            id: 1,
            name: "Student User",
            email: "student@example.com",
            role: "student",
            rollNo: "CS22001"
          },
          application: {
            _id: "app123",
            applicationId: "HOSTEL-2025-1234",
            studentId: 1,
            name: "Student User",
            class: "Computer Science - Third Year",
            rollNo: "CS22001",
            cgpa: 8.7,
            address: "123 College Street, Pune, Maharashtra",
            mobileNumber: "9876543210",
            parentMobile: "9876543211",
            email: "student@example.com",
            category: "Open",
            status: "pending",
            createdAt: new Date().toISOString()
          },
          allotment: null,
          notices: [
            {
              id: 1,
              title: "Fee Payment Reminder",
              content: "All students are reminded to pay their hostel fees for the semester by October 15, 2025.",
              date: new Date().toISOString()
            },
            {
              id: 2,
              title: "Water Supply Interruption",
              content: "There will be a planned water supply interruption in Block A on Saturday between 10:00 AM and 2:00 PM due to maintenance work.",
              date: new Date(Date.now() - 86400000).toISOString()
            },
            {
              id: 3,
              title: "New Hostel Rules",
              content: "Please note that updated hostel rules have been published. All students must familiarize themselves with the new regulations.",
              date: new Date(Date.now() - 172800000).toISOString()
            }
          ]
        });
      }
      
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
      
      // Get applications sorted by CGPA in descending order
      const allApplications = await storage.getApplicationsByStatus();
      
      // Sort applications by CGPA in descending order
      const sortedApplications = allApplications.sort((a, b) => b.cgpa - a.cgpa);
      
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
      
      // Get complaints
      const pendingComplaints = await storage.getComplaintsByStatus('pending');
      
      // Get notifications
      const notifications = await storage.getNotifications();
      
      return res.status(200).json({
        stats,
        applications: sortedApplications,
        pendingComplaints,
        roomStats,
        notifications
      });
    } catch (error) {
      console.error('Error fetching faculty dashboard:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/faculty/applications/pending', authenticate, authorize(['faculty']), async (req, res) => {
    try {
      // Get pending applications
      const applications = await storage.getApplicationsByStatus('pending');
      
      // Get application summary
      const summary = {
        pending: await storage.countPendingApplications(),
        allotted: await storage.countAllottedStudents(),
        availableBeds: 300 - await storage.countAllottedStudents(), // Example, replace with actual calculation
        totalStudents: await storage.countTotalStudents()
      };
      
      // Sort by CGPA in descending order
      const sortedApplications = applications.sort((a, b) => b.cgpa - a.cgpa);
      
      return res.status(200).json({
        applications: sortedApplications,
        summary
      });
    } catch (error) {
      console.error('Error fetching pending applications:', error);
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
  
  // Approve application
  app.post('/api/faculty/applications/:id/approve', authenticate, authorize(['faculty']), async (req, res) => {
    try {
      const applicationId = req.params.id;
      
      // Get application details
      const application = await storage.getApplicationById(applicationId);
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      // Check if application is not already processed
      if (application.status !== 'pending') {
        return res.status(400).json({ message: 'Application has already been processed' });
      }
      
      // Update application status to approved
      await storage.updateApplicationStatus(applicationId, 'approved');
      
      return res.status(200).json({ 
        message: 'Application approved successfully',
        applicationId
      });
    } catch (error) {
      console.error('Error approving application:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Reject application
  app.post('/api/faculty/applications/:id/reject', authenticate, authorize(['faculty']), async (req, res) => {
    try {
      const applicationId = req.params.id;
      const { reason } = req.body;
      
      // Get application details
      const application = await storage.getApplicationById(applicationId);
      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }
      
      // Check if application is not already processed
      if (application.status !== 'pending') {
        return res.status(400).json({ message: 'Application has already been processed' });
      }
      
      // Update application status to rejected
      await storage.updateApplicationStatus(applicationId, 'rejected');
      
      return res.status(200).json({ 
        message: 'Application rejected successfully',
        applicationId
      });
    } catch (error) {
      console.error('Error rejecting application:', error);
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

  // Room occupancy check endpoint
  app.get('/api/faculty/rooms/:building/:roomNumber/occupancy', authenticate, authorize(['faculty']), async (req, res) => {
    try {
      const { building, roomNumber } = req.params;
      
      // Get all allotments for this room
      const allotments = await storage.getAllotmentsForRoom(building, roomNumber);
      
      // Count active allotments
      const occupancy = allotments.length;
      
      // Get bed numbers that are already taken
      const occupiedBeds = allotments.map(allotment => allotment.bedNumber);
      
      return res.status(200).json({
        occupancy,
        occupiedBeds,
        isFull: occupancy >= 2, // Room is full if 2 or more students are already allotted
        availableBeds: 2 - occupancy
      });
    } catch (error) {
      console.error('Error checking room occupancy:', error);
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
