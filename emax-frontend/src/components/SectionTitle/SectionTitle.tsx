interface Props{
    title:string;
}

const SectionTitle=({title}:Props)=>{

return(

<div style={{
padding:"40px 20px 20px",
fontSize:"30px",
fontWeight:700
}}>

{title}

</div>

)

}

export default SectionTitle;