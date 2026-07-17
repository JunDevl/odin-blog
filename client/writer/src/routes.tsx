import { Navigate, type RouteObject } from "react-router";
import App from "./App";
import Auth from "@shared/components/Auth/Auth";
import PageNotFound from "@shared/components/PageNotFound/PageNotFound";
import Profile from "@shared/components/Profile/Profile";
import Posts from "./components/Posts/Posts";
import EditingPost from "./components/EditingPost/EditingPost";

const jwt = localStorage.getItem("jwt");

const routes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to={jwt ? `/posts` : `/auth`} replace/>
  },
  {
    path: "/auth",
    element: <Auth admin/>
  },
  {
    element: <App/>,
    children: [
      {
        path: "/posts",
        children: [
          {
            index: true,
            element: <Posts/>
          },
          {
            path: ":postId",
            element: <EditingPost/>
          }
        ]
      },
      {
        path: "/profile",
        element: <Profile/>
      }
    ]
  },
  {
    path: "*",
    element: <PageNotFound/>
  }
]

export default routes;