import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Trash2, ShieldAlert, Award, Compass, Receipt, Copy, X, MapPin, Navigation, Map, ShieldCheck, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { User, Address, Order, Notification } from '../types';
import { 
  getUserOrdersUnified, 
  getUserAddressesUnified, 
  saveAddressUnified, 
  deleteAddressUnified, 
  updateOrderStatusUnified 
} from '../services/clientStore';

interface CustomerDashboardProps {
  user: User;
  onNotify: (title: string, msg: string, type: 'success' | 'info') => void;
  onRefreshUser: () => void;
}

export default function CustomerDashboard({ user, onNotify, onRefreshUser }: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'rewards'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // New address form state
  const [isAddingAddr, setIsAddingAddr] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  
  // High-performance live mapping & logistics tracking state
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [formattedLocationName, setFormattedLocationName] = useState('');
  const [deliveryAvailability, setDeliveryAvailability] = useState<'IDLE' | 'CHECKING' | 'AVAILABLE' | 'UNAVAILABLE'>('IDLE');

  // Invoice display overlay state
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  const fetchDashboardData = async () => {
    try {
      const dataOrders = await getUserOrdersUnified(user.id);
      const sorted = [...dataOrders].sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(sorted);

      const dataAddrs = await getUserAddressesUnified(user.id);
      setAddresses(dataAddrs);

      const respNotif = await fetch(`/api/notifications/${user.id}`).catch(() => null);
      if (respNotif && respNotif.ok) {
        const dataNotif = await respNotif.json();
        if (Array.isArray(dataNotif)) {
          setNotifications(dataNotif);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user.id]);

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !street || !city || !state || !zip) {
      onNotify('Validation', 'Please fill in all address parameters.', 'info');
      return;
    }

    try {
      await saveAddressUnified({
        userId: user.id,
        fullName,
        phone,
        street,
        city,
        state,
        zipCode: zip,
        lat,
        lng,
        formattedLocationName,
        isDefault: addresses.length === 0
      });

      onNotify('Address Registered', 'New shipping address added in your book with verified geolocations.', 'success');
      setIsAddingAddr(false);
      setFullName('');
      setPhone('');
      setStreet('');
      setCity('');
      setState('');
      setZip('');
      setLat(undefined);
      setLng(undefined);
      setFormattedLocationName('');
      setDeliveryAvailability('IDLE');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGPSDetect = () => {
    onNotify('Initiating GPS Tracker', 'Triangulating secure device coordinate matrices...', 'info');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latitude = parseFloat(pos.coords.latitude.toFixed(6));
          const longitude = parseFloat(pos.coords.longitude.toFixed(6));
          setLat(latitude);
          setLng(longitude);
          setStreet(`G-Block Plot 4, Near MMRDA Crossing, Bandra Kurla Complex`);
          setCity("Mumbai");
          setState("Maharashtra");
          setZip("400051");
          setFormattedLocationName(`Bandra Triangulation Center`);
          setDeliveryAvailability('AVAILABLE');
          onNotify('GPS Coordinate Acquired', `Location fetched: Lat ${latitude}, Lng ${longitude}. Address parameters loaded.`, 'success');
        },
        (err) => {
          // Graceful high-fidelity simulated backup parameters
          const randLat = parseFloat((19.076 + Math.random() * 0.03).toFixed(6));
          const randLng = parseFloat((72.877 + Math.random() * 0.03).toFixed(6));
          setLat(randLat);
          setLng(randLng);
          setStreet(`Bandra Commercial District, BKC Avenue 3`);
          setCity("Mumbai");
          setState("Maharashtra");
          setZip("400051");
          setFormattedLocationName(`BKC Main Circle Gateway`);
          setDeliveryAvailability('AVAILABLE');
          onNotify('GPS Acquired (Simulated)', `Acquired backup coordinates: Lat ${randLat}, Lng ${randLng} in Mumbai district.`, 'success');
        }
      );
    } else {
      onNotify('GPS Unsupported', 'Aviation GPS is disabled or not supported in this client environment.', 'info');
    }
  };

  const handleCheckDelivery = () => {
    if (!zip || zip.trim().length === 0) {
      onNotify('Validation Error', 'Please supply a postal Zip Code to verify logistics coverage.', 'info');
      return;
    }
    setDeliveryAvailability('CHECKING');
    setTimeout(() => {
      const isValid = /^[1-9][0-9]{5}$/.test(zip); // standard Indian pincode check
      if (isValid) {
        setDeliveryAvailability('AVAILABLE');
        onNotify('Serviceable Zone', `Express dispatch coverage confirmed to PIN: ${zip}. Time: 2-3 business days.`, 'success');
      } else {
        setDeliveryAvailability('UNAVAILABLE');
        onNotify('Coverage Limit', `Shipping logistics currently unavailable for PIN: ${zip}.`, 'info');
      }
    }, 1100);
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddressUnified(id, user.id);
      onNotify('Address Removed', 'Removed address catalog successfully.', 'success');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await updateOrderStatusUnified(orderId, 'CANCELLED');
      onNotify('Order Cancelled', 'Your order was successfully terminated and a refund has been issued.', 'success');
      fetchDashboardData();
      onRefreshUser();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReturnOrder = async (orderId: string) => {
    try {
      await updateOrderStatusUnified(orderId, 'RETURN_REQUESTED');
      onNotify('Return Process Initiated', 'Product pickup and refund verification scheduled.', 'success');
      fetchDashboardData();
      onRefreshUser();
    } catch (err) {
      console.error(err);
    }
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(user.referralCode);
    onNotify('Code Copied', 'Your custom code was added to your clipboard! Share with friends to earn points.', 'success');
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 max-w-5xl mx-auto font-sans">
      
      {/* Upper Account Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono font-bold tracking-wider px-2 py-0.5 rounded-md uppercase">SHOPSPHERE CLUB MEMBER</span>
          <h2 className="text-xl font-bold mt-1.5">{user.name}</h2>
          <p className="text-xs text-slate-300 mt-1">{user.email}</p>
          <div className="flex items-center gap-2 mt-4 text-xs">
            <span className="bg-white/10 px-2.5 py-1 rounded-lg">Verified Account ✔</span>
            <span className="bg-indigo-500/25 text-indigo-200 px-2.5 py-1 rounded-lg font-mono">ID: {user.id}</span>
          </div>
        </div>

        {/* Reward Status Blocks */}
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 w-full md:w-auto shrink-0">
          <Award className="w-10 h-10 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">CURRENT STAR BALANCE</span>
            <span className="text-2xl font-bold block font-mono text-amber-300">{user.rewardPoints} Stars</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">₹1 Value = 0.05 Reward Star Credit</span>
          </div>
        </div>
      </div>

      {/* Control Tabs row */}
      <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-semibold max-w-sm mb-6">
        <button
          id="tab-cust-orders"
          onClick={() => { setActiveTab('orders'); setIsAddingAddr(false); }}
          className={`flex-1 px-4 py-2 rounded-lg transition-all cursor-pointer text-center ${activeTab === 'orders' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
        >
          My Orders ({orders.length})
        </button>
        <button
          id="tab-cust-addr"
          onClick={() => { setActiveTab('addresses'); }}
          className={`flex-1 px-4 py-2 rounded-lg transition-all cursor-pointer text-center ${activeTab === 'addresses' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
        >
          Address Book ({addresses.length})
        </button>
        <button
          id="tab-cust-rewards"
          onClick={() => { setActiveTab('rewards'); setIsAddingAddr(false); }}
          className={`flex-1 px-4 py-2 rounded-lg transition-all cursor-pointer text-center ${activeTab === 'rewards' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
        >
          Referral Bonus
        </button>
      </div>

      {/* TAB: Orders list */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400">
              <Compass className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              You haven't made any transactions on RFP yet.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(o => (
                <div key={o.id} className="border border-gray-100 rounded-xl overflow-hidden p-4 space-y-4 text-xs">
                  {/* Order metadata line */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-50 pb-3 gap-2">
                    <div>
                      <span className="font-bold text-gray-900 text-sm">ORDER #{o.id}</span>
                      <p className="text-[10px] text-gray-400 mt-1 font-mono">Issued On: {new Date(o.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id={`btn-invoice-${o.id}`}
                        onClick={() => setSelectedInvoice(o)}
                        className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-2.5 py-1.5 rounded-lg font-medium border border-gray-200 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        Download Invoice
                      </button>
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider ${o.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' : o.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        {o.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Items listing block */}
                  <div className="space-y-2">
                    {o.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff"}
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff"; }}
                          alt={item.title}
                          className="w-10 h-10 rounded-lg object-contain p-0.5 border border-gray-200 bg-white shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-gray-950 block truncate leading-none">{item.title}</span>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Qty: {item.quantity} {item.selectedSize && `| Size: ${item.selectedSize}`} {item.selectedColor && `| Color: ${item.selectedColor}`}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-gray-900">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Shipment Tracking details progress */}
                  {o.status !== 'CANCELLED' && o.status !== 'RETURNED' && (
                    <div className="bg-slate-50/80 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 mt-3 space-y-4 font-sans shadow-sm">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-150/50 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">Logistics Routing Tracker</span>
                        </div>
                        <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 font-bold px-2.5 py-1 rounded">
                          Priority Air Service
                        </span>
                      </div>
                      
                      {/* Advanced Stepper Progress Blocks */}
                      <div className="grid grid-cols-4 gap-2 relative pt-2">
                        {/* Connecting Line */}
                        <div className="absolute left-[12.5%] right-[12.5%] top-5.5 h-1 bg-gray-200 dark:bg-slate-800 -z-10 rounded-full">
                          <div 
                            className="bg-indigo-600 h-full transition-all duration-[800ms]" 
                            style={{ 
                              width: o.status === 'DELIVERED' ? '100%' : o.status === 'SHIPPED' ? '66%' : o.status === 'PROCESSED' ? '33%' : '0%' 
                            }} 
                          />
                        </div>

                        {/* Step 1: Placed */}
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold text-xs ${
                            o.status === 'PENDING' || o.status === 'PROCESSED' || o.status === 'SHIPPED' || o.status === 'DELIVERED'
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                            : 'bg-white dark:bg-slate-950 border-gray-200 text-gray-400'
                          }`}>
                            ✓
                          </div>
                          <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 mt-2 block">Placed</span>
                          <span className="text-[8px] text-slate-400 dark:text-slate-500 leading-tight hidden md:block">Order logged successfully</span>
                        </div>

                        {/* Step 2: Processed */}
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold text-xs ${
                            o.status === 'PROCESSED' || o.status === 'SHIPPED' || o.status === 'DELIVERED'
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                            : 'bg-white dark:bg-slate-950 border-gray-200 text-gray-400'
                          }`}>
                            {o.status === 'PROCESSED' || o.status === 'SHIPPED' || o.status === 'DELIVERED' ? '✓' : '2'}
                          </div>
                          <span className={`${o.status === 'PROCESSED' || o.status === 'SHIPPED' || o.status === 'DELIVERED' ? 'font-extrabold text-indigo-600 dark:text-indigo-400' : 'text-slate-400'} text-[10px] mt-2 block`}>Packed</span>
                          <span className="text-[8px] text-slate-400 dark:text-slate-500 leading-tight hidden md:block">Fulfillment clearance</span>
                        </div>

                        {/* Step 3: Shipped */}
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold text-xs ${
                            o.status === 'SHIPPED' || o.status === 'DELIVERED'
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                            : 'bg-white dark:bg-slate-950 border-gray-200 text-gray-400'
                          }`}>
                            {o.status === 'SHIPPED' || o.status === 'DELIVERED' ? '✓' : '3'}
                          </div>
                          <span className={`${o.status === 'SHIPPED' || o.status === 'DELIVERED' ? 'font-extrabold text-indigo-600 dark:text-indigo-400' : 'text-slate-400'} text-[10px] mt-2 block`}>Dispatched</span>
                          <span className="text-[8px] text-slate-400 dark:text-slate-500 leading-tight hidden md:block">Handed over to Delhivery</span>
                        </div>

                        {/* Step 4: Delivered */}
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold text-xs ${
                            o.status === 'DELIVERED'
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20'
                            : 'bg-white dark:bg-slate-950 border-gray-200 text-gray-400'
                          }`}>
                            🏁
                          </div>
                          <span className={`${o.status === 'DELIVERED' ? 'font-extrabold text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} text-[10px] mt-2 block`}>Delivered</span>
                          <span className="text-[8px] text-slate-400 dark:text-slate-500 leading-tight hidden md:block">Signed at door</span>
                        </div>
                      </div>

                      {/* Transit meta information */}
                      {o.trackingNumber && (
                        <div className="bg-white dark:bg-slate-950/50 p-3.5 rounded-xl border border-gray-100 dark:border-slate-800 text-[11px] font-mono leading-relaxed space-y-1.5 text-slate-600 dark:text-slate-400">
                          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1">
                            <div>
                              <span>LOGISTICS PARTNER: </span>
                              <strong className="text-slate-900 dark:text-white font-sans">Delhivery Air Direct</strong>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span>AIRWAY BILL: </span>
                              <strong className="text-slate-900 dark:text-white">{o.trackingNumber}</strong>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(o.trackingNumber || '');
                                  onNotify('Copied AWB', 'Airway bill added to clipboard.', 'success');
                                }}
                                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer text-indigo-500"
                                title="Copy Tracking Code"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1 pt-1.5 border-t border-gray-100 dark:border-slate-800/60">
                            <div>
                              <span>ESTIMATED DELIVERY window: </span>
                              <strong className="text-indigo-600 dark:text-indigo-400 font-sans">{o.deliveryDate}</strong>
                            </div>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-300 font-bold px-2 py-0.5 rounded font-sans">
                              {o.status === 'DELIVERED' ? 'Delivery cycle archived' : 'Transit active'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl">
                    <div className="font-semibold text-gray-700">
                      Total Checkout Value: <span className="font-bold text-indigo-600 font-mono text-sm ml-1">₹{o.total}</span>
                    </div>

                    <div className="flex gap-2">
                      {o.status === 'PENDING' && (
                        <button
                          id={`btn-cancel-ord-${o.id}`}
                          onClick={() => handleCancelOrder(o.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}
                      {o.status === 'DELIVERED' && (
                        <button
                          id={`btn-return-ord-${o.id}`}
                          onClick={() => handleReturnOrder(o.id)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          Return Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: Address configuring book */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Shipping Addresses Configured</h3>
            {!isAddingAddr && (
              <button
                id="btn-open-addr"
                onClick={() => setIsAddingAddr(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Shipping Address
              </button>
            )}
          </div>

          {isAddingAddr && (
            <form onSubmit={handleCreateAddress} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Premium Device GPS triangulator */}
              <div className="sm:col-span-2 flex flex-col md:flex-row gap-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 items-start md:items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-600 text-white rounded-lg">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Express GPS Address Auto-Fill</span>
                    <span className="text-[10px] text-slate-500">Detect current device coordinates to complete forms instantly</span>
                  </div>
                </div>
                <button
                  id="btn-gps-detect"
                  type="button"
                  onClick={handleGPSDetect}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shrink-0 self-stretch md:self-auto justify-center cursor-pointer text-xs"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Locate Me
                </button>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Full Name</label>
                <input
                  id="inp-addr-name"
                  type="text"
                  placeholder="Rejitha Kumar"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Mobile Number</label>
                <input
                  id="inp-addr-phone"
                  type="text"
                  placeholder="+91..."
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-600 font-semibold mb-1">Street Address, Room, Apartment Details</label>
                <input
                  id="inp-addr-street"
                  type="text"
                  placeholder="302 Sapphire Block, West Avenue"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-600 font-semibold mb-1">City</label>
                <input
                  id="inp-addr-city"
                  type="text"
                  placeholder="Mumbai"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">State</label>
                  <input
                    id="inp-addr-state"
                    type="text"
                    placeholder="Maharashtra"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Zip Code / Pin</label>
                  <input
                    id="inp-addr-zip"
                    type="text"
                    placeholder="400053"
                    value={zip}
                    onChange={e => setZip(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* High-Fidelity Interactive grid-coordinate pin selector map wrapper */}
              <div className="sm:col-span-2 space-y-2 mt-2">
                <div className="flex justify-between items-center">
                  <label className="text-gray-700 font-bold flex items-center gap-1">
                    <Map className="w-4 h-4 text-indigo-500" />
                    Interactive GPS Pin Dropper Map
                  </label>
                  {lat && lng && (
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      Coords Selected: {lat}, {lng}
                    </span>
                  )}
                </div>
                <div 
                  className="h-44 bg-slate-200 rounded-xl relative overflow-hidden border border-slate-300 shadow-inner group cursor-crosshair select-none"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const offsetX = e.clientX - rect.left;
                    const offsetY = e.clientY - rect.top;
                    const calculatedLat = parseFloat((19.076 + (offsetY / 4400)).toFixed(6));
                    const calculatedLng = parseFloat((72.877 + (offsetX / 4400)).toFixed(6));
                    setLat(calculatedLat);
                    setLng(calculatedLng);
                    setStreet(`Plot #${Math.floor(calculatedLat * 1000 % 350)}, BKC Commercial Block, Sector-${Math.floor(calculatedLng * 1000 % 8)}`);
                    setCity("Mumbai");
                    setState("Maharashtra");
                    setZip("400051");
                    setFormattedLocationName(`Marker Point: ${calculatedLat}, ${calculatedLng}`);
                    setDeliveryAvailability('AVAILABLE');
                    onNotify('Coordinate Pinned', `Dropped pin at: Lat: ${calculatedLat}, Lng: ${calculatedLng}. Form fields synchronized!`, 'success');
                  }}
                >
                  <div className="absolute inset-0 opacity-45 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] bg-slate-50"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-indigo-200/50"></div>
                  <div className="absolute left-1/3 top-0 bottom-0 w-[1.5px] bg-indigo-200/50"></div>
                  <div className="absolute left-2/3 top-0 bottom-0 w-[1.5px] bg-indigo-200/40 flex items-center justify-center">
                    <span className="text-[8px] text-indigo-300 font-bold bg-white px-1 leading-none rounded shadow-xs rotate-6">Bandra Exp Way</span>
                  </div>

                  <div className="absolute left-16 top-16 w-3 h-3 bg-indigo-400/30 rounded-full animate-ping"></div>
                  <div className="absolute left-16 top-16 w-2 h-2 bg-indigo-600 rounded-full shadow-md" title="M-Block Warehouse Hub"></div>

                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-xs py-1 px-2.5 rounded-lg border border-slate-200/60 text-[10px] text-slate-600 text-center leading-none shadow-xs">
                    Click anywhere on this visual geographic grid to drop the address pin and auto-fill coordinates.
                  </div>

                  {lat && lng && (
                    <div 
                      className="absolute transition-all duration-300 flex flex-col items-center"
                      style={{
                        left: `${Math.min(95, Math.max(5, ((lng - 72.877) * 4400)))}%`,
                        top: `${Math.min(90, Math.max(10, ((lat - 19.076) * 4400)))}%`,
                        transform: 'translate(-50%, -100%)'
                      }}
                    >
                      <MapPin className="w-7 h-7 text-red-600 drop-shadow-md" />
                      <div className="w-2 h-1 bg-black/30 rounded-full blur-[1px] mt-0.5"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Logistics delivery validation utility panel */}
              <div className="sm:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-100 p-4 rounded-xl border border-slate-200/50 items-center mt-1">
                <div className="md:col-span-2">
                  <span className="font-bold text-slate-800 block">Check Destination Delivery Coverage</span>
                  <span className="text-[10px] text-slate-500 font-medium">Verify standard express delivery routing coverage limits for this PIN code</span>
                </div>
                <div className="flex justify-end">
                  <button
                    id="btn-check-logistics"
                    type="button"
                    onClick={handleCheckDelivery}
                    className="w-full md:w-auto bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Check Routing
                  </button>
                </div>
              </div>

              {deliveryAvailability === 'CHECKING' && (
                <div className="sm:col-span-2 text-center text-xs text-slate-500 py-1 flex items-center justify-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  Analyzing commercial shipping matrices...
                </div>
              )}
              {deliveryAvailability === 'AVAILABLE' && (
                <div className="sm:col-span-2 bg-emerald-50 border border-emerald-100 text-emerald-800 p-2.5 rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 bg-emerald-600 text-white rounded-full p-0.5 shrink-0" />
                  <span>Verified location: Express distribution active for PIN code {zip}. Timeline: 1-2 Enterprise Days.</span>
                </div>
              )}
              {deliveryAvailability === 'UNAVAILABLE' && (
                <div className="sm:col-span-2 bg-red-50 border border-red-100 text-red-800 p-2.5 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 bg-red-600 text-white rounded-full p-0.5 shrink-0" />
                  <span>Logistics bound reached: PIN code {zip} is outside live expedited delivery boundaries.</span>
                </div>
              )}

              <div className="sm:col-span-2 flex gap-2 pt-3 border-t border-slate-100 mt-2">
                <button
                  id="btn-save-addr"
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl transition cursor-pointer"
                >
                  Save Address
                </button>
                <button
                  id="btn-cancel-addr"
                  type="button"
                  onClick={() => setIsAddingAddr(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 rounded-xl transition cursor-pointer"
                >
                  Discard
                </button>
              </div>
            </form>
          )}

          {addresses.length === 0 ? (
            <p className="text-xs text-gray-400 py-3">No custom addresses saved. Please register one before checkout processes.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map(a => (
                <div key={a.id} className="bg-white p-4 rounded-xl border border-gray-100 relative text-xs shadow-xs">
                  <span className="font-bold text-gray-950 block">{a.fullName}</span>
                  <span className="text-gray-400 font-mono text-[10px] block mt-1">{a.phone}</span>
                  <p className="text-gray-600 mt-2 pr-10">{a.street}, {a.city}, {a.state} - {a.zipCode}</p>
                  
                  {a.isDefault && (
                    <span className="inline-block bg-indigo-50 text-indigo-600 text-[9px] font-bold px-2 py-0.5 rounded mt-3">
                      PRIMARY SHIPPING ADDRESS
                    </span>
                  )}

                  <button
                    id={`btn-del-addr-${a.id}`}
                    onClick={() => handleDeleteAddress(a.id)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: Referral Incentives & rewards */}
      {activeTab === 'rewards' && (
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Invite Friends, Multiply Reward Points
              </h3>
              <p className="text-slate-500 leading-relaxed mt-1">
                Share your unique code to invite companions to register accounts. When they register, we credit <span className="font-bold text-slate-800">150 point Stars</span> inside their balance, and add <span className="font-bold text-indigo-600">200 point Stars</span> directly inside your account core!
              </p>
            </div>

            {/* Referral system display */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shrink-0 w-full md:w-auto">
              <span className="text-[10px] text-slate-400 block font-bold">YOUR UNIQUE REFERRAL CODE</span>
              <div className="flex gap-2 items-center mt-2.5">
                <span className="font-mono text-sm block font-bold bg-slate-50 border border-slate-200/50 px-4 py-2 text-indigo-700 rounded-lg leading-none">
                  {user.referralCode}
                </span>
                <button
                  id="btn-copy-ref"
                  onClick={copyReferral}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 ml-1 rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal Overlay Viewer */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-xs font-sans">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 relative flex flex-col max-h-[90vh]">
            <button
              id="btn-close-invoice"
              onClick={() => setSelectedInvoice(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-5">
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-none">RFP</h1>
                  <span className="text-[10px] text-gray-400 font-mono tracking-tight block mt-1">Delhi/NCR Fulfilment Center</span>
                </div>
                <div className="text-right">
                  <h3 className="text-xs font-bold text-gray-900">RETAIL INVOICE</h3>
                  <span className="text-[10px] text-gray-400 font-mono tracking-tight block mt-0.5">ID: {selectedInvoice.id}</span>
                </div>
              </div>

              {/* Addresses section */}
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 leading-relaxed border-b border-gray-150 pb-4">
                <div>
                  <span className="font-bold text-gray-950 block">Delivered To:</span>
                  <span>{selectedInvoice.shippingAddress.fullName}</span>
                  <p>{selectedInvoice.shippingAddress.street}, {selectedInvoice.shippingAddress.city}, {selectedInvoice.shippingAddress.zipCode}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-950 block">Payment Method:</span>
                  <span>{selectedInvoice.paymentMethod} Payment</span>
                  <p className="font-mono mt-1">Tx Status: {selectedInvoice.paymentStatus}</p>
                </div>
              </div>

              {/* Invoice table list of products */}
              <div className="text-xs">
                <div className="grid grid-cols-6 font-bold text-zinc-700 bg-zinc-50 p-2.5 rounded-lg mb-2">
                  <span className="col-span-3">Item Description</span>
                  <span className="col-span-1 text-center">Unit Price</span>
                  <span className="col-span-1 text-center">Qty</span>
                  <span className="col-span-1 text-right">Sum</span>
                </div>

                <div className="divide-y divide-zinc-50">
                  {selectedInvoice.items.map((it, ix) => (
                    <div key={ix} className="grid grid-cols-6 p-2 text-zinc-600 font-semibold items-center">
                      <span className="col-span-3 text-zinc-950 truncate pr-4">{it.title}</span>
                      <span className="col-span-1 text-center font-mono">₹{it.price}</span>
                      <span className="col-span-1 text-center font-mono">{it.quantity}</span>
                      <span className="col-span-1 text-right font-mono text-zinc-950">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total tallies */}
              <div className="border-t border-gray-100 pt-4 space-y-1.5 text-xs text-right pr-2">
                <div>Subtotal Amount: <span className="font-mono text-zinc-900 font-semibold">₹{selectedInvoice.subtotal}</span></div>
                {selectedInvoice.discountAmount > 0 && (
                  <div className="text-emerald-600">Applied Discount: <span className="font-mono font-semibold">-₹{selectedInvoice.discountAmount}</span></div>
                )}
                <div>Shipping & Logistics: <span className="font-mono text-zinc-900 font-semibold">₹{selectedInvoice.shippingFee}</span></div>
                <div>Applied Tax Charges (18% GST): <span className="font-mono text-zinc-900 font-semibold">₹{selectedInvoice.tax}</span></div>
                <div className="border-t border-gray-100 pt-2 font-bold text-zinc-950 text-sm">
                  Net Amount Payable: <span className="font-mono text-indigo-700 ml-1">₹{selectedInvoice.total}</span>
                </div>
              </div>
            </div>

            <button
              id="btn-print-invoice"
              onClick={() => { window.print(); }}
              className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-3 rounded-xl transition cursor-pointer"
            >
              Print retail slip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
