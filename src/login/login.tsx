import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./login.css";
import { useApi } from "../utils/ApiUtils";
import { LOGIN_USER } from "../app.constants";
import Snackbar from "@mui/material/Snackbar";
import { AlertContext } from "../App";

interface LoginProps {
  userLogin: (email?: string) => void;
}

export const Login = ({ userLogin }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { httpPost } = useApi();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const handleAlertBar = useContext(AlertContext);

  const handleLogin = (e: any) => {
    e.preventDefault();
    const requestBody = {
      email: email,
      password: password,
    };

    httpPost(LOGIN_USER, requestBody).then((response: any) => {
      if (response.data.status === "Success") {
        userLogin(email);
        navigate("/teams");
        handleAlertBar("success", true, "User login successfully!!");
      } else if (response.data.status === "Error") {
        handleAlertBar("error", true, response.data.data);
      }
    });
  };

  useEffect(() => {
    sessionStorage.removeItem("user");
    userLogin();
  }, []);

  return (
    <>
      {/* <h1>Login</h1> */}
      <div className="login-container">
        {/* <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={6000}
          open={showAlert}
          onClose={() => setShowAlert(false)}
          key={"top" + "left"}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {alertMsg}
          </Alert>
        </Snackbar> */}
        <Container maxWidth="md" style={{ height: "100%" }}>
          <Paper style={{ padding: "20px" }}>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              style={{ height: "100%" }}
            >
              <Grid item xs={12} md={6} style={{ marginBottom: "20px" }}>
                <img src="/assets/split.png" width={200} height={100} />
                <Box display="flex" justifyContent="center">
                  <Typography className="px-5">
                    <Typography sx={{ fontWeight: 600, fontSize: "12px" }}>
                      Less Stress when sharing expenses with someone
                    </Typography>
                    Keep track of your shared expenses and balances with
                    housemates, trips, groups, friends, and family.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} className="px-2">
                <Typography variant="h4" align="center" gutterBottom>
                  Login
                </Typography>
                <form onSubmit={handleLogin}>
                  <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    style={{
                      backgroundColor:
                        !email.length || !password.length
                          ? "gray"
                          : "rgb(46 158 121)",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                    disabled={!email.length || !password.length}
                  >
                    Login
                  </Button>
                </form>
                <Typography>Don't have a account?</Typography>
                <NavLink style={{ color: " rgb(46 158 121)" }} to={"/signUp"}>
                  Signup here
                </NavLink>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </div>
    </>
  );
};

export default Login;
