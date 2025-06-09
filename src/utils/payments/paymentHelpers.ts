
import { supabase } from '@/utils/supabase/client';

export interface PaymentRecord {
  registration_id: string;
  student_name: string;
  month_year: string;
  tuition_amount: number;
  is_paid: boolean;
}

// Generate payment records for existing registrations
export const generatePaymentRecordsForExistingRegistrations = async () => {
  try {
    // Get all existing registrations
    const { data: registrations, error: regError } = await supabase
      .from('registrations')
      .select('registrationid, childname');

    if (regError) {
      console.error('Error fetching registrations:', regError);
      return { success: false, error: regError.message };
    }

    if (!registrations || registrations.length === 0) {
      return { success: true, message: 'No registrations found' };
    }

    // Generate payment records for next 12 months
    const paymentRecords: PaymentRecord[] = [];
    const currentDate = new Date();

    for (const registration of registrations) {
      for (let i = 0; i < 12; i++) {
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
        const monthYear = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`;

        paymentRecords.push({
          registration_id: registration.registrationid,
          student_name: registration.childname,
          month_year: monthYear,
          tuition_amount: 150.00, // Default tuition amount
          is_paid: false
        });
      }
    }

    // Insert payment records (ignore duplicates due to unique constraint)
    const { error: insertError } = await supabase
      .from('student_payments')
      .upsert(paymentRecords, { 
        onConflict: 'registration_id,month_year',
        ignoreDuplicates: true 
      });

    if (insertError) {
      console.error('Error inserting payment records:', insertError);
      return { success: false, error: insertError.message };
    }

    return { 
      success: true, 
      message: `Generated payment records for ${registrations.length} students` 
    };
  } catch (error) {
    console.error('Error generating payment records:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Update payment status
export const updatePaymentStatus = async (
  paymentId: string, 
  isPaid: boolean, 
  paymentMethod?: string
) => {
  try {
    const updateData: any = {
      is_paid: isPaid,
      payment_date: isPaid ? new Date().toISOString().split('T')[0] : null,
    };

    if (paymentMethod && isPaid) {
      updateData.payment_method = paymentMethod;
    }

    const { error } = await supabase
      .from('student_payments')
      .update(updateData)
      .eq('id', paymentId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
