import "./comments.css"

import { useParams } from "react-router";
import { createPostComment, deletePostComment, fetchPostComments } from "../../actions";
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
        {data.map(comment => {
          const createdAt = new Date(comment.createdAt);

          const editedAt = comment.editedAt ? new Date(comment.editedAt) : null;
          
          return (
            <div className={`comment${ comment.owned ? " owned" : ""}`} key={comment.id} id={`${comment.id}`}>
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
              <div className="bottom">
                <p className="content">
                  {comment.content}
                </p>
                {comment.owned && 
                  <form 
                    onSubmit={async e => {
                      e.preventDefault();

                      await deletePostComment(postId, comment.id);

                      await queryClient.fetchQuery({
                        queryKey: ["comments", postId],
                      })
                    }}
                    className="delete_comment"
                  >
                    <button className="accent">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </form>
                }
              </div>
            </div>
          )
        })}
      </Suspense>
    </div>
  )
}

export default Comments