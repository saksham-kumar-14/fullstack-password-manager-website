import HomeAnimation from "../Components/home/home_animation";
import DarkModeToggle from "../Components/home/dark_mode_toggle";
import Head from 'next/head';
import { useEffect, useState } from "react"
import style from "../styles/Home/Home.module.css"
import Login from '../Components/login/login';
import Register from '../Components/register/register';
import Create from "../Components/home/create";
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { useRouter } from 'next/router';

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [loggedin, setLoggedin] = useState(false);
  const [state, setState] = useState("");
  const [userInfo, setUserInfo] = useState();

  const router = useRouter();

  function decodeCookie(token){
    let start = 0;
    for(let i=0;i<token.length;i++){
      if(token[i]==="="){
        start = i+1;
        break;
      }
    }

    return token.slice(start,token.length)
  }

  useEffect(async()=>{
    try{
      const token = decodeCookie(document.cookie);
      const user = jwt.decode(token);
      const res = await axios.post("http://localhost:3001/login",{
        email : user.email,
        password : user.password
      })
      const data = await res.data;

      console.log(data)
      if(data.user){
        setUserInfo(user);
        setDarkMode(user.darkMode)
        setLoggedin(true)
      }else{
        setUserInfo(false);
      }
    }catch(error){
      console.log(error)
    }
  },[])

  function logoutUser(){
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    location.reload()
  }

  function deleteUser(){
    axios.post("http://localhost:3001/deleteUser" , {
      email : userInfo.email,
      password : userInfo.password
    }).then(()=>{
      location.reload()
    }).catch(()=>{
      alert("Some Error Occured!")
    })
  }


  return(

    <div id={darkMode?style.darkContainer:style.container} className={(state==="register"||state==="login")? style.no_scroll_container : style.container }>
      
      <Head>
        <title>Home</title>
      </Head>

      <div className={style.header}>
        <HomeAnimation />
        {loggedin?
        <div>
          <button onClick={()=>{logoutUser()}} className={style.auth_btn}>Logout</button>
          <button onClick={()=>{deleteUser()}} className={style.delete_user_btn}>Delete User</button>
        </div>:
        <div>
          <button onClick={()=>{setState("login")}} className={style.auth_btn}>Login</button>
          <button onClick={()=>{setState("register")}} className={style.auth_btn}>Register</button>
        </div>}
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} userInfo={userInfo}
        setUserInfo={setUserInfo} />
      </div>

      { state==="login" && 
      <div className={style.auth_div}>
        <Login setState={setState}/>
      </div> }
      { state==="register" && 
      <div className={style.auth_div}>
        <Register setState={setState}/>
      </div> }

      
      <div className={style.pre_body}>
        <div className={style.body}>

          <div>
            <Create userInfo={userInfo} setUserInfo={setUserInfo} />
          </div>

          <div className={style.view_div}>
            <button onClick={()=>{
              router.push("/view")
            }} className={style.view_btn}>View All Stored Passwords</button>
          </div>
        </div>
      </div>
      
    </div>

  )
}

export default Home;