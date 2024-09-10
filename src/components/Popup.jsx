import React from 'react'
import {useState} from 'react'

const Popup = ({ node, setIsPopupOpen, handleAddFolder, handleEditFolder, name, getType, requesttype }) => {
    const [inputValue, setInputValue] = useState((input)=> {
      if (requesttype === 'edit') {
        return name
      } else {
        return ''
      }
    })
    const [type, setType] = useState((type) => {
      if (requesttype === 'edit') {
        return getType
      } else {
        return 'folder'
      }
    })
    console.log(requesttype);
  return (
    <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-white justify-center items-center shadow-[1px_1px_10px_1px_rgba(0,0,0,0.5)] rounded-md flex-col flex p-10'>
      <span onClick={() => { setIsPopupOpen(false) }} className='absolute top-1 right-1 text-red-500 cursor-pointer'>X</span>
      <div className='bg-white p-4 rounded-md flex flex-col gap-2'>
        <input className='p-2 outline-none border border-gray-200' value={inputValue} onInput={(e) => setInputValue(e.target.value)} type="text" />
        <select name="type" id="" value={type} onChange={(e) => setType(e.target.value)} className='p-2 outline-none border border-gray-200'>
            <option value="folder">Folder</option>
            <option value="file">File</option>
        </select>
        <button onClick={() => { if (requesttype === 'add') { handleAddFolder(node.id, inputValue, type) } else if (requesttype === 'edit') { handleEditFolder(node.id, inputValue, type) }; setIsPopupOpen(false) }}>Submit</button>
      </div>
    </div>
  )
}

export default Popup