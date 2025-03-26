
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
  hasPriorExperience: "yes" | "no";
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

// Supabase database format (snake_case columns)
export interface SupabaseRegistration {
  id?: number;
  registrationid: string;
  parentname: string;
  parentemail: string;
  parentphone: string;
  emergencycontact: string;
  childname: string;
  childage: string;
  childgrade: string;
  schoolname: string;
  medicalinfo?: string;
  preferredbatch: string;
  alternatebatch?: string;
  haspriorexperience: "yes" | "no";
  experiencedescription?: string;
  interestlevel?: string;
  referralsource: string;
  photoconsent: boolean;
  waiveragreement: boolean;
  tshirtsize?: string;
  specialrequests?: string;
  volunteerinterest: boolean;
  submittedat: string;
}

// Initialize empty database structure
export const emptyDB: DBStorage = {
  registrations: []
};
