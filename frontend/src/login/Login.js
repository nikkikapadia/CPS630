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
  CircularProgress,
} from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";
import { SnackbarContext } from "../contexts/SnackbarContext";

// validation schema for login input
const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .matches(
      /@torontomu\.ca$/,
      "Email addresses must end with the domain @torontomu.ca."
    )
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

// Login page
const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const {
    showSnackbar,
    setShowSnackbar,
    setSnackbarMessage,
    snackbarMessage,
    snackbarSeverity,
    setSnackbarSeverity,
  } = useContext(SnackbarContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    // try to sign in
    onSubmit: (values) => {
      setLoading(true); // start loading
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then(async (userCredential) => {
          console.log(userCredential.user, "User Logged In Successfully"); // Sign-in successful

          const token = userCredential.user.accessToken;

          // Store auth status and token in sessionStorage
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("authToken", token);

          const userInfo = await fetch(
            `https://cps630.onrender.com/api/users/get/email/${values.email}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
              },
            }
          )
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              return data;
            });

          sessionStorage.setItem("email", values.email);
          sessionStorage.setItem("fullName", userInfo[0].fullName);
          sessionStorage.setItem("isAdmin", userInfo[0].isAdmin.toString());
          sessionStorage.setItem("_id", userInfo[0]._id);
          sessionStorage.setItem("username", userInfo[0].username);

          // set user context
          setUser({
            isLoggedIn: true,
            username: userInfo[0].username,
            email: userInfo[0].email,
            fullName: userInfo[0].fullName,
            isAdmin: userInfo[0].isAdmin,
            _id: userInfo[0]._id,
            authToken: token,
          });

          setSnackbarMessage("Login successful!");
          setSnackbarSeverity("success");
          setShowSnackbar(true);
          navigate("/"); // Redirect after showing success message
        })
        .catch((error) => {
          // Sign-in failure
          console.error("Error signing in: ", error.message);
          alert(`Error signing in: ${error.message}`);
          setSnackbarMessage(`Error signing in: ${error.message}`);
          setSnackbarSeverity("error");
          setShowSnackbar(true); // Corrected from setOpenSnackbar to setShowSnackbar, to match the change to context-based approach
        })
        .finally(() => {
          setLoading(false); // stop loading once promise settles
        });
      console.log(values, "Submiited Values");
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box width={"100%"}>
      <Card
        elevation={0}
        sx={{
          maxWidth: "600px",
          width: { xs: "90%", sm: "100%" },
          margin: "40px auto",
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
              Login
            </Typography>

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
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 5,
                }}
              >
                <CircularProgress
                  size={50}
                  thickness={4}
                  style={{ color: "#213555" }}
                />
              </Box>
            ) : (
              <>
                <Button
                  fullWidth
                  sx={{
                    backgroundColor: "#213555",
                    py: 1.5,
                    textTransform: "capitalize",
                    fontSize: "16px",
                    ":hover": { backgroundColor: "#213555" },
                    position: "relative",
                  }}
                  variant="contained"
                  type="submit"
                  disabled={loading}
                >
                  Login
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
                    Dont have an account?{" "}
                    <Link to={"/register"} style={{ textDecoration: "none" }}>
                      <Typography
                        component={"span"}
                        sx={{ color: "#213555", fontWeight: "bold" }}
                      >
                        Register
                      </Typography>
                    </Link>
                  </Typography>
                </Box>
              </>
            )}
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={() => {
          setShowSnackbar(false);
          setSnackbarMessage("");
        }}
      >
        <Alert
          onClose={() => {
            setShowSnackbar(false);
            setSnackbarMessage("");
          }}
          severity={snackbarSeverity}
          sx={{ width: "100%", fontSize: 20, alignItems: "center" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
