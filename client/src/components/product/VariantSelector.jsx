import { useState, useMemo } from 'react';
import './VariantSelector.css';

const VariantSelector = ({ variants, onVariantSelect }) => {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  
  const colors = useMemo(() => [...new Set(variants.map((v) => v.color).filter(Boolean))], [variants]);
  const sizes = useMemo(() => [...new Set(variants.map((v) => v.size).filter(Boolean))], [variants]);

  
  const activeVariant = useMemo(() => {
    if (!selectedColor && !selectedSize) return null;
    return variants.find((v) => {
      const colorMatch = !selectedColor || v.color === selectedColor;
      const sizeMatch = !selectedSize || v.size === selectedSize;
      return colorMatch && sizeMatch;
    });
  }, [variants, selectedColor, selectedSize]);

  
  const availableSizesForColor = useMemo(() => {
    if (!selectedColor) return sizes;
    return variants.filter((v) => v.color === selectedColor).map((v) => v.size);
  }, [variants, selectedColor, sizes]);

  
  const availableColorsForSize = useMemo(() => {
    if (!selectedSize) return colors;
    return variants.filter((v) => v.size === selectedSize).map((v) => v.color);
  }, [variants, selectedSize, colors]);

  const handleColorClick = (color) => {
    const newColor = color === selectedColor ? '' : color;
    setSelectedColor(newColor);

    const variant = variants.find((v) => v.color === newColor && (!selectedSize || v.size === selectedSize));
    onVariantSelect(variant || null);
  };

  const handleSizeClick = (size) => {
    const newSize = size === selectedSize ? '' : size;
    setSelectedSize(newSize);

    const variant = variants.find((v) => v.size === newSize && (!selectedColor || v.color === selectedColor));
    onVariantSelect(variant || null);
  };

  const getVariantForCombo = (color, size) => {
    return variants.find((v) => v.color === color && v.size === size);
  };

  const isComboOutOfStock = (color, size) => {
    const v = getVariantForCombo(color, size);
    return v && v.stock === 0;
  };

  return (
    <div className="variant-selector">
      {}
      {colors.length > 0 && (
        <div className="variant-group">
          <label className="variant-label">
            Color{selectedColor && <span className="variant-selected">: {selectedColor}</span>}
          </label>
          <div className="variant-options">
            {colors.map((color) => {
              const isAvailable = availableColorsForSize.includes(color);
              const combo = selectedSize ? getVariantForCombo(color, selectedSize) : null;
              const isOOS = combo ? combo.stock === 0 : false;

              return (
                <button
                  key={color}
                  className={`variant-btn variant-color-btn ${selectedColor === color ? 'active' : ''} ${
                    !isAvailable ? 'unavailable' : ''
                  } ${isOOS ? 'out-of-stock' : ''}`}
                  onClick={() => handleColorClick(color)}
                  disabled={!isAvailable}
                  title={!isAvailable ? 'Not available' : isOOS ? 'Out of stock' : color}
                >
                  {color}
                  {isOOS && <span className="oos-line"></span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {}
      {sizes.length > 0 && (
        <div className="variant-group">
          <label className="variant-label">
            Size{selectedSize && <span className="variant-selected">: {selectedSize}</span>}
          </label>
          <div className="variant-options">
            {sizes.map((size) => {
              const isAvailable = availableSizesForColor.includes(size);
              const combo = selectedColor ? getVariantForCombo(selectedColor, size) : null;
              const isOOS = combo ? combo.stock === 0 : false;

              return (
                <button
                  key={size}
                  className={`variant-btn variant-size-btn ${selectedSize === size ? 'active' : ''} ${
                    !isAvailable ? 'unavailable' : ''
                  } ${isOOS ? 'out-of-stock' : ''}`}
                  onClick={() => handleSizeClick(size)}
                  disabled={!isAvailable}
                  title={!isAvailable ? 'Not available' : isOOS ? 'Out of stock' : size}
                >
                  {size}
                  {isOOS && <span className="oos-line"></span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {}
      {activeVariant && (
        <div className="variant-info animate-fade-in">
          <div className="variant-info-row">
            <span className="variant-info-label">Price:</span>
            <span className="variant-info-price">₹{activeVariant.price.toLocaleString('en-IN')}</span>
          </div>
          <div className="variant-info-row">
            <span className="variant-info-label">SKU:</span>
            <span className="variant-info-sku">{activeVariant.sku}</span>
          </div>
          <div className="variant-info-row">
            <span className="variant-info-label">Stock:</span>
            {activeVariant.stock > 0 ? (
              <span className="badge badge-success">{activeVariant.stock} in stock</span>
            ) : (
              <span className="badge badge-danger">Out of stock</span>
            )}
          </div>
        </div>
      )}

      {}
      {!activeVariant && (selectedColor || selectedSize) && (
        <div className="variant-info animate-fade-in">
          <p className="text-muted" style={{ fontSize: '0.88rem' }}>
            {!selectedColor && colors.length > 0 && 'Please select a color'}
            {!selectedSize && sizes.length > 0 && selectedColor && 'Please select a size'}
            {selectedColor && selectedSize && 'This combination is unavailable'}
          </p>
        </div>
      )}
    </div>
  );
};

export default VariantSelector;
