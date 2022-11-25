import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Avatar from '../components/avatar'
import ChatList from '../components/chat-list'
import Conversation from '../components/conversation'
import Login from '../components/login'
import useConversations from '../libs/useConversation'
import useLocalStorage from '../libs/useLocalStorage'
import useWebsocket from '../libs/websocket'

export default function Home() {
  const [roomId, setRoomId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [auth, setAuthUser] = useLocalStorage("user", false);
  const [isLoading, messages, setMessages, fetchConversations] = useConversations("");

  const handleTyping = (mode) => {
    if (mode === "IN") {
      setIsTyping(true)
    } else {
      setIsTyping(false)
    }
  }

  const handleMessage = (msg, userId) => {
    setMessages(prev => {
      const item = { text: msg, user_id: userId };
      console.log("handleMessage", [...prev, item]);
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
      }
    } catch (e) {
      console.log(e);
    }
  }

  const [sendMessage, closeConnection] = useWebsocket(onMessage)
  const updateFocus = () => {
    const data = {
      chat_type: "TYPING",
      value: ["IN"],
      room_id: "main",
      user_id: auth.id
    }
    sendMessage(JSON.stringify(data))
  }

  const onFocusChange = () => {
    const data = {
      chat_type: "TYPING",
      value: ["OUT"],
      room_id: "main",
      user_id: auth.id
    }
    sendMessage(JSON.stringify(data))
  }

  const submitMessage = (e) => {
    e.preventDefault();
    let message = e.target.message.value;
    if (message === "") {
      return;
    }

    if (!auth.id) {
      alert("You don't have an ID, please create one!!!")
      return
    }

    const data = {
      chat_type: "TEXT",
      value: [message],
      room_id: roomId,
      user_id: auth.id
    }
    sendMessage(JSON.stringify(data))
    e.target.message.value = "";
    handleMessage(message, auth.id);
    onFocusChange();
  }

  const updateMessages = (room) => {
    if (!room.id) return;
    fetchConversations(room.id)
    setRoomId(room.id)
  }

  useEffect(() => {
    setShowLogIn(!auth)
  }, [auth])

  return (
    <div>
      <Head>
        <title>Rust with react chat app</title>
        <meta name="description" content="Rust with react chat app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Login show={showLogIn} setAuth={setAuthUser} />
      <div className={`${!auth && 'hidden'} bg-gradient-to-b from-orange-400 to-rose-400 h-screen p-12`}>
        <main className='flex w-full max-w-[1020px] h-[700px] mx-auto bg-[#FAF9FE] rounded-[25px] backdrop-opacity-30 opacity-95'>
          <aside className='bg-[#F0EEF5] w-[325px] h-[700px] rounded-l-[25px] p-4 overflow-auto'>
            <ChatList onChatChange={updateMessages} />
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
            {isLoading && <p className="px-4 text-slate-500">Loading conversation...</p>}
            <Conversation data={messages} auth={auth}/>
            <div className='w-full'>
              <form onSubmit={submitMessage} className='flex gap-2 items-center rounded-full border border-violet-500 bg-violet-200 p-1 m-2'>
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
      </div>
    </div>
  )
}
