import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Avatar from '../components/avatar'
import ChatList from '../components/chat-list'
import ConversationItem from '../components/conversation-item'
import Login from '../components/login'
import useLocalStorage from '../libs/useLocalStorage'
import useWebsocket from '../libs/websocket'

export default function Home() {
  const [sessionId, setSessionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [auth, setAuthUser] = useLocalStorage("user", false);
 
  const handleTyping = (mode) => {
    if (mode === "in") {
      setIsTyping(true)
    } else {
      setIsTyping(false)
    }
  }

  const handleMessage = (msg, id) => {
    setMessages(prev => {
      const item = { text: msg, id };
      console.log([...prev, item]);
      return [...prev, item];
    })
  }

  const onMessage = (data) => {
    try {
      let messageJson = JSON.parse(data);
      console.log(messageJson.chat_type);
      switch (messageJson.chat_type) {
        case "TYPING": {
          handleTyping(messageJson.value[0]);
          return;
        }
        case "TEXT": {
          handleMessage(messageJson.value[0], messageJson.id);
          return;
        }
        case "CONNECT": {
          if (sessionId === null) {
            setSessionId(messageJson.value[0])
          }
          return;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  const [sendMessage, closeConnection] = useWebsocket(onMessage)
  const updateFocus = () => {
    console.log("I'm focusing...");
    sendMessage("/typing in")
  }

  const onFocusChange = () => {
    console.log('The focus is gone...');
    sendMessage("/typing out")
  }

  const submitForm = (e) => {
    e.preventDefault();
    let message = e.target.message.value;
    if (message === "") {
      return;
    }

    sendMessage(message)
    e.target.message.value = "";
    handleMessage(message, sessionId);
    onFocusChange();
  }

  return (
    <div>
      <Head>
        <title>Rust with react chat app</title>
        <meta name="description" content="Rust with react chat app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {auth ? (<div className='bg-gradient-to-b from-orange-400 to-rose-400 h-screen p-12' >
        <main className='flex w-full max-w-[1020px] h-[700px] mx-auto bg-[#FAF9FE] rounded-[25px] backdrop-opacity-30 opacity-95'>
          <aside className='bg-[#F0EEF5] w-[325px] h-[700px] rounded-l-[25px] p-4 overflow-auto'>
            <ChatList />
          </aside>
          <section className='rounded-r-[25px] w-full max-w-[690px] grid grid-rows-[80px_minmax(450px,_1fr)_65px]'>
            <div className='rounded-tr-[25px] w-ful'>
              <div className='flex gap-3 p-3 items-center'>
                <Avatar color='rgb(245 158 11)'>RO</Avatar>
                <div>
                  <p className='font-semibold text-gray-600 text-base'>Ahmad Rosid</p>
                  <div className='text-xs text-gray-400'>{isTyping ? "Typing..." : "10:15 AM"}</div>
                </div>
              </div>
              <hr className='bg-[#F0EEF5]' />
            </div>
            <div className='p-2 space-y-4 overflow-y-auto'>
              {
                React.Children.toArray(
                  messages.map(item => {
                    const isMe = item.id === sessionId;
                    return <ConversationItem right={isMe} content={item.text} />
                  })
                )
              }
            </div>
            <div className='w-full'>
              <form onSubmit={submitForm} className='flex gap-2 items-center rounded-full border border-violet-500 bg-violet-200 p-1 m-2'>
                <input
                  onBlur={onFocusChange}
                  onFocus={updateFocus}
                  name="message"
                  className='p-2 placeholder-gray-600 text-sm w-full rounded-full bg-violet-200 focus:outline-none'
                  placeholder='Type your message here...' />
                <button type='submit' className='bg-violet-500 rounded-full py-2 px-6 font-semibold text-white text-sm'>Sent</button>
              </form>
            </div>
          </section>
        </main>
      </div>) : (<Login setAuth={setAuthUser} />)}
    </div>
  )
}
