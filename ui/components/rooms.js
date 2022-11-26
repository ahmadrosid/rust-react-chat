import React, { useState, useEffect } from "react";
import Avatar from "./avatar";

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

function ChatListItem({ onSelect, room, userId, index, selectedItem }) {
    const { users, created_at, last_message } = room;
    const active = index == selectedItem;
    const date = new Date(created_at);
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    const time = `${date.getHours()}:${date.getMinutes()} ${ampm}`
    const name = users?.filter(user => user.id != userId).map(user => user.username)[0];

    return (
        <div
            onClick={() => onSelect(index, {})}
            className={`${active ? 'bg-[#FDF9F0] border border-[#DEAB6C]' : 'bg-[#FAF9FE] border border-[#FAF9FE]'} p-2 rounded-[10px] shadow-sm cursor-pointer`} >
            <div className='flex justify-between items-center gap-3'>
                <div className='flex gap-3 items-center w-full'>
                    <Avatar>{name}</Avatar>
                    <div className="w-full max-w-[150px]">
                        <h3 className='font-semibold text-sm text-gray-700'>{name}</h3>
                        <p className='font-light text-xs text-gray-600 truncate'>{last_message}</p>
                    </div>
                </div>
                <div className='text-gray-400 min-w-[55px]'>
                    <span className='text-xs'>{time}</span>
                </div>
            </div>
        </div>
    )
}

export default function ChatList({ onChatChange, userId }) {
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
        let mapUsers = new Map();
        item.users.forEach(el => {
            mapUsers.set(el.id, el);
        });
        const users = {
            get: (id) => {
                return mapUsers.get(id).username;
            },
            get_target_user: (id) => {
                return item.users.filter(el => el.id != id).map(el => el.username).join("")
            }
        }
        onChatChange({ ...item.room, users })
    }

    return (
        <div className="overflow-hidden space-y-3">
            {isLoading && <p>Loading chat lists.</p>}
            {
                data.map((item, index) => {
                    return <ChatListItem
                        onSelect={(idx) => onSelectedChat(idx, item)}
                        room={{ ...item.room, users: item.users }}
                        index={index}
                        key={item.room.id}
                        userId={userId}
                        selectedItem={selectedItem} />
                })
            }
        </div>
    )
}