import {
  Add,
  AttachMoney,
  CloseOutlined,
  Delete,
  Person,
  SearchOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { teamheaders } from "./teams.constants";
import { AlertContext, UserContext } from "../App";
import { updateUrlParams, useApi } from "../utils/ApiUtils";
import {
  ADD_TEAM,
  GET_CREATED_TEAMS,
  GET_FRIENDS,
  GET_MEMBERS_TEAMS,
} from "../app.constants";
import { useNavigate } from "react-router-dom";
import "./teams.css";

const Teams = () => {
  const [searchText, setSearchText] = useState("");
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [createdTeams, setCreatedTeams] = useState([]);
  const [membersTeams, setMembersTeams] = useState([]);
  const [friendsList, setFiendsList] = useState<any>([]);
  const [selectedFriends, setSelectedFriends] = useState<any>([]);
  const user = useContext<any>(UserContext);
  const { httpGet, httpPost } = useApi();
  const handleAlertBar = useContext(AlertContext);
  const navigate = useNavigate();

  const handleAddFriend = (friend: any) => {
    setSelectedFriends([...selectedFriends, friend]);
    const index = friendsList.findIndex((data: any) => data.id === friend.id);
    friendsList.splice(index, 1);
    setFiendsList([...friendsList]);
  };

  const handleDelete = (friend: any) => {
    const index = selectedFriends.findIndex(
      (data: any) => data.id === friend.id
    );
    selectedFriends.splice(index, 1);
    setSelectedFriends([...selectedFriends]);
    setFiendsList([...friendsList, friend]);
  };

  const handleRowClick = (team:any) =>{
    navigate('/team', {state:{team: team}});
  }

  const addTeam = () => {
    const requestBody = {
      teamName: teamName,
      description: description,
      createdBy: user,
      users: selectedFriends,
    };

    httpPost(ADD_TEAM, requestBody).then((response: any) => {
      if (response.data.status === "Success") {
        setShowModal(false);
        getCreatedTeams();
        setTeamName("");
        setDescription("");
        setSelectedFriends([]);
        handleAlertBar('success', true, 'Team created successfully!!')
      } else if (response.data.status === 'Error') {
        handleAlertBar('error', true, response.data.data)
      }
    });
  };

  const getFriends = () => {
    const queryParam = {
      email: user?.email,
    };
    httpGet(updateUrlParams(GET_FRIENDS, queryParam)).then((response: any) => {
      if (response.data.status === "Success") {
        setFiendsList(response.data.data);
      }
    });
  };

  const getCreatedTeams = () => {
    const queryParams = {
      email: user?.email,
    };

    httpGet(updateUrlParams(GET_CREATED_TEAMS, queryParams)).then(
      (response: any) => {
        if (response.data.status === "Success") {
          setCreatedTeams(response.data.data);
        }
      }
    );
  };

  const getMembersTeams = () => {
    const queryParams = {
      email: user?.email,
    };

    httpGet(updateUrlParams(GET_MEMBERS_TEAMS, queryParams)).then(
      (response: any) => {
        if (response.data.status === "Success") {
          setMembersTeams(response.data.data);
        }
      }
    );
  };

  useEffect(() => {
    if (user) {
      getCreatedTeams();
      getMembersTeams();
    }
  }, [user]);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" m={2}>
            <Typography variant="h5" component="h3">
              Created Teams
            </Typography>
            <Box display="flex" justifyContent="space-around">
              {/* <Input
                id="standard-adornment-password"
                type="text"
                placeholder="Search Team"
                value={searchText}
                sx={{ marginRight: "10px" }}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                startAdornment={
                  <InputAdornment position="start">
                    {" "}
                    <SearchOutlined />
                  </InputAdornment>
                }
                endAdornment={
                  searchText && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchText("")}>
                        <CloseOutlined />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              /> */}
              <Button
              className="btn"
                variant="contained"
                onClick={() => {
                  getFriends();
                  setShowModal(true);
                }}
              >
                New Team
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} mt={2} mx={2}>
          <Paper>
            <TableContainer>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    {teamheaders.map((header: any) => (
                      <TableCell align="center">{header.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {createdTeams.length ? (
                    createdTeams.map((row: any) => (
                      <TableRow
                        key={row?.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{row.teamName}</TableCell>
                        <TableCell align="center">{row.description}</TableCell>
                        <TableCell align="center">{row.createdBy.name}</TableCell>
                        <TableCell align="center">
                          {row.teamMembers
                            .map((members: any) => members.name)
                            .join(", ")}
                        </TableCell>
                        <TableCell align="center">
                          {row.settled ? "Settled" : "Unsettled"}
                        </TableCell>
                        <TableCell align="center"><AttachMoney  color="primary" onClick={()=>handleRowClick(row)}/></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow sx={{ border: 0 }}>
                      <TableCell align="center" colSpan={4}>
                        No Data Available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
       <Typography variant="h5" component="h3" m={2}>Other Teams</Typography>
        <Grid item xs={12} mt={2} mx={2}>
          <Paper>
            <TableContainer>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    {teamheaders.map((header: any) => (
                      <TableCell align="center">{header.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {membersTeams.length ? (
                    membersTeams.map((row: any) => (
                      <TableRow
                        key={row?.id}
                        onClick={()=>handleRowClick(row)}
                        
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                       <TableCell align="center">{row.teamName}</TableCell>
                        <TableCell align="center">{row.description}</TableCell>
                        <TableCell align="center">{row.createdBy.name}</TableCell>
                        <TableCell align="center">
                          {row.teamMembers
                            .map((members: any) => members.name)
                            .join(", ")}
                        </TableCell>
                        <TableCell align="center">
                          {row.settled ? "Settled" : "Unsettled"}
                        </TableCell>
                        <TableCell align="center"><AttachMoney  color="primary" onClick={()=>handleRowClick(row)}/></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow sx={{ border: 0 }}>
                      <TableCell align="center" colSpan={4}>
                        No Data Available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10]}
        componentsProps = {{}}
      /> */}
      <Dialog
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setTeamName('');
          setDescription('');
          setSelectedFriends([]);
        }}
      >
        <DialogTitle>Create New Team</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText> */}
          <TextField
            required
            margin="dense"
            id="name"
            name="name"
            label="Team Name"
            type="text"
            fullWidth
            variant="standard"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Team Description"
            multiline
            rows={2}
            type="text"
            fullWidth
            variant="standard"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Box mb={2} mt={2}>
          <Typography variant="body1" >Selected Friends: </Typography>
          {selectedFriends.length>0 ?selectedFriends.map((friend: any) => {
            return (
              <ListItem key={friend.id}>
                <Chip
                  label={friend.name}
                  onDelete={() => handleDelete(friend)}
                />
              </ListItem>
            );
          }): <div>No Friends were added to Team</div>}
          </Box>
          {friendsList.length > 0 ? (
            <><Typography >Add Your Buddies:</Typography>
            <List>
              {friendsList.map((friend: any) => {
                return (
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="add"
                        onClick={() => handleAddFriend(friend)}
                      >
                        <Add />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={friend.name}
                      secondary={friend.email}
                    />
                  </ListItem>
                );
              })}
            </List></>
          ) : (
            <>Please add friends here</>
          )}
        </DialogContent>
        <DialogActions>
          <Button   className="btn"  variant="contained" disabled={teamName.length < 3} onClick={addTeam}>Create</Button>
          <Button
              variant="contained"
              color="error"
              onClick={() => {
              setShowModal(false);
              setTeamName("");
              setDescription("");
              setSelectedFriends([]);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Teams;
