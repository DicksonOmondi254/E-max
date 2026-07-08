
const API="http://localhost:5000/api/auth";

export const authService={

login:async(data:any)=>{

const response=await fetch(`${API}/login`,{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(data)

});

return response.json();

},

register:async(data:any)=>{

const response=await fetch(`${API}/register`,{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(data)

});

return response.json();

}

}