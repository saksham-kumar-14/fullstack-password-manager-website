import React , { useState , useEffect } from 'react';
import style from '../../styles/Home/home_animation.module.css'

const HomeAnimation = () => {
    const words = ["Manage Your" , "Passwords" , "Smartly"];
    const [currentWord, setCurrentWord] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [end, setEnd] = useState(0);
    const [increase, setIncrease] = useState(true)    

    useEffect(()=>{
        setTimeout(() => {

            if(increase){
                if(end === words[currentIndex].length){
                    setIncrease(false);
                }else{
                    setEnd(end+1)
                }
            }else{
                if(end===-1){
                    setIncrease(true)
                    if(currentIndex===words.length-1){
                        setCurrentIndex(0)
                    }else{
                        setCurrentIndex(currentIndex+1)
                    }
                }else{
                    setEnd(end-1)
                }
            }

            setCurrentWord(words[currentIndex].slice(0,end+1))

        }, 150);
    })

    return(
        <div className={style.container}> 
            <span>{currentWord}</span>
        </div>
    )
}

export default HomeAnimation;