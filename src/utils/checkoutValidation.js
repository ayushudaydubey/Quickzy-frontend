export const validateCheckoutDetails = (user) => {
  if (!user) {
    return {
      isValid: false,
      missingFields: ['User not found'],
    };
  }

  const missingFields = [];

  if (!user.address || user.address.trim() === '') {
    missingFields.push('Address');
  }

  if (!user.mobile && !user.phone) {
    missingFields.push('Contact Number');
  }

  if (!user.zipCode || user.zipCode.trim() === '') {
    missingFields.push('Pincode');
  }

  if (!user.state || user.state.trim() === '') {
    missingFields.push('State');
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

export const getMissingFieldsMessage = (missingFields) => {
  if (missingFields.length === 0) return '';
  if (missingFields.length === 1) {
    return `Please complete your ${missingFields[0]} before proceeding with payment.`;
  }
  const fields =
    missingFields.slice(0, -1).join(', ') +
    ' and ' +
    missingFields[missingFields.length - 1];
  return `Please complete your ${fields} before proceeding with payment.`;
};
