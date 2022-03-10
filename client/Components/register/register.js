import { EyeIcon, EyeOffIcon, TrashIcon } from "@heroicons/react/solid";
import style from "../../styles/Auth/auth.module.css";
import { useEffect, useState } from "react";
import axios from 'axios';

const Register = ({ setState }) => {
    const [passwordType, setPasswordType] = useState("password");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [allUsers, setAllUsers] = useState();
    useEffect(async()=>{
        const res = await fetch("http://localhost:3001/getUsers");
        const data = await res.json();
        setAllUsers(data);
    },[])

    function emailExists(){
        let result = false;
        allUsers.map((e)=>{
            if(e.email===email){ result = true; }
        })

        return result;
    }
    

    function createUser(){
        axios.post("http://localhost:3001/createUser" , {
            name : name,
            email : email,
            password : password
        }).then(()=>{
            alert("User created!")
            setState("login")
        }).catch(()=>{
            alert("Error occured")
        })
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
                    <label>Name</label>
                    <input onChange={(e)=>{
                        setName(e.target.value)
                    }} className={style.not_password_input} type="text" placeholder="Name"></input>
                </div>

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
                    if(name==="" || password==="" || email===""){
                        alert("Fill the fields properly!")
                    }else if(emailExists(email)){
                        alert("This email already exists in the database. Try to login..")
                    }else{
                        createUser()
                    }
                }} className={style.submit_btn}>Submit</button>
            </div>

            <span className={style.info}>Already Registered? <a onClick={()=>{
                setState("login")
            }}>Login</a></span>
        </div>
    )
}

export default Register;