import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCategories, getBrands } from '../../features/products/productSlice';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';
import './ProductFilters.css';

const ProductFilters = ({ onFilterChange }) => {
  const dispatch = useDispatch();
  const { categories, brands } = useSelector((state) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getBrands());
  }, [dispatch]);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters({ search });
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const applyFilters = useCallback(
    (overrides = {}) => {
      const params = {
        search: overrides.search ?? search,
        category: overrides.category ?? category,
        brand: overrides.brand ?? brand,
        sort: overrides.sort ?? sort,
        minPrice: overrides.minPrice ?? minPrice,
        maxPrice: overrides.maxPrice ?? maxPrice,
        page: 1,
      };

      
      const cleanParams = {};
      Object.entries(params).forEach(([key, val]) => {
        if (val) cleanParams[key] = val;
      });

      setSearchParams(cleanParams);
      onFilterChange?.(cleanParams);
    },
    [search, category, brand, sort, minPrice, maxPrice, setSearchParams, onFilterChange]
  );

  const handleCategoryChange = (val) => {
    setCategory(val);
    applyFilters({ category: val });
  };

  const handleBrandChange = (val) => {
    setBrand(val);
    applyFilters({ brand: val });
  };

  const handleSortChange = (val) => {
    setSort(val);
    applyFilters({ sort: val });
  };

  const handlePriceApply = () => {
    applyFilters({});
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setBrand('');
    setSort('-createdAt');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
    onFilterChange?.({});
  };

  const hasFilters = search || category || brand || minPrice || maxPrice || sort !== '-createdAt';

  return (
    <div className="product-filters">
      {}
      <div className="filter-search">
        <HiMagnifyingGlass className="filter-search-icon" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input filter-search-input"
          id="product-search"
        />
      </div>

      <div className="filter-row">
        {}
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="form-select filter-select"
          id="category-filter"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {}
        <select
          value={brand}
          onChange={(e) => handleBrandChange(e.target.value)}
          className="form-select filter-select"
          id="brand-filter"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        {}
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="form-select filter-select"
          id="sort-filter"
        >
          <option value="-createdAt">Newest First</option>
          <option value="price">Price: Low → High</option>
          <option value="-price">Price: High → Low</option>
          <option value="-averageRating">Top Rated</option>
        </select>

        {}
        <div className="filter-price-range">
          <input
            type="number"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={handlePriceApply}
            className="form-input filter-price-input"
            min="0"
          />
          <span className="filter-price-dash">—</span>
          <input
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={handlePriceApply}
            className="form-input filter-price-input"
            min="0"
          />
        </div>

        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
            <HiXMark size={16} /> Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
