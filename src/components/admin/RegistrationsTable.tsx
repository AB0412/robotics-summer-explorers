
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { FormValues } from '@/components/registration/RegistrationTypes';

export interface EnhancedRegistration extends FormValues {
  registrationId?: string;
  submittedAt?: string;
}

interface RegistrationsTableProps {
  registrations: EnhancedRegistration[];
}

export const RegistrationsTable: React.FC<RegistrationsTableProps> = ({ registrations }) => {
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
