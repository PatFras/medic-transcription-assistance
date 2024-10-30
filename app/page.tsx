"use client";
import { useState, useEffect } from "react";
const {Amplify, Auth} = require("aws-amplify") ;
import awsconfig from "./aws-exports";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(awsconfig);

interface User {
  username: string;
  // otros campos que puedas necesitar
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user: User) => setUser(user))
      .catch((err: any) => console.log(err));
  }, []);

  if (!user) {
    return (
      <div>
        <h1>Please Sign In</h1>
      </div>
    );
  }

  return (
    <main>
      <h1>Welcome, {user.username}</h1>
      <div>
        App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of this tutorial.
        </a>
      </div>
    </main>
  );
}
