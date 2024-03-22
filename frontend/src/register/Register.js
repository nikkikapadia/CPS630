import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  FormLabel,
  TextField,
  Typography,
  Checkbox,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import { auth } from '../firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const validationSchema = yup.object({
  fullName: yup.string().required("Full Name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Password must match"),
});

const Register = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      isAgreed: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (values.isAgreed) {
        createUserWithEmailAndPassword(auth, values.email, values.password)
          .then((userCredential) => {
            console.log(userCredential.user, "User Created Successfully")

            // Set 'isLoggedIn' to true and store 'authToken'
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('authToken', userCredential.user.accessToken);

            setSnackbarMessage('Registration successful! You are now logged in.');
            setOpenSnackbar(true); // Show success Snackbar
            setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds

          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage);
            //UI changes here to reflect error
          });
      } else {
        console.log("User did not agree to terms");
        
      }
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box width={"100%"}>
      <Card
        elevation={0}
        sx={{
          maxWidth: "600px",
          margin: "40px auto",
          width: { xs: "90%", sm: "100%" },
          backgroundColor: "white",
          boxShadow: "0px 1px 5px rgba(52, 55, 70, 0.1) ",
        }}
      >
        <CardContent
          sx={{
            px: { xs: 3, sm: 4.5 },
            py: { xs: 3, sm: 4 },
          }}
        >
          <form
            onSubmit={formik.handleSubmit}
            style={{
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              gap: "35px",
            }}
          >
            <Typography sx={{ fontSize: "22px", fontWeight: "600" }}>
              Register
            </Typography>
            <Box sx={{ width: "100%" }}>
              <TextField
                label="Full Name"
                id="fullName"
                name="fullName"
                fullWidth
                variant="outlined"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.fullName && Boolean(formik.errors.fullName)
                }
                helperText={formik.touched.fullName && formik.errors.fullName}
              />
              <FormLabel
                sx={{
                  mt: "8px",
                  textAlign: "left",
                  fontSize: "14px",
                  display: "block",
                }}
              >
                Your Name will be displayed on your public profile
              </FormLabel>
            </Box>
            <TextField
              label="Email"
              id="email"
              type="email"
              name="email"
              fullWidth
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              label="Password"
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              fullWidth
              variant="outlined"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    {showPassword ? (
                      <VisibilityOff onClick={() => setShowPassword(false)} />
                    ) : (
                      <Visibility onClick={() => setShowPassword(true)} />
                    )}
                  </IconButton>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              id="confirmPassword"
              type="confirmPassword"
              name="confirmPassword"
              fullWidth
              variant="outlined"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            />
            <FormControlLabel
              sx={{ gap: "2px" }}
              control={<Checkbox checked={formik.values.isAgreed} />}
              label="I agree to the Terms of Service and Privacy Policy"
              name="isAgreed"
              onChange={formik.handleChange}
            />
            <Button
              fullWidth
              sx={{
                backgroundColor: "#213555",
                py: 1.5,
                textTransform: "capitalize",
                fontSize: "16px",
                ":hover": { backgroundColor: "#213555" },
              }}
              variant="contained"
              type="submit"
              disabled={!formik.values.isAgreed}
            >
              Register
            </Button>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Typography sx={{ textAlign: "center" }}>
                Already have an account?{" "}
                <Typography
                  component={"span"}
                  sx={{ color: "#213555", fontWeight: "bold" }}
                >
                  Login
                </Typography>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>

    
  );
};

export default Register;
