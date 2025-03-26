
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

type Registration = {
  id: string;
  parentName: string;
  parentEmail: string;
  childName: string;
  childAge: number;
  grade: string;
  schoolName: string;
  preferredTiming: string;
  registrationDate: string;
  [key: string]: any;
};

const RegistrationSearch = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    // Load registrations from localStorage
    const savedRegistrations = localStorage.getItem('registrations');
    if (savedRegistrations) {
      const parsedRegistrations = JSON.parse(savedRegistrations);
      setRegistrations(parsedRegistrations);
      setFilteredRegistrations(parsedRegistrations);
    }
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredRegistrations(registrations);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = registrations.filter(reg => 
      reg.parentName.toLowerCase().includes(term) ||
      reg.parentEmail.toLowerCase().includes(term) ||
      reg.childName.toLowerCase().includes(term) ||
      reg.parentPhone?.toLowerCase().includes(term) ||
      reg.schoolName.toLowerCase().includes(term)
    );
    
    setFilteredRegistrations(filtered);
  };

  const toggleDetails = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registration Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by name, email, or school..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch}
              className="bg-robotics-navy"
            >
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredRegistrations.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No registrations found.
            </CardContent>
          </Card>
        ) : (
          filteredRegistrations.map((registration) => (
            <Card key={registration.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 flex flex-wrap justify-between items-center"
                  onClick={() => toggleDetails(registration.id)}
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{registration.childName}</h3>
                    <p className="text-sm text-gray-600">
                      Parent: {registration.parentName} • Age: {registration.childAge} • Grade: {registration.grade}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {registration.preferredTiming}
                    </p>
                    <p className="text-xs text-gray-500">
                      Registered: {formatDate(registration.registrationDate)}
                    </p>
                  </div>
                </div>
                
                {expandedId === registration.id && (
                  <div className="p-4 bg-gray-50 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Parent Information</h4>
                        <ul className="space-y-1 text-sm">
                          <li><span className="font-medium">Name:</span> {registration.parentName}</li>
                          <li><span className="font-medium">Email:</span> {registration.parentEmail}</li>
                          <li><span className="font-medium">Phone:</span> {registration.parentPhone}</li>
                          <li><span className="font-medium">Emergency Contact:</span> {registration.emergencyContact}</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Child Information</h4>
                        <ul className="space-y-1 text-sm">
                          <li><span className="font-medium">Name:</span> {registration.childName}</li>
                          <li><span className="font-medium">Age:</span> {registration.childAge}</li>
                          <li><span className="font-medium">Grade:</span> {registration.grade}</li>
                          <li><span className="font-medium">School:</span> {registration.schoolName}</li>
                          {registration.medicalInfo && (
                            <li><span className="font-medium">Medical Info:</span> {registration.medicalInfo}</li>
                          )}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Program Details</h4>
                        <ul className="space-y-1 text-sm">
                          <li><span className="font-medium">Preferred Time:</span> {registration.preferredTiming}</li>
                          {registration.alternateTiming && (
                            <li><span className="font-medium">Alternate Time:</span> {registration.alternateTiming}</li>
                          )}
                          <li>
                            <span className="font-medium">Experience:</span> {registration.priorExperience === 'yes' ? 'Yes' : 'No'}
                            {registration.priorExperience === 'yes' && registration.experienceDetails && (
                              <span> - {registration.experienceDetails}</span>
                            )}
                          </li>
                          {registration.interestLevel && (
                            <li><span className="font-medium">Interest Level:</span> {registration.interestLevel}/5</li>
                          )}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Additional Information</h4>
                        <ul className="space-y-1 text-sm">
                          <li><span className="font-medium">Heard From:</span> {registration.referralSource || 'Not specified'}</li>
                          <li><span className="font-medium">Photo Consent:</span> {registration.photoConsent ? 'Yes' : 'No'}</li>
                          {registration.tshirtSize && (
                            <li><span className="font-medium">T-Shirt Size:</span> {registration.tshirtSize}</li>
                          )}
                          {registration.specialRequests && (
                            <li><span className="font-medium">Special Requests:</span> {registration.specialRequests}</li>
                          )}
                          <li>
                            <span className="font-medium">Volunteer Interest:</span> {registration.volunteerInterest ? 'Yes' : 'No'}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RegistrationSearch;
