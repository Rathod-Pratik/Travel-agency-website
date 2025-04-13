import React from 'react'

const CheckingModel = ({functions,onClose,text}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/40 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
      <h2 className="text-2xl font-bold text-gray-800">Are you sure?</h2>
      <p className="text-gray-600 mt-2">Do you really want to cancel this {text}?</p>

      <div className="mt-6 flex justify-center gap-4">
        <button 
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition hover:bg-gray-400"
          onClick={onClose}  
        >
          Cancel
        </button>

        <button 
          className="bg-orange-500 cursor-pointer text-white px-4 py-2 rounded-md transition hover:bg-orange-600"
           onClick={functions} 
        >
          Confirm
        </button>
      </div>
    </div>
  </div>

  )
}

export default CheckingModel;