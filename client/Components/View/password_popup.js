import axios from "axios";
import { useState } from "react"
import style from "../../styles/View/view.module.css"
import jwt from 'jsonwebtoken';
import ViewEdit from "./view_edit";
import { TrashIcon } from '@heroicons/react/outline'
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";

const ViewPasswordPopup = ({ state , setState  , selected , userInfo , setUserInfo , setSelected }) => {

    const [input, setInput] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordType, setPasswordType] = useState("password")

    const setCookie = (token) => {
        let cname = "user=" + token;
        const date = new Date();
        date.setTime(date.getTime() + (100*60*60*24*30))
        let expiry_date = "expires=" + date.toUTCString();
        
        const cookie = cname + "; " + expiry_date
        document.cookie = cookie 
    }

    function deletePassword(){
        let newUserInfo = {};
        newUserInfo.name = userInfo.name;
        newUserInfo.email = userInfo.email;
        newUserInfo.password = userInfo.password;
        newUserInfo.darkMode = userInfo.darkMode;
        newUserInfo.storedPasswords = [];

        userInfo.storedPasswords.map((e)=>{
            if(e!==selected){
                newUserInfo.storedPasswords.push(e);
            }
        })

        setUserInfo(newUserInfo);

        axios.post("http://localhost:3001/updateUser" , {
            email : newUserInfo.email,
            password : newUserInfo.password,
            darkMode : newUserInfo.darkMode,
            storedPasswords : newUserInfo.storedPasswords
        });

        const token = jwt.sign({
            name : userInfo.name,
            email : newUserInfo.email,
            password : newUserInfo.password,
            darkMode : newUserInfo.darkMode,
            storedPasswords : newUserInfo.storedPasswords
        } , "secret");
        setCookie(token);

        setSelected({});
        setState("");
    }

    function editPassword(){
        let newUserInfo = {};
        newUserInfo.name = userInfo.name;
        newUserInfo.email = userInfo.email;
        newUserInfo.password = userInfo.password;
        newUserInfo.darkMode = userInfo.darkMode;
        newUserInfo.storedPasswords = [];

        userInfo.storedPasswords.map((e)=>{
            if(e===selected){
                e.password = newPassword;
            }
            newUserInfo.storedPasswords.push(e);
        });

        setUserInfo(newUserInfo);

        axios.post("http://localhost:3001/updateUser" , {
            email : newUserInfo.email,
            password : newUserInfo.password,
            darkMode : newUserInfo.darkMode,
            storedPasswords : newUserInfo.storedPasswords
        });

        const token = jwt.sign({
            name : userInfo.name,
            email : newUserInfo.email,
            password : newUserInfo.password,
            darkMode : newUserInfo.darkMode,
            storedPasswords : newUserInfo.storedPasswords
        } , "secret");
        setCookie(token);

        setSelected({});
        setState("");

    }

    async function isPasswordValid(){
        const res = await axios.post("http://localhost:3001/login" , {
            email : userInfo.email,
            password : input
        })
        const user = res.data;
        return user.user;
    }

    async function verifyKey(){
        const proceed = await isPasswordValid()
        if(proceed){
            if(state==="delete"){
                deletePassword()
            }else{
                if(newPassword===""){
                    alert("Set a new password too!")
                }else{
                    editPassword();
                }
            }
        }else{
            alert("Secret Key is wrong!")
        }
    }

    return(
        <div className={style.popupContainer}>

            <div className={style.popupSubContainer}>

                <div className={style.trashIconDiv}>
                    <TrashIcon className={style.trashIcon} onClick={()=>{
                        setState("")
                    }} />
                </div>

                <div className={style.inputDiv}>
                    <label>Confirm Secret Key (Your Account Password)</label>
                    <div className={style.RealInputDiv}>
                        <input type={passwordType} onChange={(e)=>{setInput(e.target.value)}} className={style.secretKeyInput} placeholder="Secret Key"></input>
                        {passwordType==="password" ?
                        <EyeIcon onClick={()=>{ setPasswordType("text") }} className={style.eyeIcon}/>:
                        <EyeOffIcon onClick={()=>{ setPasswordType("password") }} className={style.eyeIcon}/>}
                    </div>
                </div>

                {state==="edit" && 
                <ViewEdit setNewPassword={setNewPassword} website={selected.website} />}

                <button onClick={()=>{
                    verifyKey()
                }} className={style.secretKeySubmitBtn}>Submit</button>
            </div>

        </div>
    )
}

export default ViewPasswordPopup;