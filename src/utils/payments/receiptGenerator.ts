import jsPDF from 'jspdf';

export interface PaymentReceiptData {
  student_name: string;
  month_year: string; // YYYY-MM
  tuition_amount: number;
  payment_date?: string | null; // ISO date (YYYY-MM-DD)
  payment_method?: string | null;
  registration_id: string;
  organization_name?: string;
}

const formatMonth = (monthYear: string) => {
  const [year, month] = monthYear.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const downloadPaymentReceipt = (data: PaymentReceiptData) => {
  const {
    student_name,
    month_year,
    tuition_amount,
    payment_date,
    payment_method,
    registration_id,
    organization_name = 'Payment Receipt',
  } = data;

  const doc = new jsPDF();
  const left = 20;
  let y = 20;

  // Header
  doc.setFontSize(16);
  doc.text(organization_name, left, y);
  y += 8;
  doc.setFontSize(12);
  doc.text('Tuition Payment Receipt', left, y);

  // Receipt metadata box
  y += 10;
  const issuedOn = new Date().toLocaleString();
  doc.setFontSize(10);
  doc.text(`Receipt ID: ${registration_id}-${month_year}`, left, y);
  y += 6;
  doc.text(`Issued On: ${issuedOn}`, left, y);

  // Divider
  y += 6;
  doc.setLineWidth(0.5);
  doc.line(left, y, 190, y);
  y += 10;

  // Student and payment details
  doc.setFontSize(12);
  doc.text(`Student Name: ${student_name}`, left, y); y += 7;
  doc.text(`Month: ${formatMonth(month_year)}`, left, y); y += 7;
  doc.text(`Amount Paid: $${(tuition_amount ?? 0).toFixed(2)}`, left, y); y += 7;
  doc.text(`Payment Method: ${payment_method ? payment_method.toUpperCase() : 'N/A'}`, left, y); y += 7;
  doc.text(`Payment Date: ${payment_date ? new Date(payment_date).toLocaleDateString() : 'N/A'}`, left, y);

  // Footer
  y += 14;
  doc.setLineWidth(0.2);
  doc.line(left, y, 190, y);
  y += 8;
  doc.setFontSize(10);
  doc.text('Thank you for your payment.', left, y);

  const safeStudent = student_name.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const fileName = `receipt-${safeStudent}-${month_year}.pdf`;
  doc.save(fileName);
};
