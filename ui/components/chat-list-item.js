import Avatar from "./avatar"

export default function ChatListItem({ onSelect, username, index, selectedItem }) {
    const active = index == selectedItem;
    return (
        <div onClick={() => onSelect(index)} className={`${active ? 'bg-[#FDF9F0] border border-[#DEAB6C]' : 'bg-[#FAF9FE] border border-[#FAF9FE]'} p-2 rounded-[10px] shadow-sm cursor-pointer`} >
            <div className='flex justify-between items-center gap-3'>
                <div className='flex gap-3 items-center'>
                    <Avatar>{username}</Avatar>
                    <div >
                        <h3 className='font-semibold text-sm text-gray-700'>{username}</h3>
                        <p className='font-light text-xs text-gray-600'>Some example chat desc...</p>
                    </div>
                </div>
                <div className='text-gray-400'>
                    <span className='text-xs'>20:15 AM</span>
                </div>
            </div>
        </div>
    )
}