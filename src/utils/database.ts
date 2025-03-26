
// This file simulates a database using local storage and a JSON file
// In a real production app, you would use a proper backend database

// Interface for our database storage
export interface DBStorage {
  registrations: Registration[];
}

// Registration interface matching our form data
export interface Registration {
  registrationId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  emergencyContact: string;
  childName: string;
  childAge: string;
  childGrade: string;
  schoolName: string;
  medicalInfo?: string;
  preferredBatch: string;
  alternateBatch?: string;
  hasPriorExperience: "yes" | "no"; // Updated to match enum in form schema
  experienceDescription?: string;
  interestLevel?: string;
  referralSource: string;
  photoConsent: boolean;
  waiverAgreement: boolean;
  tShirtSize?: string;
  specialRequests?: string;
  volunteerInterest: boolean;
  submittedAt: string;
}

// Initialize empty database structure
const emptyDB: DBStorage = {
  registrations: []
};

// Load the database from localStorage
export const loadDatabase = (): DBStorage => {
  try {
    const dbData = localStorage.getItem('roboticsDB');
    if (dbData) {
      return JSON.parse(dbData);
    }
  } catch (error) {
    console.error('Error loading database:', error);
  }
  
  // If no data or error, return empty structure
  return emptyDB;
};

// Save the database to localStorage
export const saveDatabase = (db: DBStorage): void => {
  try {
    localStorage.setItem('roboticsDB', JSON.stringify(db));
  } catch (error) {
    console.error('Error saving database:', error);
  }
};

// Get all registrations
export const getAllRegistrations = (): Registration[] => {
  const db = loadDatabase();
  return db.registrations;
};

// Add a new registration
export const addRegistration = (registration: Registration): void => {
  const db = loadDatabase();
  db.registrations.push(registration);
  saveDatabase(db);
  
  // For backward compatibility, also save to the old location
  const existingRegistrations = localStorage.getItem('registrations');
  let registrationsArray = [];
  
  if (existingRegistrations) {
    registrationsArray = JSON.parse(existingRegistrations);
  }
  
  registrationsArray.push(registration);
  localStorage.setItem('registrations', JSON.stringify(registrationsArray));
};

// Delete a registration
export const deleteRegistration = (registrationId: string): void => {
  const db = loadDatabase();
  db.registrations = db.registrations.filter(
    reg => reg.registrationId !== registrationId
  );
  saveDatabase(db);
  
  // For backward compatibility, also update the old location
  const existingRegistrations = localStorage.getItem('registrations');
  if (existingRegistrations) {
    const registrationsArray = JSON.parse(existingRegistrations);
    const updatedRegistrations = registrationsArray.filter(
      (reg: Registration) => reg.registrationId !== registrationId
    );
    localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));
  }
};

// Export a function to download the database as JSON
export const exportDatabase = (): string => {
  const db = loadDatabase();
  return JSON.stringify(db, null, 2);
};

// Import database from JSON string
export const importDatabase = (jsonData: string): boolean => {
  try {
    const parsedData = JSON.parse(jsonData);
    // Validate the data has the expected structure
    if (parsedData && typeof parsedData === 'object' && Array.isArray(parsedData.registrations)) {
      saveDatabase(parsedData);
      
      // Update the old storage location too
      localStorage.setItem('registrations', JSON.stringify(parsedData.registrations));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error importing database:', error);
    return false;
  }
};
