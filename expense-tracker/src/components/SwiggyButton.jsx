import React from 'react'

const SwiggyButton = ({recipename}) => {
    const urlcomp = encodeURIComponent(recipename);
    const swiggyUrl = `https://www.swiggy.com/search?query=${urlcomp}`;
  return (
    <div>
    <a 
      href={swiggyUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
    >
      SWIGGY IT!
    </a>
    </div>
  )
}

export default SwiggyButton
