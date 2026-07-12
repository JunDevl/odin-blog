import { Navigate, type RouteObject } from "react-router";
import Blog from "./App";
import Auth from "./components/Auth/Auth";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import Posts from "./components/Posts/Posts";
import ViewingPost from "./components/ViewingPosts/ViewingPosts";

const jwt = localStorage.getItem("jwt");

const routes: RouteObject[] = [
  {
    path: "/",
    children: [
      {
        index: true,
        element: <Navigate to={jwt ? `/blog` : `/auth`} replace />
      },
      {
        path: "/auth",
        element: <Auth />
      },
      {
        path: "/blog",
        element: <Blog />,
        children: [
          {
            index: true,
            element: <Posts />
          },
          {
            path: ":postId",
            element: <ViewingPost />
          }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <PageNotFound />
  }
]

export default routes;