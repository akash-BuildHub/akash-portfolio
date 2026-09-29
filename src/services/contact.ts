// Contact form delivery: posts submissions to a Google Apps Script web app.

export interface ContactFormData {
  name: string;
  companyName: string;
  mobileNumber: string;
  email: string;
  purpose: string;
  message: string;
}

// Set VITE_GOOGLE_APPS_SCRIPT_URL to use your own deployment.
const GOOGLE_APPS_SCRIPT_URL =
  import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL ??
  "https://script.google.com/macros/s/AKfycbyt82VFGoEw0gwSCGzl8dWLAwVA6jaFLZgARxk77zZFk6x7gnsNE_UyKUgrgeEZrDp5Tw/exec";

// `no-cors` makes the response opaque, so this resolves whenever the request
// is sent; it only rejects on a network failure.
export const submitContactForm = async (data: ContactFormData): Promise<void> => {
  await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, timestamp: new Date().toISOString() }),
  });
};
