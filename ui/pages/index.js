import Head from 'next/head'
import Avatar from '../components/avatar'
import ChatList from '../components/chat-list'
import ConversationItem from '../components/conversation-item'

export default function Home() {
  return (
    <div >
      <Head>
        <title>Rust with react chat app</title>
        <meta name="description" content="Rust with react chat app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='bg-gradient-to-b from-orange-400 to-rose-400 h-screen p-12' >
        <main className='flex w-[1020px] h-[700px] mx-auto bg-[#FAF9FE] rounded-[25px] backdrop-opacity-30 opacity-95'>
          <aside className='bg-[#F0EEF5] w-[330px] h-[700px] rounded-l-[25px] p-4 overflow-auto'>
            <ChatList />
          </aside>
          <section className='rounded-r-[25px] w-[690px] grid grid-rows-[80px_minmax(450px,_1fr)_65px]'>
            <div className='rounded-tr-[25px] w-ful'>
              <div className='flex gap-3 p-3 items-center'>
                <Avatar color='rgb(245 158 11)'>RO</Avatar>
                <div>
                  <p className='font-semibold text-gray-600 text-base'>Ahmad Rosid</p>
                  <div className='text-xs text-gray-400'>10:15 AM</div>
                </div>
              </div>
              <hr className='bg-[#F0EEF5]' />
            </div>
            <div className='p-2 space-y-4 overflow-y-auto'>
              <ConversationItem content={"Hey Jhon, have you been following the World Cup? It's been pretty exciting so far."} />
              <ConversationItem right content={"Yeah, I have been. It's been a great tournament. I'm really enjoying it."} />
              <ConversationItem content={"I know! I can't believe that big team is out already. The have a lot of great player."} />
              <ConversationItem right content={"I know, it's been a bit of a shock. But there have been some great games."} />
              <ConversationItem content={"Yeah, I'm really looking forward to the rest of the tournament. I think it's going to be a great finish."} />
              <ConversationItem right content={"So, who do you think is going to win the World Cup?"} /> 
              <ConversationItem content={"That's a tough question. There are a lot of good teams still in it. I think Brazil has a good chance."} />
              <ConversationItem right content={"I'm not so sure. I think Spain might be the team to beat. They've been looking really good."} />
            </div>
            <div className='w-full'>
              <div className='flex gap-2 items-center rounded-full border border-violet-500 bg-violet-200 p-1 m-2'>
                <input className='p-2 text-sm w-full rounded-full bg-violet-200 focus:outline-none' placeholder='Type your message here...' />
                <button className='bg-violet-500 rounded-full py-2 px-6 font-semibold text-white text-sm'>Sent</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
