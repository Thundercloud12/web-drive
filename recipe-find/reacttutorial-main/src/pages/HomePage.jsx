import { Search } from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"




const HomePage = () => {
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(true);


 const fetchRecipes = async (queryparam) => {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${queryparam}`);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    // Wait for JSON parsing
    const data = await res.json();
    
    console.log("API Response Data:", data); 
    setRecipes(data.meals || []);
    setLoading(false);
    } catch (error) {
      console.log(error);
      
    }
  }

  const suggestrecipe = async () => {
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
      const recipes = await res.json()
      setRecipes(recipes.meals || []); 
    } catch (error) {
      
    }
  }

  useEffect(() => {
    fetchRecipes("cake")
  }, [])

  const handleSearchRecipe = (e) => {
    e.preventDefault();
    fetchRecipes(e.target[0].value)
  }

	return (
		<div className="bg-[#faf9fb] p-10 flex flex-nowrap">
      <div className="flex-1 ml-6">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex gap-x-10">
          <form onSubmit={handleSearchRecipe}>
            <label className="input shadow-md flex items-center gap-2">
              <Search size={"24"} />
              <input
                type="text"
                className="text-sm md:text-md grow"
                placeholder="What do you want to cook today?"
              />
            </label>
          </form>
         <Button className="bg-fuchsia-100 text-amber-500" onClick={(e) => {
          e.preventDefault()
          suggestrecipe()
         }}>Suggest me something</Button>
        </div>
          


          <h1 className="font-bold text-3xl md:text-5xl mt-4">
            Recommended Recipes
          </h1>
          <p className="text-slate-500 font-semibold ml-1 my-2 text-sm tracking-tight">
            Popular choices
          </p>

          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {!loading &&
              recipes.map((recipe , index) => (
                <RecipeCard key={index} recipe={recipe} />
              ))}

            {loading &&
              [...Array(9)].map((_, index) => (
                <div key={index} className="flex flex-col gap-4 w-full">
                  <div className="skeleton h-32 w-full"></div>
                  <div className="flex justify-between">
                    <div className="skeleton h-4 w-28"></div>
                    <div className="skeleton h-4 w-24"></div>
                  </div>
                  <div className="skeleton h-4 w-1/2"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
	);
};
export default HomePage;
