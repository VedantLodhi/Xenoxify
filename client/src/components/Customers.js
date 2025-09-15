import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Users, Mail, Phone, MapPin, Calendar, DollarSign, ShoppingBag, Eye, MoreVertical, ChevronLeft, ChevronRight, User, Star, TrendingUp, Clock } from 'lucide-react';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const Customers = () => {
  // State with proper initial values
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'total_spent', 'orders_count', 'join_date'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  // Fetch customers data
  const fetchCustomers = async (page = 1, limit = 20, search = '') => {
    try {
      setLoading(true);
      setError(null);

      // Make API call with correct base URL
      const response = await axios.get(`${API_BASE_URL}/api/shopify/customers`, {
        params: {
          page,
          limit,
          search
        }
      });

      // Handle response data with fallbacks
      const data = response.data || {};
      setCustomers(data.data || []);
      setPagination({
        page: data.page || 1,
        limit: data.limit || 20,
        total: data.total || 0,
        totalPages: data.totalPages || 1
      });

      console.log('Customers loaded successfully');
    } catch (error) {
      console.error('Customers fetch error:', error);
      setError('Failed to load customers. Please check if the server is running.');
      
      // Set empty state on error
      setCustomers([]);
      setPagination({
        page: 1,
        limit: 20,
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
      fetchCustomers(newPage, pagination.limit, searchTerm);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers(1, pagination.limit, searchTerm);
  };

  // Initial load
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Helper function to get customer initials
  const getCustomerInitials = (customer) => {
    const name = customer.name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim();
    if (!name || name === 'N/A') return 'U';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return numAmount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  // Helper function to get customer status
  const getCustomerStatus = (customer) => {
    const totalSpent = parseFloat(customer.total_spent) || 0;
    const ordersCount = customer.orders_count || 0;
    
    if (totalSpent > 10000) return { label: 'VIP', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    if (totalSpent > 5000) return { label: 'Premium', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (ordersCount > 5) return { label: 'Regular', color: 'bg-green-100 text-green-800 border-green-200' };
    if (ordersCount > 0) return { label: 'New', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { label: 'Prospect', color: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  // Helper function to get customer avatar color
  const getAvatarColor = (customer) => {
    const name = customer.name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim();
    if (!name || name === 'N/A') return 'from-blue-500 to-blue-600';
    
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const colors = [
      'from-red-500 to-red-600',
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-yellow-500 to-yellow-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-orange-500 to-orange-600'
    ];
    
    return colors[Math.abs(hash) % colors.length];
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
          
          {/* Customer Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Customers</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => fetchCustomers()}
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
              <h1 className="text-3xl font-bold text-white">Customers</h1>
              <p className="text-gray-300 mt-1">
                Manage your customer relationships and insights
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
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
                </div>
        </form>
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'cards' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Users className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'table' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Filter className="w-5 h-5" />
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
                  <span className="text-sm font-medium text-gray-600">Total Customers</span>
                  <span className="text-lg font-semibold text-gray-900">{pagination.total}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600">VIP Customers</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {customers.filter(c => (parseFloat(c.total_spent) || 0) > 10000).length}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600">New This Month</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {customers.filter(c => {
                      const joinDate = new Date(c.joinDate || c.created_at);
                      const monthAgo = new Date();
                      monthAgo.setMonth(monthAgo.getMonth() - 1);
                      return joinDate > monthAgo;
                    }).length}
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
                  <option value="total_spent">Sort by Total Spent</option>
                  <option value="orders_count">Sort by Orders</option>
                  <option value="join_date">Sort by Join Date</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <TrendingUp className={`w-4 h-4 transform transition-transform duration-200 ${
                    sortOrder === 'desc' ? 'rotate-180' : ''
                  }`} />
                </button>
              </div>
            </div>
          </div>
      </div>

        {/* Customers Section */}
        {customers && customers.length > 0 ? (
          <div>
            {viewMode === 'cards' ? (
              /* Cards View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {customers.map((customer, index) => {
                  const status = getCustomerStatus(customer);
                  const customerName = customer.name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown Customer';
                  
                  return (
                    <div 
                      key={customer.id || index} 
                      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 group p-6"
                    >
                      {/* Customer Header */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${getAvatarColor(customer)} rounded-full flex items-center justify-center text-white font-semibold text-lg`}>
                          {getCustomerInitials(customer)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-lg truncate group-hover:text-blue-600 transition-colors duration-200">
                            {customerName}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Customer Info */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{customer.email || 'N/A'}</span>
                        </div>
                        
                        {customer.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{customer.phone}</span>
                          </div>
                        )}
                        
                        {customer.default_address && (
                          <div className="flex items-start space-x-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span className="truncate">
                              {customer.default_address.city}, {customer.default_address.zip}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Customer Stats */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                              <ShoppingBag className="w-4 h-4" />
                              <span className="text-xs font-medium">Orders</span>
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                              {customer.orders_count || 0}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 text-gray-600 mb-1">
                              <DollarSign className="w-4 h-4" />
                              <span className="text-xs font-medium">Spent</span>
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                              {formatCurrency(customer.total_spent)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Joined {formatDate(customer.joinDate || customer.created_at)}</span>
                          </div>
                          <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Table View */
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Orders
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Spent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Join Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                  </tr>
                </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers.map((customer, index) => {
                        const status = getCustomerStatus(customer);
                        const customerName = customer.name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown Customer';
                        
                        return (
                          <tr key={customer.id || index} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarColor(customer)} rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3`}>
                                  {getCustomerInitials(customer)}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{customerName}</div>
                                  <div className="text-sm text-gray-500">ID: {customer.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{customer.email || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{customer.phone || 'No phone'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-900">
                                <ShoppingBag className="w-4 h-4 mr-1" />
                                {customer.orders_count || 0}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-gray-900">
                                {formatCurrency(customer.total_spent)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(customer.joinDate || customer.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                    </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
              </div>
            )}
            
            {/* Pagination */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
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
          // No Customers State
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Customers Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? `No customers match "${searchTerm}"` : 'You don\'t have any customers yet.'}
            </p>
            <button 
              onClick={() => fetchCustomers()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {searchTerm ? 'Clear Search' : 'Refresh Customers'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
