import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchUser } from "../../actions";
import "./toolbar.css"

type Props = {}

const Toolbar = (props: Props) => {
  const { data: user } = useSuspenseQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser()
  });

  return (
    <nav id="toolbar">
      <ul>
        <li className="user">
          {user.name}
        </li>
      </ul>
    </nav>
  )
}

export default Toolbar