import {
  Add,
  ArrowDownward,
  ArrowDropDown,
  CurrencyRupeeRounded,
  North,
  South,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Stack,
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
import { AlertContext, UserContext } from "../App";
import { updateUrlParams, useApi } from "../utils/ApiUtils";
import {
  ADD_PERSONAL_EXPENSE,
  ADD_PERSONAL_INCOME,
  GET_EXPENSES,
  GET_INCOMES,
} from "../app.constants";
import "./personal-expenses.css";

const PersonalExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const { httpPost, httpGet } = useApi();
  const user = useContext<any>(UserContext);
  const handleAlertBar = useContext(AlertContext);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [incomeOpen, setIncomeOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [incomeObj, setIncomeObj] = useState({ description: "", amount: 0 });
  const [expenseObj, setExpenseObj] = useState({ description: "", amount: 0 });

  const getDate = (dateString: string) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month (0 for January)
    const year = date.getFullYear();

    const formattedDay = (day < 10 ? "0" : "") + day;
    const formattedMonth = (month < 10 ? "0" : "") + month;

    return formattedDay + "-" + formattedMonth + "-" + year;
  };

  const handleAddIncome = () => {
    const queryParam = {
      email: user?.email,
    };
    httpPost(updateUrlParams(ADD_PERSONAL_INCOME, queryParam), incomeObj).then(
      (response: any) => {
        if (response.data.status === "Success") {
          getIncomesOfUser();
          setIncomeOpen(false);
          setIncomeObj({ description: "", amount: 0 });
          handleAlertBar("success", true, "Income added successfully!!");
        } else if(response.data.status === "Error") {
          handleAlertBar("error", true, response.data.data);
        }
      }
    );
  };

  const handleAddExpense = () => {
    const queryParam = {
      email: user?.email,
    };
    httpPost(
      updateUrlParams(ADD_PERSONAL_EXPENSE, queryParam),
      expenseObj
    ).then((response: any) => {
      if (response.data.status === "Success") {
        getExpensesOfUser();
        setExpenseOpen(false);
        setExpenseObj({ description: "", amount: 0 });
        handleAlertBar("success", true, "Expense added successfully!!");
      } else if(response.data.status === "Error") {
        handleAlertBar("error", true, response.data.data);
      }
    });
  };

  const getIncomesOfUser = () => {
    const queryParam = {
      email: user?.email,
    };

    httpGet(updateUrlParams(GET_INCOMES, queryParam)).then((response: any) => {
      if (response.data.status === "Success") {
        setIncomes(response.data.data);
      }
    });
  };
  const getExpensesOfUser = () => {
    const queryParam = {
      email: user?.email,
    };

    httpGet(updateUrlParams(GET_EXPENSES, queryParam)).then((response: any) => {
      if (response.data.status === "Success") {
        setExpenses(response.data.data);
      }
    });
  };

  const getTotals = () => {
    const te = expenses.reduce((acc, value: any) => {
      return acc + value?.expense;
    }, 0);
    const ti = incomes.reduce((acc, value: any) => {
      return acc + value?.expense;
    }, 0);

    setTotalExpense(te);
    setTotalIncome(ti);
  };

  useEffect(() => {
    getIncomesOfUser();
    getExpensesOfUser();
  }, [user]);

  useEffect(() => {
    getTotals();
  }, [incomes, expenses]);

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        mx={2}
        mb={4}
      >
        <Grid container>
          <Grid item xs={8}>
            <Stack spacing={2} direction="row" alignItems="center" mt={2}>
              <Alert
                icon={<CurrencyRupeeRounded fontSize="inherit" />}
                severity="success"
              >
                Total Expenses: {totalExpense}
              </Alert>
              <Alert
                icon={<CurrencyRupeeRounded fontSize="inherit" />}
                severity="info"
              >
                Total Income: {totalIncome}
              </Alert>
              <Alert
                icon={<CurrencyRupeeRounded fontSize="inherit" />}
                severity="warning"
              >
                Total Balance: {totalIncome - totalExpense}
              </Alert>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-evenly"
              p={2}
            >
              <div>
                <IconButton
                  color="primary"
                  onClick={() => {
                    setIncomeOpen(!incomeOpen);
                  }}
                >
                  <Typography>Add Income</Typography>
                  <Add />
                </IconButton>
                <Collapse in={incomeOpen}>
                  <div className="collapse-container">
                    <TextField
                      label="Enter Description"
                      variant="standard"
                      color="primary"
                      value={incomeObj.description}
                      onChange={(e) => {
                        setIncomeObj({
                          ...incomeObj,
                          description: e.target.value,
                        });
                      }}
                    />
                    <TextField
                      label="Enter Amount"
                      variant="standard"
                      color="primary"
                      type="number"
                      value={incomeObj.amount===0?'':incomeObj.amount}
                      onChange={(e) => {
                        setIncomeObj({
                          ...incomeObj,
                          amount: Number(e.target.value),
                        });
                      }}
                    />
                    <Button
                      variant="contained"
                      className="btn"
                      sx={{ margin: "5px" }}
                      disabled={
                        incomeObj.description.length < 3 ||
                        incomeObj.amount === 0
                      }
                      onClick={handleAddIncome}
                    >
                      Add
                    </Button>
                  </div>
                </Collapse>
              </div>
              <div>
                <IconButton
                  color="secondary"
                  onClick={() => {
                    setExpenseOpen(!expenseOpen);
                  }}
                >
                  <Typography>Add Expense</Typography>
                  <Add />
                </IconButton>
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
                       className="btn"
                      sx={{ margin: "5px" }}
                      disabled={
                        expenseObj.description.length < 3 ||
                        expenseObj.amount === 0
                      }
                      onClick={handleAddExpense}
                    >
                      Add
                    </Button>
                  </div>
                </Collapse>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Grid container>
        <Grid item xs={6} px={2}>
         <Typography>Incomes</Typography>
          <Paper>
            <TableContainer>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>SI No</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Created On</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incomes.length ? (
                    incomes.map((row: any, index) => (
                      <TableRow
                        key={row?.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.description}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {getDate(row.createddate)}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.expense}
                        </TableCell>
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
        <Grid item xs={6} px={2}>
        <Typography alignSelf="flex-start">Expenses</Typography>
          <Paper>
            <TableContainer>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell>SI No</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Created On</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.length ? (
                    expenses.map((row: any, index) => (
                      <TableRow
                        key={row?.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.description}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {getDate(row.createddate)}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.expense}
                        </TableCell>
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
    </>
  );
};

export default PersonalExpenses;
