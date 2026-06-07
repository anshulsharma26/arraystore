import { useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../features/products/productSlice';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import Pagination from '../components/ui/Pagination';
import Loader from '../components/ui/Loader';
import './ProductListPage.css';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, page, pages, total, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    dispatch(getProducts(params));
  }, [dispatch, searchParams]);

  const handleFilterChange = useCallback(
    (filters) => {
      dispatch(getProducts(filters));
    },
    [dispatch]
  );

  const handlePageChange = (newPage) => {
    const params = Object.fromEntries(searchParams.entries());
    params.page = newPage;
    setSearchParams(params);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Shop All Products</h1>
          <p className="page-subtitle">
            {total > 0 ? `${total} products found` : 'Browse our collection'}
          </p>
        </div>

        <ProductFilters onFilterChange={handleFilterChange} />

        {isLoading ? (
          <div className="grid-products">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="skeleton skeleton-card"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No products found</h3>
            <p className="empty-state-text">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <div className="grid-products stagger">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <Pagination page={page} pages={pages} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
