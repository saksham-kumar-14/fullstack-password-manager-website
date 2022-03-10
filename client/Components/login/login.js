import { EyeIcon, EyeOffIcon, TrashIcon } from "@heroicons/react/solid";
import style from "../../styles/Auth/auth.module.css";
import { useState } from "react";
import axios from 'axios';

const Login = ({ setState }) => {
    const [passwordType, setPasswordType] = useState("password");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("")

    const setCookie = (token) => {
        let cname = "user=" + token;
        const date = new Date();
        date.setTime(date.getTime() + (100*60*60*24*30))
        let expiry_date = "expires=" + date.toUTCString();
        
        const cookie = cname + "; " + expiry_date
        document.cookie = cookie 
    }

    async function loginUser(){
        const res = await axios.post("http://localhost:3001/login" , {
            email : email,
            password : password
        });
        const data = await res.data;

        if(data.user){
            setCookie(data.user);
            alert("User found!")
            location.reload();
        }else{
            alert("User not found!")
        }

    }

    return(
        <div className={style.container}>
            <div className={style.trash_div}>
                <TrashIcon onClick={()=>{
                    setState("")
                }} className={style.trash_btn} />
            </div>
            <div className={style.subcontainer}>

                <div className={style.input_div}>
                    <label>Email</label>
                    <input onChange={(e)=>{
                        setEmail(e.target.value)
                    }} className={style.not_password_input} type="text" placeholder="Email"></input>
                </div>

                <div className={style.input_div}>
                    <label>Password</label>

                    <div className={style.password_input}>
                        <input onChange={(e)=>{
                            setPassword(e.target.value)
                        }} placeholder="Password" type={passwordType}></input>

                        <div className={style.eye_div}>
                            {passwordType==="password"?
                            <EyeIcon onClick={()=>{
                                setPasswordType("text")
                            }} className={style.eye_icon}/>:
                            <EyeOffIcon onClick={()=>{
                                setPasswordType("password")
                            }} className={style.eye_icon}/>}
                        </div>
                        
                    </div>
                </div>

                <button onClick={()=>{
                    if(email!=="" && password!==""){
                        loginUser();
                    }else{
                        alert("Fill the fields properly!")
                    }
                }} className={style.submit_btn}>Submit</button>
            </div>

            <span className={style.info}>Not Registered? <a onClick={()=>{
                setState("register")
            }}>Register</a></span>
        </div>
    )
}

export default Login;