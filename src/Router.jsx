import {Route, Routes} from "react-router-dom";
import About from "./pages/About";
import DBMain from "./pages/DBMain";
import Home from "./pages/home/Home";
import Profile from "./pages/Profile";
import Error from "./pages/Error";
import Dashboard from "./pages/dashboard/Dashboard";
import Header from "./pages/Header";
import FavoriteProject from "./pages/dashboard/project/FavoriteProject";
import CodeSettings from "./pages/dashboard/codeSettings/CodeSettings";
import CodeTemplateEdit from "./pages/dashboard/codeSettings/CodeTemplateEdit";
import PublicProject from "./pages/dashboard/project/PublicProject";
import Team from './pages/dashboard/team/Team'
import MyProject from "./pages/dashboard/project/MyProject";
import SignUpIn from "./pages/auth/SignUpIn";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import TeamDetail from "./pages/dashboard/team/TeamDetail";
import DefaultColumnTemplate from "./pages/dashboard/defaultColumnTemplate/DefaultColumnTemplate";
import DefaultColumnTemplateDetail from "./pages/dashboard/defaultColumnTemplate/DefaultColumnTemplateDetail";
import TeamJoin from "./pages/dashboard/team/TeamJoin";
import DBTable from "./pages/dbpage/table/DBTable"
import DBTerminal from "./pages/dbpage/terminal/DBTerminal"
import DBErd from "./pages/dbpage/er/DBErd"
import DBSnapshot from "./pages/dbpage/snap/DBSnapshot"
import DBSql from "./pages/dbpage/sql/DBSql";

const CustomRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/index" element={<Home/>}/>
            <Route path={"/team/join/:key"} element={<TeamJoin/>}/>
            <Route path="/auth" element={<SignUpIn/>}>
                <Route path="signUp" element={<SignUp/>}/>
                <Route path="signIn" element={<SignIn/>}/>
            </Route>
            <Route path="/console" element={<Header/>}>
                <Route path={"project/:id"} element={<DBMain/>}>
                    <Route path={"table"} element={<DBTable/>}/>
                    <Route path={"terminal"} element={<DBTerminal/>}/>
                    <Route path={"erd"} element={<DBErd/>}/>
                    <Route path={"snapshot"} element={<DBSnapshot/>}/>
                    <Route path={"sqlLib"} element={<DBSql/>}/>
                </Route>


                <Route path={"dashboard"} element={<Dashboard/>}>
                    <Route path={"favorite"} element={<FavoriteProject/>}/>
                    <Route path={"codeSettings"} element={<CodeSettings/>}/>
                    <Route path={"codeTemplateEdit/:id"} element={<CodeTemplateEdit/>}/>
                    <Route path={"publicProject"} element={<PublicProject/>}/>
                    <Route path={"favorite"} element={<FavoriteProject/>}/>
                    <Route path={"myProject"} element={<MyProject/>}/>
                    <Route path={"teams"} element={<Team/>}/>
                    <Route path={"teamDetail/:id"} element={<TeamDetail/>}/>
                    <Route path={"defaultColumnTemplate"} element={<DefaultColumnTemplate/>}/>
                    <Route path={"defaultColumnTemplate/detail/:id"} element={<DefaultColumnTemplateDetail/>}/>
                </Route>
            </Route>
            <Route path="/about" element={<About/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="*" element={<Error/>}/>
        </Routes>
    );
};

export default CustomRouter;
