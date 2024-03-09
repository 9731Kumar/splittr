import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { updateUrlParams, useApi } from "../../utils/ApiUtils";
import { GET_TEAM_EXPENSES, SAVE_TEAM_EXPENSE, UPDATE_TEAM_STATUS } from "../../app.constants";
import { AlertContext, UserContext } from "../../App";
import "./team.css";
import {
  Button,
  Chip,
  Collapse,
  Grid,
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
import { AttachMoney } from "@mui/icons-material";

const Team = () => {
  const [teamExpenses, setTeamExpenses] = useState([]);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [splittedBill, setSplittedBill] = useState<any>([]);
  const { httpGet, httpPost, httpPut } = useApi();
  const [team, setTeam] = useState<any>();
  const [teamMembers, setTeamMembers] = useState<any>([]);
  const { state } = useLocation();
  const user = useContext(UserContext);
  const [expenseObj, setExpenseObj] = useState({ description: "", amount: 0 });
  const handleAlertBar = useContext(AlertContext);

  const updateStatus = ()=>{
    const queryParam = {
      id: team.id
    }

    const requestBody = {
      isSettled: true
    }

    httpPut(updateUrlParams(UPDATE_TEAM_STATUS, queryParam), requestBody).then((response:any)=>{
      if(response.data.status === 'Success') {

      }
    })


  }

  const splitBill = (friends: any, contributions: any) => {
    const totalContribution = contributions.reduce(
      (acc: any, curr: any) => acc + curr,
      0
    );
    const share = totalContribution / friends.length;

    // Calculate how much each person owes or is owed
    const balances: any = {};
    friends.forEach((friend: string | number, index: string | number) => {
      const contribution = contributions[index];
      balances[friend] = contribution - share;
    });
    // Find out who owes whom and how much
    const transactions = [];
    let positiveBalances = Object.keys(balances).filter(
      (key) => balances[key] > 0
    );
    let negativeBalances = Object.keys(balances).filter(
      (key) => balances[key] < 0
    );

    let i = 0;
    let j = 0;

    while (i < positiveBalances.length && j < negativeBalances.length) {
      const debtor = negativeBalances[j];
      const creditor = positiveBalances[i];
      const amount = Math.min(-balances[debtor], balances[creditor]);

      balances[debtor] += amount;
      balances[creditor] -= amount;

      transactions.push(`${debtor} pays ${creditor} Rs.${amount.toFixed(2)}`);

      if (balances[debtor] === 0) j++;
      if (balances[creditor] === 0) i++;
    }

    return transactions;
  };

  const handleSplitExpense = () => {
    let obj: any = {};
    let creator = team.createdBy.name;
    obj[creator] = 0;
    teamExpenses.forEach((teamExp: any) => {
      if (!obj.hasOwnProperty(teamExp.addedBy.name)) {
        obj[teamExp.addedBy.name] = teamExp.expense;
      } else {
        const arr = obj[teamExp.addedBy.name] + teamExp.expense;
        obj[teamExp.addedBy.name] = arr;
      }
    });

    team.teamMembers.forEach((member: any) => {
      if (!obj.hasOwnProperty(member?.name)) {
        obj[member.name] = 0;
      }
    });
  
    const transactions = splitBill(Object.keys(obj), Object.values(obj));
    setSplittedBill([...transactions]);
    updateStatus();
  };

  const getTeamExpenses = () => {
    const queryParams = {
      teamId: team?.id,
    };

    httpGet(updateUrlParams(GET_TEAM_EXPENSES, queryParams)).then(
      (response: any) => {
        if (response.data.status === "Success") {
          setTeamExpenses(response.data.data);
        }
      }
    );
  };

  const addExpense = () => {
    const requestBody = {
      teamId: team?.id,
      description: expenseObj.description,
      amount: expenseObj.amount,
      addedBy: user,
    };

    httpPost(SAVE_TEAM_EXPENSE, requestBody).then((response: any) => {
      if (response.data.status === "Success") {
        getTeamExpenses();
        setExpenseOpen(false);
        setExpenseObj({ description: "", amount: 0 });
        handleAlertBar("success", true, "Expense added successfully!!");
      } else if(response.data.status === 'Error') {
        handleAlertBar("error", true, response.data.data);
      }
    });
  };

  useEffect(() => {
    setTeam(state.team);
    setTeamMembers([state.team.createdBy, ...state.team.teamMembers]);
  }, [state]);

  useEffect(() => {
    if (team) {
      getTeamExpenses();
    }
  }, [team]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: 20 }}>
            <Grid container spacing={2}>
              <Grid item xs={3} style={{ display: "flex" }}>
                <Typography variant="subtitle2" mr={2} mt={1}>
                  Group Name
                </Typography>

                <Chip label={team?.teamName} className="chip-color" />
              </Grid>

              <Grid item xs={7} style={{ display: "flex" }}>
                {teamMembers.length > 0 && (
                  <Typography variant="subtitle2" mr={2} mt={1}>
                    Group Members:
                  </Typography>
                )}

                <div>
                  {teamMembers.map((member: any, index: any) => (
                    <Chip
                      key={index}
                      label={member?.name}
                      className="chip-color"
                    />
                  ))}
                </div>
              </Grid>

              { !team?.settled && <Grid
                item
                xs={2}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <Button
                  variant="contained"
                  className="btn"
                  onClick={() => setExpenseOpen(!expenseOpen)}
                >
                  Add Expenses
                </Button>
                <Collapse in={expenseOpen}>
                  <div className="collapse-container">
                    <TextField
                      label="Enter Description"
                      variant="standard"
                      color="primary"
                      value={expenseObj.description}
                      onChange={(e) => {
                        setExpenseObj({
                          ...expenseObj,
                          description: e.target.value,
                        });
                      }}
                    />
                    <TextField
                      label="Enter Amount"
                      variant="standard"
                      color="primary"
                      type="number"
                      value={expenseObj.amount===0?'':expenseObj.amount}
                      onChange={(e) => {
                        setExpenseObj({
                          ...expenseObj,
                          amount: Number(e.target.value),
                        });
                      }}
                    />
                    <Button
                      variant="contained"
                      color="warning"
                      sx={{ margin: "5px" }}
                      disabled={
                        expenseObj.description.length < 3 ||
                        expenseObj.amount === 0
                      }
                      onClick={addExpense}
                    >
                      Add
                    </Button>
                  </div>
                </Collapse>
              </Grid>}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} mx={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell> Expense Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Added By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamExpenses.length > 0 ? (
                  teamExpenses.map((expense: any) => {
                    return (
                      <TableRow>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{expense.expense}</TableCell>
                        <TableCell>{expense.addedBy.name}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <>No Expenses haven't added yet</>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={10} style={{ display: "flex" }}>
          {splittedBill.length > 0 && (
            <Grid ml={4}>
              <Typography variant="subtitle1">Splitted Amount</Typography>
              {splittedBill.map((bill: any) => {
                return <Chip label={bill} className="chip-color" />;
              })}
            </Grid>
          )}
        </Grid>
        {(splittedBill.length>0 || !team?.settled) && (
          <Grid item xs={2}>
            <Button
              variant="contained"
              className="btn"
              onClick={handleSplitExpense}
              disabled={teamExpenses.length === 0}
            >
              Split Expenses
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Team;
