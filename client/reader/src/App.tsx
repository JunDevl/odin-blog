import { Outlet } from "react-router";
import Toolbar from "./components/Toolbar/Toolbar";

const App = () => {

  return (
    <>
      <Toolbar/>
      <Outlet/>
    </>
  )
}

export default App
