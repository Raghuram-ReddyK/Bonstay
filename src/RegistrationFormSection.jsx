import React from 'react';

import {
  TextField,
  Typography,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Alert
} from '@mui/material';

import CountrySelect from './CountrySelect';

const RegistrationFormSections = ({
  state,
  formErrors,
  error,
  handleChange
}) => {

  const renderBasicInfoSection = () => (
    <Box>
      <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 'bold', mb: 3, fontSize: { xs: '1.3rem', md: '1.5rem' } }}>
        Basic Information
      </Typography>

      {/* User Type Selection */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.1rem' }, mb: 1 }}>
          Account Type
        </Typography>

        <FormControl fullWidth size="medium">
          <InputLabel>Select User Type</InputLabel>
          <Select
            name="userType"
            value={state.userType}
            onChange={handleChange}
            label="Select User Type"
            sx={{
              backgroundColor: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d1d5db'
              }
            }}
          >
            <MenuItem value="user">Normal User</MenuItem>
            <MenuItem value="admin">Administrator</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Personal Information */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.1rem' }, mb: 2 }}>
          Personal Information
        </Typography>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' } }}>
          <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
            <TextField
              name="name"
              label="Full Name"
              value={state.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              fullWidth
              variant="outlined"
              sx={{
                backgroundColor: 'white',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#d1d5db'
                  }
                }
              }}
            />
          </Box>

          <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
            <TextField
              name="address"
              label="Address"
              value={state.address}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              multiline
              rows={2}
              sx={{
                backgroundColor: 'white',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#d1d5db'
                  }
                }
              }}
            />
          </Box>

          <Box sx={{ backgroundColor: 'white', borderRadius: 1 }}>
            <CountrySelect
              onChange={handleChange}
              value={state.country}
              margin="none"
            />
          </Box>

          <TextField
            name="phoneNo"
            label="Phone Number"
            value={state.phoneNo}
            onChange={handleChange}
            error={!!formErrors.phoneNo}
            helperText={formErrors.phoneNo}
            fullWidth
            variant="outlined"
            sx={{
              backgroundColor: 'white',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#d1d5db'
                }
              }
            }}
          />
        </Box>
      </Box>

      {/* Account Credentials */}
      <Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.1rem' }, mb: 2 }}>
          Account Credentials
        </Typography>

        <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField
            name="email"
            label="Email Address"
            value={state.email}
            onChange={handleChange}
            error={!!formErrors.email || (error && error.includes('Email is already registered'))}
            helperText={formErrors.email || (error && error.includes('Email is already registered') ? error : '')}
            fullWidth
            variant="outlined"
            type="email"
            sx={{
              backgroundColor: 'white',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#d1d5db'
                }
              }
            }}
          />

          <TextField
            name="password"
            label="Password"
            value={state.password}
            onChange={handleChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
            type="password"
            fullWidth
            variant="outlined"
            sx={{
              backgroundColor: 'white',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#d1d5db'
                }
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );

  const renderRoleDetailsSection = () => (
    <Box>
      <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 'bold', mb: 3, fontSize: { xs: '1.3rem', md: '1.5rem' } }}>
        {state.userType === 'admin' ? 'Administrator Setup' : 'Personal Details'}
      </Typography>

      {/* Admin specific fields */}
      {state.userType === 'admin' && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.1rem' }, mb: 2 }}>
            Administrator Verification
          </Typography>

          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              name="adminCode"
              label="Admin Code"
              value={state.adminCode}
              onChange={handleChange}
              error={!!formErrors.adminCode}
              helperText={formErrors.adminCode || "Enter the admin verification code"}
              type="password"
              fullWidth
              variant="outlined"
              sx={{
                backgroundColor: 'white',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#d1d5db'
                  }
                }
              }}
            />

            <Alert severity="info">
              <MuiLink component="a" href="/admin-code-request" sx={{ ml: 1, fontWeight: 'bold' }}>
                Don't have an admin code? Request one here
              </MuiLink>
            </Alert>

            <TextField
              name="department"
              label="Department"
              value={state.department}
              onChange={handleChange}
              error={!!formErrors.department}
              helperText={formErrors.department}
              fullWidth
              variant="outlined"
              sx={{
                backgroundColor: 'white',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#d1d5db'
                  }
                }
              }}
            />
          </Box>
        </Box>
      )}

      {/* Normal user specific fields */}
      {state.userType === 'user' && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: { xs: '1rem', md: '1.1rem' }, mb: 2 }}>
            Additional Information
          </Typography>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' } }}>
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
              <TextField
                name="dateOfBirth"
                label="Date of Birth"
                type="date"
                value={state.dateOfBirth}
                onChange={handleChange}
                error={!!formErrors.dateOfBirth}
                helperText={formErrors.dateOfBirth}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                sx={{
                  backgroundColor: 'white',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#d1d5db'
                    }
                  }
                }}
              />
            </Box>

            <FormControl
              fullWidth
              variant="outlined"
              error={!!formErrors.gender}
              sx={{
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d1d5db'
                }
              }}
            >
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={state.gender}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              {formErrors.gender && <FormHelperText>{formErrors.gender}</FormHelperText>}
            </FormControl>

            <TextField
              name="occupation"
              label="Occupation"
              value={state.occupation}
              onChange={handleChange}
              error={!!formErrors.occupation}
              helperText={formErrors.occupation}
              fullWidth
              variant="outlined"
              sx={{
                backgroundColor: 'white',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#d1d5db'
                  }
                }
              }}
            />
          </Box>
        </Box>
      )}

      {/* Empty State */}
      {!state.userType && (
        <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Select Account Type
          </Typography>
          <Typography variant="body2">
            Choose your account type to continue with role-specific details
          </Typography>
        </Box>
      )}
    </Box>
  );

  return {
    renderBasicInfoSection,
    renderRoleDetailsSection
  };
};

export default RegistrationFormSections;
