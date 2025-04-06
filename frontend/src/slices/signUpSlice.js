import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fullname: '',
  surname: '',
  email: '',
  feesReceiptNo: '',
  idCardImage: null,      // Could be File or URL
  profileImage: null,     // Optional: for profile picture
  error: '',              // Error message from server/validation
  success: '',            // Success message (optional)
  submit: false,          // Whether form has been submitted
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    setSubmit: (state, action) => {
      state.submit = action.payload;
    },
    resetForm: () => initialState,
  },
});

export const { updateField, setError, setSuccess, setSubmit, resetForm } = signupSlice.actions;
export default signupSlice.reducer;
