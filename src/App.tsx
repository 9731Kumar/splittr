import React, { createContext, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import NavigationBar from "./naviagtion/navigation";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./app-routes";
import { FETCH_USER_BY_EMAIL, User } from "./app.constants";
import { updateUrlParams, useApi } from "./utils/ApiUtils";
import { Alert, AlertColor, Snackbar } from "@mui/material";

export const UserContext = createContext(null);
export const AlertContext  = createContext<any>(null);

const AppContent = () => {
  const [isUserLoggedIn, setUserLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("");
    const [severity , setSeverity] = useState<AlertColor>("error");
  const { httpGet } = useApi();

  const userLogin = (email?: string) => {
    if (email) {
      fetchUser(email);
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }
  };

  const handleAlertBar = (severity:AlertColor, showAlert:boolean, alertMsg:string) => {
    setShowAlert(showAlert);
    setSeverity(severity);
    setAlertMsg(alertMsg);
  }

  const fetchUser = async (email: string) => {
    const queryParam = {
      email: email,
    };
    await httpGet(updateUrlParams(FETCH_USER_BY_EMAIL, queryParam)).then(
      (response: any) => {
        if (response.data.status === "Success") {
          setUser(response.data.data);
          sessionStorage.setItem("user", JSON.stringify(response.data.data));
        }
      }
    );
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user")!);
    if (user) {
      setUserLoggedIn(true);
      setUser(JSON.parse(JSON.stringify(user)));
    }
  }, []);

  return (
    <>
    <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={6000}
          open={showAlert}
          onClose={() => setShowAlert(false)}
          key={"top" + "left"}
        >
          <Alert severity={severity} sx={{ width: "100%" }}>
            {alertMsg}
          </Alert>
        </Snackbar>
      <UserContext.Provider value={user}>
        <AlertContext.Provider value={handleAlertBar}>
        <NavigationBar isUserLoggedIn={isUserLoggedIn} />
        <AppRoutes userLogin={userLogin} />
        </AlertContext.Provider>
      </UserContext.Provider>
    </>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

export default App;
