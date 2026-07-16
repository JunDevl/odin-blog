import "./posts.css"

import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../actions";
import { Suspense, type MouseEvent } from "react";
import { useNavigate } from "react-router";
import { format } from "date-fns";

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
        {posts.map((post, i) => {
          const createdAt = new Date(post.createdAt)

          return (
            <div className="post" key={i} id={`${i}`} onClick={e => handleClick(e)}>
              <h3 className="title">{post.title}</h3>
              <p className="author">{post.author.name}</p>
              <p className="created">
                <time dateTime={post.createdAt}>
                  {format(createdAt, "P")}
                </time>
              </p>
            </div>
          )
        }
          
        )}
      </Suspense>
    </main>
  )
}

export default Posts