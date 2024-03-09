export const saveUser = "/user";
export const LOGIN_USER = "/user/login";
export const FETCH_USER_BY_EMAIL = "/user/email";
export const FETCH_CONTACTS = "/user/contacts/email";
export const ADD_FRIENDS = "/user/addFriend";
export const GET_FRIENDS = "/userFriends/email";
export const GET_INCOMES = "/personalIncomes/email";
export const GET_EXPENSES = "/personalExpenses/email";
export const ADD_PERSONAL_INCOME = "/personalIncome/email";
export const ADD_PERSONAL_EXPENSE = "/personalExpense/email";
export const GET_CREATED_TEAMS = "/createdTeams/email";
export const GET_MEMBERS_TEAMS = "/teams/member/email";
export const ADD_TEAM = "/team";
export const GET_TEAM_EXPENSES = "/teamExpenses/teamId";
export const SAVE_TEAM_EXPENSE = "/teamExpense";
export const UPDATE_USER = "/user/update/id";
export const UPDATE_TEAM_STATUS = "/team/settled/id";

export interface User {
    id:number,
    name:string,
    email:string,
    password:string,
    phone:string
}