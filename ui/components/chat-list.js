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

export default function ChatList() {
    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }
        setLoading(true)
        getRooms()
            .then((data) => {
                setData(data)
                setLoading(false)
            })
    }, [])

    const [selectedItem, setSelectedItem] = useState(-1);
    return (
        <div className="overflow-hidden space-y-3">
            {
                React.Children.toArray(
                    data.map((item, index) => {
                        return <ChatListItem
                            onSelect={(idx) => setSelectedItem(idx)}
                            className="cursor-pointer"
                            username={item.name} 
                            description={item.last_message}
                            createdAt={item.created_at}
                            index={index}
                            selectedItem={selectedItem} />
                    })
                )
            }
        </div>
    )
}