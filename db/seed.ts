import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function seed() {
  try {
    console.log("Starting seeding process...");

    // Create users (faculty and students)
    const facultyPassword = await bcrypt.hash("faculty123", 10);
    const studentPassword = await bcrypt.hash("student123", 10);

    // Check if faculty already exists
    const existingFaculty = await db.query.users.findFirst({
      where: eq(schema.users.email, "faculty@college.edu")
    });

    if (!existingFaculty) {
      // Insert faculty
      const [faculty] = await db.insert(schema.users).values({
        name: "Dr. Rajesh Kumar",
        email: "faculty@college.edu",
        password: facultyPassword,
        role: "faculty",
        designation: "Hostel Rector"
      }).returning();

      console.log("Faculty created:", faculty.id);
    } else {
      console.log("Faculty already exists, skipping creation");
    }

    // Create some student accounts
    const studentData = [
      { name: "Priya Sharma", email: "priya.sharma@student.edu", rollNo: "CS2020001" },
      { name: "Rahul Patel", email: "rahul.patel@student.edu", rollNo: "ME2020002" },
      { name: "Neha Gupta", email: "neha.gupta@student.edu", rollNo: "EC2020003" }
    ];

    for (const student of studentData) {
      // Check if student already exists
      const existingStudent = await db.query.users.findFirst({
        where: eq(schema.users.email, student.email)
      });

      if (!existingStudent) {
        const [newStudent] = await db.insert(schema.users).values({
          name: student.name,
          email: student.email,
          password: studentPassword,
          role: "student",
          rollNo: student.rollNo
        }).returning();

        console.log(`Student created: ${newStudent.name} (${newStudent.id})`);
      } else {
        console.log(`Student ${student.name} already exists, skipping creation`);
      }
    }

    // Create notice
    const existingNotice = await db.query.notices.findFirst({
      where: eq(schema.notices.title, "Welcome to College Hostel")
    });

    if (!existingNotice) {
      await db.insert(schema.notices).values({
        title: "Welcome to College Hostel",
        content: "Welcome to the college hostel for the new academic year! Please complete your registration process by submitting your application form.",
        priority: "important",
        date: new Date()
      });

      await db.insert(schema.notices).values({
        title: "Mess Timings Updated",
        content: "New mess timings: Breakfast: 7:30-9:30 AM, Lunch: 12:30-2:30 PM, Dinner: 7:30-9:30 PM. Please adhere to these timings.",
        priority: "normal",
        date: new Date()
      });

      console.log("Notices created");
    } else {
      console.log("Notices already exist, skipping creation");
    }

    // Create faculty notifications
    const existingNotification = await db.query.notifications.findFirst({
      where: eq(schema.notifications.title, "New Applications")
    });

    if (!existingNotification) {
      await db.insert(schema.notifications).values({
        title: "New Applications",
        content: "10 new hostel applications are pending for review",
        date: new Date()
      });

      await db.insert(schema.notifications).values({
        title: "Complaint Received",
        content: "A critical priority complaint has been submitted regarding plumbing issues in A Block",
        date: new Date()
      });

      console.log("Notifications created");
    } else {
      console.log("Notifications already exist, skipping creation");
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

seed();
