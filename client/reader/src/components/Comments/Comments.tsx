import "./comments.css"

import { useParams } from "react-router";
import { createPostComment, fetchPostComments } from "../../actions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useRef, useState, type SubmitEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";

type Props = {}

const Comments = (props: Props) => {
  const queryClient = useQueryClient();

  const params = useParams();

  const input = useRef<HTMLInputElement>(null);

  const [isCreatingComment, setIsCreatingComment] = useState(false);

  const postId = Number(params["postId"]);

  const { data } = useSuspenseQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchPostComments(postId)
  })

  const submitForm = (e: SubmitEvent<HTMLFormElement>) => {
    if (isCreatingComment) 
      return e.preventDefault();
    
    setIsCreatingComment(true);
  }

  return (
    <div id="comments">
      <form id="new_comment" action={async (formData) => {
        if (isCreatingComment) return;

        await createPostComment(formData, postId);

        await queryClient.fetchQuery({
          queryKey: ["comments", postId],
        })

        input.current!.value = "";

        setIsCreatingComment(false);
      }} onSubmit={submitForm} method="POST">
        <input type="text" name="content" id="content" ref={input} required/>
        <button>Comment</button>
      </form>
      <Suspense fallback={<p>Loading...</p>}>
        {data.map((comment, i) => {
          const createdAt = new Date(comment.createdAt);

          const editedAt = comment.editedAt ? new Date(comment.editedAt) : null;
          
          return (
            <div className="comment" data-owned={comment.owned} key={i} id={`${i}`}>
              <div className="info">
                <span className="author">{comment.author.name}</span>
                <span className="created">
                  <time dateTime={createdAt.toUTCString()}>
                    {createdAt.toLocaleDateString()}
                  </time>
                </span>
                {editedAt && 
                  <span className="edited">
                    Edited: 
                    <time dateTime={editedAt.toUTCString()}>
                      {editedAt.toLocaleDateString()}
                    </time>
                  </span>
                }
              </div>
              <p className="content">
                {comment.content}
              </p>
            </div>
          )
        })}
      </Suspense>
    </div>
  )
}

export default Comments