import { Heart, HeartPulse, Soup } from "lucide-react";
import { useEffect, useState } from "react";
import InformationCard from "./InformationCard";

const RecipeCard = ({ recipe, bg, badge }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showinfo, setshowinfo] = useState(false);

  // On mount (and whenever recipe.strMeal changes), check if this recipe is in local storage favorites
  useEffect(() => {
    const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    const isRecipeAlreadyInFavourite = favourites.some(
      (fav) => fav.strMeal === recipe.strMeal
    );
    if (isRecipeAlreadyInFavourite) {
      setIsFavorite(true);
    }
  }, [recipe.strMeal]);

  const addRecipeToFavorites = () => {
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    const isRecipeAlreadyInFavourite = favourites.some(
      (fav) => fav.strMeal === recipe.strMeal
    );

    if (isRecipeAlreadyInFavourite) {
      // Remove the recipe from favourites by filtering it out
      favourites = favourites.filter(
        (fav) => fav.strMeal !== recipe.strMeal
      );
      setIsFavorite(false);
    } else {
      favourites.push(recipe);
      setIsFavorite(true);
    }
    localStorage.setItem("favourites", JSON.stringify(favourites));
	
  };

  const handleShowInfo = () => {
    setshowinfo(true)
  }

  return (
    <div className={`flex flex-col rounded-md ${bg} overflow-hidden p-3 relative`}>
      <a
        href={recipe.strYoutube}
        target="_blank"
        rel="noopener noreferrer"
        className="relative h-32"
      >
        <div className="skeleton absolute inset-0" />
        <img
          src={recipe?.strMealThumb || "default-image-url.jpg"}
          alt="recipe img"
          className="rounded-md w-full h-full object-cover cursor-pointer opacity-0 transition-opacity duration-500"
          onLoad={(e) => {
            e.currentTarget.style.opacity = 1;
            e.currentTarget.previousElementSibling.style.display = "none";
          }}
        />
        <div
          className="absolute top-1 right-2 bg-white rounded-full p-1 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            addRecipeToFavorites();
          }}
        >
          {!isFavorite && <Heart size={20} className="hover:fill-red-500 hover:text-red-500" />}
          {isFavorite && <Heart size={20} className="fill-red-500 text-red-500" />}
        </div>
      </a>

      <div className="flex mt-1">
        <p className="font-bold tracking-wide">{recipe?.strMeal || "hello"}</p>
      </div>
     <button
        onClick={handleShowInfo}
        className="absolute bottom-0 right-3 bg-blue-300 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        More Info
      </button>

      {/* Conditionally render the InformationCard */}
      {showinfo && (
        <InformationCard
          recipe={recipe} 
          onClose={() => setshowinfo(false)} 
        />
      )}
    </div>
  );
};

export default RecipeCard;
