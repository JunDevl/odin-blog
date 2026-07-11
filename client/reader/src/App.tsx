import { Outlet } from "react-router";
import Toolbar from "./components/Toolbar/Toolbar";

const Blog = () => {

  return (
    <>
      <Toolbar />
      <Outlet />
    </>
  )
}

export default Blog
