import React, { useState, useEffect } from "react";
import ChatListItem from "./chat-list-item";

async function getRooms() {
    try {
        const url = "http://localhost:8080/rooms";
        let result = await fetch(url);
        return result.json();
    } catch (e) {
        console.log(e);
        return Promise.resolve(null);
    }
}

export default function ChatList({ onChatChange }) {
    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState(-1);

    useEffect(() => {
        setLoading(true)
        getRooms()
            .then((data) => {
                setData(data)
                setLoading(false)
            })
    }, [])

    const onSelectedChat = (idx, item) => {
        setSelectedItem(idx)
        onChatChange(item)
    }
    
    return (
        <div className="overflow-hidden space-y-3">
            {isLoading && <p>Loading chat lists.</p>}
            {
                data.map((item, index) => {
                    return <ChatListItem
                        onSelect={(idx) => onSelectedChat(idx, item)}
                        className="cursor-pointer"
                        username={item.name}
                        description={item.last_message}
                        createdAt={item.created_at}
                        index={index}
                        key={item.id}
                        selectedItem={selectedItem} />
                })
            }
        </div>
    )
}