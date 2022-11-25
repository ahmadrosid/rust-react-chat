import React from "react";
import ConversationItem from "./conversation-item";

export default function Conversation({ data, auth }) {
  console.log(data);

    return (
        <div className='p-2 space-y-4 overflow-y-auto'>
            {
                React.Children.toArray(
                    data.map(item => {
                        console.log({item}, auth.id);
                        const isMe = item.user_id === auth.id;
                        return <ConversationItem right={isMe} content={item.text}  />
                    })
                )
            }
        </div>
    )
}