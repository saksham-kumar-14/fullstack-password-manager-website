import style from "../../styles/view/view.module.css";
import { EyeIcon , EyeOffIcon } from '@heroicons/react/solid'
import { useState } from 'react';
import SuggestPassword from "../home/suggest_password";

const ViewEdit = ({ website , setNewPassword }) => {
    const [passwordType, setPasswordType] = useState("password")

    return(
        <>

        <div className={style.inputDiv}>
            <label>New Password for '{website}'</label>
            <div className={style.RealInputDiv}>
                <input id="password-field" type={passwordType} onChange={(e)=>{
                    setNewPassword(e.target.value)
                }} placeholder="New Password"></input>
                {passwordType==="password" ?
                <EyeIcon onClick={()=>{setPasswordType("text")}} className={style.eyeIcon}/>:
                <EyeOffIcon onClick={()=>{setPasswordType("password")}} className={style.eyeIcon}/>}
            </div>
        </div>

        <SuggestPassword setPassword={setNewPassword} />

        </>
    )
}

export default ViewEdit;