
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormValues } from '@/components/registration/RegistrationTypes';

// Hard-coded admin password - in a real app, this would be handled securely
const ADMIN_PASSWORD = "admin123"; 

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [registrations, setRegistrations] = useState<FormValues[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const { toast } = useToast();
  
  const itemsPerPage = 5;

  useEffect(() => {
    // Check if user is already authenticated in this session
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadRegistrations();
    }
  }, []);

  const handleAuthentication = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      loadRegistrations();
      toast({
        title: "Authentication successful",
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast({
        title: "Authentication failed",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  const loadRegistrations = () => {
    // Load registrations from localStorage
    const savedRegistrations = localStorage.getItem('registrations');
    if (savedRegistrations) {
      setRegistrations(JSON.parse(savedRegistrations));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAuthentication();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
    setPassword('');
  };

  // Filter registrations based on search term and selected filter
  const filteredRegistrations = registrations.filter(reg => {
    const searchTermLower = searchTerm.toLowerCase();
    
    switch(searchFilter) {
      case 'childName':
        return reg.childName.toLowerCase().includes(searchTermLower);
      case 'parentName':
        return reg.parentName.toLowerCase().includes(searchTermLower);
      case 'email':
        return reg.parentEmail.toLowerCase().includes(searchTermLower);
      case 'all':
      default:
        return (
          reg.parentName.toLowerCase().includes(searchTermLower) ||
          reg.childName.toLowerCase().includes(searchTermLower) ||
          reg.parentEmail.toLowerCase().includes(searchTermLower)
        );
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const currentRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {!isAuthenticated ? (
        <Card>
          <CardHeader>
            <CardTitle>Admin Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button onClick={handleAuthentication}>Login</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2 items-center max-w-md w-full">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search registrations..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={searchFilter}
                onValueChange={setSearchFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Search filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  <SelectItem value="childName">Student Name</SelectItem>
                  <SelectItem value="parentName">Parent Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Registrations ({filteredRegistrations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {registrations.length === 0 ? (
                <p>No registrations found.</p>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parent Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Child Name</TableHead>
                        <TableHead>Child Age</TableHead>
                        <TableHead>Preferred Batch</TableHead>
                        <TableHead>Experience</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentRegistrations.map((reg, index) => (
                        <TableRow key={index}>
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
                  
                  {totalPages > 1 && (
                    <Pagination className="mt-4">
                      <PaginationContent>
                        {currentPage > 1 && (
                          <PaginationItem>
                            <PaginationPrevious onClick={() => setCurrentPage(prev => prev - 1)} />
                          </PaginationItem>
                        )}
                        
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink 
                              isActive={currentPage === i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        {currentPage < totalPages && (
                          <PaginationItem>
                            <PaginationNext onClick={() => setCurrentPage(prev => prev + 1)} />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Admin;
