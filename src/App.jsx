
import { useEffect, useState } from "react";
import {
  Search, Clock, ChefHat, Heart, Utensils,
  X, ArrowRight, Leaf, BookOpen
} from "lucide-react";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Vegetarian");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const API = "https://www.themealdb.com/api/json/v1/1";

  useEffect(() => {
    fetch(`${API}/categories.php`)
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(() => setCategories([]));

    loadCategory("Vegetarian");
  }, []);

  const loadCategory = async (category) => {
    setLoading(true);
    setSearch("");
    setActiveCategory(category);

    try {
      const res = await fetch(
        `${API}/filter.php?c=${encodeURIComponent(category)}`
      );
      const data = await res.json();
      setRecipes(data.meals || []);
    } catch {
      setRecipes([]);
    }

    setLoading(false);
  };

  const searchRecipes = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    setLoading(true);
    setActiveCategory("");

    try {
      const res = await fetch(
        `${API}/search.php?s=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      setRecipes(data.meals || []);
    } catch {
      setRecipes([]);
    }

    setLoading(false);
  };

  const openRecipe = async (id) => {
    try {
      const res = await fetch(`${API}/lookup.php?i=${id}`);
      const data = await res.json();
      setSelected(data.meals?.[0] || null);
    } catch {
      alert("Unable to load recipe. Please try again.");
    }
  };

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const ingredients = selected
    ? Array.from({ length: 20 }, (_, i) => ({
        name: selected[`strIngredient${i + 1}`],
        measure: selected[`strMeasure${i + 1}`]
      })).filter(item => item.name?.trim())
    : [];

  return (
    <div className="app">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; background: #fffaf3; color: #302b25; }
        button, input { font: inherit; }
        button { cursor: pointer; }
        .navbar {
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 7%; background: #fff; border-bottom: 1px solid #eee7dc;
          position: sticky; top: 0; z-index: 5;
        }
        .logo { color: #e87935; font-size: 26px; font-weight: 800; }
        .logo span { color: #39332b; }
        .nav-right { display: flex; gap: 22px; align-items: center; }
        .nav-right button { border: none; background: none; color: #554c42; }
        .hero {
          margin: 35px auto; width: 86%; min-height: 330px; border-radius: 24px;
          padding: 55px; display: flex; align-items: center;
          background: linear-gradient(90deg, #34291f 0%, #34291fdd 45%, #34291f20 100%),
          url("https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1400");
          background-size: cover; background-position: center; color: white;
        }
        .hero-content { max-width: 530px; }
        .tag { color: #ffc28e; font-size: 13px; font-weight: bold; letter-spacing: 2px; }
        .hero h1 { font-size: clamp(35px, 5vw, 55px); margin: 17px 0; line-height: 1.1; }
        .hero p { color: #eee1d5; line-height: 1.7; margin-bottom: 25px; }
        .search { display: flex; background: white; border-radius: 10px; padding: 6px; max-width: 460px; }
        .search input { border: none; outline: none; padding: 13px; flex: 1; min-width: 0; color: #333; }
        .search button { background: #e87935; color: white; border: none; border-radius: 8px; padding: 12px 18px; }
        .container { width: 86%; margin: 45px auto; }
        .section-heading { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; gap: 10px; }
        .section-heading h2 { font-size: 27px; }
        .section-heading p { color: #918579; font-size: 14px; margin-top: 7px; }
        .categories { display: flex; gap: 10px; overflow-x: auto; padding: 5px 0 18px; }
        .category {
          padding: 11px 18px; border-radius: 30px; white-space: nowrap;
          background: white; border: 1px solid #eadfd1; color: #665b50;
        }
        .category.active { background: #e87935; color: white; border-color: #e87935; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 24px; }
        .card {
          background: white; border-radius: 16px; overflow: hidden;
          box-shadow: 0 5px 20px #46351a0b; transition: .2s;
        }
        .card:hover { transform: translateY(-5px); box-shadow: 0 12px 25px #46351a18; }
        .image-wrap { position: relative; }
        .card img { width: 100%; height: 190px; object-fit: cover; display: block; }
        .heart {
          position: absolute; right: 12px; top: 12px; background: white;
          border: none; border-radius: 50%; padding: 9px; display: grid;
          color: #e87935;
        }
        .card-info { padding: 17px; }
        .card-info h3 { font-size: 17px; margin-bottom: 12px; line-height: 1.4; }
        .card-bottom { display: flex; justify-content: space-between; align-items: center; }
        .card-bottom span { font-size: 13px; color: #95877a; }
        .view-btn { border: none; background: #fff0e4; color: #d96e2f; padding: 9px 12px; border-radius: 8px; font-weight: bold; }
        .status { text-align: center; padding: 50px 10px; color: #82776c; }
        .footer { text-align: center; padding: 30px; background: #34291f; color: #e9d9c8; margin-top: 60px; }
        .modal-bg {
          position: fixed; inset: 0; background: #0009; z-index: 10;
          display: flex; justify-content: center; align-items: center; padding: 20px;
        }
        .modal {
          background: white; border-radius: 18px; max-width: 750px; width: 100%;
          max-height: 90vh; overflow-y: auto; position: relative; padding: 25px;
        }
        .close { position: absolute; right: 18px; top: 18px; border: none; background: white; padding: 8px; border-radius: 50%; }
        .modal img { width: 100%; max-height: 280px; object-fit: cover; border-radius: 12px; margin: 12px 0 20px; }
        .modal h2 { color: #d96e2f; margin: 10px 0; }
        .modal h3 { margin: 20px 0 10px; }
        .modal p, .modal li { line-height: 1.7; color: #685e54; }
        .modal ul { padding-left: 22px; }
        @media(max-width: 650px) {
          .navbar { padding: 17px 5%; }
          .nav-right { gap: 10px; }
          .hero { width: 92%; padding: 30px 22px; min-height: 350px; }
          .container { width: 92%; }
          .section-heading h2 { font-size: 22px; }
          .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
          .card img { height: 140px; }
          .card-info { padding: 12px; }
          .card-info h3 { font-size: 14px; }
        }
      `}</style>

      <nav className="navbar">
        <div className="logo">Recipe<span>Hub.</span></div>
        <div className="nav-right">
          <button onClick={() => loadCategory("Vegetarian")}>Explore</button>
          <button onClick={() => {
            setRecipes(recipes.filter(r => favorites.includes(r.idMeal)));
            setActiveCategory("");
          }}>
            <Heart size={17} /> Favorites ({favorites.length})
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="tag">FRESH IDEAS. DELICIOUS MEALS.</div>
          <h1>Find your next favourite recipe.</h1>
          <p>Discover delicious dishes, explore new flavours and bring something special to your table.</p>
          <form className="search" onSubmit={searchRecipes}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search recipes..."
            />
            <button type="submit"><Search size={18} /></button>
          </form>
        </div>
      </section>

      <main className="container">
        <div className="section-heading">
          <div>
            <h2>Explore Categories</h2>
            <p>Choose a category and discover something tasty.</p>
          </div>
          <Utensils color="#e87935" size={27} />
        </div>

        <div className="categories">
          {categories.map(cat => (
            <button
              key={cat.idCategory}
              className={`category ${activeCategory === cat.strCategory ? "active" : ""}`}
              onClick={() => loadCategory(cat.strCategory)}
            >
              {cat.strCategory}
            </button>
          ))}
        </div>

        <div className="section-heading">
          <div>
            <h2>Discover Recipes</h2>
            <p>Handpicked inspiration for your next meal.</p>
          </div>
          <BookOpen color="#e87935" size={26} />
        </div>

        {loading ? (
          <div className="status">Loading delicious recipes...</div>
        ) : recipes.length === 0 ? (
          <div className="status">
            <ChefHat size={40} />
            <h3>No recipes found</h3>
            <p>Try another search or select a different category.</p>
          </div>
        ) : (
          <div className="grid">
            {recipes.map(recipe => (
              <div className="card" key={recipe.idMeal}>
                <div className="image-wrap">
                  <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                  <button
                    className="heart"
                    onClick={() => toggleFavorite(recipe.idMeal)}
                  >
                    <Heart
                      size={18}
                      fill={favorites.includes(recipe.idMeal) ? "#e87935" : "none"}
                    />
                  </button>
                </div>
                <div className="card-info">
                  <h3>{recipe.strMeal}</h3>
                  <div className="card-bottom">
                    <span><Leaf size={14} /> Recipe idea</span>
                    <button className="view-btn" onClick={() => openRecipe(recipe.idMeal)}>
                      View Recipe <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selected && (
        <div className="modal-bg" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setSelected(null)}>
              <X size={22} />
            </button>
            <img src={selected.strMealThumb} alt={selected.strMeal} />
            <h2>{selected.strMeal}</h2>
            <p>{selected.strCategory} · {selected.strArea}</p>
            <h3>Ingredients</h3>
            <ul>
              {ingredients.map((item, i) => (
                <li key={i}>{item.measure} {item.name}</li>
              ))}
            </ul>
            <h3>Cooking Instructions</h3>
            <p>{selected.strInstructions}</p>
          </div>
        </div>
      )}

      <footer className="footer">
        <h3>RecipeHub.</h3>
        <p>Discover. Cook. Enjoy. | Made with love for food lovers.</p>
      </footer>
    </div>
  );
}

export default App;
