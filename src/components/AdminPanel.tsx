import React, { useState, useEffect } from 'react';
import { Users, Store, ShoppingCart, DollarSign, Plus, Trash2, Check, X, ShieldAlert, Tag, BarChart3 } from 'lucide-react';
import { User, Seller, Coupon, Order } from '../types';

interface AdminPanelProps {
  onNotify: (title: string, msg: string, type: 'success' | 'info') => void;
}

export default function AdminPanel({ onNotify }: AdminPanelProps) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSellers: 0,
    revenue: 0
  });

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'kpi' | 'sellers' | 'coupons'>('kpi');
  
  // Coupon maker state
  const [code, setCode] = useState('');
  const [disType, setDisType] = useState<'PERCENT' | 'FIXED'>('PERCENT');
  const [value, setValue] = useState('');
  const [minVal, setMinVal] = useState('');
  const [description, setDescription] = useState('');

  const fetchAdminData = async () => {
    try {
      const respStats = await fetch('/api/admin/stats');
      const dataStats = await respStats.json();
      setStats(dataStats);

      const respSellers = await fetch('/api/admin/sellers');
      const dataSellers = await respSellers.json();
      setSellers(dataSellers);

      // Fetch coupons
      const respCoupons = await fetch('/api/coupons');
      const dataCoupons = await respCoupons.json();
      setCoupons(dataCoupons);

    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateKyc = async (sellerId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const resp = await fetch(`/api/admin/sellers/${sellerId}/kyc`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (resp.ok) {
        onNotify('KYC updated', `Seller store status changed successfully to ${status}.`, 'success');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !value) {
      onNotify('Validation Error', 'Please supply both code and discount values.', 'info');
      return;
    }

    try {
      const resp = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          discountType: disType,
          value,
          minOrderValue: minVal || 0,
          description
        })
      });

      if (resp.ok) {
        onNotify('Coupon Created', `Discount system successfully issued coupon ${code}!`, 'success');
        setCode('');
        setValue('');
        setMinVal('');
        setDescription('');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      const resp = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE'
      });
      if (resp.ok) {
        onNotify('Coupon Suspended', 'Promotional code is no longer active.', 'success');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">System Controller (Admin)</h2>
          <p className="text-xs text-gray-500">Global metrics monitoring, operations logs, coupon codes, and store authorizations.</p>
        </div>
        
        {/* Tab triggers */}
        <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-medium max-w-sm">
          <button
            id="tab-admin-kpi"
            onClick={() => setActiveTab('kpi')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === 'kpi' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <BarChart3 className="w-3.5 h-3.5 inline mr-1" />
            Analytics
          </button>
          <button
            id="tab-admin-sellers"
            onClick={() => setActiveTab('sellers')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === 'sellers' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Store className="w-3.5 h-3.5 inline mr-1" />
            Seller KYC ({sellers.filter(s => s.kycStatus === 'PENDING').length})
          </button>
          <button
            id="tab-admin-coupons"
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === 'coupons' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Tag className="w-3.5 h-3.5 inline mr-1" />
            Coupons Engine
          </button>
        </div>
      </div>

      {activeTab === 'kpi' && (
        <div className="space-y-6">
          {/* Bento statistics grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-3 text-purple-600">
                <Users className="w-5 h-5" />
                <span className="text-[10px] font-mono tracking-wider bg-purple-50 px-2 py-1 rounded">+11%</span>
              </div>
              <span className="text-2xl font-bold block text-gray-900">{stats.totalUsers}</span>
              <span className="text-xs text-gray-400 font-medium">Platform Registered Users</span>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-3 text-indigo-600">
                <Store className="w-5 h-5" />
                <span className="text-[10px] font-mono tracking-wider bg-indigo-50 px-2 py-1 rounded">Seeded</span>
              </div>
              <span className="text-2xl font-bold block text-gray-900">{stats.totalSellers}</span>
              <span className="text-xs text-gray-400 font-medium font-sans">Active Approved Sellers</span>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-3 text-emerald-600">
                <ShoppingCart className="w-5 h-5" />
                <span className="text-[10px] font-mono tracking-wider bg-emerald-50 px-2 py-1 rounded">98% Fill</span>
              </div>
              <span className="text-2xl font-bold block text-gray-900">{stats.totalOrders}</span>
              <span className="text-xs text-gray-400 font-medium">Orders Processed</span>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-3 text-amber-600">
                <DollarSign className="w-5 h-5" />
                <span className="text-[10px] font-mono tracking-wider bg-amber-50 px-2 py-1 rounded">5% Margin</span>
              </div>
              <span className="text-2xl font-bold block text-gray-900">₹{stats.revenue.toLocaleString()}</span>
              <span className="text-xs text-gray-400 font-medium">Consolidated Platform GMV</span>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h4 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-slate-700" />
              Operational Systems Diagnostics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-600 text-xs font-mono mt-3">
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block mb-1">DATA PIPELINE STATUS</span>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block mr-1.5 align-middle"></span>
                ACTIVE (db.json synced)
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block mb-1">GEMINI INTERPRETABILITY CORE</span>
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full inline-block mr-1.5 align-middle"></span>
                ONLINE (gemini-3.5-flash)
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block mb-1">MOCK PAYMENT ROUTER</span>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block mr-1.5 align-middle"></span>
                100% SUCCESS RATIO
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sellers' && (
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-sm">Seller Authorization Queue</h3>
          {sellers.length === 0 ? (
            <p className="text-xs text-gray-400 py-3">No active or pending seller registrations available inside the systems.</p>
          ) : (
            <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50">
              {sellers.map(s => (
                <div key={s.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-gray-900 text-sm block">{s.storeName}</span>
                    <p className="text-gray-500 mt-1 max-w-xl">{s.description}</p>
                    <span className="font-mono text-[9px] text-slate-400 block mt-1.5">Joined at: {new Date(s.joinedAt).toDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {s.kycStatus === 'PENDING' ? (
                      <>
                        <button
                          id={`btn-approve-${s.id}`}
                          onClick={() => handleUpdateKyc(s.id, 'APPROVED')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium transition cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve KYC
                        </button>
                        <button
                          id={`btn-reject-${s.id}`}
                          onClick={() => handleUpdateKyc(s.id, 'REJECTED')}
                          className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium transition cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full font-semibold tracking-wider text-[10px] ${s.kycStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {s.kycStatus}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Maker form */}
          <div className="md:col-span-1 bg-gray-50 p-5 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-gray-900 text-sm mb-4">Construct Coupon Code</h4>
            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-600 text-[10px] font-bold uppercase mb-1">Coupon Code</label>
                <input
                  id="inp-coupon-code"
                  type="text"
                  placeholder="e.g. MEGA30"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-600 text-[10px] font-bold uppercase mb-1">Discount Type</label>
                  <select
                    id="sel-coupon-type"
                    value={disType}
                    onChange={e => setDisType(e.target.value as any)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="PERCENT">% Percent</option>
                    <option value="FIXED">₹ Fixed Amt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 text-[10px] font-bold uppercase mb-1">Value</label>
                  <input
                    id="inp-coupon-value"
                    type="number"
                    placeholder="e.g. 20"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 text-[10px] font-bold uppercase mb-1">Minimum Order Value</label>
                <input
                  id="inp-coupon-min"
                  type="number"
                  placeholder="e.g. 1000"
                  value={minVal}
                  onChange={e => setMinVal(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 text-[10px] font-bold uppercase mb-1">Short Description</label>
                <textarea
                  id="inp-coupon-desc"
                  rows={2}
                  placeholder="Offers great discounts on clothing items..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <button
                id="btn-submit-coupon"
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Coupon Code
              </button>
            </form>
          </div>

          {/* Code inventory list */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-bold text-gray-900 text-sm">Discounts Registry</h4>
            {coupons.length === 0 ? (
              <p className="text-xs text-gray-400 py-3">No promotional coupons are currently registered.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coupons.map(c => (
                  <div key={c.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-start justify-between shadow-xs">
                    <div>
                      <span className="font-mono font-bold text-sm tracking-wide bg-indigo-50 text-indigo-700 px-2 py-1 rounded inline-block mb-2">
                        {c.code}
                      </span>
                      <p className="text-xs text-gray-900 font-semibold">
                        {c.discountType === 'PERCENT' ? `${c.value}% off` : `₹${c.value} direct deduction`}
                      </p>
                      <p className="text-gray-500 text-[10.5px] mt-1 pr-4">{c.description}</p>
                      <span className="text-slate-400 font-mono text-[9px] block mt-1.5 font-semibold">Min order: ₹{c.minOrderValue}</span>
                    </div>

                    <button
                      id={`btn-del-coupon-${c.id}`}
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-50 transition cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
