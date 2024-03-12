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
import { Link } from "react-router-dom";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const Login = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
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
    </Box>
  );
};

export default Login;
