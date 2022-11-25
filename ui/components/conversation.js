import React from "react";
import ConversationItem from "./conversation-item";

export default function Conversation({ data, auth }) {
    return (
        <div className='p-2 space-y-4 overflow-y-auto'>
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