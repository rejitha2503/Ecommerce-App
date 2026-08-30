import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  ShoppingBag, 
  Check, 
  X, 
  Tag, 
  Smartphone, 
  Receipt, 
  ShieldCheck, 
  MapPin, 
  Plus, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Info,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Address, Coupon, CartItem, Order } from '../types';
import { getUserAddressesUnified, saveAddressUnified, applyCouponUnified, submitOrderUnified } from '../services/clientStore';

interface CheckoutModalProps {
  userId: string;
  cartItems: CartItem[];
  cartTotal: number;
  onClose: () => void;
  onSuccess: (order: Order) => void;
  onNotify: (title: string, msg: string, type: 'success' | 'info' | 'error' | 'warn') => void;
  themeMode?: 'LIGHT' | 'DARK';
}

export default function CheckoutModal({ 
  userId, 
  cartItems, 
  cartTotal, 
  onClose, 
  onSuccess, 
  onNotify,
  themeMode = 'LIGHT'
}: CheckoutModalProps) {
  
  const isDark = themeMode === 'DARK';

  // Address states
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // Inline Add Address controls
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZipCode, setNewZipCode] = useState('');
  const [isSubmitAddressLoading, setIsSubmitAddressLoading] = useState(false);

  // Voucher / Promotion States
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmt, setDiscountAmt] = useState(0);

  // Custom Payment Gateways
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'RAZORPAY' | 'UPI' | 'COD'>('STRIPE');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<string>('');

  // 3D Credit Card Simulation States
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // UPI verification States
  const [upiVirtualId, setUpiVirtualId] = useState('');
  const [isUpiValid, setIsUpiValid] = useState(false);

  // Fetch registered user addresses
  const fetchAddresses = async () => {
    try {
      const data = await getUserAddressesUnified(userId);
      setAddresses(data);
      if (data.length > 0) {
        const primary = data.find((a: Address) => a.isDefault) || data[0];
        setSelectedAddrId(primary.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  // Handle auto name propagation for cardholder preview
  useEffect(() => {
    if (selectedAddrId && addresses.length > 0) {
      const addr = addresses.find(a => a.id === selectedAddrId);
      if (addr && !cardHolder) {
        setCardHolder(addr.fullName.toUpperCase());
      }
    }
  }, [selectedAddrId, addresses]);

  // Handle new inline address registration
  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newPhone.trim() || !newStreet.trim() || !newCity.trim() || !newState.trim() || !newZipCode.trim()) {
      onNotify('Validation Error', 'Please satisfy all location properties.', 'warn');
      return;
    }

    setIsSubmitAddressLoading(true);
    try {
      const saved = await saveAddressUnified({
        userId,
        fullName: newFullName,
        phone: newPhone,
        street: newStreet,
        city: newCity,
        state: newState,
        zipCode: newZipCode,
        isDefault: addresses.length === 0
      });

      onNotify('Address Registered', 'Delivery point mapped into your profile database. Saved!', 'success');
      
      // Reset state
      setNewFullName('');
      setNewPhone('');
      setNewStreet('');
      setNewCity('');
      setNewState('');
      setNewZipCode('');
      setShowAddressForm(false);
      
      // Reload addresses list
      await fetchAddresses();
      if (saved && saved.id) {
        setSelectedAddrId(saved.id);
      }
    } catch (err: any) {
      onNotify('Database Connection Error', err.message || 'Location payload failure.', 'error');
    } finally {
      setIsSubmitAddressLoading(false);
    }
  };

  // Coupons application logic
  const handleApplyCouponCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedCode = couponCode.trim().toUpperCase();
    if (!normalizedCode) return;

    try {
      const res = await applyCouponUnified(normalizedCode, cartTotal);
      if (res.valid && res.coupon) {
        setAppliedCoupon(res.coupon);
        setDiscountAmt(res.discountAmount);
        onNotify('Coupon Applied', `Code "${res.coupon.code}" applied! Saved ₹${res.discountAmount}.`, 'success');
      } else {
        onNotify('Coupon Invalid', res.error || 'Promotional coupon code is expired or invalid.', 'warn');
      }
    } catch (err) {
      console.error(err);
      onNotify('Validation Error', 'Underlying coupon check failed.', 'error');
    }
  };

  // Shipping dynamic computation based on Free Shipping coupon tier of ₹999
  const shippingFee = cartTotal >= 999 ? 0 : 99;
  const taxableSubtotal = Math.max(0, cartTotal - discountAmt);
  const gstAmount = Math.round(taxableSubtotal * 0.18); // 18% standard professional Indian GST
  const grandTotal = Math.max(0, taxableSubtotal + shippingFee + gstAmount);

  // Credit Card detection helper
  const detectCardBrand = (num: string) => {
    const raw = num.replace(/\s+/g, '');
    if (raw.startsWith('4')) return { name: 'Visa', color: 'from-blue-600 to-indigo-800' };
    if (/^(5[1-5]|2[2-7])/.test(raw)) return { name: 'Mastercard', color: 'from-red-650 to-amber-600' };
    if (/^6(0|5)/.test(raw)) return { name: 'RuPay', color: 'from-sky-700 to-indigo-900' };
    if (/^(34|37)/.test(raw)) return { name: 'American Express', color: 'from-teal-600 to-slate-800' };
    return { name: 'Card', color: 'from-[#FF6B35] to-[#E94560]' };
  };

  const cardBrand = detectCardBrand(cardNumber);

  // Formatting credit card numbers: xxxx xxxx xxxx xxxx
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const formatted = raw.substring(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Formatting credit card expiration: MM/YY
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 4) raw = raw.substring(0, 4);
    if (raw.length >= 2) {
      const month = parseInt(raw.substring(0, 2));
      const monthStr = month > 12 ? '12' : raw.substring(0, 2);
      const yearStr = raw.substring(2);
      setCardExpiry(`${monthStr}/${yearStr}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Formatting CVV number
  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, cardBrand.name === 'American Express' ? 4 : 3);
    setCardCvv(raw);
  };

  // Handle UPI virtual address verification
  const handleUpiIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setUpiVirtualId(val);
    const isValid = /^[a-zA-Z0-9.\-_]{3,24}@[a-zA-Z]{3,12}$/.test(val);
    setIsUpiValid(isValid);
  };

  // Main order placing & payment execution sequence
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAddrId) {
      onNotify('Address Missing', 'Please register or select a target delivery location.', 'warn');
      return;
    }

    // Input verification
    if (paymentMethod === 'STRIPE') {
      if (cardNumber.replace(/\s+/g, '').length < 15) {
        onNotify('Invalid Card', 'Please supply a complete credit or debit card number.', 'warn');
        return;
      }
      if (cardExpiry.length < 5) {
        onNotify('Invalid Expiration', 'Input correct MM/YY expiration sequence.', 'warn');
        return;
      }
      if (cardCvv.length < 3) {
        onNotify('Invalid Security Code', 'CVV code must contain at least 3 digits.', 'warn');
        return;
      }
    }

    if (paymentMethod === 'UPI' && !isUpiValid) {
      onNotify('UPI ID Error', 'Please register a valid UPI address (e.g., cell@okaxis or user@ybl).', 'warn');
      return;
    }

    const shipAddress = addresses.find(a => a.id === selectedAddrId);
    if (!shipAddress) return;

    setIsProcessingPayment(true);
    setPaymentStep('Encrypting core connection sockets...');

    // 1. Stripe processing timeline representation
    const steps = paymentMethod === 'STRIPE' ? [
      'Authenticating credit tokenization registers via secure PCI-DSS...',
      'Verifying credit card limit authorizations...',
      'Mapping token signatures with Stripe sandbox node...',
      'Finalizing balance transfers...'
    ] : paymentMethod === 'RAZORPAY' ? [
      'Launching Razorpay Secure V3 overlay frame...',
      'Validating order signature credentials with sandbox bank hub...',
      'Decoupling merchant ledger callbacks...',
      'Authorizing payment order ID tokens...'
    ] : paymentMethod === 'UPI' ? [
      'Sending payment request request to registered VPA handle...',
      'Waiting for secure authorization callback on your smart device...',
      'UPI direct core clearing in progress...',
      'Clearing transaction limits...'
    ] : [
      'Locking order delivery registers...',
      'Generating digital cash delivery receipts...',
      'Registering dispatch coordinate routes...'
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setPaymentStep(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        submitOrderToBackend(shipAddress);
      }
    }, 450);
  };

  const submitOrderToBackend = async (shipAddress: Address) => {
    try {
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0],
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor
      }));

      const orderData = await submitOrderUnified({
        userId,
        items: orderItems,
        subtotal: cartTotal,
        tax: gstAmount,
        shippingFee,
        discountAmount: discountAmt,
        couponApplied: appliedCoupon?.code,
        total: grandTotal,
        shippingAddress: shipAddress,
        paymentMethod
      });

      setIsProcessingPayment(false);
      onNotify('Transaction Verified', 'Authorized. Your order has been placed successfully!', 'success');
      onSuccess(orderData);
    } catch (err: any) {
      setIsProcessingPayment(false);
      console.error(err);
      onNotify('Gateway Error', err.message || 'Payment processing encountered an error.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 z-50 flex items-center justify-center p-3 md:p-6 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 25, opacity: 0 }}
        className={`w-full max-w-5xl rounded-2xl shadow-2xl relative flex flex-col md:flex-row overflow-hidden max-h-[96vh] md:max-h-[90vh] ${
          isDark ? 'bg-[#0D0D1A] border border-slate-800 text-slate-100' : 'bg-[#F8F9FA] text-slate-800 border border-gray-100'
        }`}
      >
        
        {/* Processing/Loading Modal Overlay */}
        <AnimatePresence>
          {isProcessingPayment && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center text-center p-6"
            >
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#FF6B35] animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-slate-800 flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-emerald-500 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-bold font-sora text-white">Security Verification Active</h3>
              <p className="text-xs text-[#FF6B35] font-mono mt-2 tracking-widest uppercase">PCI-DSS SECURITY HANDSHAKE</p>
              
              <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-4 rounded-xl mt-6 text-center space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-widest">GATEWAY ACTIVITY</span>
                <p className="text-xs text-slate-350 font-mono italic">{paymentStep}</p>
              </div>

              <span className="text-[10px] font-mono text-slate-550 bottom-8 absolute uppercase tracking-widest flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                256-Bit SSL Encrypted Tunnel Verified
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LEFT WORKSPACE: Input Forms (Addresses & Payment Sinks) */}
        <div className="flex-1 overflow-y-auto p-5 md:p-7 space-y-7 scrollbar-none">
          <div className="flex justify-between items-center border-b pb-4 border-slate-205 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-[#FF6B35] font-extrabold uppercase tracking-widest flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF6B35]"></span>
                ShopSphere Checkout Conduit
              </span>
              <h2 className="text-xl font-extrabold font-sora tracking-tight mt-0.5">Secure Transaction Workspace</h2>
            </div>
            
            {/* Close trigger button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-full hover:scale-105 transition active:scale-95 cursor-pointer ${
                isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-gray-250 text-gray-500 hover:text-gray-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section 1: Address Selection / Inline Creator */}
          <div className="space-y-3.5">
            <div className="flex justify-between items-center sm:flex-row flex-col gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#FF6B35]" />
                1. Shipping Address Selection
              </h3>
              
              {!showAddressForm && (
                <button
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                  className="text-[10.5px] font-bold font-sora text-[#FF6B35] hover:text-[#e55928] flex items-center gap-1 bg-[#FF6B35]/10 px-2.5 py-1 rounded-lg transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> Register New
                </button>
              )}
            </div>

            {/* Slide-out Address registration form */}
            <AnimatePresence>
              {showAddressForm && (
                <motion.form 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleAddNewAddress}
                  className={`p-4 rounded-xl border overflow-hidden space-y-3 text-xs leading-none ${
                    isDark ? 'bg-[#16213E]/50 border-slate-800' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center pb-1 mb-2 border-b border-dashed border-gray-200 dark:border-slate-850">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Register Customer Address Coordinate</span>
                    <button 
                      type="button" 
                      onClick={() => setShowAddressForm(false)}
                      className="text-gray-400 hover:text-red-500 text-[10.5px]"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-450 font-bold mb-1">Full Delivery Name</label>
                      <input 
                        type="text" 
                        required
                        value={newFullName} 
                        onChange={e => setNewFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full p-2 border rounded-lg focus:ring-1 focus:ring-[#FF6B35] outline-none text-[11.5px] font-sans ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-gray-250 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-450 font-bold mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={newPhone} 
                        onChange={e => setNewPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className={`w-full p-2 border rounded-lg focus:ring-1 focus:ring-[#FF6B35] outline-none text-[11.5px] font-sans ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-gray-250 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-450 font-bold mb-1">Street Address</label>
                    <input 
                      type="text" 
                      required
                      value={newStreet} 
                      onChange={e => setNewStreet(e.target.value)}
                      placeholder="e.g. Flat 302, Green Meadows, Peelamedu"
                      className={`w-full p-2 border rounded-lg focus:ring-1 focus:ring-[#FF6B35] outline-none text-[11.5px] font-sans ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-gray-250 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-450 font-bold mb-1">City</label>
                      <input 
                        type="text" 
                        required
                        value={newCity} 
                        onChange={e => setNewCity(e.target.value)}
                        placeholder="Coimbatore"
                        className={`w-full p-2 border rounded-lg focus:ring-1 focus:ring-[#FF6B35]/50 outline-none text-[11px] ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-gray-250 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-450 font-bold mb-1">State</label>
                      <input 
                        type="text" 
                        required
                        value={newState} 
                        onChange={e => setNewState(e.target.value)}
                        placeholder="Tamil Nadu"
                        className={`w-full p-2 border rounded-lg focus:ring-1 focus:ring-[#FF6B35]/50 outline-none text-[11px] ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-gray-250 text-slate-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-slate-450 font-bold mb-1">ZIP Code</label>
                      <input 
                        type="text" 
                        required
                        value={newZipCode} 
                        onChange={e => setNewZipCode(e.target.value)}
                        placeholder="641004"
                        className={`w-full p-2 border rounded-lg focus:ring-1 focus:ring-[#FF6B35]/50 outline-none text-[11px] ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-gray-250 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitAddressLoading}
                    className="w-full bg-slate-900 dark:bg-slate-100 dark:text-slate-950 text-white font-bold font-sora p-2 rounded-lg transition active:scale-95 text-[11px] flex justify-center items-center gap-1.5 mt-2 shadow-sm cursor-pointer hover:opacity-90"
                  >
                    {isSubmitAddressLoading ? 'Registering coordinates...' : 'Save & Select Address'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Address Selection Cards list */}
            {addresses.length === 0 ? (
              <div className="bg-[#FF6B35]/5 border border-[#FF6B35]/25 text-slate-650 dark:text-slate-300 p-4 rounded-xl leading-relaxed text-xs">
                <p className="font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                  <Info className="w-4 h-4 text-[#FF6B35]" /> No Registered Addresses Found
                </p>
                <p className="mt-1 text-slate-500">
                  Please click <b>"Register New"</b> to submit delivery address parameters, coordinates, and contact details to proceed with checkout.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                {addresses.map(a => (
                  <label
                    key={a.id}
                    onClick={() => setSelectedAddrId(a.id)}
                    className={`flex p-3 rounded-xl border transition-all cursor-pointer items-start gap-3 relative ${
                      selectedAddrId === a.id 
                        ? 'border-[#FF6B35] bg-[#FF6B35]/5 text-slate-900 dark:text-white shadow-xs' 
                        : (isDark ? 'border-slate-800 bg-[#16213E]/30 text-slate-400 hover:border-slate-705' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-350')
                    }`}
                  >
                    <input
                      id={`chk-addr-${a.id}`}
                      type="radio"
                      name="checkoutAddrGroup"
                      checked={selectedAddrId === a.id}
                      onChange={() => setSelectedAddrId(a.id)}
                      className="mt-1 accent-[#FF6B35]"
                    />
                    <div className="leading-tight flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-slate-150">{a.fullName}</span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">{a.phone}</span>
                        {a.isDefault && (
                          <span className="text-[9px] bg-[#0FAA6F]/15 text-[#0FAA6F] px-1.5 py-0.5 rounded font-black font-mono">PRIMARY</span>
                        )}
                      </div>
                      <p className="mt-1.5 text-slate-500 dark:text-slate-400 text-[11px] leading-tight font-sans">
                        {a.street}, {a.city}, {a.state} - <span className="font-mono">{a.zipCode}</span>
                      </p>
                    </div>

                    {selectedAddrId === a.id && (
                      <span className="bg-[#FF6B35] text-white p-0.5 rounded-full absolute -top-1.5 -right-1.5">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Verified Payment Protocols selection */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#FF6B35]" />
              2. Secured Payment Gateway Protocols
            </h3>

            {/* Main Selector Row Tabs */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'STRIPE', icon: CreditCard, label: 'Credit Card', sub: 'Secure SSL' },
                { id: 'RAZORPAY', icon: Receipt, label: 'Razorpay', sub: 'Sandbox API' },
                { id: 'UPI', icon: Smartphone, label: 'UPI Direct', sub: 'Scan QR' },
                { id: 'COD', icon: ShoppingBag, label: 'Cash / COD', sub: 'Doorstep PO' }
              ].map(gate => {
                const isActive = paymentMethod === gate.id;
                return (
                  <button
                    key={gate.id}
                    type="button"
                    onClick={() => setPaymentMethod(gate.id as any)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition duration-300 gap-1 select-none cursor-pointer text-center group ${
                      isActive 
                        ? 'border-[#FF6B35] bg-[#FF6B35]/5 font-bold text-[#FF6B35] ring-2 ring-[#FF6B35]/10' 
                        : (isDark 
                            ? 'border-slate-800 bg-[#16213E]/30 text-slate-400 hover:border-slate-700 hover:bg-slate-900' 
                            : 'border-gray-250 bg-white text-slate-600 hover:border-gray-400 hover:bg-slate-50')
                    }`}
                  >
                    <gate.icon className={`w-5 h-5 transition-transform group-hover:scale-110 duration-200 ${isActive ? 'text-[#FF6B35]' : 'text-slate-400'}`} />
                    <span className="text-[10.5px] font-bold block mt-1 tracking-tight leading-none">{gate.label}</span>
                    <span className="text-[8px] opacity-70 block font-mono uppercase tracking-widest">{gate.sub}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Gateway Contents displaying high-fidelity modules */}
            <div className="pt-1.5">
              
              {/* Payment Flow: STRIPE SECURE CREDIT CARD METRICS */}
              {paymentMethod === 'STRIPE' && (
                <div className="space-y-5">
                  
                  {/* Dynamic interactive 3D Card flips */}
                  <div className="perspective-1000 w-full flex justify-center py-2 select-none">
                    <motion.div 
                      animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                      style={{ transformStyle: 'preserve-3d' }}
                      className={`w-full max-w-sm h-48 rounded-2xl p-5 text-white flex flex-col justify-between shadow-xl relative bg-gradient-to-tr ${cardBrand.color} border border-white/20`}
                    >
                      {/* CARD FACE FRONT */}
                      <div 
                        style={{ backfaceVisibility: 'hidden' }}
                        className="absolute inset-0 p-5 flex flex-col justify-between"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[13px] font-black font-sora tracking-tight bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                              ShopSphere Premium
                            </span>
                            <span className="text-[8px] font-mono tracking-widest block opacity-70 mt-0.5">VISA CERTIFIED METRIC</span>
                          </div>
                          <span className="text-xs font-bold font-mono uppercase border border-white/30 px-2 py-0.5 rounded bg-white/10">
                            {cardBrand.name}
                          </span>
                        </div>

                        {/* Interactive chip & vector signal */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-8 h-6 bg-amber-300/80 rounded-md border border-amber-400 flex flex-col justify-between p-1">
                            <div className="w-1.5 h-1 bg-[#1A1A2E]/20 rounded"></div>
                            <div className="w-full h-0.5 bg-[#1A1A2E]/20"></div>
                            <div className="w-full h-0.5 bg-[#1A1A2E]/20"></div>
                          </div>
                          <div className="text-[10px] font-mono tracking-widest text-slate-300">
                            )))) Contactless
                          </div>
                        </div>

                        <div className="mt-2 text-center">
                          <span className="text-lg font-mono tracking-[0.25em] font-bold block bg-gradient-to-r from-white to-[#F8F9FA] bg-clip-text text-transparent">
                            {cardNumber || '•••• •••• •••• ••••'}
                          </span>
                        </div>

                        <div className="flex justify-between items-end mt-2">
                          <div>
                            <span className="text-[8px] opacity-70 block font-mono">ACCOUNT CARD NOMINEE</span>
                            <span className="text-[11px] font-bold truncate max-w-[190px] block font-sora uppercase">
                              {cardHolder || 'CARDOWNER NAME'}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] opacity-70 block font-mono">EXPIRES</span>
                            <span className="font-mono font-bold text-xs">
                              {cardExpiry || 'MM/YY'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* CARD FACE REVERSE SIDE (Flipped) */}
                      <div 
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        className="absolute inset-0 p-5 flex flex-col justify-between text-slate-100"
                      >
                        {/* Tape stripe */}
                        <div className="absolute top-6 left-0 right-0 h-9 bg-slate-950"></div>
                        
                        <div className="mt-14 flex items-center justify-between">
                          <div className="flex-1 mr-4">
                            <div className="h-7 bg-white/20 rounded flex items-center justify-end px-3 select-none">
                              <span className="text-[8px] text-zinc-400 font-mono italic tracking-widest mr-2 uppercase">AUTHORIZED NOMINEE SECURE SIGNATURE</span>
                            </div>
                          </div>
                          <div className="bg-white text-slate-900 justify-center flex items-center rounded h-7 w-12 border shadow px-2">
                            <span className="font-mono text-xs font-bold text-slate-950 tracking-widest">
                              {cardCvv || '•••'}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-end mt-4 text-[8px] font-mono opacity-80 leading-relaxed">
                          <span>
                            This card remains secure electronic property of active PCI systems. Fraudulent usages will activate real-time geocoded telemetry locks.
                          </span>
                          <span className="text-[10px] font-black italic shrink-0">CVV OK</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 text-xs font-sans">
                    <div className="md:col-span-12">
                      <label className="block text-slate-450 font-bold mb-1">Card Number (PCI-DSS Secured)</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="4111 2222 3333 4444"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          id="inp-cc-num"
                          className={`w-full p-2.5 pl-9 border rounded-xl font-mono tracking-widest text-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] outline-none ${
                            isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-250'
                          }`}
                        />
                        <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      </div>
                    </div>

                    <div className="md:col-span-12">
                      <label className="block text-slate-450 font-bold mb-1">Cardholder Custodian Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Rahul Sharma"
                        value={cardHolder}
                        onChange={e => setCardHolder(e.target.value.toUpperCase())}
                        id="inp-cc-holder"
                        className={`w-full p-2.5 border rounded-xl font-sora font-semibold focus:ring-1 focus:ring-[#FF6B35] outline-none text-[11.5px] ${
                          isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-250 text-slate-900'
                        }`}
                      />
                    </div>

                    <div className="md:col-span-6 col-span-6">
                      <label className="block text-slate-450 font-bold mb-1">Expiration Date</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={handleCardExpiryChange}
                          id="inp-cc-expiry"
                          className={`w-full p-2.5 pl-8 text-center border rounded-xl font-mono focus:ring-1 focus:ring-[#FF6B35] outline-none ${
                            isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-250'
                          }`}
                        />
                        <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                      </div>
                    </div>

                    <div className="md:col-span-6 col-span-6">
                      <label className="block text-slate-450 font-bold mb-1">CVV Code</label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          placeholder="***"
                          maxLength={4}
                          value={cardCvv}
                          onChange={handleCardCvvChange}
                          onFocus={() => setIsCardFlipped(true)}
                          onBlur={() => setIsCardFlipped(false)}
                          id="inp-cc-cvv"
                          className={`w-full p-2.5 pl-8 text-center border rounded-xl font-mono tracking-widest focus:ring-1 focus:ring-[#FF6B35] outline-none ${
                            isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-250'
                          }`}
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Flow: RAZORPAY SANDBOX PLATFORM INTERFACE */}
              {paymentMethod === 'RAZORPAY' && (
                <div className={`p-4 rounded-xl border space-y-3 ${
                  isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-slate-800">
                    <span className="font-bold text-xs text-indigo-500">Razorpay API Sandbox Integration</span>
                    <span className="font-mono text-[9px] uppercase font-black bg-indigo-500/15 text-indigo-505 px-2 py-0.5 rounded tracking-wider">Active</span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    The platform coordinates orders with the secure <b>Razorpay API</b> module. In a test environment, order confirmation establishes virtual handshake calls directly with bank servers.
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-[10px] font-mono py-2 p-3 rounded-lg border border-indigo-150/50 bg-indigo-50/20 dark:bg-slate-950/40">
                    <div>
                      <span className="text-slate-400 uppercase block tracking-wider font-semibold">Sandbox Client Key ID</span>
                      <span className="text-indigo-650 dark:text-indigo-400 font-bold">rzp_test_5hpSphr999</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase block tracking-wider font-semibold">Protocol Call Type</span>
                      <span className="text-slate-800 dark:text-slate-205 font-bold">RazorPay Checkout Standard V3</span>
                    </div>
                    <div className="col-span-2 pt-1">
                      <span className="text-slate-400 uppercase block tracking-wider font-semibold">Secure Request Hash Checks</span>
                      <span className="text-slate-500 block truncate max-w-full">sha256_b796ea8a94ee88102a901ff...</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 italic flex items-start gap-1">
                    <span className="text-indigo-500">●</span> All major debit/credit cards, UPI applications, and standard NetBanking configurations are integrated.
                  </div>
                </div>
              )}

              {/* Payment Flow: UPI BARCODE QR DIRECT SCANS & CHIPS */}
              {paymentMethod === 'UPI' && (
                <div className={`p-4 rounded-xl border space-y-4 ${
                  isDark ? 'bg-[#16213E]/30 border-slate-800' : 'bg-gray-50/70 border-gray-200 shadow-xs'
                }`}>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 dark:border-slate-850">
                    <span className="font-bold text-xs text-[#FF6B35]">Unified Payments Interface (UPI) Smart Scanner</span>
                    <span className="font-mono text-[9px] font-black bg-emerald-500/10 text-[#0FAA6F] px-2 py-0.5 rounded uppercase tracking-wider">PREPAY DISCOUNT AVAILABLE</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4.5">
                    {/* Simulated High Fidelity Barcode QR Frame with Moving Scan Line */}
                    <div className="w-28 h-28 bg-white p-2 rounded-xl relative shadow-md shrink-0 border border-gray-150 flex flex-col justify-between overflow-hidden">
                      {/* Interactive CSS scan line */}
                      <span className="absolute left-0 right-0 h-0.5 bg-emerald-500/70 shadow-[0_0_8px_#10b981] animate-[bounce_1600ms_infinite]"></span>
                      
                      <div className="w-full flex justify-between h-4">
                        <div className="w-4.5 h-4.5 border-t-[3.5px] border-l-[3.5px] border-slate-900 rounded-sm"></div>
                        <div className="w-4.5 h-4.5 border-t-[3.5px] border-r-[3.5px] border-slate-900 rounded-sm"></div>
                      </div>

                      {/* Barcode details simulated with block characters */}
                      <div className="font-mono font-black text-slate-950 text-[11px] leading-tight text-center tracking-[0.1em] select-none uppercase">
                        ▟▚ ▞▜  ▚▞<br />
                        ▚▞ ▜▛  ▞▚<br />
                        ▞▚ ▟▛  ▚▞<br />
                        ▟▛ ▜▛  ▞▚
                      </div>

                      <div className="w-full flex justify-between h-4">
                        <div className="w-4.5 h-4.5 border-b-[3.5px] border-l-[3.5px] border-slate-900 rounded-sm"></div>
                        <div className="w-4.5 h-4.5 border-b-[3.5px] border-r-[3.5px] border-slate-900 rounded-sm"></div>
                      </div>
                    </div>

                    <div className="space-y-3 flex-1 w-full text-xs leading-none">
                      <span className="font-bold text-slate-700 dark:text-slate-205 block">Scan to Pay via BHIM / GPay / PhonePe / Paytm</span>
                      <p className="text-slate-500 dark:text-slate-400 text-[10.5px] leading-relaxed">
                        To pay instantly, scan the secure merchant codes with your preferred mobile payment applications. Or manually register your UPI payment handle (VPA):
                      </p>

                      <div className="space-y-1.5">
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="e.g. user@okaxis"
                            value={upiVirtualId}
                            onChange={handleUpiIdChange}
                            className={`w-full p-2 border rounded-lg font-mono focus:ring-1 focus:ring-[#FF6B35] outline-none text-[11px] ${
                              isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-250 text-slate-900'
                            }`}
                          />
                          {upiVirtualId && (
                            <span className="absolute right-2.5 top-2">
                              {isUpiValid ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <X className="w-4 h-4 text-red-500" />
                              )}
                            </span>
                          )}
                        </div>

                        {/* Autocomplete Quick UPI handle chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {['@okaxis', '@ybl', '@paytm', '@okicici', '@oksbi'].map(h => {
                            return (
                              <button
                                key={h}
                                type="button"
                                onClick={() => {
                                  // Prefix name or clean state
                                  const namePart = upiVirtualId.split('@')[0] || 'customer';
                                  const syntheticVpa = `${namePart}${h}`;
                                  setUpiVirtualId(syntheticVpa);
                                  setIsUpiValid(true);
                                }}
                                className={`text-[9.5px] font-mono px-2 py-1 rounded border hover:scale-105 active:scale-95 transition cursor-pointer select-none ${
                                  isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-650' : 'bg-white border-gray-250 hover:border-gray-400'
                                }`}
                              >
                                {h}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Flow: CASH ON DELIVERY SECURE ROUTE */}
              {paymentMethod === 'COD' && (
                <div className="space-y-3.5">
                  <div className={`p-4 rounded-xl border leading-relaxed space-y-3 ${
                    isDark ? 'bg-[#0FAA6F]/5 border-[#0FAA6F]/15' : 'bg-emerald-50/40 border-emerald-150 shadow-xs'
                  }`}>
                    <div className="flex justify-between items-center pb-2 border-b border-emerald-100 dark:border-[#0FAA6F]/10">
                      <span className="font-bold text-xs text-[#0FAA6F]">Cash on Delivery Logistics Matrix</span>
                      <span className="font-mono text-[9px] font-black bg-[#0FAA6F]/10 text-[#0FAA6F] px-2 py-0.5 rounded uppercase tracking-wider">AVAILABLE AT PIN</span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-sans">
                      Your delivery coordinates are fully serviced by ShopSphere courier networks. No advanced deposits are pending. Cash will be collected during delivery doorstep transfers.
                    </p>

                    <div className="space-y-1.5 bg-white dark:bg-slate-950/40 p-2.5 rounded-lg border border-emerald-100/40 dark:border-emerald-900/10 text-[10.5px]">
                      <div className="flex items-center gap-2 text-[#0FAA6F] font-bold">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>Doorstep POS Swipe Available: Pay via UPI/Card at Doorstep</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#0FAA6F] font-bold">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>Contactless Security Dispatch Routing Ensured</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#0FAA6F] font-bold">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>Order dispatch within 24 hours of checkout submission</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-205 dark:border-slate-800">
            {/* Submit authorize button */}
            <button
              onClick={handleCheckoutSubmit}
              disabled={!selectedAddrId}
              id="btn-authorize-and-place-order"
              type="button"
              className={`w-full text-white font-black font-sora py-4 rounded-xl transition duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md select-none text-xs uppercase tracking-wider ${
                !selectedAddrId 
                  ? 'bg-slate-400 dark:bg-slate-800 text-slate-600 dark:text-slate-500 cursor-not-allowed' 
                  : 'bg-[#FF6B35] hover:bg-[#e35925] hover:shadow-lg active:scale-98'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>
                {paymentMethod === 'COD' 
                  ? `Authorize Cash Delivery of ₹${grandTotal}` 
                  : `Authorize Instant Payment of ₹${grandTotal}`}
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT WORKSPACE: Invoice billing Ledger */}
        <div className={`w-full md:w-[380px] p-5 md:p-7 flex flex-col justify-between border-t md:border-t-0 md:border-l ${
          isDark ? 'bg-[#16213E]/40 border-slate-800' : 'bg-slate-50 border-gray-200'
        }`}>
          <div className="space-y-5 flex-1 overflow-y-auto scrollbar-none pb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5 pb-2 border-b border-dashed border-slate-205 dark:border-slate-850">
              <Receipt className="w-4 h-4 text-[#FF6B35]" />
              3. Checkout Invoice Ledger
            </h3>

            {/* Scrolling Mini-items listings */}
            <div className={`space-y-3 divide-y max-h-[170px] overflow-y-auto pr-1 select-none leading-none ${
              isDark ? 'divide-slate-800' : 'divide-slate-150'
            }`}>
              {cartItems.map((it, idx) => (
                <div key={it.id || idx} className="flex gap-3 items-center pt-2.5 first:pt-0">
                  <img
                    src={it.product.images?.[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff"}
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff"; }}
                    alt={it.product.title}
                    referrerPolicy="no-referrer"
                    className={`w-10 h-10 rounded-lg object-contain p-0.5 border shrink-0 bg-white ${
                      isDark ? 'border-slate-800' : 'border-gray-200'
                    }`}
                  />
                  <div className="flex-1 min-w-0 pr-1 text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100 truncate block leading-tight">{it.product.title}</span>
                    <span className="text-[9.5px] text-slate-400 mt-1 block">
                      Qty: {it.quantity} {it.selectedSize && `| Size: ${it.selectedSize}`} {it.selectedColor && `| Color: ${it.selectedColor}`}
                    </span>
                  </div>
                  <span className="font-black text-slate-950 dark:text-slate-100 font-mono text-[11px]">
                    ₹{it.product.price * it.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Dynamic Shipping Free Delivery Tracker Progress */}
            <div className={`p-3 rounded-xl border leading-relaxed space-y-1 ${
              cartTotal >= 999 
                ? 'bg-[#0FAA6F]/5 border-[#0FAA6F]/20' 
                : (isDark ? 'bg-slate-905 border-slate-800' : 'bg-gray-100 border-gray-200')
            }`}>
              <div className="flex justify-between items-center text-[10.5px]">
                <span className="font-bold text-slate-600 dark:text-slate-450 uppercase font-mono tracking-wider">Free Shipping Hub</span>
                {cartTotal >= 999 ? (
                  <span className="text-[#0FAA6F] font-bold">QUALIFIED</span>
                ) : (
                  <span className="text-[#FF6B35] font-black font-mono">₹{999 - cartTotal} PENDING</span>
                )}
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="bg-[#0FAA6F] h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (cartTotal / 999) * 100)}%` }}
                ></div>
              </div>
              {cartTotal >= 999 ? (
                <p className="text-[9.5px] text-slate-500 mt-1">🎉 You have unlocked <b>FREE Shipping</b>! ₹99 delivery fee cut from total.</p>
              ) : (
                <p className="text-[9.5px] text-slate-400 mt-1">Add just <b>₹{999 - cartTotal}</b> more of elite items to unlock FREE shipping.</p>
              )}
            </div>

            {/* Coupon / Voucher Submission Box */}
            <form onSubmit={handleApplyCouponCode} className="space-y-1.5 pt-2">
              <label className="text-[9.5px] text-slate-450 font-bold uppercase tracking-widest block">Available Promo Coupon</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="e.g. FIRST10"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    id="inp-invoice-coupon"
                    className={`w-full p-2 pl-7 border rounded-lg font-mono font-bold tracking-widest text-[11px] focus:ring-1 focus:ring-[#FF6B35] outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-250 text-slate-900'
                    }`}
                  />
                  <Tag className="w-4 h-4 text-slate-400 absolute left-2 top-2.5" />
                </div>
                <button
                  type="submit"
                  id="btn-invoice-coupon-submit"
                  className="bg-slate-950 dark:bg-slate-100 dark:text-slate-950 font-bold text-white px-3.5 py-1.5 rounded-lg text-xs hover:opacity-90 transition cursor-pointer select-none active:scale-95 flex items-center justify-center"
                >
                  Apply
                </button>
              </div>

              {/* Promotional Voucher tags */}
              <div className="flex gap-2 pt-1 font-mono text-[9px]">
                <button
                  type="button"
                  onClick={() => { setCouponCode('FIRST10'); }}
                  className="text-[#FF6B35] underline hover:no-underline font-semibold"
                >
                  🎟️ FIRST10 (10% OFF)
                </button>
                <span className="text-slate-350 dark:text-slate-700">|</span>
                <button
                  type="button"
                  onClick={() => { setCouponCode('SAVE20'); }}
                  className="text-indigo-500 underline hover:no-underline font-semibold"
                >
                  🎟️ SAVE20 (20% OFF)
                </button>
              </div>

              {appliedCoupon && (
                <div className="bg-[#0FAA6F]/10 border border-[#0FAA6F]/20 text-[#0FAA6F] p-2 rounded-lg flex items-center justify-between text-[11px] font-sans">
                  <span>Code Applied: <b>{appliedCoupon.code}</b> (-₹{discountAmt})</span>
                  <button
                    type="button"
                    onClick={() => { setAppliedCoupon(null); setDiscountAmt(0); }}
                    className="text-red-500 hover:text-red-650 font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Pricing Ledger tally columns */}
          <div className={`p-4 rounded-2xl space-y-2 border font-sans select-none ${
            isDark ? 'bg-slate-950 border-slate-850' : 'bg-white border-slate-200'
          }`}>
            <div className="flex justify-between font-bold text-slate-500 text-[11px]">
              <span>Items Total Amount</span>
              <span className="font-mono text-slate-800 dark:text-slate-205">₹{cartTotal}</span>
            </div>
            {discountAmt > 0 && (
              <div className="flex justify-between font-bold text-[#0FAA6F] text-[11px]">
                <span>Coupon Reduction</span>
                <span className="font-mono">-₹{discountAmt}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-slate-500 text-[11px]">
              <span>Shipping Delivery Fees</span>
              {shippingFee === 0 ? (
                <span className="font-mono text-[#0FAA6F] font-black">FREE SHIPPING</span>
              ) : (
                <span className="font-mono text-slate-800 dark:text-slate-205">₹{shippingFee}</span>
              )}
            </div>
            <div className="flex justify-between font-bold text-slate-500 text-[11px]">
              <span>Consolidated Tax GST (18%)</span>
              <span className="font-mono text-slate-800 dark:text-slate-205">₹{gstAmount}</span>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 mt-2 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-450 text-[10px] uppercase block tracking-wider leading-none">Net Total Payable</span>
                <span className="text-[10px] text-slate-400 italic block mt-0.5 leading-none">Includes taxes & duties</span>
              </div>
              <span className="font-space font-extrabold text-[#FF6B35] text-lg">
                ₹{grandTotal}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
