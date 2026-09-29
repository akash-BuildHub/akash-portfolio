import type { ContactFormData } from '@/services/contact';

const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidMobileNumber = (mobile: string): boolean => mobile.replace(/\D/g, '').length === 10;

// Returns a message per invalid field; an empty object means the form is valid.
export const validateContactForm = (data: ContactFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.mobileNumber.trim()) {
    errors.mobileNumber = 'Mobile number is required';
  } else if (!isValidMobileNumber(data.mobileNumber)) {
    errors.mobileNumber = 'Please enter a valid 10-digit mobile number';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  return errors;
};
