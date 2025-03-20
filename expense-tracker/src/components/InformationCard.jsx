import React from 'react'
import SwiggyButton from './SwiggyButton'

const InformationCard = ({recipe, onClose}) => {
  return (
 <div className="fixed inset-0 flex items-center justify-center bg-amber-100 bg-opacity-50 z-50">
      <div className="bg-white relative max-w-md w-[400px] h-[500px] p-4 shadow-lg rounded-lg"">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 bg-white p-1 rounded-full text-red-600 hover:text-gray-800 text-2xl z-10"
        >
          X
        </button>
        <div className="h-1/2">
          <a
        href={recipe.strYoutube}
        target="_blank"
        rel="noopener noreferrer"
        className="relative h-32"
       >
          <img 
            className="w-full h-full object-cover"
            src={recipe.strMealThumb}
            alt="Caffe Latte" 
          />
        </a>
        </div>
        <div className="h-1/2 p-4 overflow-auto">
          <h2 className="text-xl font-bold mb-4">{recipe.strMeal}</h2>
          <p>Details for recipe: {recipe.strInstructions}</p>
          {/* Insert additional detailed information here */}
          <div className='flex space-x-56'>
          <p className='font-extrabold' >Too tired to cook this?</p>
          <SwiggyButton recipename = {recipe.strMeal} />
        </div>
        </div>
      </div>
    </div>
  )
}

export default InformationCard
