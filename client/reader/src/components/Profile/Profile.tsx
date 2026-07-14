import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchUser } from "../../actions";
import { Suspense } from "react";

type Props = {}

const Profile = (props: Props) => {
  const { data: user } = useSuspenseQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser()
  });


  return (
    <div>
      <Suspense fallback={<p>Loading ...</p>}>
        <p className="name">{user.name}</p>
        <p className="emai">{user.email}</p>
      </Suspense>
    </div>
  )
}

export default Profile