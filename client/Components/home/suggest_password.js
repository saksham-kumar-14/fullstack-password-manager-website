import { useState , useEffect } from "react";
import style from "../../styles/Home/create.module.css"

const SuggestPassword = ({ setPassword }) => {
    const [suggestedPassword, setSuggestedPassword] = useState("");

    function generateSuggestion(){
        let result = "";
        let length = Math.floor(Math.random()*10);
        length += 15;

        for(let i=0;i<15;i++){
            let index = Math.floor(Math.random()*(126-32));
            index += 32;
            result += String.fromCharCode(index)
        }

        setSuggestedPassword(result);
    }

    useEffect(()=>{
        generateSuggestion();
    },[])

    return(
        <div className={style.suggestion_div}>
            <button className={style.suggestion_btn} onClick={()=>{
                document.getElementById("password-field").value = suggestedPassword;
                generateSuggestion();
                setPassword(suggestedPassword)
            }}>Suggest Password?</button>
        </div>
    )
}


export default SuggestPassword;