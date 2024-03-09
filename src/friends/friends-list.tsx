import {
  AddCircleOutlineOutlined,
  Close,
  Person,
  PersonAdd,
  PersonPinCircleOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import { blue, green } from "@mui/material/colors";
import { useContext, useEffect, useState } from "react";
import { updateUrlParams, useApi } from "../utils/ApiUtils";
import { AlertContext, UserContext } from "../App";
import {
  ADD_FRIENDS,
  FETCH_CONTACTS,
  GET_FRIENDS,
  User,
} from "../app.constants";
import "./friends-list.css"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const Friends = () => {
  const [userFriends, setUserFriends] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [openDailog, setOpenDailog] = useState(false);
  const { httpGet, httpPost } = useApi();
  const user = useContext<any>(UserContext);
  const handleAlertBar = useContext(AlertContext);

  const handleAddFriend = (contact: any) => {
    const requestBody = {
      userEmail: user.email,
      friendEmail: contact.email,
    };

    httpPost(ADD_FRIENDS, requestBody).then((response) => {
      if (response.data.data) {
        getContacts();
        handleAlertBar('success', true, 'Friend Added Successfull!!')
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
        setUserFriends(response.data.data);
      }
    });
  };

  const getContacts = () => {
    const queryParam = {
      email: user?.email,
    };
    httpGet(updateUrlParams(FETCH_CONTACTS, queryParam)).then((response) => {
      if (response.data.status === "Success") {
        setContactList(response.data.data);
        getFriends();
      }
    });
  };

  useEffect(() => {
    getFriends();
  }, [user]);

  return (
    <>
      {!userFriends.length ? (
        <>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
            mt={16}
          >
            <Paper sx={{ marginBottom: "20px" }}>
              <img src="/assets/friends.png" alt="friends" height="300px" />
            </Paper>
            <Button
              variant="contained"
              className="btn"
              startIcon={<PersonAdd />}
              onClick={() => {
                getContacts();
                setOpenDailog(true);
              }}
            >
              Add Friends
            </Button>
          </Box>
        </>
      ) : (
        <Box mt={2} mx={2} display="flex" flexDirection="column">
          <div className="header">
            <Typography variant="subtitle1">FRIENDS</Typography>
            <Button
               variant="contained"
               className="btn"
              startIcon={<PersonAdd />}
              onClick={() => {
                getContacts();
                setOpenDailog(true);
              }}
            >
              Add Friends
            </Button>
          </div>
          <TableContainer component={Paper} className="px-5">
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell>Phone</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userFriends.map((friend: any) => (
                  <StyledTableRow key={friend.email}>
                    <StyledTableCell component="th" scope="row">
                      {friend.name}
                    </StyledTableCell>
                    <StyledTableCell>{friend.email}</StyledTableCell>
                    <StyledTableCell>{friend.phone}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Dialog onClose={() => setOpenDailog(false)} open={openDailog}>
        <DialogTitle mx={1}>  <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Contacts</Typography>
            <IconButton aria-label="close" onClick={() => setOpenDailog(false)}>
              <Close />
            </IconButton>
          </div></DialogTitle>
        <List
          sx={{
            pt: 0,
            marginLeft: "16px",
            marginRight: "16px",
            width: "400px",
          }}
        >
          {contactList.length ? contactList.map((contact: any) => (
            <ListItem disableGutters key={contact.email}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: green[100], color: green[600] }}>
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={contact.name} secondary={contact.email} />
              <IconButton
                color="success"
                aria-label="add to friends"
                onClick={() => handleAddFriend(contact)}
              >
                <PersonAdd />
              </IconButton>
              {/* </ListItemButton> */}
            </ListItem>
          )): <><Typography variant="subtitle1" align="center">No More Contacts</Typography></>}
        </List>
      </Dialog>
    </>
  );
};

export default Friends;
