
const API_URL = "http://localhost:5000/api";
export const authService={

login:async(data:any)=>{

const response=await fetch(`${API_URL}/login`,{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(data)

});

return response.json();

},

register:async(data:any)=>{

const response=await fetch(`${API_URL}/login`, {

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(data)

});

return response.json();

}

}