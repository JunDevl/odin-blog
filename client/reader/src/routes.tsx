import { Navigate, type RouteObject } from "react-router";
import App from "./App";
import Auth from "@shared/components/Auth/Auth";
import PageNotFound from "@shared/components/PageNotFound/PageNotFound";
import Profile from "@shared/components/Profile/Profile";
import Posts from "./components/Posts/Posts";
import ViewingPost from "./components/ViewingPosts/ViewingPosts";

const jwt = localStorage.getItem("jwt");

const routes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to={jwt ? `/blog` : `/auth`} replace/>
  },
  {
    path: "/auth",
    element: <Auth/>
  },
  {
    element: <App/>,
    children: [
      {
        path: "/blog",
        children: [
          {
            index: true,
            element: <Posts/>
          },
          {
            path: ":postId",
            element: <ViewingPost />
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