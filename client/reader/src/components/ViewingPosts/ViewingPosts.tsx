import Comments from "../Comments/Comments";
import { useParams } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../actions";
import { Suspense } from "react";

type Props = {}

const ViewingPost = (props: Props) => {
  const params = useParams();

  const postId = Number(params["postId"]);

  const { data: posts } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts()
  });

  const post = posts[postId - 1];

  return (
    <main>
      <Suspense fallback={<p>Loading ...</p>}>
        <h1 className="title">
          {post.title}
        </h1>
        <span className="created">
          <time dateTime={post.createdAt.toUTCString()}>
            {post.createdAt.toUTCString()}
          </time>
        </span>
        <p className="content">
          {post.content}
        </p>
      </Suspense>
      <Comments/>
    </main>
  )
}

export default ViewingPost