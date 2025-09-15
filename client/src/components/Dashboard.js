import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Eye, 
  MoreVertical,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Zap,
  Star
} from 'lucide-react';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const Dashboard = () => {
  // State with proper initial values
  const [summaryData, setSummaryData] = useState({
    totalOrders: 10,
    totalRevenue: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    growthRate: 0,
    conversionRate: 0
  });



  const [topCustomers, setTopCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [chartData, setChartData] = useState({
    salesOverTime: [],
    orderStatusDistribution: [],
    paymentStatus: [],
    topCustomersByRevenue: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  // Generate realistic mock data
  // const generateMockData = () => {
  //   // Generate sales over time data
  //   const salesOverTime = [];
  //   const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  //   for (let i = days - 1; i >= 0; i--) {
  //     const date = new Date();
  //     date.setDate(date.getDate() - i);
  //     salesOverTime.push({
  //       date: date.toISOString().split('T')[0],
  //       sales: Math.floor(Math.random() * 300) + 150
  //     });
  //   }

  //   // Generate order status distribution
  //   const orderStatusDistribution = [
  //     { status: 'delivered', count: 45, color: '#10B981' },
  //     { status: 'shipped', count: 32, color: '#3B82F6' },
  //     { status: 'pending', count: 28, color: '#F59E0B' },
  //     { status: 'processing', count: 18, color: '#8B5CF6' },
  //     { status: 'cancelled', count: 12, color: '#EF4444' },
  //     { status: 'refunded', count: 8, color: '#F97316' }
  //   ];

  //   // Generate payment status data
  //   const paymentStatus = [
  //     { status: 'paid', count: 120, color: '#10B981' },
  //     { status: 'pending', count: 25, color: '#F59E0B' },
  //     { status: 'failed', count: 8, color: '#EF4444' },
  //     { status: 'refunded', count: 5, color: '#6B7280' }
  //   ];

  //   // Generate top customers data
  //   const topCustomersData = [
  //     { name: 'John Doe', revenue: 12500, orders: 25, avatar: 'JD' },
  //     { name: 'Jane Smith', revenue: 9800, orders: 20, avatar: 'JS' },
  //     { name: 'Mike Johnson', revenue: 8900, orders: 18, avatar: 'MJ' },
  //     { name: 'Sarah Wilson', revenue: 7500, orders: 15, avatar: 'SW' },
  //     { name: 'Tom Brown', revenue: 6200, orders: 12, avatar: 'TB' }
  //   ];

  //   // Generate recent orders
  //   const recentOrders = [
  //     { id: 'ORD-001', customer: 'John Doe', amount: 250, status: 'delivered', date: '2025-01-10' },
  //     { id: 'ORD-002', customer: 'Jane Smith', amount: 180, status: 'shipped', date: '2025-01-09' },
  //     { id: 'ORD-003', customer: 'Mike Johnson', amount: 320, status: 'pending', date: '2025-01-08' },
  //     { id: 'ORD-004', customer: 'Sarah Wilson', amount: 420, status: 'delivered', date: '2025-01-07' },
  //     { id: 'ORD-005', customer: 'Tom Brown', amount: 150, status: 'processing', date: '2025-01-06' }
  //   ];

  //   return {
  //     summaryData: {
  //       totalOrders: 150,
  //       totalRevenue: 45000,
  //       totalCustomers: 89,
  //       averageOrderValue: 300,
  //       growthRate: 12.5,
  //       conversionRate: 3.2
  //     },
  //     topCustomers: topCustomersData,
  //     orders: recentOrders,
  //     chartData: {
  //       salesOverTime,
  //       orderStatusDistribution,
  //       paymentStatus,
  //       topCustomersByRevenue: topCustomersData
  //     }
  //   };
  // };

  // Fetch dashboard data
  // const fetchDashboardData = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     // For now, use mock data. In production, replace with actual API calls
  //     const mockData = generateMockData();
      
  //     setSummaryData(mockData.summaryData);
  //     setTopCustomers(mockData.topCustomers);
  //     setOrders(mockData.orders);
  //     setChartData(mockData.chartData);

  //     console.log('Dashboard data loaded successfully');
  //   } catch (error) {
  //     console.error('Dashboard data fetch error:', error);
  //     setError('Failed to load dashboard data. Please check if the server is running.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
//  const fetchDashboardData = async () => {
//   try {
//     setLoading(true);
//     setError(null);

//     const res = await axios.get(`${API_BASE_URL}/api/shopify/dashboard`);
//     const result = res.data;
//     console.log("Dashboard API result:", result);


//     if (result.success && result.data) {
//       const apiSummary = result.data.summary;

//       setSummaryData({
//         totalOrders: apiSummary.totalOrders || 0,
//         totalRevenue: apiSummary.totalRevenue || 0,
//         totalCustomers: apiSummary.totalCustomers || 0,
//         averageOrderValue: apiSummary.avgOrderValue || 0,
//         growthRate: result.data.metrics?.growthRate || 0, 
//         conversionRate: result.data.metrics?.conversionRate || 0
//       });

//       setTopCustomers(
//         (result.data.topCustomers || []).map(c => ({
//           ...c,
//           revenue: c.total_spent || 0,
//           orders: c.orders_count || 0   // if API has it, otherwise 0
//           }))
//            );
//       setOrders(result.data.ordersByDate || []);
// setChartData({
//   salesOverTime: result.data.ordersByDate || [],
//   orderStatusDistribution: Object.entries(result.data.orderStatusCounts || {}).map(
//     ([status, count]) => ({ status, count })
//     ),
//   paymentStatus: [], // if backend doesn’t send, leave empty
//   topCustomersByRevenue: result.data.topCustomers || []
// });

//     }
//   } catch (error) {
//     console.error("Dashboard data fetch error:", error);
//     setError("Failed to load dashboard data.");
//   } finally {
//     setLoading(false);
//   }
// };



//   // useEffect(() => {
//   //   fetchDashboardData();
//   // }, [timeRange]);

// useEffect(() => {
//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`/api/dashboard?timeRange=${timeRange}`);
//       if (res.data.success) {
//         const dashboardData = res.data.data;

//         // ✅ Summary data
//         setSummaryData({
//           totalOrders: dashboardData.summary?.totalOrders || 0,
//           totalRevenue: dashboardData.summary?.totalRevenue || 0,
//           totalCustomers: dashboardData.summary?.totalCustomers || 0,
//           averageOrderValue: dashboardData.summary?.avgOrderValue || 0,
//           growthRate: dashboardData.summary?.growthRate || 0,
//           conversionRate: dashboardData.metrics?.conversionRate || 0
//         });

//         // ✅ Top customers
//         setTopCustomers(dashboardData.topCustomers || []);

//         // ✅ Orders list
//         setOrders(dashboardData.recentOrders || []);

//         // ✅ Chart Data
//         setChartData({
//           salesOverTime: dashboardData.ordersByDate || [], // line chart
//           orderStatusDistribution: Object.entries(dashboardData.orderStatusCounts || {}).map(
//             ([status, count]) => ({ name: status, value: count })
//           ), // pie chart
//           paymentStatus: [], // agar API me hai to map karna hoga
//           topCustomersByRevenue: (dashboardData.topCustomers || []).map(cust => ({
//             name: cust.name,
//             value: cust.totalSpent
//           }))
//         });
//       }
//     } catch (err) {
//       console.error("Error fetching dashboard data:", err);
//       setError("Failed to fetch dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchDashboardData();
// }, [timeRange]);

// 🟢 Fetch dashboard data from API
const fetchDashboardData = async () => {
  try {
    setLoading(true);
    setError(null);

    const res = await axios.get(`${API_BASE_URL}/api/shopify/dashboard?timeRange=${timeRange}`);
    if (res.data.success && res.data.data) {
      const data = res.data.data;

      // ✅ Summary Data
      setSummaryData({
        totalOrders: data.summary?.totalOrders || 0,
        totalRevenue: data.summary?.totalRevenue || 0,
        totalCustomers: data.summary?.totalCustomers || 0,
        averageOrderValue: data.summary?.avgOrderValue || 0,
        growthRate: data.metrics?.growthRate || 0,
        conversionRate: data.metrics?.conversionRate || 0
      });

      // ✅ Top Customers
      setTopCustomers(
        (data.topCustomers || []).map(c => ({
          ...c,
          revenue: c.total_spent || 0,
          orders: c.orders_count || 0
        }))
      );

      // ✅ Orders list (recent orders)
      setOrders(data.recentOrders || []);

      // ✅ Chart Data
      setChartData({
        salesOverTime: data.ordersByDate || [], // Line chart
        orderStatusDistribution: Object.entries(data.orderStatusCounts || {}).map(
          ([status, count]) => ({ status, count })
        ), // Pie chart
        paymentStatus: [], // add mapping if API gives payment status
        topCustomersByRevenue: (data.topCustomers || []).map(cust => ({
          name: cust.first_name || cust.name || "Unknown",
          value: cust.total_spent || 0
        }))
      });
    }
  } catch (err) {
    console.error("Dashboard data fetch error:", err);
    setError("Failed to load dashboard data.");
  } finally {
    setLoading(false);
  }
};

// 🟢 Fetch on load + whenever timeRange changes
useEffect(() => {
  fetchDashboardData();
}, [timeRange]);



  // Helper functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'bg-green-100 text-green-800 border-green-200',
      shipped: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // const getCustomerInitials = (name) => {
  //   return name.split(' ').map(n => n[0]).join('').toUpperCase();
  // };
  function getCustomerInitials(name, first_name, last_name) {
  if (name) {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  }
  const first = first_name?.[0] || "";
  const last = last_name?.[0] || "";
  return (first + last).toUpperCase();
}
  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 w-full">
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

        <div className="relative z-10 max-w-7xl mx-auto p-2 sm:p-4 space-y-3">
          {/* Header Skeleton */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="space-y-2">
                <div className="h-8 bg-white/30 rounded-xl w-48 animate-pulse"></div>
                <div className="h-5 bg-white/30 rounded-lg w-64 animate-pulse"></div>
              </div>
              <div className="h-10 bg-white/30 rounded-xl w-40 animate-pulse"></div>
            </div>
          </div>
          
          {/* Metrics Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 animate-pulse">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-2">
                    <div className="h-4 bg-white/30 rounded w-24"></div>
                    <div className="h-8 bg-white/30 rounded w-20"></div>
                  </div>
                  <div className="w-14 h-14 bg-white/30 rounded-2xl"></div>
                </div>
                <div className="h-8 bg-white/30 rounded-full w-24"></div>
              </div>
            ))}
          </div>
          
          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-white/30 rounded w-32"></div>
                  <div className="w-10 h-10 bg-white/30 rounded-xl"></div>
                </div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-12 bg-white/30 rounded-xl"></div>
                  ))}
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
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-6">
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

        <div className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Oops! Something went wrong</h2>
          <p className="text-blue-200 mb-8 leading-relaxed">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 w-full">
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        {/* Header Section */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent drop-shadow-lg">
                🚀 Dashboard
              </h1>
              <p className="text-lg text-blue-100">Welcome back! Here's your analytics overview</p>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <Calendar className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">Time Range:</span>
              </div>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border-2 border-white/30 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 bg-white/10 backdrop-blur-sm font-medium transition-all duration-200 hover:bg-white/20 text-white"
              >
                <option value="7d" className="bg-gray-800 text-white">Last 7 days</option>
                <option value="30d" className="bg-gray-800 text-white">Last 30 days</option>
                <option value="90d" className="bg-gray-800 text-white">Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Total Orders */}
          <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 text-white">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">📦 Total Orders</p>
                <p className="text-3xl font-bold text-white">{summaryData.totalOrders.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-300 transition-all duration-300">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <TrendingUp className="w-4 h-4 text-white mr-1" />
                <span className="text-sm font-semibold text-white">+{summaryData.growthRate}%</span>
              </div>
              <span className="text-xs text-blue-100">vs last period</span>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 text-white">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">💰 Total Revenue</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(summaryData.totalRevenue)}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-green-300 transition-all duration-300">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <TrendingUp className="w-4 h-4 text-white mr-1" />
                <span className="text-sm font-semibold text-white">+8.2%</span>
              </div>
              <span className="text-xs text-green-100">vs last period</span>
            </div>
          </div>

          {/* Total Customers */}
          <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 text-white">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-purple-100 uppercase tracking-wide">👥 Total Customers</p>
                <p className="text-3xl font-bold text-white">{summaryData.totalCustomers.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-300 transition-all duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <TrendingUp className="w-4 h-4 text-white mr-1" />
                <span className="text-sm font-semibold text-white">+5.1%</span>
              </div>
              <span className="text-xs text-purple-100">vs last period</span>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 text-white">
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-orange-100 uppercase tracking-wide">🎯 Avg Order Value</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(summaryData.averageOrderValue)}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-orange-300 transition-all duration-300">
                <Target className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <TrendingDown className="w-4 h-4 text-white mr-1" />
                <span className="text-sm font-semibold text-white">-2.1%</span>
              </div>
              <span className="text-xs text-orange-100">vs last period</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Order Status Distribution */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">📊 Order Status</h3>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="space-y-3">
              {chartData.orderStatusDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors duration-200 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-semibold text-white capitalize">{item.status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-white">{item.count}</span>
                    <div className="w-16 bg-white/20 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500" 
                        style={{ 
                          backgroundColor: item.color,
                          width: `${(item.count / 50) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Over Time */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">📈 Sales Trend</h3>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="space-y-3">
              {chartData.salesOverTime.slice(-5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors duration-200 border border-white/20">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span className="text-xs text-blue-200">{new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-white/20 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${(item.sales / 500) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-white min-w-[60px] text-right">${item.sales}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Status */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">💳 Payment Status</h3>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="space-y-3">
              {chartData.paymentStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors duration-200 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-semibold text-white capitalize">{item.status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-white">{item.count}</span>
                    <div className="w-16 bg-white/20 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500" 
                        style={{ 
                          backgroundColor: item.color,
                          width: `${(item.count / 130) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Customers by Revenue */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">⭐ Top Customers</h3>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
              <button className="text-blue-200 hover:text-white font-semibold text-sm flex items-center transition-colors duration-200">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {chartData.topCustomersByRevenue.map((customer, index) => (
              <div key={index} className="group flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20">
                <div className="flex items-center space-x-5">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-indigo-200 transition-all duration-300">
                      {customer.avatar}
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">#{index + 1}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{customer.name}</p>
                    <p className="text-sm text-blue-200 font-medium">{customer.orders} orders • Top Customer</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-xl">{formatCurrency(customer.revenue)}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-32 bg-white/20 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-indigo-400 to-purple-600 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${(customer.revenue / 15000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-blue-200 font-medium">{Math.round((customer.revenue / 15000) * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">🛒 Recent Orders</h3>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <button className="text-blue-200 hover:text-white font-semibold text-sm flex items-center transition-colors duration-200">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/20">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/20">
                <thead className="bg-white/10 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/5 backdrop-blur-sm divide-y divide-white/20">
                  {orders.map((order, index) => (
                    <tr key={index} className="hover:bg-white/10 transition-all duration-200 group">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-xs font-bold text-white">#{index + 1}</span>
                          </div>
                          <span className="text-sm font-bold text-white">{order.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-bold text-white">{getCustomerInitials(order.customer)}</span>
                          </div>
                          <span className="text-sm font-semibold text-white">{order.customer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white">{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span className="text-xs text-blue-200">{new Date(order.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-lg font-bold text-white">{formatCurrency(order.amount)}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <button className="group-hover:bg-white/20 p-2 rounded-xl transition-all duration-200 hover:bg-white/30">
                          <Eye className="w-5 h-5 text-white" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};





export default Dashboard;
