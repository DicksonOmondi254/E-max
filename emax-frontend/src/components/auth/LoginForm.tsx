import { useState } from "react";

const LoginForm=()=>{

const[email,setEmail]=useState("");

const[password,setPassword]=useState("");

return(

<div className="auth-card">

<h2>Welcome Back</h2>

<input
type="email"
placeholder="Email Address"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button>

Login

</button>

</div>

);

};

export default LoginForm;