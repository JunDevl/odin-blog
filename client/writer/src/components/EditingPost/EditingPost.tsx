import "./editingpost.css";

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { fetchPosts } from "../../../../reader/src/actions";
import { Suspense, useState, type SubmitEvent } from "react";
import { format } from "date-fns";
import { updatePost } from "../../actions";

type Props = {}

const EditingPost = (props: Props) => {
  const queryClient = useQueryClient();

  const params = useParams();

  const postId = Number(params["postId"]);

  const { data: posts } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts()
  });

  const post = posts.find(post => post.id = postId)!;

  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editing, setEditing] = useState<"title" | "content" | null>(null);

  const createdAt = new Date(post.createdAt);

  const submitForm = (e: SubmitEvent<HTMLFormElement>) => {
    if (isEditingPost) 
      return e.preventDefault();
    
    setIsEditingPost(true);
  }

  return (
    <main id="post">
      <Link to="/posts" id="back">
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
          <p id="created" className="uneditable">
            <time dateTime={createdAt.toUTCString()}>
              {format(createdAt, "P")}
            </time>
          </p>
          {editing === "title" ? 
            <form 
              className="title" 
              action={async formData => {
                if (isEditingPost) return;

                await updatePost(formData, postId);

                await queryClient.fetchQuery({
                  queryKey: ["posts"]
                })

                setEditing(null);
                setIsEditingPost(false);
              }} 
              onSubmit={submitForm}
            >
              <input type="text" name="title" id="title" defaultValue={post.title}/>
              <div className="buttons">
                <button type="reset" onClick={() => setEditing(null)}>Cancel</button>
                <button type="submit">Edit</button>
              </div>
            </form> :
            <h1 className="title" onClick={() => setEditing("title")}>
              {post.title}
            </h1>
          }
          {editing === "content" ? 
            <form 
              className="content" 
              action={async formData => {
                if (isEditingPost) return;

                await updatePost(formData, postId);

                await queryClient.fetchQuery({
                  queryKey: ["posts"]
                })

                setEditing(null);
                setIsEditingPost(false);
              }} 
              onSubmit={submitForm}
            >
              <textarea name="content" id="content" defaultValue={post.content}/>
              <div className="buttons">
                <button type="reset" onClick={() => setEditing(null)}>Cancel</button>
                <button type="submit">Edit</button>
              </div>
            </form> :
            <p className="content" onClick={() => setEditing("content")}>
              {post.content}
            </p>
          }
        </Suspense>
      </div>
    </main>
  )
}

export default EditingPost