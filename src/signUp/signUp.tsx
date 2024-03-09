import { Alert, Button, Container, Grid, Paper, Snackbar, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react";
import "./signUp.css"
import { useApi } from "../utils/ApiUtils";
import { saveUser } from "../app.constants";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../App";

export const Signup = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { httpPost } = useApi();
    const navigate = useNavigate();
    const handleAlertBar = useContext(AlertContext);

  
    const handleSignup = (e: any) => {
      e.preventDefault();
      const requestBody = {
        name:name,
        email: email,
        password: password,
        phone: phone
      }

      httpPost(saveUser, requestBody).then((response:any)=>{
        if(response.data.status === "Success") {
          handleAlertBar("success", true, "User created successfully!!")
          navigate("/login");
        } else if (response.data.status === "Error") {
          handleAlertBar("error", true, response.data.data);
        }
      } )
    };

    const disableButton = ():boolean=>{
      return name.length>3 && email.length>3 && phone.length === 10 && password.length>6;
    }

  
    return (
      <div className="signup-container">
        <Container maxWidth="md" style={{ height: "100vh" }}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: "100%" }}
          >
            {/* <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="center">
                <img
                  src="/assets/Split_Expenses.png"
                  alt="Signup"
                  style={{ width: "80%", maxWidth: "300px", height: "auto" }}
                />
              </Box>
            </Grid> */}
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: "20px" }}>
                <Typography variant="h4" align="center" gutterBottom>
                  Sign Up
                </Typography>
                <form onSubmit={handleSignup}>
                  <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    label="Phone"
                    fullWidth
                    type="number"
                    margin="normal"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <TextField
                    label="Email"
                    type="email"
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
                      backgroundColor: !disableButton()?"grey":"rgb(46 158 121)",
                      marginTop: "20px",
                    }}
                    disabled={!disableButton()}
                  >
                    Sign Up
                  </Button>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  };
  
  export default Signup;