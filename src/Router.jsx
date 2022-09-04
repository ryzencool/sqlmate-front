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


const CustomRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/index" element={<Home/>}/>
            <Route path="/auth" element={<SignUpIn/>}>
                <Route path="signUp" element={<SignUp/>}/>
                <Route path="signIn" element={<SignIn/>}/>
            </Route>
            <Route path="/header" element={<Header/>}>
                <Route path={"home/:id"} element={<DBMain/>}/>

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
