import { LockOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { updateUrlParams, useApi } from "../utils/ApiUtils";
import { UPDATE_USER } from "../app.constants";


const Profile = ()=>{
  const [open, setOpen] = useState(false);
  const [editMode,setEditMode] = useState(false);
  const userData = useContext<any>(UserContext);
  const [user, setUser] = useState<any>(null);
  const { httpPut} = useApi();
  const navigate = useNavigate();

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  useEffect(()=>{
    if(userData) {
        setUser({...userData});
    }
  },[userData])

  const handleEditorUpdate = ()=>{
    setEditMode(!editMode);
    if(editMode){
        updateUser();
    }
  }

  const updateUser = ()=>{
    const queryParam = {
      id: user?.id
    };

    httpPut(updateUrlParams(UPDATE_USER, queryParam), user).then((response:any)=>{
      if(response.data.status === "Success"){
        navigate('/teams');
        sessionStorage.setItem("user", JSON.stringify(response.data.data));
      }
    })

  }

  const handleLogout = ()=>{
    navigate('/logout');
  }
     return <>
     <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "success.main" }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Profile
          </Typography>
          <Box component={Paper} elevation={3} sx={{ mt: 3, p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Avatar
                  alt="User Image"
                  src={""}
                  sx={{ width: "200px", height: "200px" }}
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  disabled={!editMode}
                  value={user?.name}
                  onChange={handleInputChange}
                />
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  disabled={!editMode}
                  value={user?.email}
                  onChange={handleInputChange}
                  sx={{ mt: 2 }}
                />
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  type="password"
                  name="password"
                  disabled={!editMode}
                  value={user?.password}
                  onChange={handleInputChange}
                  sx={{ mt: 2 }}
                />
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  disabled={!editMode}
                  value={user?.phone}
                  onChange={handleInputChange}
                  sx={{ mt: 2 }}
                />
                <Grid display={"flex"}>
                  <Grid item xs={5}>
                    <Button
                      type="submit"
                      variant="contained"
              className="btn"
                      fullWidth
                      sx={{ mt: 3 }}
                      onClick={() => handleEditorUpdate()}
                    >
                      {editMode ? 'Update' : 'Edit'} User
                    </Button>
                  </Grid>
                  <Grid item xs={5}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="error"
                      fullWidth
                      sx={{ m: 3 }}
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      {/* <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Update Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Old Password"
            type="password"
            fullWidth
            value={oldPassword}
            onChange={checkOldPwd}
          />
          <TextField
            autoFocus
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={password}
            onChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePasswordUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog> */}
     </>
}

export default Profile;