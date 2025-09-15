import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Grid, List, Package, DollarSign, Hash, BarChart3, Eye, MoreVertical, ChevronLeft, ChevronRight, Loader2, Image as ImageIcon, Camera } from 'lucide-react';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const Products = () => {
  // State with proper initial values
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price', 'stock', 'status'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  // Fetch products data
  const fetchProducts = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true);
      setError(null);

      // Make API call with pagination and search
      const response = await axios.get(`${API_BASE_URL}/api/shopify/products`, {
        params: {
          page,
          limit,
          search
        }
      });

      // Handle response data with fallbacks
      const responseData = response.data || {};
      setProducts(responseData.data || []); // Correctly access the nested 'data' array
      setPagination({
        page: responseData.page || 1,
        limit: responseData.limit || 10,
        total: responseData.count || 0, // Use the 'count' property from the API response
        totalPages: responseData.totalPages || 1
      });

      console.log('Products loaded successfully');
    } catch (error) {
      console.error('Products fetch error:', error);
      setError('Failed to load products. Please check if the server is running.');
      
      // Set empty state on error
      setProducts([]);
      setPagination({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProducts(newPage, pagination.limit, searchTerm);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1, pagination.limit, searchTerm);
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper function to format price
  const formatPrice = (price) => {
    const numPrice = parseFloat(price) || 0;
    return numPrice.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  // Helper function to get product image
  const getProductImage = (product) => {
    // Try to get image from various possible fields
    const imageUrl = product?.images[0]?.src 
                    
    
    if (imageUrl) {
      return imageUrl;
    }
    
    // Return null to use placeholder
    return null;
  };

  // Helper function to get product initials for placeholder
  const getProductInitials = (productName) => {
    if (!productName) return 'P';
    const words = productName.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return productName.substring(0, 2).toUpperCase();
  };

  // Helper function to get brand color based on product name
  const getBrandColor = (productName) => {
    if (!productName) return 'from-blue-500 to-blue-600';
    
    const name = productName.toLowerCase();
    if (name.includes('adidas')) return 'from-red-500 to-red-600';
    if (name.includes('nike')) return 'from-black to-gray-800';
    if (name.includes('puma')) return 'from-orange-500 to-orange-600';
    if (name.includes('ceat')) return 'from-yellow-500 to-yellow-600';
    if (name.includes('mrf')) return 'from-green-500 to-green-600';
    if (name.includes('rcb')) return 'from-red-600 to-red-700';
    if (name.includes('indian')) return 'from-blue-600 to-blue-700';
    if (name.includes('cricket')) return 'from-green-600 to-green-700';
    if (name.includes('jersey')) return 'from-purple-500 to-purple-600';
    if (name.includes('shoe')) return 'from-gray-500 to-gray-600';
    if (name.includes('bat')) return 'from-amber-500 to-amber-600';
    
    return 'from-blue-500 to-blue-600';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded-lg w-48 mb-4 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-full max-w-md animate-pulse"></div>
          </div>
          
          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => fetchProducts()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Main gradient orbs with enhanced effects */}
        <div className="absolute -top-60 -right-60 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-60 -left-60 w-[700px] h-[700px] bg-gradient-to-r from-indigo-500/30 via-cyan-500/30 to-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating particles with glow effects */}
        <div className="absolute top-20 left-10 w-6 h-6 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-20 w-8 h-8 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-4 h-4 bg-indigo-400 rounded-full shadow-lg shadow-indigo-400/50 animate-bounce" style={{ animationDelay: '2s', animationDuration: '2.5s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-7 h-7 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        <div className="absolute top-60 left-1/2 w-5 h-5 bg-pink-400 rounded-full shadow-lg shadow-pink-400/50 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2.8s' }}></div>
        <div className="absolute bottom-60 right-1/3 w-6 h-6 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '3.2s' }}></div>
        
        {/* Animated wave patterns */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-500/10 to-transparent animate-pulse"></div>
        <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-purple-500/10 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Neon grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Glowing lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-pink-400/50 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Products</h1>
              <p className="text-gray-300 mt-1">
                Manage your product inventory and details
              </p>
            </div>
            
            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
                </div>
        </form>
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600">Total Products</span>
                  <span className="text-lg font-semibold text-gray-900">{pagination.total}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600">Active</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {products.filter(p => p.status?.toLowerCase() === 'active').length}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600">Draft</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {products.filter(p => p.status?.toLowerCase() === 'draft').length}
                  </span>
                </div>
              </div>
              
              {/* Sort Controls */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="stock">Sort by Stock</option>
                  <option value="status">Sort by Status</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <BarChart3 className={`w-4 h-4 transform transition-transform duration-200 ${
                    sortOrder === 'desc' ? 'rotate-180' : ''
                  }`} />
                </button>
              </div>
            </div>
          </div>
      </div>

        {/* Products Section */}
        {products && products.length > 0 ? (
          <div>
            {/* Products Grid/List */}
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
                : "space-y-4 mb-8"
            }>
              {products.map((product, index) => (
                <div 
                  key={product.id || index} 
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 group ${
                    viewMode === 'list' ? 'flex items-center p-6' : 'p-6'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <>
                      {/* Product Image */}
                      <div className="w-full h-48 rounded-lg mb-4 overflow-hidden group-hover:scale-105 transition-transform duration-200 relative">
                        {getProductImage(product) ? (
                          <img
                            src={getProductImage(product)}
                            alt={product.name || product.title || 'Product'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-full bg-gradient-to-br ${getBrandColor(product.name || product.title)} flex items-center justify-center ${
                            getProductImage(product) ? 'hidden' : 'flex'
                          }`}
                        >
                          <div className="text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                              <Package className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-white font-bold text-lg">
                              {getProductInitials(product.name || product.title)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Image overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="bg-white/90 rounded-full p-2">
                            <Camera className="w-5 h-5 text-gray-700" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                          {product.name || product.title || 'Unnamed Product'}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">
                            {formatPrice(product.variants[0].price)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                            {product.status || 'Unknown'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Hash className="w-4 h-4" />
                            <span>{product.sku || 'N/A'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4" />
                            <span>{product.stock || product.inventory || 0} in stock</span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-2">
                          <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200">
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    // List View
                    <>
                      <div className="w-16 h-16 rounded-lg mr-4 flex-shrink-0 overflow-hidden relative group">
                        {getProductImage(product) ? (
                          <img
                            src={getProductImage(product)}
                            alt={product.name || product.title || 'Product'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-full bg-gradient-to-br ${getBrandColor(product.name || product.title)} flex items-center justify-center ${
                            getProductImage(product) ? 'hidden' : 'flex'
                          }`}
                        >
                          <div className="text-center">
                            <Package className="w-6 h-6 text-white mb-1" />
                            <div className="text-white font-bold text-xs">
                              {getProductInitials(product.name || product.title)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 text-lg truncate group-hover:text-blue-600 transition-colors duration-200">
                            {product.name || product.title || 'Unnamed Product'}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                            {product.status || 'Unknown'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold text-lg">{formatPrice(product.price)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Hash className="w-4 h-4" />
                            <span>{product.sku || 'N/A'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BarChart3 className="w-4 h-4" />
                            <span>{product.stock || product.inventory || 0} in stock</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
                </div>
                
                <div className="flex items-center space-x-2">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
              </button>
              
                  <div className="flex items-center space-x-1">
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            pagination.page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
              
              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
              </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // No Products State
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? `No products match "${searchTerm}"` : 'You don\'t have any products yet.'}
            </p>
            <button 
              onClick={() => fetchProducts()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {searchTerm ? 'Clear Search' : 'Refresh Products'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
