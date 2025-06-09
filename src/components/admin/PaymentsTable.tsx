import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Calendar, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface StudentPayment {
  id: string;
  registration_id: string;
  student_name: string;
  month_year: string;
  tuition_amount: number;
  is_paid: boolean;
  payment_date: string | null;
  payment_method: string | null;
  notes: string | null;
}

interface Student {
  registrationid: string;
  childname: string;
}

export const PaymentsTable = () => {
  const [payments, setPayments] = useState<StudentPayment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<StudentPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const { toast } = useToast();

  // Generate month options (current month and next 11 months)
  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthYear = date.toISOString().substring(0, 7); // YYYY-MM format
      months.push(monthYear);
    }
    
    return months;
  };

  const monthOptions = generateMonthOptions();

  // Load students from registrations table
  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('registrationid, childname')
        .order('childname', { ascending: true });

      if (error) {
        console.error('Error loading students:', error);
        return;
      }

      setStudents(data || []);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  // Load payments from database
  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('student_payments')
        .select('*')
        .order('student_name', { ascending: true })
        .order('month_year', { ascending: true });

      if (error) {
        console.error('Error loading payments:', error);
        toast({
          title: "Error Loading Payments",
          description: "Could not load payment data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setPayments(data || []);
      setFilteredPayments(data || []);
    } catch (error) {
      console.error('Error loading payments:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading payments.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new payment record
  const createPaymentRecord = async (studentName: string, registrationId: string, monthYear: string) => {
    try {
      const newPayment = {
        registration_id: registrationId,
        student_name: studentName,
        month_year: monthYear,
        tuition_amount: 100.00, // Updated from 150.00 to 100.00
        is_paid: false,
        payment_date: null,
        payment_method: null,
        notes: null
      };

      const { data, error } = await supabase
        .from('student_payments')
        .insert([newPayment])
        .select()
        .single();

      if (error) {
        console.error('Error creating payment record:', error);
        toast({
          title: "Error Creating Payment Record",
          description: "Could not create payment record. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Add to local state
      setPayments(prev => [...prev, data]);
      
      toast({
        title: "Payment Record Created",
        description: `Created payment record for ${studentName} - ${formatMonth(monthYear)}.`,
      });
    } catch (error) {
      console.error('Error creating payment record:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating payment record.",
        variant: "destructive",
      });
    }
  };

  // Update payment status
  const updatePaymentStatus = async (paymentId: string, isPaid: boolean, paymentMethod?: string) => {
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
        console.error('Error updating payment:', error);
        toast({
          title: "Error Updating Payment",
          description: "Could not update payment status. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setPayments(prev => prev.map(payment => 
        payment.id === paymentId 
          ? { ...payment, ...updateData }
          : payment
      ));

      toast({
        title: "Payment Updated",
        description: `Payment status ${isPaid ? 'marked as paid' : 'marked as unpaid'}.`,
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating payment.",
        variant: "destructive",
      });
    }
  };

  // Delete payment record
  const deletePaymentRecord = async (paymentId: string, studentName: string, monthYear: string) => {
    try {
      const { error } = await supabase
        .from('student_payments')
        .delete()
        .eq('id', paymentId);

      if (error) {
        console.error('Error deleting payment:', error);
        toast({
          title: "Error Deleting Payment",
          description: "Could not delete payment record. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Remove from local state
      setPayments(prev => prev.filter(payment => payment.id !== paymentId));

      toast({
        title: "Payment Deleted",
        description: `Payment record for ${studentName} - ${formatMonth(monthYear)} has been deleted.`,
      });
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting payment.",
        variant: "destructive",
      });
    }
  };

  // Check if payment record exists for student and month
  const getPaymentRecord = (studentName: string, monthYear: string) => {
    return payments.find(p => p.student_name === studentName && p.month_year === monthYear);
  };

  // Handle quick payment assignment
  const handleQuickPayment = async (studentName: string, monthYear: string, isPaid: boolean) => {
    const student = students.find(s => s.childname === studentName);
    if (!student) return;

    const existingPayment = getPaymentRecord(studentName, monthYear);
    
    if (existingPayment) {
      // Update existing payment
      await updatePaymentStatus(existingPayment.id, isPaid, isPaid ? 'cash' : undefined);
    } else {
      // Create new payment record
      await createPaymentRecord(studentName, student.registrationid, monthYear);
      // Wait a moment for the record to be created, then update it
      setTimeout(async () => {
        const newPayment = getPaymentRecord(studentName, monthYear);
        if (newPayment && isPaid) {
          await updatePaymentStatus(newPayment.id, true, 'cash');
        }
      }, 1000);
    }
  };

  // Filter payments based on filters
  useEffect(() => {
    let filtered = payments;

    // Student filter
    if (selectedStudent && selectedStudent !== 'all') {
      filtered = filtered.filter(payment => payment.student_name === selectedStudent);
    }

    // Month filter
    if (selectedMonth && selectedMonth !== 'all') {
      filtered = filtered.filter(payment => payment.month_year === selectedMonth);
    }

    // Payment status filter
    if (paymentFilter === 'paid') {
      filtered = filtered.filter(payment => payment.is_paid);
    } else if (paymentFilter === 'unpaid') {
      filtered = filtered.filter(payment => !payment.is_paid);
    }

    setFilteredPayments(filtered);
  }, [payments, selectedStudent, selectedMonth, paymentFilter]);

  // Load data on component mount
  useEffect(() => {
    loadStudents();
    loadPayments();
  }, []);

  // Get unique students and months for filter dropdowns
  const uniqueStudents = [...new Set(payments.map(p => p.student_name))].sort();
  const uniqueMonths = [...new Set(payments.map(p => p.month_year))].sort();

  // Format month for display
  const formatMonth = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading payments...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Payment Assignment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Payment Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">Select Student</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All students</SelectItem>
                  {students.map(student => (
                    <SelectItem key={student.registrationid} value={student.childname}>
                      {student.childname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Select Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All months</SelectItem>
                  {monthOptions.map(month => (
                    <SelectItem key={month} value={month}>
                      {formatMonth(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  if (selectedStudent !== 'all' && selectedMonth !== 'all') {
                    handleQuickPayment(selectedStudent, selectedMonth, true);
                  }
                }}
                disabled={selectedStudent === 'all' || selectedMonth === 'all'}
                className="flex-1"
              >
                Mark as Paid
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  if (selectedStudent !== 'all' && selectedMonth !== 'all') {
                    handleQuickPayment(selectedStudent, selectedMonth, false);
                  }
                }}
                disabled={selectedStudent === 'all' || selectedMonth === 'all'}
                className="flex-1"
              >
                Mark as Unpaid
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Student Payments ({filteredPayments.length})
          </CardTitle>
          
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All payments</SelectItem>
                <SelectItem value="paid">Paid only</SelectItem>
                <SelectItem value="unpaid">Unpaid only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.student_name}</TableCell>
                  <TableCell>{formatMonth(payment.month_year)}</TableCell>
                  <TableCell>${payment.tuition_amount?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>
                    {payment.is_paid ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Paid
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        Unpaid
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>{payment.payment_method || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={payment.is_paid}
                        onCheckedChange={(checked) => {
                          if (checked && !payment.is_paid) {
                            updatePaymentStatus(payment.id, true, 'cash');
                          } else if (!checked && payment.is_paid) {
                            updatePaymentStatus(payment.id, false);
                          }
                        }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {payment.is_paid ? 'Paid' : 'Mark as paid'}
                      </span>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Payment Record</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the payment record for {payment.student_name} - {formatMonth(payment.month_year)}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deletePaymentRecord(payment.id, payment.student_name, payment.month_year)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No payments found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
