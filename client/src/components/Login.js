import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Store, Mail, Key, Sparkles, ArrowRight, Shield, Zap, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [tenantId, setTenantId] = useState('dev-tenant-001');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if user is already logged in
    if (user) {
      navigate('/dashboard');
    }

    // Check for tenant parameter from OAuth callback
    const tenant = searchParams.get('tenant');
    if (tenant) {
      setTenantId(tenant);
    }
  }, [user, navigate, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !tenantId) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, tenantId);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleShopifyInstall = () => {
    const shop = prompt('Enter your Shopify store domain (e.g., mystore.myshopify.com):');
    if (shop) {
      window.location.href = `/auth/install?shop=${shop}`;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
              <Store className="h-10 w-10 text-white" />
            </div>
            <h1 className="mt-8 text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent drop-shadow-lg">
              🚀 Xenoxify
            </h1>
            <p className="mt-4 text-lg text-blue-100 font-medium">
              Multi-tenant Shopify analytics platform
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="flex items-center text-yellow-300">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="text-blue-200 text-sm">Trusted by 1000+ stores</span>
            </div>
          </div>
          
          {/* Glassmorphism Login Form */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back! 👋</h2>
              <p className="text-blue-100">Sign in to your analytics dashboard</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-white">
                  📧 Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-300 group-focus-within:text-white transition-colors duration-200" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="tenantId" className="block text-sm font-semibold text-white">
                  🔑 Tenant ID
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-blue-300 group-focus-within:text-white transition-colors duration-200" />
                  </div>
                  <input
                    id="tenantId"
                    name="tenantId"
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                    placeholder="Enter tenant ID"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                  />
                </div>
                <p className="text-xs text-blue-200 flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Get this from your Shopify app installation
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-white/70 font-medium">Or</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleShopifyInstall}
                  className="group w-full flex justify-center items-center py-4 px-6 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl backdrop-blur-sm hover:bg-white/20 hover:border-white/30 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <div className="flex items-center space-x-2">
                    <Store className="w-5 h-5" />
                    <span>Install from Shopify</span>
                    <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-blue-200 font-medium">Lightning Fast</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-blue-200 font-medium">Secure</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-blue-200 font-medium">Modern</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-blue-200 flex items-center justify-center space-x-2">
              <span>Need help?</span>
              <span className="text-white hover:text-blue-300 cursor-pointer transition-colors duration-200">Contact support</span>
              <span>or</span>
              <span className="text-white hover:text-blue-300 cursor-pointer transition-colors duration-200">check documentation</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

