import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Users table - for both students and faculty
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // 'student' or 'faculty'
  rollNo: text("roll_no"),  // Only for students
  profileImage: text("profile_image"),
  designation: text("designation"),  // Only for faculty
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Applications table - for hostel applications
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  applicationId: text("application_id").notNull().unique(), // Format: HOSTEL-YEAR-XXXX
  name: text("name").notNull(),
  class: text("class").notNull(),
  rollNo: text("roll_no").notNull(),
  cgpa: doublePrecision("cgpa").notNull(),
  address: text("address").notNull(),
  mobileNumber: text("mobile_number").notNull(),
  parentMobile: text("parent_mobile").notNull(),
  email: text("email").notNull(),
  category: text("category").notNull(), // open, obc, sc, st, etc.
  marksheetUrl: text("marksheet_url"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Allotments table - for room allocations
export const allotments = pgTable("allotments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  applicationId: text("application_id").notNull().references(() => applications.applicationId),
  hostelBuilding: text("hostel_building").notNull(), // A Block, B Block, etc.
  roomNumber: text("room_number").notNull(),
  bedNumber: text("bed_number").notNull(), // 1, 2, 3
  floor: text("floor").notNull(),
  allotmentDate: timestamp("allotment_date").defaultNow().notNull(),
  status: text("status").notNull().default("active"), // active, cancelled, completed
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Complaints table - for student complaints
export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  studentName: text("student_name").notNull(),
  subject: text("subject").notNull(),
  category: text("category").notNull(), // maintenance, roommate, facilities, etc.
  description: text("description").notNull(),
  roomNumber: text("room_number"),
  priority: text("priority").notNull(), // low, medium, high, critical
  status: text("status").notNull().default("pending"), // pending, in-progress, resolved, cancelled
  response: text("response"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Rector messages table - for contacting the rector
export const rectorMessages = pgTable("rector_messages", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  studentName: text("student_name").notNull(),
  subject: text("subject").notNull(),
  messageType: text("message_type").notNull(), // inquiry, permission, leave, etc.
  message: text("message").notNull(),
  status: text("status").notNull().default("unread"), // unread, read, replied
  response: text("response"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Help questions table - for FAQs
export const helpQuestions = pgTable("help_questions", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  studentName: text("student_name").notNull(),
  subject: text("subject").notNull(),
  question: text("question").notNull(),
  status: text("status").notNull().default("pending"), // pending, answered
  answer: text("answer"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Contact messages table - for website contact form
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("unread"), // unread, read, replied
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Notices table - for important announcements
export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  priority: text("priority").notNull().default("normal"), // normal, important, urgent
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Notifications table - for faculty dashboard
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  applications: many(applications),
  allotments: many(allotments),
  complaints: many(complaints),
  rectorMessages: many(rectorMessages),
  helpQuestions: many(helpQuestions)
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  student: one(users, { fields: [applications.studentId], references: [users.id] }),
  allotment: one(allotments, { fields: [applications.applicationId], references: [allotments.applicationId] })
}));

export const allotmentsRelations = relations(allotments, ({ one }) => ({
  student: one(users, { fields: [allotments.studentId], references: [users.id] }),
  application: one(applications, { fields: [allotments.applicationId], references: [applications.applicationId] })
}));

export const complaintsRelations = relations(complaints, ({ one }) => ({
  student: one(users, { fields: [complaints.studentId], references: [users.id] })
}));

export const rectorMessagesRelations = relations(rectorMessages, ({ one }) => ({
  student: one(users, { fields: [rectorMessages.studentId], references: [users.id] })
}));

export const helpQuestionsRelations = relations(helpQuestions, ({ one }) => ({
  student: one(users, { fields: [helpQuestions.studentId], references: [users.id] })
}));

// Validation schemas
export const userInsertSchema = createInsertSchema(users, {
  name: (schema) => schema.min(3, "Name must be at least 3 characters"),
  email: (schema) => schema.email("Must be a valid email"),
  password: (schema) => schema.min(6, "Password must be at least 6 characters"),
  role: (schema) => schema.refine(val => ['student', 'faculty'].includes(val), "Role must be either 'student' or 'faculty'")
});

export const applicationInsertSchema = createInsertSchema(applications, {
  name: (schema) => schema.min(3, "Name must be at least 3 characters"),
  email: (schema) => schema.email("Must be a valid email"),
  mobileNumber: (schema) => schema.min(10, "Mobile number must be at least 10 digits"),
  parentMobile: (schema) => schema.min(10, "Parent's mobile number must be at least 10 digits"),
  address: (schema) => schema.min(5, "Address must be at least 5 characters")
});

export const complaintInsertSchema = createInsertSchema(complaints, {
  subject: (schema) => schema.min(5, "Subject must be at least 5 characters"),
  description: (schema) => schema.min(10, "Description must be at least 10 characters")
});

export const rectorMessageInsertSchema = createInsertSchema(rectorMessages, {
  subject: (schema) => schema.min(5, "Subject must be at least 5 characters"),
  message: (schema) => schema.min(10, "Message must be at least 10 characters")
});

export const helpQuestionInsertSchema = createInsertSchema(helpQuestions, {
  subject: (schema) => schema.min(5, "Subject must be at least 5 characters"),
  question: (schema) => schema.min(10, "Question must be at least 10 characters")
});

export const contactMessageInsertSchema = createInsertSchema(contactMessages, {
  name: (schema) => schema.min(3, "Name must be at least 3 characters"),
  email: (schema) => schema.email("Must be a valid email"),
  subject: (schema) => schema.min(5, "Subject must be at least 5 characters"),
  message: (schema) => schema.min(10, "Message must be at least 10 characters")
});

// Types
export type User = typeof users.$inferSelect;
export type UserInsert = z.infer<typeof userInsertSchema>;

export type Application = typeof applications.$inferSelect;
export type ApplicationInsert = z.infer<typeof applicationInsertSchema>;

export type Allotment = typeof allotments.$inferSelect;
export type AllotmentInsert = typeof allotments.$inferInsert;

export type Complaint = typeof complaints.$inferSelect;
export type ComplaintInsert = z.infer<typeof complaintInsertSchema>;

export type RectorMessage = typeof rectorMessages.$inferSelect;
export type RectorMessageInsert = z.infer<typeof rectorMessageInsertSchema>;

export type HelpQuestion = typeof helpQuestions.$inferSelect;
export type HelpQuestionInsert = z.infer<typeof helpQuestionInsertSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type ContactMessageInsert = z.infer<typeof contactMessageInsertSchema>;

export type Notice = typeof notices.$inferSelect;
export type NoticeInsert = typeof notices.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NotificationInsert = typeof notifications.$inferInsert;
