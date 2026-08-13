import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Mail, Lock, Eye, EyeOff, User, ArrowRight, Sparkles, ShieldCheck, 
  Truck, RefreshCw, Smartphone, Check, AlertCircle, Chrome, Github, 
  Facebook, HelpCircle, Sun, Moon, Star, Award, ChevronRight,
  ShoppingBag, ShieldAlert, CheckCircle2, Sparkle
} from 'lucide-react';
import { User as UserType } from '../types';

interface AuthExperienceProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserType, token: string, role: 'CUSTOMER' | 'SELLER' | 'ADMIN') => void;
  triggerToast: (title: string, message: string, type: 'success' | 'info') => void;
}

type AuthMode = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD' | 'OTP' | 'ONBOARDING' | 'OAUTH_SIMULATOR';

export default function AuthExperience({ isOpen, onClose, onSuccess, triggerToast }: AuthExperienceProps) {
  // Theme of the right authentication card pane
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  
  // Input fields
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [referredByCode, setReferredByCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP Verification state
  const [otpArray, setOtpArray] = useState<string[]>(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpStep, setOtpStep] = useState<'REQUEST' | 'VERIFY'>('REQUEST');
  const [otpTarget, setOtpTarget] = useState('');

  // Password Reset state
  const [resetStep, setResetStep] = useState<'EMAIL' | 'CODE' | 'NEW_PASSWORD'>('EMAIL');
  const [resetCode, setResetCode] = useState<string[]>(['', '', '', '', '', '']);
  const resetCodeRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OAuth Simulated state
  const [oauthProvider, setOauthProvider] = useState<'Google' | 'GitHub' | 'Facebook' | null>(null);
  const [simulatedAccountChosen, setSimulatedAccountChosen] = useState(false);

  // States for UX interactions
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessCheck, setShowSuccessCheck] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Onboarding parameters (Preferences Questionnaire)
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [preferredDepartments, setPreferredDepartments] = useState<string[]>([]);
  const [preferredStyle, setPreferredStyle] = useState<'minimal' | 'chic' | 'classic' | 'smart'>('chic');
  const [onboardingAvatar, setOnboardingAvatar] = useState<string>('🤵');

  // Interactive Floating product cards state
  const [floatingCards, setFloatingCards] = useState([
    {
      id: 1,
      title: 'Premium Chronograph Gold',
      price: '$249',
      image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=150&q=80',
      tag: 'Elite Watch',
      x: '12%', y: '15%'
    },
    {
      id: 2,
      title: 'Air Max Pro Sport Shoes',
      price: '$180',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80',
      tag: 'Trending Now',
      x: '68%', y: '28%'
    },
    {
      id: 3,
      title: 'Banarasi Silk Heritage Saree',
      price: '$450',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=150&q=80',
      tag: 'Bridal Choice',
      x: '22%', y: '62%'
    }
  ]);

  if (!isOpen) return null;

  // Compute Password Strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: 'No password', color: 'bg-gray-300' };
    let score = 0;
    if (pass.length > 6) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1: return { score: 1, text: 'Weak Accent', color: 'bg-red-500 w-1/4' };
      case 2: return { score: 2, text: 'Moderate Range', color: 'bg-amber-400 w-2/4' };
      case 3: return { score: 3, text: 'Secure Shield', color: 'bg-emerald-400 w-3/4' };
      case 4: return { score: 4, text: 'Military Vault', color: 'bg-indigo-500 w-full' };
      default: return { score: 1, text: 'Weak', color: 'bg-red-500 w-1/4' };
    }
  };

  const passwordStrength = getPasswordStrength(passwordInput);

  // Switch Auth states cleanly
  const handleSwitchMode = (newMode: AuthMode) => {
    setFormError(null);
    setMode(newMode);
  };

  // Perform OTP actions
  const triggerOtpRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpTarget) {
      setFormError('Please enter a valid email or phone number.');
      return;
    }
    setIsLoading(true);
    setFormError(null);
    setTimeout(() => {
      setIsLoading(false);
      setOtpStep('VERIFY');
      triggerToast('Security Protocol', `Verification security credentials dispatched to ${otpTarget}.`, 'success');
    }, 1500);
  };

  const verifyOtpCode = async () => {
    const enteredPin = otpArray.join('');
    if (enteredPin.length < 6) {
      setFormError('Please input the complete 6-digit access OTP pin.');
      return;
    }
    setIsLoading(true);
    setFormError(null);
    setTimeout(async () => {
      setIsLoading(false);
      // Simulate login with verified system demo guest profile
      try {
        const payload = {
          email: otpTarget.includes('@') ? otpTarget : 'otp.shopper@shopsphere.com',
          password: 'customer123' 
        };
        const resp = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        const data = await resp.json();
        if (resp.ok) {
          setShowSuccessCheck(true);
          setTimeout(() => {
            onSuccess(data.user, data.token, data.user.role);
            resetAllStates();
          }, 1000);
        } else {
          // Fallback if not registered, let's create random profile dynamically!
          const mockUser: UserType = {
            id: `user-otp-${Math.random().toString(36).substring(2, 7)}`,
            email: payload.email,
            name: 'OTP Verified Client',
            role: 'CUSTOMER',
            rewardPoints: 120,
            referralCode: 'SPHERE-OTP-220',
            verified: true,
            createdAt: new Date().toISOString()
          };
          setShowSuccessCheck(true);
          setTimeout(() => {
            onSuccess(mockUser, 'mock-jwt-token-key-22340', 'CUSTOMER');
            resetAllStates();
          }, 1000);
        }
      } catch (err) {
        setFormError('OTP Verification failed. Please request dynamic code retry.');
      }
    }, 1800);
  };

  // Perform Reset Password actions
  const handleResetPasswordFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (resetStep === 'EMAIL') {
      if (!emailInput) {
        setFormError('Email Address configuration is required for recovery lookup.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setResetStep('CODE');
        triggerToast('Credential Locator', 'Secret security code dispatched. Check your inbox folders.', 'success');
      }, 1400);
    } else if (resetStep === 'CODE') {
      const pinCode = resetCode.join('');
      if (pinCode.length < 6) {
        setFormError('Complete 6-digit cryptographic pin is required.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setResetStep('NEW_PASSWORD');
      }, 1200);
    } else if (resetStep === 'NEW_PASSWORD') {
      if (!newPassword || newPassword.length < 6) {
        setFormError('Vault safeguards require new passwords to stand at 6 characters or above.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setFormError('Passwords mismatched. Verify character alignments.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setShowSuccessCheck(true);
        triggerToast('Vault Refactored', 'Your security parameters have been verified. Access credentials restored.', 'success');
        setTimeout(() => {
          setShowSuccessCheck(false);
          setResetStep('EMAIL');
          setMode('LOGIN');
          setPasswordInput(newPassword);
        }, 1500);
      }, 1700);
    }
  };

  // Onboarding Preference complete submission
  const handleOnboardingRegister = async () => {
    setIsLoading(true);
    setFormError(null);
    
    try {
      // First save the profile on backend
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: emailInput, 
          name: nameInput || 'Elite Client', 
          password: passwordInput,
          referredBy: referredByCode
        })
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok) {
        setShowSuccessCheck(true);
        triggerToast('Onboarding Configured', `Tailoring department settings complete! Enjoy personalized deals.`, 'success');
        setTimeout(() => {
          onSuccess(data.user, data.token, 'CUSTOMER');
          resetAllStates();
        }, 1200);
      } else {
        setFormError(data.error || 'Enterprise registry failed. Verify credentials unique profile.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setFormError('Server response error. Please try standard sign in.');
    }
  };

  // Authentic JWT based login
  const handleRealLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      setFormError('All authentication parameter fields must be satisfied.');
      return;
    }
    setIsLoading(true);
    setFormError(null);

    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });

      const data = await resp.json();
      setIsLoading(false);

      if (resp.ok) {
        setShowSuccessCheck(true);
        setTimeout(() => {
          onSuccess(data.user, data.token, data.user.role);
          resetAllStates();
        }, 1000);
      } else {
        setFormError(data.error || 'Invalid credentials mapping.');
      }
    } catch (error) {
      setIsLoading(false);
      setFormError('Endpoint connection timed out. Try again shortly.');
    }
  };

  // Google / GitHub / Facebook OAuth Simulator Setup
  const handleOauthInit = (provider: 'Google' | 'GitHub' | 'Facebook') => {
    setOauthProvider(provider);
    setSimulatedAccountChosen(false);
    handleSwitchMode('OAUTH_SIMULATOR');
  };

  const completeOauthVerification = async (accountEmail: string, accountName: string) => {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        // Try Logging in first if user already exists
        const loginResp = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: accountEmail, password: 'oauthVerifiedPassword167' })
        });
        
        let data = await loginResp.json();
        
        if (!loginResp.ok) {
          // If not exists, register immediately
          const regResp = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: accountEmail, name: accountName, password: 'oauthVerifiedPassword167' })
          });
          data = await regResp.json();
        }

        setIsLoading(false);
        setShowSuccessCheck(true);
        triggerToast('Credential Link Sync', `Integrated via Secure ${oauthProvider} OpenID network.`, 'success');
        
        setTimeout(() => {
          onSuccess(data.user || data, data.token || 'mock-linked-social-token', (data.user?.role) || 'CUSTOMER');
          resetAllStates();
        }, 1000);

      } catch (err) {
        setIsLoading(false);
        setFormError('Identity profile lookup sync mismatch.');
      }
    }, 1500);
  };

  const resetAllStates = () => {
    setEmailInput('');
    setPasswordInput('');
    setNameInput('');
    setReferredByCode('');
    setFormError(null);
    setShowSuccessCheck(false);
    setIsLoading(false);
    setMode('LOGIN');
    onClose();
  };

  // Handle inputs index changes for pins automatically
  const handlePinInput = (
    index: number, 
    value: string, 
    type: 'OTP' | 'RESET'
  ) => {
    const v = value.slice(-1); // only accept single character
    const targetArr = type === 'OTP' ? [...otpArray] : [...resetCode];
    targetArr[index] = v;

    if (type === 'OTP') {
      setOtpArray(targetArr);
      if (v && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    } else {
      setResetCode(targetArr);
      if (v && index < 5) {
        resetCodeRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (
    index: number, 
    e: React.KeyboardEvent<HTMLInputElement>, 
    type: 'OTP' | 'RESET'
  ) => {
    if (e.key === 'Backspace') {
      const targetArr = type === 'OTP' ? [...otpArray] : [...resetCode];
      if (!targetArr[index] && index > 0) {
        targetArr[index - 1] = '';
        if (type === 'OTP') {
          setOtpArray(targetArr);
          otpRefs.current[index - 1]?.focus();
        } else {
          setResetCode(targetArr);
          resetCodeRefs.current[index - 1]?.focus();
        }
      } else {
        targetArr[index] = '';
        if (type === 'OTP') {
          setOtpArray(targetArr);
        } else {
          setResetCode(targetArr);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-stretch justify-center font-sans">
      
      {/* SHUFFLED AURORA COLORED LIGHT BLOB NODES FOR AMBIENT LUXURY VIBE */}
      <div className="absolute inset-0 bg-slate-950 -z-20 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[60%] h-[60%] rounded-full bg-indigo-900/40 mix-blend-screen blur-[120px] animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[60%] h-[60%] rounded-full bg-violet-900/30 mix-blend-screen blur-[130px] animate-pulse duration-[8000ms]" />
        <div className="absolute top-1/3 right-1/4 w-[350px]. h-[350px] rounded-full bg-purple-900/25 mix-blend-screen blur-[100px] animate-pulse duration-[5000ms]" />
      </div>

      <AnimatePresence>
        {mode === 'OAUTH_SIMULATOR' && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-5"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-sm tracking-tight">Access Link Integration</h4>
                </div>
                <button
                  onClick={() => handleSwitchMode('LOGIN')}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-900">
                  Secure OAuth Gateway
                </span>
                <p className="text-xs text-slate-300">
                  RFP integrates with active authenticated networks. Please select an verified social profile directory to authorize connection:
                </p>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                    className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"
                  />
                  <span className="text-xs text-indigo-300 font-medium">Validating security key handshakes...</span>
                </div>
              ) : showSuccessCheck ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xs text-emerald-400 font-bold">Token authenticated successfully!</span>
                </div>
              ) : (
                <div className="space-y-3.5 pt-2">
                  <button
                    onClick={() => completeOauthVerification('rejitha2503@gmail.com', 'Rejitha Nair')}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm">
                        RN
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold font-sans">Rejitha Nair</p>
                        <p className="text-[10px] text-slate-400 font-mono">rejitha2503@gmail.com</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>

                  <button
                    onClick={() => completeOauthVerification('demo.buyer@shopsphere.com', 'Elite Corporate Client')}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-600 text-white font-bold flex items-center justify-center text-sm">
                        EC
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold font-sans">Elite Corporate Client</p>
                        <p className="text-[10px] text-slate-400 font-mono">demo.buyer@shopsphere.com</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>

                  <button
                    onClick={() => completeOauthVerification('admin@shopsphere.com', 'Super Administrator')}
                    className="w-full flex items-center justify-between p-3.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-900 font-black flex items-center justify-center text-sm">
                        SA
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold font-sans">Super Administrator</p>
                        <p className="text-[10px] text-slate-400 font-mono">admin@shopsphere.com</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-[10px] text-slate-500">
                      Standard sandbox identity protocols will bind temporary sessions under encrypted JWT locks.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-7xl mx-auto flex items-stretch overflow-hidden relative shadow-2xl rounded-none md:rounded-2xl md:my-6 md:border md:border-slate-850/80">
        
        {/* CLOSE CORNER BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-40 p-2 bg-slate-900/40 hover:bg-slate-900/80 text-slate-300 hover:text-white rounded-full transition cursor-pointer border border-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COMPONENT: BRANDING & 3D FLOATING PREMIUM CONTENT */}
        <div className="hidden lg:flex w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-between p-12 border-r border-slate-900">
          
          {/* PURPLE AURORA INTERACTIVE CANVAS GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/70 via-slate-950 to-purple-950/40 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full mix-blend-screen blur-[100px] pointer-events-none animate-pulse" />

          {/* DYNAMIC GLOWING LIGHT TRACK PARTICLES */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute w-1.5 h-1.5 rounded-full bg-purple-400 top-[20%] left-[10%] shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-bounce" />
            <div className="absolute w-2 h-2 rounded-full bg-indigo-400 bottom-[30%] left-[15%] shadow-[0_0_12px_rgba(99,102,241,0.6)] animate-ping" />
            <div className="absolute w-1 h-1 rounded-full bg-pink-400 top-[40%] right-[10%] shadow-[0_0_8px_rgba(236,72,153,0.5)] animate-pulse" />
          </div>

          {/* BRAND LABEL HEADLINE */}
          <div className="z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-fuchsia-500 shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white animate-wiggle" />
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block">SHOPSPHERE</span>
              <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase tracking-widest leading-none">Enterprise Suite</span>
            </div>
          </div>

          {/* INTERACTIVE FLOATING GLASS CARDS */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {floatingCards.map((card, idx) => (
              <motion.div
                key={card.id}
                style={{ left: card.x, top: card.y }}
                animate={{
                  y: [0, idx % 2 === 0 ? -15 : 15, 0],
                  rotate: [0, idx % 2 === 0 ? 2 : -2, 0]
                }}
                transition={{
                  duration: 6 + idx * 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute w-56 p-3 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl flex items-center gap-3 text-white"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-11 h-11 object-cover rounded-lg bg-slate-800 shadow"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] bg-indigo-500/20 text-indigo-300 font-mono font-bold px-1.5 py-0.5 rounded uppercase">{card.tag}</span>
                  </div>
                  <p className="text-[10px] font-bold truncate mt-1 text-slate-200">{card.title}</p>
                  <p className="text-xs font-black text-white mt-0.5">{card.price}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* DYNAMIC SHIFT DISPLAY BANNER IN CENTER */}
          <div className="my-auto z-10 max-w-md pt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-1.5 text-indigo-400">
                <Star className="w-4 h-4 fill-indigo-400" />
                <Star className="w-4 h-4 fill-indigo-400" />
                <Star className="w-4 h-4 fill-indigo-400" />
                <Star className="w-4 h-4 fill-indigo-400" />
                <Star className="w-4 h-4 fill-indigo-400" />
                <span className="text-xs font-semibold text-slate-300 ml-2">Audit Trusted</span>
              </div>
              
              <h2 className="text-4xl font-extrabold text-white tracking-tight leading-none font-sans">
                Experience E-Commerce <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Forged in Luxury
                </span>
              </h2>

              <p className="text-sm text-slate-400 leading-relaxed font-normal">
                Connecting discerning shoppers to verified brand partners, artisanal luxury sarees, high-velocity activewear, and digital lifestyle controllers.
              </p>
            </motion.div>
          </div>

          {/* SYSTEM ASSURANCE & COGNITIVE LOGISTICS PANEL */}
          <div className="z-10 text-white space-y-4 border-t border-slate-900 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-2.5 items-start">
                <div className="p-1.5 rounded-lg bg-indigo-950 border border-indigo-900 text-indigo-400 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-200">Express Priority Air</h5>
                  <p className="text-[10px] text-slate-400 leading-snug">Dispatched within 24 hours of checkout validation.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="p-1.5 rounded-lg bg-indigo-950 border border-indigo-900 text-indigo-400 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-200">Identity Lock Protection</h5>
                  <p className="text-[10px] text-slate-400 leading-snug">PCI-DSS compliance safeguarding card vaulting.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="p-1.5 rounded-lg bg-indigo-950 border border-indigo-900 text-indigo-400 mt-0.5">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-200">Assured Exchange Index</h5>
                  <p className="text-[10px] text-slate-400 leading-snug">30-day hassle-free returns with reverse billing courier cycles.</p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="p-1.5 rounded-lg bg-indigo-950 border border-indigo-900 text-indigo-400 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-200">100% Genuine Items</h5>
                  <p className="text-[10px] text-slate-400 leading-snug">Direct factory authenticity certificates for every parcel.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COMPONENT: AUTH FORMS & INTERACTION PANELS */}
        <div className={`w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 transition-colors duration-300 relative ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-950'}`}>
          
          {/* THEME SWITCHER */}
          <div className="absolute left-6 top-6 z-10 flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl border transition flex items-center gap-1 cursor-pointer ${isDarkMode ? 'bg-slate-900 border-slate-800 text-indigo-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-indigo-600 hover:text-indigo-900'}`}
              title="Toggle Aesthetic Vision"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <div className="w-full max-w-md space-y-7 z-10">
            
            <AnimatePresence mode="wait">
              
              {/* LOGIN STATE RENDERING */}
              {mode === 'LOGIN' && (
                <motion.div
                  key="login-pane"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2 text-center lg:text-left">
                    <span className="text-[10px] font-mono tracking-widest font-extrabold text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                      SECURE CLIENT ACCESS PORTAL
                    </span>
                    <h3 className="text-3xl font-black tracking-tight mt-3">Welcome Back</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Access your personal shopping dashboard, checkout vouchers, and wallet rewards.
                    </p>
                  </div>

                  {formError && (
                    <motion.div
                      initial={{ shake: true }}
                      className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex gap-2 items-start"
                    >
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Credential Mismatch</p>
                        <p className="text-[11px] opacity-90 mt-0.5">{formError}</p>
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={handleRealLoginSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className={`block font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Verified Email Address</label>
                      <div className="relative">
                        <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        <input
                          id="inp-auth-email"
                          type="email"
                          placeholder="rejitha2503@gmail.com"
                          value={emailInput}
                          onChange={e => setEmailInput(e.target.value)}
                          className={`w-full font-mono text-sm py-3 pl-11 pr-4 rounded-xl transition duration-250 focus:outline-none border ${
                            isDarkMode 
                            ? 'bg-slate-900/60 border-slate-800 text-white focus:border-indigo-500 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-950' 
                            : 'bg-slate-50 border-slate-200 text-slate-950 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className={`block font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Secure Passphrase</label>
                        <button
                          type="button"
                          onClick={() => handleSwitchMode('FORGOT_PASSWORD')}
                          className="font-bold text-indigo-500 hover:text-indigo-400 hover:underline transition text-[11px] cursor-pointer"
                        >
                          Forgot Passphrase?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        <input
                          id="inp-auth-pass"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="customer123"
                          value={passwordInput}
                          onChange={e => setPasswordInput(e.target.value)}
                          className={`w-full font-mono text-sm py-3 pl-11 pr-11 rounded-xl transition duration-250 focus:outline-none border ${
                            isDarkMode 
                            ? 'bg-slate-900/60 border-slate-800 text-white focus:border-indigo-500 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-950' 
                            : 'bg-slate-50 border-slate-200 text-slate-950 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-800 transition ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black hover:bg-slate-100'}`}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${rememberMe ? 'bg-indigo-600 border-indigo-600 text-white' : isDarkMode ? 'border-slate-850 bg-slate-900' : 'border-slate-300 bg-slate-50'}`}>
                            {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <span className={`text-[11px] font-medium selection:bg-transparent ${isDarkMode ? 'text-slate-400 group-hover:text-slate-250' : 'text-slate-600 group-hover:text-slate-950'}`}>Remember this device parameters</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleSwitchMode('OTP')}
                        className="text-xs font-bold text-indigo-500 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        Access via OTP
                      </button>
                    </div>

                    <button
                      id="btn-auth-submit"
                      type="submit"
                      disabled={isLoading}
                      className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold py-3.5 rounded-2xl select-none transition-all duration-300 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50`}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>Initializing Authentication handshakes...</span>
                        </>
                      ) : showSuccessCheck ? (
                        <CheckCircle2 className="w-5 h-5 animate-bounce" />
                      ) : (
                        <>
                          <span>Establish Decrypted Connection</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* SOCIAL SIGN IN SECTION */}
                  <div className="space-y-4 pt-4 border-t border-slate-900/10 dark:border-slate-800">
                    <div className="relative flex justify-center items-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                      </div>
                      <span className={`relative px-3 text-[10px] font-mono tracking-widest uppercase ${isDarkMode ? 'bg-slate-950 text-slate-500' : 'bg-white text-slate-400'}`}>
                        OR CONNECT SECURELY WITH
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {/* Prominent Google Authentication Button */}
                      <button
                        onClick={() => handleOauthInit('Google')}
                        className={`w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border transition-all duration-300 text-xs font-extrabold cursor-pointer hover:scale-[1.01] active:scale-[0.99] shadow-sm select-none ${
                          isDarkMode 
                          ? 'bg-slate-900 border-slate-800 text-white hover:bg-slate-850 hover:border-slate-700 hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
                        }`}
                      >
                        <Chrome className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
                        <span>Continue with Google Account</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() => handleOauthInit('GitHub')}
                          className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-200 text-xs font-bold cursor-pointer hover:scale-[1.01] ${
                            isDarkMode 
                            ? 'bg-slate-900/60 border-slate-850 text-slate-300 hover:bg-slate-900 hover:text-white' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-black'
                          }`}
                        >
                          <Github className="w-4 h-4 text-slate-400" />
                          <span>GitHub</span>
                        </button>

                        <button
                          onClick={() => handleOauthInit('Facebook')}
                          className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-200 text-xs font-bold cursor-pointer hover:scale-[1.01] ${
                            isDarkMode 
                            ? 'bg-slate-900/60 border-slate-850 text-slate-300 hover:bg-slate-900 hover:text-white' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-black'
                          }`}
                        >
                          <Facebook className="w-4 h-4 text-blue-500" />
                          <span>Facebook</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-xs">
                    <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>
                      Haven't registered your credentials?{' '}
                    </span>
                    <button
                      id="btn-toggle-reg"
                      onClick={() => handleSwitchMode('REGISTER')}
                      className="text-indigo-500 hover:text-indigo-400 font-bold hover:underline transition cursor-pointer"
                    >
                      Create Custom Profile
                    </button>
                  </div>
                </motion.div>
              )}

              {/* REGISTER STATE RENDERING */}
              {mode === 'REGISTER' && (
                <motion.div
                  key="register-pane"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2 text-center lg:text-left">
                    <span className="text-[10px] font-mono tracking-widest font-extrabold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 uppercase">
                      ENTERPRISE CLIENT REGISTRY
                    </span>
                    <h3 className="text-3xl font-black tracking-tight mt-3">Create Account</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Register secure keys to unlock personalized catalogs with high performance algorithms.
                    </p>
                  </div>

                  {formError && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!emailInput || !nameInput || !passwordInput) {
                        setFormError('Please fulfill all security core configurations.');
                        return;
                      }
                      setFormError(null);
                      handleSwitchMode('ONBOARDING');
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="space-y-1.5">
                      <label className={`block font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Full Client Name</label>
                      <div className="relative">
                        <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        <input
                          id="inp-auth-name"
                          type="text"
                          placeholder="Rejitha Nair"
                          value={nameInput}
                          onChange={e => setNameInput(e.target.value)}
                          className={`w-full text-sm py-3 pl-11 pr-4 rounded-xl transition duration-250 focus:outline-none border ${
                            isDarkMode 
                            ? 'bg-slate-900/60 border-slate-800 text-white focus:border-indigo-500 focus:bg-slate-900' 
                            : 'bg-slate-50 border-slate-200 text-slate-950 focus:border-indigo-600 focus:bg-white'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className={`block font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Verified Email Address</label>
                      <div className="relative">
                        <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        <input
                          id="inp-auth-email"
                          type="email"
                          placeholder="shoppers@shopsphere.com"
                          value={emailInput}
                          onChange={e => setEmailInput(e.target.value)}
                          className={`w-full font-mono text-sm py-3 pl-11 pr-4 rounded-xl transition duration-250 focus:outline-none border ${
                            isDarkMode 
                            ? 'bg-slate-900/60 border-slate-800 text-white focus:border-indigo-500 focus:bg-slate-900' 
                            : 'bg-slate-50 border-slate-200 text-slate-950 focus:border-indigo-600 focus:bg-white'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className={`block font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Secure Passphrase</label>
                      <div className="relative">
                        <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        <input
                          id="inp-auth-pass"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={passwordInput}
                          onChange={e => setPasswordInput(e.target.value)}
                          className={`w-full font-mono text-sm py-3 pl-11 pr-11 rounded-xl transition duration-250 focus:outline-none border ${
                            isDarkMode 
                            ? 'bg-slate-900/60 border-slate-800 text-white focus:border-indigo-500 focus:bg-slate-900' 
                            : 'bg-slate-50 border-slate-200 text-slate-950 focus:border-indigo-600 focus:bg-white'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-800 transition ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-black hover:bg-slate-100'}`}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      {/* PASSWORD METRIC VAULT STRENGTH INDICATOR */}
                      {passwordInput && (
                        <div className="space-y-1 pt-1.5">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Shield Strength:</span>
                            <span className="font-bold text-indigo-400">{passwordStrength.text}</span>
                          </div>
                          <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                            <div className={`h-full transition-all duration-300 ${passwordStrength.color}`} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className={`block font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Referral Code (Optional)</label>
                      <input
                        id="inp-auth-ref"
                        type="text"
                        placeholder="e.g. SPHERE120"
                        value={referredByCode}
                        onChange={e => setReferredByCode(e.target.value)}
                        className={`w-full font-mono font-bold tracking-wider text-sm py-3 px-4 rounded-xl transition duration-250 focus:outline-none border ${
                          isDarkMode 
                          ? 'bg-slate-900/60 border-slate-800 text-white focus:border-indigo-500 focus:bg-slate-900' 
                          : 'bg-slate-50 border-slate-200 text-slate-950 focus:border-indigo-600 focus:bg-white'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-550 hover:to-purple-550 text-white font-extrabold py-3.5 rounded-2xl transition duration-300 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                    >
                      <span>Proceed with Personal Tailoring</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="text-center text-xs">
                    <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>
                      Already hold verified credit codes?{' '}
                    </span>
                    <button
                      id="btn-toggle-login"
                      onClick={() => handleSwitchMode('LOGIN')}
                      className="text-indigo-500 hover:text-indigo-400 font-bold hover:underline transition cursor-pointer"
                    >
                      Sign In Instantly
                    </button>
                  </div>
                </motion.div>
              )}

              {/* PREMIUM PREFERENCE QUESTIONNAIRE ONBOARDING EXPERIENCE */}
              {mode === 'ONBOARDING' && (
                <motion.div
                  key="onboarding-pane"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <div className="space-y-2 text-center">
                    <span className="text-[10px] font-mono tracking-widest font-extrabold text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                      STEP {onboardingStep + 1} OF 3: PREFERENCE MATRIX
                    </span>
                    <h3 className="text-2xl font-black tracking-tight mt-3">Tailor Your Sphere</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Select options below so our recommendation engine can curate your view.
                    </p>
                  </div>

                  {formError && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-00 text-xs text-center">
                      {formError}
                    </div>
                  )}

                  <div className="space-y-6 py-2">
                    
                    {onboardingStep === 0 && (
                      <div className="space-y-4">
                        <label className={`block text-xs font-bold text-center ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}>Select Preferred Departments (Multiple)</label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {['Footwear', "Women's Fashion", "Men's Fashion", 'Electronics', 'Gaming', 'Books', 'Sports & Fitness'].map(dept => {
                            const isSel = preferredDepartments.includes(dept);
                            return (
                              <button
                                key={dept}
                                onClick={() => {
                                  if (isSel) {
                                    setPreferredDepartments(preferredDepartments.filter(d => d !== dept));
                                  } else {
                                    setPreferredDepartments([...preferredDepartments, dept]);
                                  }
                                }}
                                className={`p-3.5 rounded-xl border text-center font-bold tracking-tight transition cursor-pointer ${
                                  isSel 
                                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' 
                                  : isDarkMode 
                                    ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white' 
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-black'
                                }`}
                              >
                                {dept}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {onboardingStep === 1 && (
                      <div className="space-y-4 text-center">
                        <label className={`block text-xs font-bold ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}>Determine Your Styling Aesthetic</label>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          {[
                            { id: 'chic', name: 'Premium Chic', desc: 'Sarees, gold elements and jewelry sets' },
                            { id: 'minimal', name: 'Minimalist Modern', desc: 'Oxford collars, linen weaves' },
                            { id: 'classic', name: 'Classic Leisure', desc: 'Chino pants and canvas knits' },
                            { id: 'smart', name: 'Technical Smart', desc: 'Digital controllers, headsets' }
                          ].map(styleObj => (
                            <button
                              key={styleObj.id}
                              onClick={() => setPreferredStyle(styleObj.id as any)}
                              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer min-h-[90px] ${
                                preferredStyle === styleObj.id 
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                                : isDarkMode 
                                  ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900' 
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span className="font-extrabold text-xs">{styleObj.name}</span>
                              <span className={`text-[9px] opacity-80 mt-1 block leading-normal ${preferredStyle === styleObj.id ? 'text-slate-100' : 'text-slate-400'}`}>{styleObj.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {onboardingStep === 2 && (
                      <div className="space-y-4 text-center">
                        <label className={`block text-xs font-bold ${isDarkMode ? 'text-slate-350' : 'text-slate-700'}`}>Choose Your Client Avatar Profile Identifier</label>
                        <div className="flex justify-center gap-4 py-2">
                          {['🤵', '🛍️', '👟', '💍', '🎮', '🎧'].map(avatar => (
                            <button
                              key={avatar}
                              onClick={() => setOnboardingAvatar(avatar)}
                              className={`w-14 h-14 rounded-2xl text-2xl flex items-center justify-center border transition cursor-pointer hover:scale-105 duration-200 ${
                                onboardingAvatar === avatar 
                                ? 'bg-indigo-600 border-indigo-500 scale-105 shadow-md shadow-indigo-600/30' 
                                : isDarkMode 
                                  ? 'bg-slate-900 border-slate-800' 
                                  : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              {avatar}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="flex gap-3 pt-2">
                    {onboardingStep > 0 && (
                      <button
                        onClick={() => setOnboardingStep(onboardingStep - 1)}
                        className={`w-1/3 py-3.5 rounded-2xl font-bold text-xs border transition cursor-pointer ${
                          isDarkMode 
                          ? 'border-slate-800 text-slate-300 hover:bg-slate-900' 
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Back
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        if (onboardingStep < 2) {
                          if (onboardingStep === 0 && preferredDepartments.length === 0) {
                            setFormError('Please choose at least one category to sync catalog data.');
                            return;
                          }
                          setFormError(null);
                          setOnboardingStep(onboardingStep + 1);
                        } else {
                          handleOnboardingRegister();
                        }
                      }}
                      disabled={isLoading}
                      className={`flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-550 hover:to-purple-550 text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer`}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : onboardingStep === 2 ? (
                        <>
                          <span>Finalize Setup</span>
                          <Check className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>Continue Setup</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* FORGOT PASSWORD PANELS */}
              {mode === 'FORGOT_PASSWORD' && (
                <motion.div
                  key="forgot-pane"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2 text-center lg:text-left">
                    <span className="text-[10px] font-mono tracking-widest font-extrabold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 uppercase">
                      CREDENTIAL RECOVERY SHIELD
                    </span>
                    <h3 className="text-3xl font-black tracking-tight mt-3">Reset Passphrase</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Recover secure vault access mapping by verifying owner parameters.
                    </p>
                  </div>

                  {formError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-00 text-xs rounded-xl flex gap-1.5">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <form onSubmit={handleResetPasswordFlow} className="space-y-4 text-xs">
                    
                    {resetStep === 'EMAIL' && (
                      <div className="space-y-1.5">
                        <label className={`block font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Verify Account Email Address</label>
                        <div className="relative">
                          <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                          <input
                            type="email"
                            placeholder="rejitha2503@gmail.com"
                            value={emailInput}
                            onChange={e => setEmailInput(e.target.value)}
                            className={`w-full font-mono text-sm py-3 pl-11 pr-4 rounded-xl transition focus:outline-none border ${
                              isDarkMode 
                              ? 'bg-slate-900/60 border-slate-800 text-white focus:border-indigo-500 focus:bg-slate-900' 
                              : 'bg-slate-50 border-slate-200 text-slate-950 focus:border-indigo-600 focus:bg-white'
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    {resetStep === 'CODE' && (
                      <div className="space-y-4 text-center">
                        <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          A 6-digit dynamic key has been securely dispatched. Input the numeric codes to verify decryption:
                        </p>
                        <div className="flex justify-between gap-1.5 max-w-xs mx-auto">
                          {resetCode.map((pin, i) => (
                            <input
                              key={i}
                              type="text"
                              maxLength={1}
                              pattern="[0-9]*"
                              inputMode="numeric"
                              ref={el => { resetCodeRefs.current[i] = el; }}
                              value={pin}
                              onChange={(e) => handlePinInput(i, e.target.value, 'RESET')}
                              onKeyDown={(e) => handleBackspace(i, e, 'RESET')}
                              className={`w-11 h-12 text-center text-lg font-black font-mono rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ${
                                isDarkMode 
                                ? 'bg-slate-900 border-slate-800 text-indigo-400 focus:bg-slate-900' 
                                : 'bg-slate-50 border-slate-200 text-indigo-700 focus:bg-white'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {resetStep === 'NEW_PASSWORD' && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className={`block font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Draft New Secure Passphrase</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className={`w-full font-mono text-sm py-3 px-4 rounded-xl transition focus:outline-none border ${
                              isDarkMode 
                              ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500' 
                              : 'bg-slate-50 border-slate-200 text-slate-950 focus:border-indigo-600'
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className={`block font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Verify New Passphrase</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className={`w-full font-mono text-sm py-3 px-4 rounded-xl transition focus:outline-none border ${
                              isDarkMode 
                              ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500' 
                              : 'bg-slate-50 border-slate-200 text-slate-950 focus:border-indigo-600'
                            }`}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-550 hover:to-purple-550 text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing lookup data...</span>
                        </>
                      ) : showSuccessCheck ? (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <Check className="w-4 h-4" /> Passed Vault Verification
                        </div>
                      ) : (
                        <span>
                          {resetStep === 'EMAIL' && 'Generate Encryption Key reset'}
                          {resetStep === 'CODE' && 'Submit Verification Key'}
                          {resetStep === 'NEW_PASSWORD' && 'Commit New Keys'}
                        </span>
                      )}
                    </button>
                    
                  </form>

                  <div className="text-center">
                    <button
                      onClick={() => handleSwitchMode('LOGIN')}
                      className="text-xs font-bold text-slate-400 hover:text-indigo-400 hover:underline transition cursor-pointer"
                    >
                      Cancel Recovery Operations
                    </button>
                  </div>
                </motion.div>
              )}

              {/* OTP LOGIN PANELS */}
              {mode === 'OTP' && (
                <motion.div
                  key="otp-pane"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2 text-center lg:text-left">
                    <span className="text-[10px] font-mono tracking-widest font-extrabold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 uppercase">
                      DYNAMIC OTP SECURE SYSTEM
                    </span>
                    <h3 className="text-3xl font-black tracking-tight mt-3">OTP Authentication</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Access the secure RFP platform dynamically using one-time verification keys.
                    </p>
                  </div>

                  {formError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex gap-1.5">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {otpStep === 'REQUEST' ? (
                    <form onSubmit={triggerOtpRequest} className="space-y-4 text-xs">
                      <div className="space-y-1.5">
                        <label className={`block font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Verified Email or Phone Coordinate</label>
                        <div className="relative">
                          <Smartphone className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                          <input
                            type="text"
                            placeholder="rejitha2503@gmail.com or Mobile Number"
                            value={otpTarget}
                            onChange={e => setOtpTarget(e.target.value)}
                            className={`w-full font-mono text-sm py-3 pl-11 pr-4 rounded-xl transition focus:outline-none border ${
                              isDarkMode 
                              ? 'bg-slate-900/60 border-slate-800 text-white focus:border-indigo-500 focus:bg-slate-900' 
                              : 'bg-slate-50 border-slate-200 text-slate-950 focus:border-indigo-600 focus:bg-white'
                            }`}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-550 hover:to-purple-550 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Requesting OTP Key...</span>
                          </>
                        ) : (
                          <>
                            <span>Request Secured Dynamic OTP</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-5 text-xs">
                      <p className={`text-xs text-center ${isDarkMode ? 'text-slate-300' : 'text-slate-650'}`}>
                        Cryptography PIN codes dispatched to <strong className="font-mono text-indigo-400">{otpTarget}</strong>. Enter the keys below:
                      </p>
                      <div className="flex justify-between gap-1.5 max-w-xs mx-auto">
                        {otpArray.map((pin, i) => (
                          <input
                            key={i}
                            type="text"
                            maxLength={1}
                            pattern="[0-9]*"
                            inputMode="numeric"
                            ref={el => { otpRefs.current[i] = el; }}
                            value={pin}
                            onChange={(e) => handlePinInput(i, e.target.value, 'OTP')}
                            onKeyDown={(e) => handleBackspace(i, e, 'OTP')}
                            className={`w-11 h-12 text-center text-lg font-black font-mono rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ${
                              isDarkMode 
                              ? 'bg-slate-900 border-slate-800 text-indigo-400 focus:bg-slate-900' 
                              : 'bg-slate-50 border-slate-200 text-indigo-700 focus:bg-white'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-[11px] pt-1">
                        <button
                          onClick={() => {
                            setOtpStep('REQUEST');
                            setOtpArray(['', '', '', '', '', '']);
                          }}
                          className="text-slate-400 hover:text-white hover:underline transition cursor-pointer"
                        >
                          Request New Coordinates
                        </button>
                        <span className="text-slate-500 font-mono">Locks expire in 5:00</span>
                      </div>

                      <button
                        onClick={verifyOtpCode}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-550 hover:to-purple-550 text-white font-extrabold py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Verifying Credentials...</span>
                          </>
                        ) : showSuccessCheck ? (
                          <div className="flex items-center gap-2 text-emerald-400 font-bold">
                            <Check className="w-4 h-4" /> Secure Check Passed!
                          </div>
                        ) : (
                          <span>Submit OTP Credentials</span>
                        )}
                      </button>
                    </div>
                  )}

                  <div className="text-center">
                    <button
                      onClick={() => handleSwitchMode('LOGIN')}
                      className="text-xs font-bold text-slate-400 hover:text-indigo-400 transition cursor-pointer"
                    >
                      Return to Basic Logins
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </div>
        </div>

      </div>
    </div>
  );
}
