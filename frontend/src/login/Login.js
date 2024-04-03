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

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .matches(/@torontomu\.ca$/, "Email addresses must end with the domain @torontomu.ca.")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const Login = () => {
  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate();
  /*
  const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  if (loggedIn)
    navigate('/');
  */

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error"); // 'success' or 'error'
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then(async (userCredential) => {
          console.log(userCredential.user, "User Logged In Successfully"); // Sign-in successful

          const token = userCredential.user.accessToken;

          // Store auth status and token in sessionStorage
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("authToken", token);

          const userInfo = await fetch(
            `http://localhost:5001/api/users/get/email/${values.email}`,
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
          setOpenSnackbar(true);
          navigate("/"); // Redirect after showing success message
        })
        .catch((error) => {
          // Sign-in failure
          console.error("Error signing in: ", error.message);
          alert(`Error signing in: ${error.message}`);
          setSnackbarMessage(`Error signing in: ${error.message}`);
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
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
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
