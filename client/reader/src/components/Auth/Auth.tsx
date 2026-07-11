import { useState } from "react";

type Props = {}

const Auth = (props: Props) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main>
      {isLogin ? "Log into your account!" : "Sign-up now!"}

      <form action="">
        {!isLogin && 
          <input type="text" name="name" id="name" />
        }
        <input type="email" name="email" id="email" />
        <input type="password" name="password" id="password" />
        <p>
          {isLogin ? "Don't have an account?" : "Already has an account?"}
          <a onClick={() => setIsLogin(l => !l)}>{isLogin ? "Log-in!" : "Sign-up!"}</a>
        </p>
      </form>
    </main>
  )
}

export default Auth