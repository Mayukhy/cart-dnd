import { useState } from "react";
import useStore from "../store/customStore";

export default function ProductCard({ product }) {
  const { id, title, thumbnail, price, discountPercentage, rating, brand, category } = product;
  const discountedPrice = (price - (price * discountPercentage) / 100).toFixed(2);
  const {updateCart, cartData} = useStore()
  const [loading, setLoading] = useState(false)
  const addToCart = async() => {
   setLoading(true)
   await updateCart("ADD", {
    id,
    title,
    thumbnail,
    price,
    quantity: 1,
    discountPercentage,
    category,
    timeStamp: Date.now()
   })
   await new Promise(r => setTimeout(r, 500))
   setLoading(false)
}

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-3 flex flex-col flex-1 gap-1">
        <span className="text-xs text-gray-500 uppercase">{category}</span>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{title}</h3>
        {brand && <span className="text-xs text-gray-400">{brand}</span>}
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-500 text-sm">★ {rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-2 mt-auto pt-2">
          <span className="text-lg font-bold text-green-600">${discountedPrice}</span>
          <span className="text-sm text-gray-400 line-through">${price}</span>
          <span className="text-xs text-red-500">-{discountPercentage}%</span>
        </div>
        <button onClick={addToCart} className={`mt-2 w-full bg-blue-600 text-white text-sm py-1.5 rounded hover:bg-blue-700 transition-colors cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading}>
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
