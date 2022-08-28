import {Route, Routes} from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Error from "./pages/Error";
import Dashboard from "./pages/Dashboard";
import Header from "./pages/Header";
import FavoriteProject from "./pages/FavoriteProject";
import Template from "./pages/Template";
import DashProject from "./pages/DashProject";
import CodeSettings from "./pages/CodeSettings";
import CodeTemplateEdit from "./pages/CodeTemplateEdit";
import PublicProject from "./pages/PublicProject";
import Team from './pages/Team'
import FieldSettings from "./pages/FieldSettings";
import MyProject from "./pages/MyProject";
import SignUpIn from "./pages/SignUpIn";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import TeamDetail from "./pages/TeamDetail";
import DefaultColumnTemplate from "./pages/DefaultColumnTemplate";
import DefaultColumnTemplateDetail from "./pages/DefaultColumnTemplateDetail";

// const routerMap = [
//     {
//         path: '/index',
//         element: <Index/>,
//     }
// ]

const CustomRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Index/>}/>
            <Route path="/index" element={<Index/>}/>
            <Route path="/auth" element={<SignUpIn/>}>
                <Route path="signUp" element={<SignUp/>}/>
                <Route path="signIn" element={<SignIn/>}/>
            </Route>
            <Route path="/header" element={<Header/>}>
                <Route path={"home/:id"} element={<Home/>}/>

                <Route path={"dashboard"} element={<Dashboard/>}>
                    <Route path={"favorite"} element={<FavoriteProject/>}/>
                    <Route path={"pubTemplate"} element={<Template/>}/>
                    <Route path={"project"} element={<DashProject/>}/>
                    <Route path={"codeSettings"} element={<CodeSettings/>}/>
                    <Route path={"codeTemplateEdit/:id"} element={<CodeTemplateEdit/>}/>
                    <Route path={"publicProject"} element={<PublicProject/>}/>
                    <Route path={"favorite"} element={<FavoriteProject/>}/>
                    <Route path={"myProject"} element={<MyProject/>}/>
                    <Route path={"teams"} element={<Team/>}/>
                    <Route path={"teamDetail/:id"} element={<TeamDetail/>}/>
                    <Route path={"defaultColumnTemplate"} element={<DefaultColumnTemplate/>}/>
                    <Route path={"defaultColumnTemplate/detail/:id"} element={<DefaultColumnTemplateDetail/>}/>
                    <Route path={"fieldSettings"} element={<FieldSettings/>}/>
                </Route>
            </Route>
            <Route path="/about" element={<About/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="*" element={<Error/>}/>
        </Routes>
    );
};

export default CustomRouter;
