import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from '../../features/products/productSlice';
import { HiPlus, HiPencil, HiTrash, HiXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import './AdminPages.css';

const emptyProduct = { name: '', description: '', brand: '', category: '', basePrice: '', images: [''], variants: [] };
const emptyVariant = { sku: '', size: '', color: '', price: '', stock: '' };

const ProductManagePage = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [variants, setVariants] = useState([]);

  useEffect(() => { dispatch(getProducts({ limit: 100 })); }, [dispatch]);

  const openCreate = () => { setEditing(null); setForm(emptyProduct); setVariants([{ ...emptyVariant }]); setShowModal(true); };
  const openEdit = (p) => { setEditing(p._id); setForm({ ...p, images: p.images?.length ? p.images : [''] }); setVariants(p.variants || []); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, basePrice: Number(form.basePrice), images: form.images.filter(Boolean), variants: variants.map(v => ({ ...v, price: Number(v.price), stock: Number(v.stock) })) };
    try {
      if (editing) { await dispatch(adminUpdateProduct({ id: editing, productData: data })).unwrap(); toast.success('Product updated'); }
      else { await dispatch(adminCreateProduct(data)).unwrap(); toast.success('Product created'); }
      setShowModal(false);
      dispatch(getProducts({ limit: 100 }));
    } catch (err) { toast.error(err || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await dispatch(adminDeleteProduct(id)).unwrap(); toast.success('Deleted'); } catch (err) { toast.error(err || 'Failed'); }
  };

  const addVariant = () => setVariants([...variants, { ...emptyVariant }]);
  const removeVariant = (i) => setVariants(variants.filter((_, idx) => idx !== i));
  const updateVariant = (i, field, val) => { const v = [...variants]; v[i][field] = val; setVariants(v); };

  return (
    <div className="page">
      <div className="container">
        <div className="flex justify-between items-center mb-lg">
          <div><h1 className="page-title">Products</h1><p className="page-subtitle">{products.length} products</p></div>
          <button className="btn btn-primary" onClick={openCreate}><HiPlus /> Add Product</button>
        </div>

        <div className="admin-table-wrap card-glass">
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Variants</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td><div className="flex items-center gap-sm"><img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt={p.name} className="admin-product-thumb" /></div></td>
                  <td><span className="badge badge-primary">{p.category}</span></td>
                  <td className="price">₹{p.basePrice.toLocaleString('en-IN')}</td>
                  <td>{p.variants?.length || 0}</td>
                  <td><div className="flex gap-sm"><button className="btn btn-ghost btn-icon" onClick={() => openEdit(p)}><HiPencil size={16} /></button><button className="btn btn-ghost btn-icon" onClick={() => handleDelete(p._id)}><HiTrash size={16} className="text-danger" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="admin-modal animate-scale-in" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-lg">
                <h2>{editing ? 'Edit Product' : 'Add Product'}</h2>
                <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><HiXMark size={20} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{resize:'vertical'}} /></div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem'}}>
                  <div className="form-group"><label className="form-label">Brand</label><input className="form-input" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Category</label><input className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required /></div>
                  <div className="form-group"><label className="form-label">Base Price</label><input className="form-input" type="number" value={form.basePrice} onChange={e => setForm({...form, basePrice: e.target.value})} required /></div>
                </div>
                <div className="form-group"><label className="form-label">Image URL</label><input className="form-input" value={form.images[0]} onChange={e => setForm({...form, images: [e.target.value]})} /></div>

                <div className="flex justify-between items-center" style={{margin:'1.5rem 0 0.75rem'}}><h3 style={{fontSize:'1rem'}}>Variants</h3><button type="button" className="btn btn-secondary btn-sm" onClick={addVariant}><HiPlus size={14} /> Add</button></div>
                {variants.map((v, i) => (
                  <div key={i} className="variant-form-row">
                    <input className="form-input" placeholder="SKU" value={v.sku} onChange={e => updateVariant(i, 'sku', e.target.value)} />
                    <input className="form-input" placeholder="Size" value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} />
                    <input className="form-input" placeholder="Color" value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)} />
                    <input className="form-input" placeholder="Price" type="number" value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} />
                    <input className="form-input" placeholder="Stock" type="number" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} />
                    <button type="button" className="btn btn-ghost btn-icon" onClick={() => removeVariant(i)}><HiXMark size={16} /></button>
                  </div>
                ))}

                <button type="submit" className="btn btn-primary btn-lg w-full mt-lg">{editing ? 'Update Product' : 'Create Product'}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagePage;
