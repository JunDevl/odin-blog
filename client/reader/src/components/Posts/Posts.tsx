import "./posts.css"

import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../actions";
import { Suspense, type MouseEvent } from "react";
import { useNavigate } from "react-router";

type Props = {}

const Posts = (props: Props) => {
  const navigate = useNavigate();

  const { data: posts } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts()
  });

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;

    navigate(`${Number(target.id) + 1}`);
  }

  return (
    <main id="blog_posts">
      <Suspense fallback={<p>Loading ...</p>}>
        {posts.map((post, i) => 
          <div className="post" key={i} id={`${i}`} onClick={e => handleClick(e)}>
            <h3 className="title">{post.title}</h3>
            <span className="author">{post.author.name}</span>
            <span className="created">
              <time dateTime={post.createdAt}>
                {post.createdAt}
              </time>
            </span>
          </div>
        )}
      </Suspense>
    </main>
  )
}

export default Posts