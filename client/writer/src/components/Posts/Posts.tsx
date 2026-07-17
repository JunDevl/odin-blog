import "./posts.css";

import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchUserPosts } from "../../actions";
import { useNavigate } from "react-router";
import { Suspense, type MouseEvent } from "react";
import { format } from "date-fns";

type Props = {}

const Posts = (props: Props) => {
  const navigate = useNavigate();

  const { data: posts } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: () => fetchUserPosts()
  })

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;

    navigate(`${Number(target.id) + 1}`);
  }

  return (
    <main id="blog_posts">
      <button className="post accent" id="new">
        +
      </button>
      <Suspense fallback={<p>Loading ...</p>}>
        {posts.map((post, i) => {
          const createdAt = new Date(post.createdAt)

          return (
            <div className="post" key={i} id={`${i}`} onClick={handleClick}>
              <h3 className="title">{post.title}</h3>
              <p className="author">{post.author.name}</p>
              <p className="created">
                <time dateTime={(post.createdAt as unknown) as string}>
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