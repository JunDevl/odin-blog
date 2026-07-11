import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../actions";
import { Suspense } from "react";

type Props = {}

const Posts = (props: Props) => {
  const { data: posts } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts()
  });

  return (
    <main>
      <Suspense fallback={<p>Loading ...</p>}>
        {posts.map(post => 
          <div>
            <h3 className="title">{post.title}</h3>
            <span className="author">{post.author.name}</span>
            <span className="created">
              <time dateTime={post.createdAt.toUTCString()}>
                {post.createdAt.toUTCString()}
              </time>
            </span>
          </div>
        )}
      </Suspense>
    </main>
  )
}

export default Posts