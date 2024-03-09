import { Navigate, Route, Routes } from "react-router-dom"
import Teams from "./teams/teams";
import Signup from "./signUp/signUp";
import Login from "./login/login";
import Friends from "./friends/friends-list";
import PersonalExpenses from "./personal-expenses/personal-expenses";
import Team from "./teams/team/team";
import Profile from "./profile/profile";

interface RoutesProps {
    userLogin:(email?:string)=>void
}

const AppRoutes = ({userLogin}:RoutesProps)=>{
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login userLogin={userLogin}/>} />
            <Route path="/signUp" element={<Signup />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/expenses" element={<PersonalExpenses />} />
            <Route path="/team" element={<Team />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<Navigate to="/login" />} />
        </Routes>
    )
}

export default AppRoutes;