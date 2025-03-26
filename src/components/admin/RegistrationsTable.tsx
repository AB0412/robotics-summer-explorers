import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { Registration } from '@/utils/database';

// EnhancedRegistration now extends Registration rather than FormValues
// to ensure compatibility with the database model
export type EnhancedRegistration = Registration;

interface RegistrationsTableProps {
  registrations: EnhancedRegistration[];
  onDeleteRegistration: (registrationId: string) => void;
}

export const RegistrationsTable: React.FC<RegistrationsTableProps> = ({ 
  registrations,
  onDeleteRegistration
}) => {
  if (registrations.length === 0) {
    return <p>No registrations found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Registration ID</TableHead>
          <TableHead>Parent Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Child Name</TableHead>
          <TableHead>Child Age</TableHead>
          <TableHead>Preferred Batch</TableHead>
          <TableHead>Experience</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrations.map((reg, index) => (
          <TableRow key={index}>
            <TableCell>{reg.registrationId || 'N/A'}</TableCell>
            <TableCell>{reg.parentName}</TableCell>
            <TableCell>{reg.parentEmail}</TableCell>
            <TableCell>{reg.childName}</TableCell>
            <TableCell>{reg.childAge}</TableCell>
            <TableCell>{reg.preferredBatch}</TableCell>
            <TableCell>{reg.hasPriorExperience}</TableCell>
            <TableCell>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Registration</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this registration? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => reg.registrationId && onDeleteRegistration(reg.registrationId)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
