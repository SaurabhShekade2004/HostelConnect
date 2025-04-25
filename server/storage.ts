import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

class Storage {
  async init() {
    // Check connection to database
    try {
      await db.execute(sql`SELECT 1`);
      console.log("Database connection successful");
    } catch (error) {
      console.error("Database connection failed:", error);
      throw error;
    }
  }

  // User methods
  async getUserByEmail(email: string) {
    return await db.query.users.findFirst({
      where: eq(schema.users.email, email)
    });
  }

  async getUserById(id: number) {
    return await db.query.users.findFirst({
      where: eq(schema.users.id, id)
    });
  }

  async createUser(userData: Omit<schema.UserInsert, "id">) {
    const [user] = await db.insert(schema.users).values(userData).returning();
    return user.id;
  }

  async updateUserProfileImage(userId: number, profileImageUrl: string) {
    await db.update(schema.users)
      .set({ profileImage: profileImageUrl })
      .where(eq(schema.users.id, userId));
    return true;
  }

  async getStudentById(studentId: number) {
    return await db.query.users.findFirst({
      where: and(
        eq(schema.users.id, studentId),
        eq(schema.users.role, 'student')
      )
    });
  }

  // Application methods
  async getApplicationByStudentId(studentId: number) {
    return await db.query.applications.findFirst({
      where: eq(schema.applications.studentId, studentId)
    });
  }

  async getApplicationById(applicationId: string | number) {
    const id = typeof applicationId === 'string' 
      ? parseInt(applicationId, 10) 
      : applicationId;
    
    if (isNaN(id)) {
      return null;
    }
    
    const application = await db.query.applications.findFirst({
      where: eq(schema.applications.id, id)
    });
    
    if (application) {
      // Get allotment if exists
      const allotment = await this.getAllotmentByApplicationId(application.applicationId);
      if (allotment) {
        return { ...application, allotment };
      }
    }
    
    return application;
  }

  async createApplication(applicationData: Omit<schema.ApplicationInsert, "id">) {
    const [application] = await db.insert(schema.applications)
      .values(applicationData)
      .returning();
    return application;
  }

  async updateApplicationStatus(applicationId: string | number, status: string) {
    const id = typeof applicationId === 'string' 
      ? parseInt(applicationId, 10) 
      : applicationId;
    
    if (isNaN(id)) {
      throw new Error('Invalid application ID');
    }
    
    await db.update(schema.applications)
      .set({ status })
      .where(eq(schema.applications.id, id));
    return true;
  }

  async getApplicationsByStatus(status?: string) {
    if (status && status !== 'all') {
      return await db.query.applications.findMany({
        where: eq(schema.applications.status, status),
        orderBy: [desc(schema.applications.cgpa)], // Sort by CGPA
      });
    } else {
      return await db.query.applications.findMany({
        orderBy: [desc(schema.applications.cgpa)], // Sort by CGPA
      });
    }
  }

  async countPendingApplications() {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(schema.applications)
      .where(eq(schema.applications.status, 'pending'));
    return result[0]?.count || 0;
  }

  async getRecentApplications(limit = 5) {
    return await db.query.applications.findMany({
      where: eq(schema.applications.status, 'pending'),
      orderBy: [desc(schema.applications.createdAt)],
      limit
    });
  }

  // Allotment methods
  async getAllotmentByStudentId(studentId: number) {
    return await db.query.allotments.findFirst({
      where: eq(schema.allotments.studentId, studentId)
    });
  }

  async getAllotmentByApplicationId(applicationId: string) {
    return await db.query.allotments.findFirst({
      where: eq(schema.allotments.applicationId, applicationId)
    });
  }

  async createAllotment(allotmentData: Omit<schema.AllotmentInsert, "id">) {
    const [allotment] = await db.insert(schema.allotments)
      .values(allotmentData)
      .returning();
    return allotment;
  }

  async checkRoomAvailability(hostelBuilding: string, roomNumber: string, bedNumber: string) {
    const existingAllotment = await db.query.allotments.findFirst({
      where: and(
        eq(schema.allotments.hostelBuilding, hostelBuilding),
        eq(schema.allotments.roomNumber, roomNumber),
        eq(schema.allotments.bedNumber, bedNumber),
        eq(schema.allotments.status, 'active')
      )
    });
    return !existingAllotment; // Room is available if no allotment exists
  }

  async countAllottedStudents() {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(schema.allotments)
      .where(eq(schema.allotments.status, 'active'));
    return result[0]?.count || 0;
  }

  async countTotalStudents() {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(schema.users)
      .where(eq(schema.users.role, 'student'));
    return result[0]?.count || 0;
  }

  // Complaint methods
  async createComplaint(complaintData: Omit<schema.ComplaintInsert, "id">) {
    const [complaint] = await db.insert(schema.complaints)
      .values(complaintData)
      .returning();
    return complaint;
  }

  async getComplaintsByStatus(status?: string) {
    if (status && status !== 'all') {
      return await db.query.complaints.findMany({
        where: eq(schema.complaints.status, status),
        orderBy: [desc(schema.complaints.createdAt)]
      });
    } else {
      return await db.query.complaints.findMany({
        orderBy: [desc(schema.complaints.createdAt)]
      });
    }
  }

  async updateComplaint(complaintId: string | number, updateData: Partial<schema.ComplaintInsert>) {
    const id = typeof complaintId === 'string' 
      ? parseInt(complaintId, 10) 
      : complaintId;
    
    if (isNaN(id)) {
      throw new Error('Invalid complaint ID');
    }
    
    const [updatedComplaint] = await db.update(schema.complaints)
      .set(updateData)
      .where(eq(schema.complaints.id, id))
      .returning();
    return updatedComplaint;
  }

  async countUnresolvedComplaints() {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(schema.complaints)
      .where(
        sql`${schema.complaints.status} != 'resolved'`
      );
    return result[0]?.count || 0;
  }

  async countComplaintsByStatus(status: string) {
    const result = await db.select({ count: sql<number>`count(*)` })
      .from(schema.complaints)
      .where(eq(schema.complaints.status, status));
    return result[0]?.count || 0;
  }

  // Rector message methods
  async createRectorMessage(messageData: Omit<schema.RectorMessageInsert, "id">) {
    const [message] = await db.insert(schema.rectorMessages)
      .values(messageData)
      .returning();
    return message;
  }

  // Help question methods
  async createHelpQuestion(questionData: Omit<schema.HelpQuestionInsert, "id">) {
    const [question] = await db.insert(schema.helpQuestions)
      .values(questionData)
      .returning();
    return question;
  }

  // Contact message methods
  async createContactMessage(messageData: Omit<schema.ContactMessageInsert, "id">) {
    const [message] = await db.insert(schema.contactMessages)
      .values(messageData)
      .returning();
    return message;
  }

  // Notice methods
  async getNotices(limit = 5) {
    return await db.query.notices.findMany({
      orderBy: [desc(schema.notices.date)],
      limit
    });
  }

  // Notification methods
  async getNotifications(limit = 5) {
    return await db.query.notifications.findMany({
      orderBy: [desc(schema.notifications.date)],
      limit
    });
  }
}

export const storage = new Storage();
