export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhoneNumber = (phone) =>
  /^[0-9+\-\s()]{7,20}$/.test(phone);

export const isStrongPassword = (password) => password.length >= 8;

export const isValidUUID = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );