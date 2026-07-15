import "./viewingpost.css";

import Comments from "../Comments/Comments";
import { Link, useParams } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../actions";
import { Suspense } from "react";
import { format } from "date-fns";

type Props = {}

const ViewingPost = (props: Props) => {
  const params = useParams();

  const postId = Number(params["postId"]);

  const { data: posts } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts()
  });

  const post = posts[postId - 1];

  const createdAt = new Date(post.createdAt);

  return (
    <main id="post">
      <Link to="/blog">
        Go back
      </Link>
      <div className="blog_post">
        <Suspense fallback={<p>Loading ...</p>}>
          <p className="created">
            <time dateTime={createdAt.toUTCString()}>
              {format(createdAt, "P")}
            </time>
          </p>
          <h1 className="title">
            {post.title}
          </h1>
          <p className="content">
            {post.content}
          </p>
        </Suspense>
      </div>
      <Comments/>
    </main>
  )
}

export default ViewingPost