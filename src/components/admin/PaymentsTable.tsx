
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

export const PaymentsTable = () => {
  const [payments, setPayments] = useState<StudentPayment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<StudentPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const { toast } = useToast();

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

  // Load payments on component mount
  useEffect(() => {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Student Payments ({filteredPayments.length})
        </CardTitle>
        
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All students</SelectItem>
              {uniqueStudents.map(student => (
                <SelectItem key={student} value={student}>
                  {student}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All months</SelectItem>
              {uniqueMonths.map(month => (
                <SelectItem key={month} value={month}>
                  {formatMonth(month)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
                          // When marking as paid, default to cash method
                          updatePaymentStatus(payment.id, true, 'cash');
                        } else if (!checked && payment.is_paid) {
                          updatePaymentStatus(payment.id, false);
                        }
                      }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {payment.is_paid ? 'Paid' : 'Mark as paid'}
                    </span>
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
  );
};
