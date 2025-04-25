import { getDb, toObjectId } from './db';
import bcrypt from 'bcrypt';

class MongoDBStorage {
  db: any;

  async init() {
    this.db = await getDb();
    return this;
  }

  // User related methods
  async getUserByEmail(email: string) {
    return await this.db.collection('users').findOne({ email });
  }

  async getUserById(id: string | any) {
    const userId = typeof id === 'string' ? toObjectId(id) : id;
    return await this.db.collection('users').findOne({ _id: userId });
  }

  async createUser(userData: any) {
    // Email must be unique
    const existingUser = await this.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const result = await this.db.collection('users').insertOne(userData);
    return result.insertedId;
  }

  async updateUserProfileImage(userId: string | any, profileImageUrl: string) {
    const id = typeof userId === 'string' ? toObjectId(userId) : userId;
    await this.db.collection('users').updateOne(
      { _id: id },
      { $set: { profileImage: profileImageUrl } }
    );
    return true;
  }

  // Application related methods
  async getStudentById(studentId: string | any) {
    const id = typeof studentId === 'string' ? toObjectId(studentId) : studentId;
    return await this.db.collection('users').findOne({ _id: id, role: 'student' });
  }

  async getApplicationByStudentId(studentId: string | any) {
    const id = typeof studentId === 'string' ? toObjectId(studentId) : studentId;
    return await this.db.collection('applications').findOne({ studentId: id });
  }

  async getApplicationById(applicationId: string | any) {
    if (typeof applicationId === 'string' && applicationId.length === 24) {
      // If it's a MongoDB ObjectId string
      return await this.db.collection('applications').findOne({ _id: toObjectId(applicationId) });
    } else {
      // If it's a custom application ID string (not ObjectId)
      return await this.db.collection('applications').findOne({ applicationId });
    }
  }

  async createApplication(applicationData: any) {
    const result = await this.db.collection('applications').insertOne(applicationData);
    return { _id: result.insertedId, ...applicationData };
  }

  async updateApplicationStatus(applicationId: string | any, status: string) {
    if (typeof applicationId === 'string' && applicationId.length === 24) {
      await this.db.collection('applications').updateOne(
        { _id: toObjectId(applicationId) },
        { $set: { status } }
      );
    } else {
      await this.db.collection('applications').updateOne(
        { applicationId },
        { $set: { status } }
      );
    }
    return true;
  }

  async getApplicationsByStatus(status?: string) {
    let query: any = {};
    if (status) {
      query.status = status;
    }
    
    // Sort by CGPA in descending order (highest first)
    return await this.db.collection('applications')
      .find(query)
      .sort({ cgpa: -1 })
      .toArray();
  }

  async countPendingApplications() {
    return await this.db.collection('applications').countDocuments({ status: 'pending' });
  }

  async getRecentApplications(limit = 5) {
    return await this.db.collection('applications')
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  // Allotment related methods
  async getAllotmentByStudentId(studentId: string | any) {
    const id = typeof studentId === 'string' ? toObjectId(studentId) : studentId;
    return await this.db.collection('allotments').findOne({ studentId: id });
  }

  async getAllotmentByApplicationId(applicationId: string | any) {
    if (typeof applicationId === 'string' && applicationId.length === 24) {
      return await this.db.collection('allotments').findOne({ applicationId: toObjectId(applicationId) });
    } else {
      return await this.db.collection('allotments').findOne({ applicationId });
    }
  }

  async createAllotment(allotmentData: any) {
    const result = await this.db.collection('allotments').insertOne(allotmentData);
    return { _id: result.insertedId, ...allotmentData };
  }

  async checkRoomAvailability(hostelBuilding: string, roomNumber: string, bedNumber: string) {
    // Count how many occupants are already in this room and bed
    const count = await this.db.collection('allotments').countDocuments({
      hostelBuilding,
      roomNumber,
      bedNumber,
      status: 'active'
    });
    
    // Room is available if no one is assigned to it
    return count === 0;
  }

  async countAllottedStudents() {
    return await this.db.collection('allotments').countDocuments({ status: 'active' });
  }

  async countTotalStudents() {
    return await this.db.collection('users').countDocuments({ role: 'student' });
  }

  // Complaint related methods
  async createComplaint(complaintData: any) {
    const result = await this.db.collection('complaints').insertOne(complaintData);
    return { _id: result.insertedId, ...complaintData };
  }

  async getComplaintsByStatus(status?: string) {
    let query: any = {};
    if (status) {
      query.status = status;
    }
    return await this.db.collection('complaints')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
  }

  async updateComplaint(complaintId: string | any, updateData: any) {
    const id = typeof complaintId === 'string' ? toObjectId(complaintId) : complaintId;
    await this.db.collection('complaints').updateOne(
      { _id: id },
      { $set: updateData }
    );
    return true;
  }

  async countUnresolvedComplaints() {
    return await this.db.collection('complaints').countDocuments({ status: { $ne: 'resolved' } });
  }

  async countComplaintsByStatus(status: string) {
    return await this.db.collection('complaints').countDocuments({ status });
  }

  // Rector message related methods
  async createRectorMessage(messageData: any) {
    const result = await this.db.collection('rectorMessages').insertOne(messageData);
    return { _id: result.insertedId, ...messageData };
  }

  // Help questions related methods
  async createHelpQuestion(questionData: any) {
    const result = await this.db.collection('helpQuestions').insertOne(questionData);
    return { _id: result.insertedId, ...questionData };
  }

  // Contact message related methods
  async createContactMessage(messageData: any) {
    const result = await this.db.collection('contactMessages').insertOne(messageData);
    return { _id: result.insertedId, ...messageData };
  }

  // Notice related methods
  async getNotices(limit = 5) {
    return await this.db.collection('notices')
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  // Notification related methods
  async getNotifications(limit = 5) {
    return await this.db.collection('notifications')
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }
}

// Create and export storage instance
const storage = new MongoDBStorage();
export { storage };