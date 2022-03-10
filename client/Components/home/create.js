import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import { useState } from "react";
import style from '../../styles/Home/create.module.css';
import SuggestPassword from "./suggest_password";
import jwt from 'jsonwebtoken';
import axios from "axios";

const Create = ({ userInfo , setUserInfo }) => {
    const [passwordType, setPasswordType] = useState("password");
    const [desc, setDesc] = useState("");
    const [website, setWebsite] = useState("");
    const [password, setPassword] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [secretKeyType, setSecretKeyType] = useState("password")

    const setCookie = (token) => {
        let cname = "user=" + token;
        const date = new Date();
        date.setTime(date.getTime() + (100*60*60*24*30))
        let expiry_date = "expires=" + date.toUTCString();
        
        const cookie = cname + "; " + expiry_date
        document.cookie = cookie 
    }

    function savePassword(){
        let newUserInfo = {};
        newUserInfo.name = userInfo.name;
        newUserInfo.email = userInfo.email;
        newUserInfo.darkMode = userInfo.darkMode;
        newUserInfo.password = userInfo.password;
        newUserInfo.storedPasswords = [];
        userInfo.storedPasswords.map((e)=>{
            newUserInfo.storedPasswords.push(e)
        })

        newUserInfo.storedPasswords.push({
            website : website,
            password : password,
            description : desc,
        });

        setUserInfo(newUserInfo);
        const token = jwt.sign({
            name : newUserInfo.name,
            email : newUserInfo.email,
            darkMode : newUserInfo.darkMode,
            storedPasswords : newUserInfo.storedPasswords,
            password : newUserInfo.password
        }, "secret");
        setCookie(token);

        axios.post("http://localhost:3001/updateUser",{
            password : newUserInfo.password,
            email : newUserInfo.email,
            darkMode : newUserInfo.darkMode,
            storedPasswords : newUserInfo.storedPasswords
        })

        location.reload();
    }

    async function isPasswordValid(pwd){
        const res = await axios.post("http://localhost:3001/login", {
            email : userInfo.email,
            password : pwd
        });
        const user = res.data;

        return user.user;
    }

    return(
        <div className={style.parentContainer}>

        <SuggestPassword setPassword={setPassword}/>

        <div className={style.container}> 
            <div className={style.input_div}>
                <label>Website Name</label>
                <input onChange={(e)=>{
                    setWebsite(e.target.value)
                }} className={style.not_password_input} type="text"></input>
            </div>

            <div className={style.input_div}>
                <label>Password</label>
                <div className={style.password_input}>
                    <input onChange={(e)=>{
                        setPassword(e.target.value)
                    }} id="password-field" type={passwordType}></input>

                    <div>
                        {passwordType==="password" ? 
                        <EyeIcon onClick={()=>{ setPasswordType("text") }} className={style.eye_icon} /> : 
                        <EyeOffIcon onClick={()=>{ setPasswordType("password") }} className={style.eye_icon} />}
                    </div>
                </div>
            </div>

            <div className={style.input_div}>
                <label>Description</label>
                <textarea onChange={(e)=>{
                    setDesc(e.target.value)
                }} className={style.not_password_input}></textarea>
            </div>

            <div className={style.input_div}>
                <label>Secret Key (Password of your account)</label>
                <div className={style.password_input}>
                    <input onChange={(e)=>{
                        setSecretKey(e.target.value)
                    }} type={secretKeyType}></input>

                    <div>
                        {secretKeyType==="password" ? 
                        <EyeIcon onClick={()=>{ setSecretKeyType("text") }} className={style.eye_icon} /> : 
                        <EyeOffIcon onClick={()=>{ setSecretKeyType("password") }} className={style.eye_icon} />}
                    </div>
                </div>
            </div>

            <button onClick={async()=>{
                if(password!=="" && website!==""){
                    const proceed = await isPasswordValid(secretKey)
                    if(proceed){
                        savePassword();
                    }else{
                        alert("Secret key (your account password) entered in wrong")
                    }
                }else{
                    alert("Fill the fields properly!")
                }
            }} className={style.submit_btn}>Submit</button>
        </div>

        </div>
    )
}

export default Create;