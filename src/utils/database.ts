
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

// File path for local storage (in a real app with Node.js backend, this would be a file path)
const DB_FILE_PATH = 'registrations-data.json';

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
    
    // In a browser-only environment, we can't write directly to the filesystem
    // Instead, we'll create a downloadable file that can be saved
    const jsonData = JSON.stringify(db, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Store the latest blob in sessionStorage for easy access
    sessionStorage.setItem('latestRegistrationsBlob', URL.createObjectURL(blob));
    
    // Display a small notification (only when running in admin mode)
    if (window.location.pathname.includes('admin')) {
      const notificationDiv = document.createElement('div');
      notificationDiv.style.position = 'fixed';
      notificationDiv.style.bottom = '20px';
      notificationDiv.style.right = '20px';
      notificationDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
      notificationDiv.style.color = 'white';
      notificationDiv.style.padding = '10px 20px';
      notificationDiv.style.borderRadius = '5px';
      notificationDiv.style.zIndex = '1000';
      notificationDiv.textContent = 'Registration data updated. Download available.';
      
      document.body.appendChild(notificationDiv);
      
      setTimeout(() => {
        document.body.removeChild(notificationDiv);
      }, 3000);
    }
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

// Get a download link for the latest database
export const getDownloadLink = (): string => {
  return sessionStorage.getItem('latestRegistrationsBlob') || '';
};
