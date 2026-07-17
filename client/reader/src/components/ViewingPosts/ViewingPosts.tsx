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
      <Link to="/blog" id="back">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M3 9H16.5C18.9853 9 21 11.0147 21 13.5C21 15.9853 18.9853 18 16.5 18H12M3 9L7 5M3 9L7 13"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
        </svg>
      </Link>
      <div id="blog_post">
        <Suspense fallback={<p>Loading ...</p>}>
          <p id="created">
            <time dateTime={createdAt.toUTCString()}>
              {format(createdAt, "P")}
            </time>
          </p>
          <h1 id="title">
            {post.title}
          </h1>
          <p id="content">
            {post.content}
          </p>
        </Suspense>
      </div>
      <Comments/>
    </main>
  )
}

export default ViewingPost