function getShortName(full_name = '') {
    if (full_name.includes(" ")) {
        const names = full_name.split(" ");
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase()
    }
    return `${full_name.slice(0,2)}`.toUpperCase()
}

export default function Avatar({ children, color = 'rgb(59 130 246)' }) {
  return (
    <div className='bg-blue-500 w-[45px] h-[45px] flex items-center justify-center rounded-full' style={{backgroundColor: color}}>
      <span className='font-bold text-sm text-white'>{getShortName(children)}</span>
    </div>
  )
}