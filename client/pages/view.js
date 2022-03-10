import { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import style from "../styles/View/view.module.css";
import Head from 'next/head';
import { HomeIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router';

import ViewBody from '../Components/View/view_body';
import ViewPasswordPopup from '../Components/View/password_popup';

const View=()=>{
    const router = useRouter();

    function decodeCookie(token){
        let start = 0;
        for(let i=0;i<token.length;i++){
            if(token[i]==="="){
                start = i+1;
                break;
            }
        }
        return token.slice(start, token.length);
    }

    const [ userInfo, setUserInfo ] = useState();
    const [state, setState] = useState("");
    const [selected, setSelected] = useState();

    useEffect(async()=>{
        try{
            const token = decodeCookie(document.cookie);
            const user = jwt.decode(token);
            const res = await axios.post("http://localhost:3001/login",{
              email : user.email,
              password : user.password
            })
            const data = await res.data;
      
            if(data.user){
                setUserInfo(user);
            }else{
                setUserInfo(false);
            }
        }catch(error){
            console.log(error)
        }
    },[])

    return(
        <div className={state===""?style.parentContainer:style.parentContainerNoScroll}>

        <Head>
            <title>View</title>
        </Head>

        <div className={style.container}>

            <HomeIcon onClick={()=>{
                router.push("../")
            }} className={style.homeIcon} />

            <div className={style.passwordShowingDiv}>

            { !userInfo ? 
                <span>Not Found!</span>:
                
                <>
                <h1 className={style.heading}>{userInfo.name}'s Stored Passwords</h1>
                {userInfo.storedPasswords.map((e,index)=>{
                    return <ViewBody setSelected={setSelected} setState={setState} key={"view-storedPassword-"+index.toString()} storedPassword={e} />
                })}
                </>
            }
            </div>

        </div>


            {state==="delete" && 
            <div className={style.popUp}>
                <ViewPasswordPopup state={state} userInfo={userInfo} setSelected={setSelected}
                selected={selected} setUserInfo={setUserInfo} setState={setState} />
            </div>
            }
            {state==="edit" &&
            <div className={style.popUp}>
            <ViewPasswordPopup state={state} userInfo={userInfo} setSelected={setSelected}
            secretKey={userInfo.password} selected={selected} setUserInfo={setUserInfo}
            setState={setState} />
            </div>}

        </div>
    )
}



export default View;