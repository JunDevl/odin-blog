import { useParams } from "react-router";
import { createPostComment, fetchPostComments } from "../../actions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, type SubmitEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";

type Props = {}

const Comments = (props: Props) => {
  const queryClient = useQueryClient();

  const params = useParams();

  const postId = Number(params["postId"]);

  const { data } = useSuspenseQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchPostComments(postId)
  })

  const submitForm = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);

    await createPostComment(formData, postId);

    await queryClient.fetchQuery({
      queryKey: ["comments"]
    })
  }

  return (
    <div id="comments">
      <form className="new_comment" onSubmit={e => submitForm(e)} method="POST">
        <input type="text" name="content" id="content" className="comment"/>
        <button>Comment</button>
      </form>
      <Suspense fallback={<p>Loading...</p>}>
        {data.map((comment, i) => 
          <div className="comment" data-owned={comment.owned} key={i} id={`${i}`}>
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