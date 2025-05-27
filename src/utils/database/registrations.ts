
// This file now re-exports from the refactored modules for backward compatibility
export * from './core';

// Import and re-export operations separately to avoid conflicts
import { getAllRegistrations, addRegistration as addReg, deleteRegistration as deleteReg } from './operations';
export { getAllRegistrations, addReg as addRegistrationOp, deleteReg as deleteRegistrationOp };
