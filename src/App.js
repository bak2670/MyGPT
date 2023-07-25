import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [value,setValue] = useState(null)
  const [message,setMessage] = useState(null);
  const [previousChats,setPreviousChats] = useState([])
  const [currentTitle,setCurrentTitle] = useState(null);


  const createNewChat = ()=>{
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  const getMessage = async () =>{
    const options = {
      method:"POST",
      body:JSON.stringify({
        message:value
      }),
      headers:{
        "Content-Type":"application/json"
      }
    }
    try{
      const response = await fetch("http://localhost:8000/completaions",options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    }catch(error){
      console.error(error)
    }
  }

  useEffect(()=>{
    console.log(currentTitle,value,message)
    if(!currentTitle && value && message){
      setCurrentTitle(value)
    }
    if(currentTitle && value && message){
      setPreviousChats(prevChats =>(
        [...prevChats,{
          title:currentTitle,
          role:"user",
          content:value,
        },{
          title:currentTitle,
          role:message.role,
          content:message.content
        }]
      ))
    }
  },[message,currentTitle])

  const onKeyPress = (e) => {
    console.log(e)
    if(e.key == 'Enter') {
      getMessage();
    }
  }


  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))

  return (
    <div className="App">
      <section className='side-bar'>
        <button onClick={createNewChat}>+ New chat</button>
        <ul className='histiry'>
          {uniqueTitles?.map((uniqueTitle,index)=><li key={index} onClick={()=>{handleClick(uniqueTitle)}}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Me</p>
        </nav>
      </section>


      <section className='main'>
        {!currentTitle && <h1>My GPT</h1>}
        <ul className='feed'>
          {currentChat?.map((chatMessage,index)=> <li key={index}>
            <p className='role'>{chatMessage.role === "user"? "나" : "컴퓨터"}</p>
            <p className={chatMessage.role === "user" ? "userchat" : "comchat"}>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className='bottom-section'>
          <div className='input-container' >
            <input value={value}  onChange={(e)=>{setValue(e.target.value)}} onKeyPress={(e)=>{onKeyPress(e)}}/>
            <div id='submit'className={value === null || ""?"opacity1":"opacity0"} onClick={getMessage} >전송</div>
          </div>
          <p className='info'>
            Chat GPT Mar 14 Version Free Research Preview
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
