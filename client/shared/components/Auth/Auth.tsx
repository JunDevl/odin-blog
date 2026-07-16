import "./auth.css";

import { useState } from "react";
import { createUser, loginUser } from "../../actions";
import { useNavigate } from "react-router";

type Props = {}

const Auth = (props: Props) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container">
      <main id="auth">
        <h3>
          {isLogin ? "Log into your account!" : "Sign-up now!"}
        </h3>

        <form action={async (auth) => {
          const createdJwt = await (isLogin ? loginUser(auth) : createUser(auth));

          if (createdJwt) navigate("/blog");

          throw new Error("Something went wrong");
        }}>
          <div id="inputs">
            {!isLogin && 
              <input type="text" name="name" id="name" placeholder="Name"/>
            }
            <input type="email" name="email" id="email" placeholder="E-mail"/>
            <input type="password" name="password" id="password" placeholder="Password"/>
          </div>
          <p>
            {isLogin ? "Don't have an account?" : "Already has an account?"}
            <a onClick={() => setIsLogin(l => !l)}>
              {isLogin ? "Log-in!" : "Sign-up!"}
            </a>
          </p>
          <button>
            {isLogin ? "Log-in!" : "Sign-up!"}
          </button>
        </form>
      </main>
    </div>
  )
}

export default Auth