import jsPDF from 'jspdf';

export const generatePDF = (application) => {
  if (!application) return;
  
  // Create new PDF document
  const doc = new jsPDF();
  
  // Add hostel logo if available
  // doc.addImage('/logo.png', 'PNG', 15, 10, 25, 25);
  
  // Add header
  doc.setFontSize(22);
  doc.setTextColor(33, 37, 41);
  doc.text('College Hostel Application', 105, 20, { align: 'center' });
  
  // Add application ID and date
  doc.setFontSize(12);
  doc.text(`Application ID: ${application.applicationId}`, 20, 40);
  doc.text(`Submission Date: ${new Date(application.createdAt).toLocaleDateString('en-IN')}`, 20, 50);
  doc.text(`Status: ${application.status.toUpperCase()}`, 20, 60);
  
  // Add line
  doc.setLineWidth(0.5);
  doc.line(20, 65, 190, 65);
  
  // Personal Information Section
  doc.setFontSize(16);
  doc.text('Personal Information', 20, 75);
  
  doc.setFontSize(12);
  doc.text(`Full Name: ${application.name}`, 20, 85);
  doc.text(`Roll Number: ${application.rollNo}`, 20, 95);
  doc.text(`Class: ${application.class}`, 20, 105);
  doc.text(`CGPA: ${application.cgpa}`, 20, 115);
  doc.text(`Category: ${application.category}`, 20, 125);
  
  // Contact Information Section
  doc.setFontSize(16);
  doc.text('Contact Information', 20, 140);
  
  doc.setFontSize(12);
  doc.text(`Mobile Number: ${application.mobileNumber}`, 20, 150);
  doc.text(`Parent's Mobile: ${application.parentMobile}`, 20, 160);
  doc.text(`Email: ${application.email}`, 20, 170);
  
  // Address wrapped to fit on page
  doc.text('Address:', 20, 180);
  const addressLines = doc.splitTextToSize(application.address, 150);
  doc.text(addressLines, 30, 190);
  
  // Add footer
  doc.setFontSize(10);
  doc.text('This is a computer-generated document and does not require a signature.', 105, 280, { align: 'center' });
  
  // Save PDF with application ID as filename
  doc.save(`hostel_application_${application.applicationId}.pdf`);
};
