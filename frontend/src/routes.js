import Project from "./Pages/Project";
import LoginPage from "./Pages/LoginPage";
import CreateProjectPage from "./Pages/CreateProjectPage";
import ProjectDashboardPage from "./Pages/ProjectDashboardPage";
import ProjectTaskPage from "./Pages/ProjectTaskPage";
import ProjectTimelinePage from "./Pages/ProjectTimelinePage";
import ProjectManagementPage from "./Pages/ProjectManagementPage";
import CreateNoticePage from "./Pages/CreateNoticePage";
import CreateTaskPage from "./Pages/CreateTaskPage";
import ErrorPage from "./Pages/ErrorPage";
import ProtectedRoute from "./ProtectedRoute";
import UserPage from "./Pages/UserPage";
import EditTaskPage from "./Pages/EditTaskPage";
import PostPage from "./Pages/PostPage";
import EditNoticePage from "./Pages/EditNoticePage";

const routes = [
    {
        auth: true,
        path: '/',
        element: <ProtectedRoute/>,
    },
    {
        auth: true,
        path: '/project',
        element: <Project/>,
    },
    {
        path: '/login',
        element: <LoginPage/>
    },
    {
        auth: true,
        path: '/members/info',
        element: <UserPage/>
    },
    {
        auth: true,
        path: '/project/create',
        element: <CreateProjectPage/>
    },
    {
        auth: true,
        path: '/project/dashboard/create',
        element: <CreateNoticePage/>
    },
    {
        auth: true,
        path: '/project/dashboard/edit',
        element: <EditNoticePage/>
    },
    {
        auth: true,
        path: '/project/task/create',
        element: <CreateTaskPage/>
    },
    {
        auth: true,
        path: '/project/dashboard',
        element: <ProjectDashboardPage/>
    },
    {
        auth: true,
        path: '/project/dashboard/post',
        element: <PostPage/>
    },
    {
        auth: true,
        path: '/project/task',
        element: <ProjectTaskPage/>
    },
    {
        auth: true,
        path: '/project/task/edit',
        element: <EditTaskPage/>
    },
    {
        auth: true,
        path: '/project/timeline',
        element: <ProjectTimelinePage/>
    },
    {
        auth: true,
        path: '/project/management',
        element: <ProjectManagementPage/>
    },
    {
        path: '*',
        element: <ErrorPage/>
    },
];

export default routes;