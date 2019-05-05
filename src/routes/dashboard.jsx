import Dashboard from "views/Dashboard/Dashboard";
import UserProfile from "views/UserProfile/UserProfile";
import TableList from "views/TableList/TableList";
import Typography from "views/Typography/Typography";
import Icons from "views/Icons/Icons";
import Maps from "views/Maps/Maps";
import Notifications from "views/Notifications/Notifications";
import Upgrade from "views/Upgrade/Upgrade";
import AllProblems from "components/AllProblems/AllProblems";
import ResolvedProblems from "../components/ResolvedProblems/Resolved";
import UnResolved from "../components/UnResolved/UnResolved";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard
  },
  {
    path: "/all",
    name: "All Problems",
    icon: "pe-7s-user",
    component: AllProblems
  },
  {
    path: "/resolved",
    name: "Resolved",
    icon: "pe-7s-user",
    component: ResolvedProblems
  },
  {
    path: '/nonresolved',
    name: 'UnResolved',
    icon: 'pe-7s-user',
    component: UnResolved
  },
  { redirect: true, path: "/", to: "/dashboard", name: "Dashboard" }
];

export default dashboardRoutes;
