import React from "react";
import { Link } from "react-router-dom";

function Page404() {
  return (
    <div>
      <h1>404</h1>
      <p>This page does not exist</p>
      <Link to={"/"}>Back to Home</Link>
    </div>
  );
}

export default Page404;
