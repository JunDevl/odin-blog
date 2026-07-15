import "./comments.css"

import { useParams } from "react-router";
import { createPostComment, fetchPostComments } from "../../actions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useRef, useState, type SubmitEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns"; 

type Props = {}

const Comments = (props: Props) => {
  const queryClient = useQueryClient();

  const params = useParams();

  const input = useRef<HTMLTextAreaElement>(null);
  const buttons = useRef<HTMLDivElement>(null);
  const commentForm = useRef<HTMLFormElement>(null);

  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
      <form 
        id="new_comment" 
        action={async (formData) => {
          if (isCreatingComment) return;

          await createPostComment(formData, postId);

          await queryClient.fetchQuery({
            queryKey: ["comments", postId],
          })

          input.current!.value = "";

          setIsCreatingComment(false);
        }} 
        onSubmit={submitForm} 
        method="POST"
        tabIndex={0}
        onFocus={() => setIsFocused(true)} 
        onBlur={() => setIsFocused(false)}
        ref={commentForm}
      >
        <textarea 
          name="content" 
          id="content" 
          ref={input}
          placeholder="Your comment"
          required
        />
        <div className="buttons" ref={buttons}>
          <button type="reset" className={`${isFocused ? "" : "hidden"}`}>Cancel</button>
          <button type="submit" className={`accent ${isFocused ? "" : "hidden"}`}>Comment</button>
        </div>
      </form>
      <Suspense fallback={<p>Loading...</p>}>
        {data.map((comment, i) => {
          const createdAt = new Date(comment.createdAt);

          const editedAt = comment.editedAt ? new Date(comment.editedAt) : null;
          
          return (
            <div className="comment" data-owned={comment.owned} key={i} id={`${i}`}>
              <div className="info">
                <h3 className="author">{comment.author.name}</h3>
                <span className="created">
                  <time dateTime={createdAt.toUTCString()}>
                    {format(createdAt, "Pp")}
                  </time>
                </span>
                {editedAt && 
                  <span className="edited">
                    Edited: 
                    <time dateTime={editedAt.toUTCString()}>
                      {format(editedAt, "Pp")}
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