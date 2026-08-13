import React, { useState, useEffect } from 'react';
import { Package, Trash2, Edit2, Plus, TrendingUp, AlertTriangle, Truck, ShoppingCart, BarChart3, Tag } from 'lucide-react';
import { Product, Order, Seller } from '../types';

interface SellerPanelProps {
  sellerUser: { id: string; name: string; email: string };
  onNotify: (title: string, msg: string, type: 'success' | 'info') => void;
}

export default function SellerPanel({ sellerUser, onNotify }: SellerPanelProps) {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'kpi' | 'inventory' | 'orders'>('kpi');
  const [isRegistering, setIsRegistering] = useState(false);

  // Store registration state
  const [storeName, setStoreName] = useState('');
  const [storeDesc, setStoreDesc] = useState('');

  // Add inventory item form state
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [origPrice, setOrigPrice] = useState('');
  const [category, setCategory] = useState("Women's Fashion");
  const [subCategory, setSubCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [stock, setStock] = useState('');
  const [sizesStr, setSizesStr] = useState('');
  const [colorsStr, setColorsStr] = useState('');
  const [description, setDescription] = useState('');

  const fetchSellerData = async () => {
    try {
      const respProfile = await fetch(`/api/seller/profile/${sellerUser.id}`);
      const selData = await respProfile.json();
      setSeller(selData);

      if (selData && selData.kycStatus === 'APPROVED') {
        const respProducts = await fetch(`/api/seller/products/${selData.id}`);
        const pData = await respProducts.json();
        setProducts(pData);

        const respOrders = await fetch(`/api/seller/orders/${selData.id}`);
        const oData = await respOrders.json();
        setOrders(oData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSellerData();
  }, [sellerUser.id]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !storeDesc) {
      onNotify('Fields required', 'Please provide a store name and description.', 'info');
      return;
    }

    try {
      const resp = await fetch('/api/seller/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: sellerUser.id,
          storeName,
          description: storeDesc
        })
      });

      if (resp.ok) {
        onNotify('Application Sent', 'Seller registration submitted for Admin verification approval.', 'success');
        fetchSellerData();
      } else {
        const err = await resp.json();
        onNotify('Failed to register', err.error || 'Server error', 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !stock || !imgUrl) {
      onNotify('Form Validation', 'Please fill in Title, Price, Image and Stock values.', 'info');
      return;
    }

    const payload = {
      title,
      description,
      price,
      originalPrice: origPrice || price,
      category,
      subCategory,
      brand,
      images: [imgUrl],
      stock,
      variants: {
        sizes: sizesStr.split(',').map(s => s.trim()).filter(Boolean),
        colors: colorsStr.split(',').map(c => c.trim()).filter(Boolean)
      },
      sellerId: seller?.id,
      sellerName: seller?.storeName
    };

    try {
      let resp;
      if (editingItemId) {
        resp = await fetch(`/api/seller/products/${editingItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        resp = await fetch('/api/seller/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (resp.ok) {
        onNotify('Catalog Updated', editingItemId ? 'Product successfully modified.' : 'Product listed successfully!', 'success');
        setIsAddingItem(false);
        setEditingItemId(null);
        clearForm();
        fetchSellerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (p: Product) => {
    setEditingItemId(p.id);
    setTitle(p.title);
    setPrice(p.price.toString());
    setOrigPrice(p.originalPrice.toString());
    setCategory(p.category);
    setSubCategory(p.subCategory || '');
    setBrand(p.brand);
    setImgUrl(p.images[0] || '');
    setStock(p.stock.toString());
    setSizesStr(p.variants?.sizes?.join(', ') || '');
    setColorsStr(p.variants?.colors?.join(', ') || '');
    setDescription(p.description);
    setIsAddingItem(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const resp = await fetch(`/api/seller/products/${productId}`, {
        method: 'DELETE'
      });
      if (resp.ok) {
        onNotify('Product Discontinued', 'Product removed from system catalog listings.', 'success');
        fetchSellerData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusShift = async (orderId: string, currentStatus: Order['status']) => {
    let nextStatus: Order['status'];
    if (currentStatus === 'PENDING') nextStatus = 'PROCESSED';
    else if (currentStatus === 'PROCESSED') nextStatus = 'SHIPPED';
    else if (currentStatus === 'SHIPPED') nextStatus = 'DELIVERED';
    else return;

    try {
      const resp = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (resp.ok) {
        onNotify('Order Adjusted', `Order transitioned to ${nextStatus}`, 'success');
        fetchSellerData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearForm = () => {
    setTitle('');
    setPrice('');
    setOrigPrice('');
    setBrand('');
    setImgUrl('');
    setStock('');
    setSizesStr('');
    setColorsStr('');
    setDescription('');
    setSubCategory('');
  };

  if (!seller) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 max-w-xl mx-auto font-sans text-center">
        <TrendingUp className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Initialize Your Seller Hub</h3>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          Open a verified digital merchant store front on RFP to list garments, tech gear, or accessories and process bulk transactions.
        </p>

        <form onSubmit={handleRegister} className="space-y-4 text-xs text-left">
          <div>
            <label className="block text-gray-600 font-bold mb-1">Store Name</label>
            <input
              id="inp-store-name"
              type="text"
              placeholder="e.g. Sabyasachi Retailers"
              value={storeName}
              onChange={e => setStoreName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-bold mb-1">Store Vision / Description</label>
            <textarea
              id="inp-store-desc"
              rows={3}
              placeholder="Tell customers about your exclusive fashion catalog, shipping speeds, and custom design standards..."
              value={storeDesc}
              onChange={e => setStoreDesc(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>
          <button
            id="btn-submit-seller"
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition cursor-pointer"
          >
            Launch Shopfront Verification
          </button>
        </form>
      </div>
    );
  }

  if (seller.kycStatus === 'PENDING') {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-8 max-w-lg mx-auto font-sans text-center shadow-xs">
        <Package className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Store Profile Under Core Verification</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-4">
          The verified store profile for <span className="font-semibold text-gray-800">"{seller.storeName}"</span> is with Admin services. Please use the Role Switcher to click Admin tab and approve KYC authorization instantly.
        </p>
        <span className="inline-block bg-amber-50 text-amber-700 font-mono text-[10px] font-bold px-3 py-1 rounded-full tracking-wider">
          STATUS: KYC PENDING
        </span>
      </div>
    );
  }

  // Approved seller content
  const totalSellerSales = products.reduce((acc, p) => acc + (p.price * (Math.floor(Math.random() * 3))), 0); // Simulated sales metrics
  const lowStockProducts = products.filter(p => p.stock <= 10);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
        <div>
          <span className="text-[10px] bg-slate-100 font-mono font-bold text-slate-600 px-2 py-0.5 rounded uppercase">Verified Merchant</span>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight mt-1">{seller.storeName} Dashboard</h2>
          <p className="text-xs text-gray-500">{seller.description}</p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-medium max-w-sm">
          <button
            id="tab-seller-kpi"
            onClick={() => { setActiveTab('kpi'); setIsAddingItem(false); }}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === 'kpi' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <BarChart3 className="w-3.5 h-3.5 inline mr-1" />
            Performance
          </button>
          <button
            id="tab-seller-inv"
            onClick={() => { setActiveTab('inventory'); }}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === 'inventory' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Package className="w-3.5 h-3.5 inline mr-1" />
            Stock Vault ({products.length})
          </button>
          <button
            id="tab-seller-ord"
            onClick={() => { setActiveTab('orders'); setIsAddingItem(false); }}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === 'orders' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Truck className="w-3.5 h-3.5 inline mr-1" />
            Dispatches ({orders.length})
          </button>
        </div>
      </div>

      {activeTab === 'kpi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <span className="text-2xl font-bold block text-gray-900">₹{totalSellerSales.toLocaleString()}</span>
              <span className="text-xs text-gray-400 font-medium">Estimated Revenue (Gross)</span>
            </div>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <span className="text-2xl font-bold block text-gray-900">{products.length}</span>
              <span className="text-xs text-gray-400 font-medium">Live SKUs Listed</span>
            </div>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <span className="text-2xl font-bold block text-gray-900">{orders.length}</span>
              <span className="text-xs text-gray-400 font-medium font-sans">Active Customer Orders</span>
            </div>
            <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100">
              <span className="text-2xl font-bold block text-red-600 font-sans">{lowStockProducts.length}</span>
              <span className="text-xs text-red-500 font-medium">Low Stock Alerts (≤ 10)</span>
            </div>
          </div>

          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900">Critical Stock Replenishment Required</span>
                <p className="text-amber-800 mt-1 max-w-2xl leading-relaxed">
                  The following listed catalog items details contain critical stock quantities threating order cancellations: {lowStockProducts.map(p => `"${p.title}"`).join(', ')}. Please update database inventory stock totals immediately inside the stock vault.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Product Registry & SKU Managers</h3>
            {!isAddingItem && (
              <button
                id="btn-open-creator"
                onClick={() => { setIsAddingItem(true); setEditingItemId(null); clearForm(); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Add New Product Entry
              </button>
            )}
          </div>

          {isAddingItem && (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <h4 className="font-bold text-gray-900 text-sm mb-4">
                {editingItemId ? `Modify Item Details (ID: ${editingItemId})` : 'Construct New Catalog Listing'}
              </h4>
              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Product Title</label>
                    <input
                      id="inp-prod-title"
                      type="text"
                      placeholder="e.g. Pure Georgette Silk Saree"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Selling Price (₹)</label>
                      <input
                        id="inp-prod-price"
                        type="number"
                        placeholder="e.g. 1499"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">M.R.P / Striked (₹)</label>
                      <input
                        id="inp-prod-orig"
                        type="number"
                        placeholder="e.g. 2499"
                        value={origPrice}
                        onChange={e => setOrigPrice(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Main Category</label>
                      <select
                        id="sel-prod-cat"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Women's Fashion">Women's Fashion</option>
                        <option value="Men's Fashion">Men's Fashion</option>
                        <option value="Footwear">Footwear</option>
                        <option value="Kids Section">Kids Section</option>
                        <option value="Books">Books</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Home & Kitchen">Home & Kitchen</option>
                        <option value="Sports & Fitness">Sports & Fitness</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Subcategory (Optional)</label>
                      <input
                        id="inp-prod-sub"
                        type="text"
                        placeholder="e.g. Sarees, Laptops"
                        value={subCategory}
                        onChange={e => setSubCategory(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Brand Name</label>
                      <input
                        id="inp-prod-brand"
                        type="text"
                        placeholder="e.g. Sabyasachi"
                        value={brand}
                        onChange={e => setBrand(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Starting Stock Level</label>
                      <input
                        id="inp-prod-stock"
                        type="number"
                        placeholder="e.g. 50"
                        value={stock}
                        onChange={e => setStock(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Direct Image URL link (Unsplash references)</label>
                    <input
                      id="inp-prod-img"
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={imgUrl}
                      onChange={e => setImgUrl(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500 font-mono text-[10.5px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Sizes (separated by commas)</label>
                      <input
                        id="inp-prod-sizes"
                        type="text"
                        placeholder="S, M, L, XL"
                        value={sizesStr}
                        onChange={e => setSizesStr(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-bold mb-1">Colors (separated by commas)</label>
                      <input
                        id="inp-prod-colors"
                        type="text"
                        placeholder="Ruby Red, Royal Blue"
                        value={colorsStr}
                        onChange={e => setColorsStr(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-600 font-bold mb-1">Core Description & Features</label>
                    <textarea
                      id="inp-prod-desc"
                      rows={3}
                      placeholder="Add key highlights and specifications details..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-indigo-500"
                    ></textarea>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      id="btn-save-sku"
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition cursor-pointer"
                    >
                      Save SKU Configurations
                    </button>
                    <button
                      id="btn-cancel-creator"
                      type="button"
                      onClick={() => { setIsAddingItem(false); setEditingItemId(null); clearForm(); }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 rounded-xl transition cursor-pointer"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {products.length === 0 ? (
            <p className="text-xs text-gray-400 py-3">No active product lists in this account.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 shadow-xs">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-20 h-20 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <span className="font-bold text-gray-900 block truncate text-sm leading-none">{p.title}</span>
                    <span className="text-gray-400 text-[10px] block mt-1.5">{p.category} | {p.brand}</span>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-indigo-600 text-sm">₹{p.price}</span>
                      <span className="text-gray-400 line-through">₹{p.originalPrice}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                      <span className={`font-semibold ${p.stock <= 10 ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded' : 'text-gray-500'}`}>
                        Stock: {p.stock}
                      </span>
                      <div className="ml-auto flex gap-1">
                        <button
                          id={`btn-edit-prod-${p.id}`}
                          onClick={() => handleEditClick(p)}
                          className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-del-prod-${p.id}`}
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-sm">Order Log & Fulfillment Centers</h3>
          {orders.length === 0 ? (
            <p className="text-xs text-gray-400 py-3">No active client dispatches verified in this block.</p>
          ) : (
            <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50 text-xs">
              {orders.map(o => (
                <div key={o.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gray-900 text-sm">ORDER #{o.id}</span>
                      <p className="text-[10px] text-gray-400 font-mono tracking-tight">Placed on: {new Date(o.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider ${o.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' : o.status === 'SHIPPED' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                      {o.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg space-y-1.5">
                    {o.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between font-semibold text-gray-700">
                        <span>{item.title} (x{item.quantity})</span>
                        <span className="font-mono text-gray-900">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div>
                      <span className="font-bold text-gray-800">Dispatch Destination:</span>
                      <p className="text-gray-500 leading-tight mt-1">
                        {o.shippingAddress.fullName}, {o.shippingAddress.street}, {o.shippingAddress.city}, {o.shippingAddress.zipCode}
                      </p>
                    </div>

                    {(o.status === 'PENDING' || o.status === 'PROCESSED' || o.status === 'SHIPPED') && (
                      <button
                        id={`btn-dispatch-order-${o.id}`}
                        onClick={() => handleStatusShift(o.id, o.status)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl transition cursor-pointer self-start sm:self-center"
                      >
                        {o.status === 'PENDING' && 'Mark as Processed'}
                        {o.status === 'PROCESSED' && 'Hand over to Logistics (Ship)'}
                        {o.status === 'SHIPPED' && 'Complete Delivery'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
