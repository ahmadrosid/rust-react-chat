import React from "react";
import Avatar from "./avatar"

function ConversationItem({ right, content }) {
    if (right) {
        return (
            <div className='w-full flex justify-end'>
                <div className='flex gap-3 justify-end'>
                    <div className='max-w-[65%] bg-violet-500 p-3 text-sm rounded-xl rounded-br-none'>
                        <p className='text-white'>{content}</p>
                    </div>
                    <div className='mt-auto'>
                        <Avatar>JH</Avatar>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex gap-3 w-full'>
            <div className='mt-auto'>
                <Avatar color='rgb(245 158 11)'>AR</Avatar>
            </div>
            <div className='max-w-[65%] bg-gray-200 p-3 text-sm rounded-xl rounded-bl-none'>
                <p>{content}</p>
            </div>
        </div>
    )
}

export default function Conversation({ data, auth }) {
    return (
        <div className='p-2 space-y-4 overflow-auto'>
            {
                data.map(item => {
                    console.log({ item }, auth.id);
                    const isMe = item.user_id === auth.id;
                    return <ConversationItem right={isMe} content={item.content} key={item.id} />
                })
            }
        </div>
    )
}
