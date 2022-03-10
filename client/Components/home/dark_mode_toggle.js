import { MoonIcon , SunIcon } from "@heroicons/react/solid"
import axios from "axios";
import style from "../../styles/Home/dark_mode_toggle.module.css"
import jwt from 'jsonwebtoken';

const DarkModeToggle = ({ darkMode , setDarkMode , userInfo, setUserInfo }) => {

    const setCookie = (token) => {
        let cname = "user=" + token;
        const date = new Date();
        date.setTime(date.getTime() + (100*60*60*24*30))
        let expiry_date = "expires=" + date.toUTCString();
        
        const cookie = cname + "; " + expiry_date
        document.cookie = cookie 
    }

    function changeDarkMode(value){
        setDarkMode(value);
        let newUserInfo = {};
        newUserInfo.name = userInfo.name;
        newUserInfo.email = userInfo.email;
        newUserInfo.darkMode = value;
        newUserInfo.password = userInfo.password;
        newUserInfo.storedPasswords = userInfo.storedPasswords

        setUserInfo(newUserInfo);

        axios.post("http://localhost:3001/updateUser", {
            email : newUserInfo.email,
            password : newUserInfo.password,
            storedPasswords : newUserInfo.storedPasswords,
            darkMode : value
        })

        const token = jwt.sign({
            name : newUserInfo.name,
            email : newUserInfo.email,
            password : newUserInfo.password,
            storedPasswords : newUserInfo.storedPasswords,
            darkMode : value
        }, 'secret')
        setCookie(token)
    }

    return(
        <div className={style.container}>
            {darkMode ? 
            <div className={style.subcontainer}>
                <MoonIcon className={style.moon_icon} />
                <button onClick={()=>{
                    if(userInfo===undefined || userInfo===null){
                        setDarkMode(false)
                    }else{
                        changeDarkMode(false)
                    }
                }} className={style.change_btn}></button>
            </div> : 
            <div className={style.subcontainer}>
                <button onClick={()=>{
                    if(userInfo===undefined || userInfo===null){
                        setDarkMode(true)
                    }else{
                        changeDarkMode(true)
                    }
                }} className={style.change_btn}></button>
                <SunIcon className={style.sun_icon} />
            </div>}
        </div>
    )
}

export default DarkModeToggle;