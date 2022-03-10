import style from "../../styles/View/view.module.css";

const ViewBody = ({ storedPassword , setState , setSelected }) => {

    return(
        <div className={style.parentInfoDiv}>
            <div>
                <div className={style.infoDiv}>
                    <span className={style.infoDivHeading}>Website : </span> 
                    <span className={style.infoDivInfo}> {storedPassword.website}</span>
                </div>
                
                <div className={style.infoDiv}>
                    <span className={style.infoDivHeading}>Password : </span> 
                    <span className={style.infoDivInfo}> {storedPassword.password}</span>
                </div>
                
                <div className={style.descDiv}>
                    <span className={style.infoDivHeading}>Description :</span>
                    <span className={style.infoDivInfo}> {storedPassword.description}</span>
                </div>
            </div>

            <div>
                <button className={style.deleteBtn} onClick={()=>{
                    setState("delete")
                    setSelected(storedPassword)
                }}>Delete</button>
                <button className={style.editBtn} onClick={()=>{
                    setState("edit")
                    setSelected(storedPassword)
                }}>Edit</button>
            </div>
        </div>
    )
}

export default ViewBody;