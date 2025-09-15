import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Eye, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  User,
  DollarSign,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  Download,
  RefreshCw
} from 'lucide-react';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// A custom hook for debouncing input
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('processedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('table');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page, limit: pagination.limit, search: debouncedSearchTerm,
        status: statusFilter, sortBy, sortOrder
      };
      const response = await axios.get(`${API_BASE_URL}/api/shopify/orders`, { params });

      // --- THE FIX IS HERE ---
      // 1. Directly access the array from `response.data.data`
      const ordersFromApi = response.data.data || [];
      // 2. Get the total count from `response.data.count` for pagination
      const totalOrders = response.data.count || 0;
      
      const transformedOrders = ordersFromApi.map(order => ({
        id: order.name,
        customer: `${order.customer?.firstName || ''} ${order.customer?.lastName || 'N/A'}`.trim(),
        customerEmail: order.customer?.email || 'No email',
        date: order.processedAt,
        amount: parseFloat(order.totalPriceSet.shopMoney.amount),
        status: mapFulfillmentStatus(order.displayFulfillmentStatus),
        paymentStatus: mapFinancialStatus(order.displayFinancialStatus),
        items: order.lineItems.edges.reduce((sum, item) => sum + item.node.quantity, 0),
      }));

      setOrders(transformedOrders);
      setPagination(prev => ({
        ...prev,
        total: totalOrders,
        totalPages: Math.ceil(totalOrders / prev.limit)
      }));

    } catch (err) {
      console.error('Orders fetch error:', err);
      setError('Failed to load orders. Please try again.');
      setOrders([]);
      setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearchTerm, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  // All other functions (handlers, helpers, etc.) remain the same
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) setPagination(p => ({ ...p, page: newPage }));
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination(p => ({ ...p, page: 1 }));
  };
  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPagination(p => ({ ...p, page: 1 }));
  };
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
    setPagination(p => ({ ...p, page: 1 }));
  };
  const mapFulfillmentStatus = (status) => {
    const statusMap = { 'FULFILLED': 'shipped', 'UNFULFILLED': 'processing', 'PARTIALLY_FULFILLED': 'processing' };
    return statusMap[status] || 'pending';
  };
  const mapFinancialStatus = (status) => {
    const statusMap = { 'PAID': 'paid', 'PENDING': 'pending', 'REFUNDED': 'refunded', 'VOIDED': 'cancelled' };
    return statusMap[status] || 'pending';
  };
  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const getStatusColor = (status) => ({
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200', processing: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200', delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200', refunded: 'bg-orange-100 text-orange-800 border-orange-200'
  }[status] || 'bg-gray-100 text-gray-800 border-gray-200');
  const getPaymentStatusColor = (status) => ({
    paid: 'bg-green-100 text-green-800 border-green-200', pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    failed: 'bg-red-100 text-red-800 border-red-200', refunded: 'bg-orange-100 text-orange-800 border-orange-200'
  }[status] || 'bg-gray-100 text-gray-800 border-gray-200');
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />; case 'shipped': return <Truck className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />; case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />; case 'refunded': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading && orders.length === 0) { /* Skeleton UI code */ }
  if (error) { /* Error UI code */ }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-60 -right-60 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-60 -left-60 w-[700px] h-[700px] bg-gradient-to-r from-indigo-500/30 via-cyan-500/30 to-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto p-6 relative z-10">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Orders Management</h1>
              <p className="text-gray-300 mt-1">Track and manage your orders</p>
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={fetchOrders} disabled={loading} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Search orders..." value={searchTerm} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"/>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select value={statusFilter} onChange={(e) => handleStatusChange(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-lg">
                  <option value="all">All Statuses</option> <option value="pending">Pending</option>
                  <option value="processing">Processing</option> <option value="shipped">Shipped</option>
                  <option value="cancelled">Cancelled</option> <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {!loading && orders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900">No Orders Found</h3>
            <p className="text-gray-600">{debouncedSearchTerm ? `No orders match your search criteria.` : 'There are no orders to display.'}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                   <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className={`bg-white divide-y divide-gray-200 ${loading ? 'opacity-50' : ''}`}>
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.date)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.items}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(order.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}<span className="ml-1 capitalize">{order.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                           <span className="capitalize">{order.paymentStatus}</span>
                         </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-700"><Eye className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {pagination.total > 0 && (
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1 || loading}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button 
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages || loading}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;