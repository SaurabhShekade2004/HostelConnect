import fs from 'fs/promises';
import path from 'path';

// Define the data directory
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
    throw error;
  }
}

// Collection class for handling file operations
class Collection {
  constructor(name) {
    this.name = name;
    this.filename = path.join(DATA_DIR, `${name}.json`);
    this.data = null;
  }

  // Load data from file
  async load() {
    try {
      await ensureDataDir();
      const exists = await fs.access(this.filename).then(() => true).catch(() => false);
      
      if (!exists) {
        this.data = [];
        await this.save();
      } else {
        const content = await fs.readFile(this.filename, 'utf8');
        this.data = JSON.parse(content);
      }
      
      return this.data;
    } catch (error) {
      console.error(`Error loading collection ${this.name}:`, error);
      this.data = [];
      return this.data;
    }
  }

  // Save data to file
  async save() {
    try {
      await ensureDataDir();
      await fs.writeFile(this.filename, JSON.stringify(this.data, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error(`Error saving collection ${this.name}:`, error);
      return false;
    }
  }

  // Get all documents
  async findAll() {
    if (!this.data) await this.load();
    return [...this.data];
  }

  // Find documents by query
  async find(query = {}) {
    if (!this.data) await this.load();
    
    return this.data.filter(item => {
      for (const key in query) {
        if (query[key] !== item[key]) {
          return false;
        }
      }
      return true;
    });
  }

  // Find a single document
  async findOne(query = {}) {
    if (!this.data) await this.load();
    
    return this.data.find(item => {
      for (const key in query) {
        if (query[key] !== item[key]) {
          return false;
        }
      }
      return true;
    }) || null;
  }

  // Find by ID
  async findById(id) {
    if (!this.data) await this.load();
    return this.data.find(item => item._id === id) || null;
  }

  // Insert a document
  async insertOne(document) {
    if (!this.data) await this.load();
    
    // Generate an ID if not provided
    if (!document._id) {
      document._id = Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    }
    
    // Add timestamp
    if (!document.createdAt) {
      document.createdAt = new Date().toISOString();
    }
    
    this.data.push(document);
    await this.save();
    
    return { ...document };
  }

  // Insert multiple documents
  async insertMany(documents) {
    if (!this.data) await this.load();
    
    const insertedDocs = documents.map(doc => {
      // Generate an ID if not provided
      if (!doc._id) {
        doc._id = Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
      }
      
      // Add timestamp
      if (!doc.createdAt) {
        doc.createdAt = new Date().toISOString();
      }
      
      return { ...doc };
    });
    
    this.data.push(...insertedDocs);
    await this.save();
    
    return [...insertedDocs];
  }

  // Update a document
  async updateOne(query, update) {
    if (!this.data) await this.load();
    
    const index = this.data.findIndex(item => {
      for (const key in query) {
        if (query[key] !== item[key]) {
          return false;
        }
      }
      return true;
    });
    
    if (index === -1) return null;
    
    // Apply updates
    const updatedDoc = { ...this.data[index] };
    
    if (update.$set) {
      for (const key in update.$set) {
        updatedDoc[key] = update.$set[key];
      }
    }
    
    // Add updated timestamp
    updatedDoc.updatedAt = new Date().toISOString();
    
    this.data[index] = updatedDoc;
    await this.save();
    
    return updatedDoc;
  }

  // Update a document by ID
  async updateById(id, update) {
    return await this.updateOne({ _id: id }, update);
  }

  // Delete a document
  async deleteOne(query) {
    if (!this.data) await this.load();
    
    const index = this.data.findIndex(item => {
      for (const key in query) {
        if (query[key] !== item[key]) {
          return false;
        }
      }
      return true;
    });
    
    if (index === -1) return false;
    
    this.data.splice(index, 1);
    await this.save();
    
    return true;
  }

  // Delete a document by ID
  async deleteById(id) {
    return await this.deleteOne({ _id: id });
  }

  // Count documents
  async countDocuments(query = {}) {
    const results = await this.find(query);
    return results.length;
  }

  // Create index (stub for API compatibility)
  async createIndex() {
    // Local storage doesn't need indexes, but we keep this for API compatibility
    return true;
  }
}

// DB class to manage collections
class LocalDB {
  constructor() {
    this.collections = {};
  }

  // Get a collection
  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = new Collection(name);
    }
    return this.collections[name];
  }

  // List all collections
  async listCollections() {
    try {
      await ensureDataDir();
      const files = await fs.readdir(DATA_DIR);
      const collectionFiles = files.filter(file => file.endsWith('.json'));
      
      return collectionFiles.map(file => ({
        name: path.basename(file, '.json')
      }));
    } catch (error) {
      console.error('Error listing collections:', error);
      return [];
    }
  }
}

// Create and export database instance
const db = new LocalDB();

// Storage interface similar to MongoDB
class LocalStorage {
  constructor() {
    this.db = db;
  }

  async init() {
    await ensureDataDir();
    console.log('Local storage initialized');
    return this;
  }

  // User related methods
  async getUserByEmail(email) {
    return await this.db.collection('users').findOne({ email });
  }

  async getUserById(id) {
    return await this.db.collection('users').findById(id);
  }

  async createUser(userData) {
    // Check if user exists
    const existingUser = await this.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const user = await this.db.collection('users').insertOne(userData);
    return user._id;
  }

  async updateUserProfileImage(userId, profileImageUrl) {
    await this.db.collection('users').updateById(userId, { 
      $set: { profileImage: profileImageUrl } 
    });
    return true;
  }

  // Application related methods
  async getStudentById(studentId) {
    return await this.db.collection('users').findOne({ _id: studentId, role: 'student' });
  }

  async getApplicationByStudentId(studentId) {
    return await this.db.collection('applications').findOne({ studentId });
  }

  async getApplicationById(applicationId) {
    if (applicationId.length === 24) { // Mock ObjectId length check
      return await this.db.collection('applications').findById(applicationId);
    } else {
      return await this.db.collection('applications').findOne({ applicationId });
    }
  }

  async createApplication(applicationData) {
    const application = await this.db.collection('applications').insertOne(applicationData);
    return application;
  }

  async updateApplicationStatus(applicationId, status) {
    if (applicationId.length === 24) { // Mock ObjectId length check
      await this.db.collection('applications').updateById(applicationId, { 
        $set: { status } 
      });
    } else {
      await this.db.collection('applications').updateOne({ applicationId }, { 
        $set: { status } 
      });
    }
    return true;
  }

  async getApplicationsByStatus(status) {
    let query = {};
    if (status) {
      query.status = status;
    }
    
    // Get all applications
    const applications = await this.db.collection('applications').find(query);
    
    // Sort by CGPA in descending order (highest first)
    return applications.sort((a, b) => b.cgpa - a.cgpa);
  }

  async countPendingApplications() {
    return await this.db.collection('applications').countDocuments({ status: 'pending' });
  }

  async getRecentApplications(limit = 5) {
    const applications = await this.db.collection('applications').findAll();
    
    // Sort by creation date (descending)
    applications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return applications.slice(0, limit);
  }

  // Allotment related methods
  async getAllotmentByStudentId(studentId) {
    return await this.db.collection('allotments').findOne({ studentId });
  }

  async getAllotmentByApplicationId(applicationId) {
    return await this.db.collection('allotments').findOne({ applicationId });
  }

  async createAllotment(allotmentData) {
    const allotment = await this.db.collection('allotments').insertOne(allotmentData);
    return allotment;
  }

  async checkRoomAvailability(hostelBuilding, roomNumber, bedNumber) {
    // Check how many allotments exist for this room and bed
    const allotments = await this.db.collection('allotments').find({
      hostelBuilding,
      roomNumber,
      bedNumber,
      status: 'active'
    });
    
    // Room is available if no one is assigned to it
    return allotments.length === 0;
  }

  async countAllottedStudents() {
    return await this.db.collection('allotments').countDocuments({ status: 'active' });
  }

  async countTotalStudents() {
    return await this.db.collection('users').countDocuments({ role: 'student' });
  }

  // Complaint related methods
  async createComplaint(complaintData) {
    const complaint = await this.db.collection('complaints').insertOne(complaintData);
    return complaint;
  }

  async getComplaintsByStatus(status) {
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const complaints = await this.db.collection('complaints').find(query);
    
    // Sort by creation date (descending)
    return complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async updateComplaint(complaintId, updateData) {
    await this.db.collection('complaints').updateById(complaintId, { 
      $set: updateData 
    });
    return true;
  }

  async countUnresolvedComplaints() {
    const complaints = await this.db.collection('complaints').find();
    return complaints.filter(c => c.status !== 'resolved').length;
  }

  async countComplaintsByStatus(status) {
    return await this.db.collection('complaints').countDocuments({ status });
  }

  // Rector message related methods
  async createRectorMessage(messageData) {
    const message = await this.db.collection('rectorMessages').insertOne(messageData);
    return message;
  }

  // Help questions related methods
  async createHelpQuestion(questionData) {
    const question = await this.db.collection('helpQuestions').insertOne(questionData);
    return question;
  }

  // Contact message related methods
  async createContactMessage(messageData) {
    const message = await this.db.collection('contactMessages').insertOne(messageData);
    return message;
  }

  // Notice related methods
  async getNotices(limit = 5) {
    const notices = await this.db.collection('notices').findAll();
    
    // Sort by creation date (descending)
    notices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return notices.slice(0, limit);
  }

  // Notification related methods
  async getNotifications(limit = 5) {
    const notifications = await this.db.collection('notifications').findAll();
    
    // Sort by creation date (descending)
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return notifications.slice(0, limit);
  }
}

// Create and export storage instance
const storage = new LocalStorage();
export { storage, db };