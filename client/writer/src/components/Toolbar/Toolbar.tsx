import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchUser } from "../../actions";
import "./toolbar.css"
import { Suspense } from "react";
import { Link } from "react-router";

type Props = {}

const Toolbar = (props: Props) => {
  const { data: user } = useSuspenseQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser()
  });

  return (
    <nav id="toolbar">
      <ul>
        <Suspense fallback={<p>Loading ...</p>}>
          <li className="home">
            <Link to={"/posts"}>Home</Link>
          </li>
          <li className="user">
            <Link to={"/profile"}>
              {user.name}
            </Link>
          </li>
        </Suspense>
      </ul>
    </nav>
  )
}

export default Toolbar