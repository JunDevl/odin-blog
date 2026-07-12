import { useParams } from "react-router";
import { createPostComment, fetchPostComments } from "../../actions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

type Props = {}

const Comments = (props: Props) => {
  const params = useParams();

  const postId = Number(params["postId"]);

  const { data } = useSuspenseQuery({
    queryKey: ["comments"],
    queryFn: () => fetchPostComments(postId)
  })

  return (
    <div id="comments">
      <form action={(formData) => createPostComment(formData, postId)} className="new_comment">
        <input type="text" name="content" id="content" className="comment"/>
        <button>Comment</button>
      </form>
      <Suspense fallback={<p>Loading...</p>}>
        {data.map((comment, i) => 
          <div className="comment" key={i} id={`${i}`}>
            <span className="author">{comment.author.name}</span>
            <span className="created">
              <time dateTime={comment.createdAt}>
                {comment.createdAt}
              </time>
            </span>
            {comment.editedAt && 
              <span className="edited">
                <time dateTime={comment.editedAt}>
                  {comment.editedAt}
                </time>
              </span>
            }
            <p className="content">
              {comment.content}
            </p>
          </div>
        )}
      </Suspense>
    </div>
  )
}

export default Comments