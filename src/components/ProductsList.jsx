import { useCallback, useEffect, useRef } from "react";
import useStore from "../store/customStore";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductsList() {
  const { products, setProducts, filter, changeFilter, loading, hasMore } = useStore();
  const observerRef = useRef();

  useEffect(() => {
    setProducts();
  }, [filter]);

  const lastElementRef = useCallback((node) => {
    if (loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    if (!hasMore) return;

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        changeFilter();
      }
    }, {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    });

    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, changeFilter]);

  const productList = products?.products || [];

  return (
    <div className="flex-1 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {productList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}
      {hasMore && <div ref={lastElementRef} style={{ height: "20px" }} />}
      {!hasMore && productList.length > 0 && (
        <p className="text-center py-4 text-gray-400 text-sm">No more products</p>
      )}
    </div>
  );
}
