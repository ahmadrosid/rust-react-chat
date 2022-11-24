import Avatar from "./avatar"

export default function ChatListItem({ onSelect, username, description, createdAt, index, selectedItem }) {
    const active = index == selectedItem;
    const date = new Date(createdAt);
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    const time = `${date.getHours()}:${date.getMinutes()} ${ampm}`
    return (
        <div onClick={() => onSelect(index)} className={`${active ? 'bg-[#FDF9F0] border border-[#DEAB6C]' : 'bg-[#FAF9FE] border border-[#FAF9FE]'} p-2 rounded-[10px] shadow-sm cursor-pointer`} >
            <div className='flex justify-between items-center gap-3'>
                <div className='flex gap-3 items-center w-full'>
                    <Avatar>{username}</Avatar>
                    <div className="w-full max-w-[150px]">
                        <h3 className='font-semibold text-sm text-gray-700'>{username}</h3>
                        <p className='font-light text-xs text-gray-600 truncate'>{description}</p>
                    </div>
                </div>
                <div className='text-gray-400 min-w-[55px]'>
                    <span className='text-xs'>{time}</span>
                </div>
            </div>
        </div>
    )
}