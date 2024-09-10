import './App.css'
import tree from './../tree.json'
import { useEffect, useState } from 'react'
import Popup from "./components/Popup.jsx";


const App = () => {
  // a useState that is our main data
  const [treeData, setTreeData] = useState(() => {
    // get data from local storage and if not found, use the tree.json
    return localStorage.getItem('treeData') ? JSON.parse(localStorage.getItem('treeData')) : tree
  })
  // using useEffect to save the treeData to local storage on every change
  useEffect(() => {
    localStorage.setItem('treeData', JSON.stringify(treeData))
  }, [treeData])

  // a function to add a folder to the treeData
  const handleAddFolder = (parentId, name, type) => {
    let newData = [...treeData]

    // a recursive function to add a folder to the treeData
    const recursiveAddFolder = (items, parentId, name, type) => {
      items.forEach((item) => {
        // if the parentId is the same as the item.id, then add a new folder to the item.sub
        if (parentId === item.id) {
          // if the item.sub is not already an array, then create an empty array
          if (!item.sub) {
            item.sub = []
          }
          // add the new folder or file to the item.sub
          item.sub.push({
            id: item.sub.length ? item.sub[item.sub.length - 1].id + 1 : item.id * 10 + 1,
            name: name,
            type: type,
            level: item.level + 1,
            isOpen: true,
          })
          // if the parentId is not the same as the item.id, then call recursive function to continue searching for the parentId
        } else if (item.sub) {
          recursiveAddFolder(item.sub, parentId, name, type)
        }
      })
    }

    recursiveAddFolder(newData, parentId, name, type)
    // set the new data to the treeData
    setTreeData(newData)
    console.log(treeData);
  }

  // a function to delete a folder from the treeData
  const handleDeleteFolder = (parentId) => {
    let newData = [...treeData]

    // a recursive function to delete a folder from the treeData
    const recursiveDeleteFolder = (items, parentId) => {
      items.forEach((item) => {
        // if the parentId is the same as the item.id, then delete the item
        if (item.id === parentId) {
          // eslint-disable-next-line no-undef
          const target = items.findIndex(item => item.id === parentId)
          items.splice(target, 1)
        }
        else if (item.sub) {
          recursiveDeleteFolder(item.sub, parentId)
        }
      })
    }

    recursiveDeleteFolder(newData, parentId)
    setTreeData(newData)
  }

  const addRootFolder = () => {
    const newData = [...treeData]

    newData.push({
      id: newData.length ? newData[newData.length - 1].id + 1 : 1,
      name: 'Hello World',
      type: 'folder',
      level: 0,
      isOpen: true,
    })
    setTreeData(newData)
  }

  // a function to toggle the folder open or close
  const toggleHandler = (paretnId) => {
    const newData = [...treeData]
    console.log(newData)

    const recursiveToggle = (items, parentId) => {
      items.map(item => {
        // if the parentId is the same as the item.id, then toggle the folder open or close
        if (item.id === parentId) {
          item.isOpen = !item.isOpen
        }
        //if parentId is not the same as item.id, then call recursiveToggle to continue searching for the parentId
        else if (item.sub) {
          recursiveToggle(item.sub, parentId)
        }
      })
    }
    // call the recursiveToggle function with the newData and parentId
    recursiveToggle(newData, paretnId)
    // set the new data to the treeData
    setTreeData(newData)
  }

  return (
    <div className={'w-full h-screen flex justify-center items-center flex-col gap-5'}>
      <div className='flex w-full justify-center'>
        <span onClick={() => addRootFolder()} className='text-lg text-blue-400'>Add Root</span>
      </div>
      <Tree treeData={treeData} handleAddFolder={handleAddFolder} handleDeleteFolder={handleDeleteFolder} toggleHandler={toggleHandler} />
    </div>
  )
}

const Tree = ({ treeData, handleAddFolder, handleDeleteFolder, toggleHandler }) => {
  return (
    <>
      <ul className={'list-none'}>
        {treeData.map((node) => (
          <TreeNode key={node.id} node={node} handleAddFolder={handleAddFolder} handleDeleteFolder={handleDeleteFolder} toggleHandler={toggleHandler} />
        ))}
      </ul>
    </>
  )
}

const TreeNode = ({ node, handleAddFolder, handleDeleteFolder, toggleHandler }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  return (
    <>
      {/* Check if the popup is open and if it is, then render the Popup component */}
      {isPopupOpen && <Popup node={node} setIsPopupOpen={setIsPopupOpen} handleAddFolder={handleAddFolder} />}
      <li style={{ paddingLeft: `${node.level * 10}px` }} className={'text-xl'}>
        {
          // if the node.type is folder, then conditionally render the down arrow icon or the right arrow icon
          node.type === 'folder' ?
            // if the node.isOpen is true, then render the down arrow icon otherwise render the right arrow icon
            node.isOpen ? <i onClick={() => toggleHandler(node.id)}
              className='fa-regular fa-down text-green-400 mx-2 cursor-pointer text-sm'></i> :
            <i onClick={() => toggleHandler(node.id)}
              className='fa-regular fa-right text-green-400 mx-2 cursor-pointer text-sm'></i> :
            // if the node.type is not folder, then render an empty icon
            <i></i>
        }

        {node.type === 'folder' ? <i className="fa-solid fa-folder mr-2"></i> :
          <i className="fa-solid fa-file mr-2"></i>}
        {node.name}
        {node.type === "folder" &&
          <i onClick={() => setIsPopupOpen(true)} className='fa-solid fa-plus cursor-pointer px-2 text-blue-400'></i>}
        <i onClick={() => handleDeleteFolder(node.id)}
          className='fa-solid fa-trash cursor-pointer px-2 text-red-400'></i>
        {node.sub && node.isOpen &&
          <Tree treeData={node.sub} handleAddFolder={handleAddFolder} handleDeleteFolder={handleDeleteFolder}
            toggleHandler={toggleHandler} />}
      </li>
    </>
  )
}

export default App
