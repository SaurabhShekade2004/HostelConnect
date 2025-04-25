import { storage as localStorage } from './local-storage.js';

// Use local file-based storage instead of MongoDB
class Storage {
  async init() {
    try {
      console.log('Initializing local storage...');
      return await localStorage.init();
    } catch (error) {
      console.error('Storage initialization error:', error);
      throw error;
    }
  }

  // User methods
  async getUserByEmail(email: string) {
    return await localStorage.getUserByEmail(email);
  }

  async getUserById(id: number | string) {
    return await localStorage.getUserById(id);
  }

  async createUser(userData: any) {
    return await localStorage.createUser(userData);
  }

  async updateUserProfileImage(userId: number | string, profileImageUrl: string) {
    return await localStorage.updateUserProfileImage(userId, profileImageUrl);
  }

  async getStudentById(studentId: number | string) {
    return await localStorage.getStudentById(studentId);
  }

  // Application methods
  async getApplicationByStudentId(studentId: number | string) {
    return await localStorage.getApplicationByStudentId(studentId);
  }

  async getApplicationById(applicationId: string | number) {
    return await localStorage.getApplicationById(applicationId);
  }

  async createApplication(applicationData: any) {
    return await localStorage.createApplication(applicationData);
  }

  async updateApplicationStatus(applicationId: string | number, status: string) {
    return await localStorage.updateApplicationStatus(applicationId, status);
  }

  async getApplicationsByStatus(status?: string) {
    return await localStorage.getApplicationsByStatus(status);
  }

  async countPendingApplications() {
    return await localStorage.countPendingApplications();
  }

  async getRecentApplications(limit = 5) {
    return await localStorage.getRecentApplications(limit);
  }

  // Allotment methods
  async getAllotmentByStudentId(studentId: number | string) {
    return await localStorage.getAllotmentByStudentId(studentId);
  }

  async getAllotmentByApplicationId(applicationId: string) {
    return await localStorage.getAllotmentByApplicationId(applicationId);
  }

  async createAllotment(allotmentData: any) {
    return await localStorage.createAllotment(allotmentData);
  }

  async checkRoomAvailability(hostelBuilding: string, roomNumber: string, bedNumber: string) {
    return await localStorage.checkRoomAvailability(hostelBuilding, roomNumber, bedNumber);
  }
  
  async getAllotmentsForRoom(hostelBuilding: string, roomNumber: string) {
    return await localStorage.getAllotmentsForRoom(hostelBuilding, roomNumber);
  }

  async countAllottedStudents() {
    return await localStorage.countAllottedStudents();
  }

  async countTotalStudents() {
    return await localStorage.countTotalStudents();
  }

  // Complaint methods
  async createComplaint(complaintData: any) {
    return await localStorage.createComplaint(complaintData);
  }

  async getComplaintsByStatus(status?: string) {
    return await localStorage.getComplaintsByStatus(status);
  }

  async updateComplaint(complaintId: string | number, updateData: any) {
    return await localStorage.updateComplaint(complaintId, updateData);
  }

  async countUnresolvedComplaints() {
    return await localStorage.countUnresolvedComplaints();
  }

  async countComplaintsByStatus(status: string) {
    return await localStorage.countComplaintsByStatus(status);
  }

  // Rector message methods
  async createRectorMessage(messageData: any) {
    return await localStorage.createRectorMessage(messageData);
  }

  // Help question methods
  async createHelpQuestion(questionData: any) {
    return await localStorage.createHelpQuestion(questionData);
  }

  // Contact message methods
  async createContactMessage(messageData: any) {
    return await localStorage.createContactMessage(messageData);
  }

  // Notice methods
  async getNotices(limit = 5) {
    return await localStorage.getNotices(limit);
  }

  // Notification methods
  async getNotifications(limit = 5) {
    return await localStorage.getNotifications(limit);
  }
}

export const storage = new Storage();
