import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchUser } from "../../actions";
import "./toolbar.css"
import { Suspense } from "react";

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
          <li className="user">
            {user.name}
          </li>
        </Suspense>
      </ul>
    </nav>
  )
}

export default Toolbar