import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const OrderCharts = ({ orders, topCustomers, summaryData }) => {
  // Process orders data for charts
  const processChartData = () => {
    // Status distribution
    const statusCount = {
      delivered: 0,
      shipped: 0,
      processing: 0,
      pending: 0,
      carseller: 0,
      refunded: 0
    };

    // Sales by date
    const salesByDate = {};
    
    // Payment status
    const paymentStatus = {
      paid: 0,
      pending: 0,
      refunded: 0
    };

    orders.forEach(order => {
      // Count status
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
      
      // Count payment status
      paymentStatus[order.payment] = (paymentStatus[order.payment] || 0) + 1;
      
      // Group by date
      const date = order.date;
      const amount = typeof order.amount === 'string' 
        ? parseFloat(order.amount.replace('$', '')) 
        : order.amount;
      salesByDate[date] = (salesByDate[date] || 0) + amount;
    });

    return { statusCount, salesByDate, paymentStatus };
  };

  const { statusCount, salesByDate, paymentStatus } = processChartData();

  // Status Distribution Chart
  const statusData = {
    labels: Object.keys(statusCount),
    datasets: [
      {
        label: 'Order Status',
        data: Object.values(statusCount),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Sales Over Time Chart
  const salesData = {
    labels: Object.keys(salesByDate),
    datasets: [
      {
        label: 'Sales ($)',
        data: Object.values(salesByDate),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  // Payment Status Chart
  const paymentData = {
    labels: Object.keys(paymentStatus),
    datasets: [
      {
        label: 'Payment Status',
        data: Object.values(paymentStatus),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Top Customers Chart
  const customerData = {
    labels: topCustomers.map(customer => customer.name),
    datasets: [
      {
        label: 'Revenue ($)',
        data: topCustomers.map(customer => customer.revenue),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="charts-container">
      <h2>Analytics Overview</h2>
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Order Status Distribution</h3>
          <Doughnut data={statusData} options={chartOptions} />
        </div>
        
        <div className="chart-card">
          <h3>Sales Over Time</h3>
          <Line data={salesData} options={chartOptions} />
        </div>
        
        <div className="chart-card">
          <h3>Payment Status</h3>
          <Bar data={paymentData} options={chartOptions} />
        </div>
        
        <div className="chart-card">
          <h3>Top Customers by Revenue</h3>
          <Bar data={customerData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default OrderCharts;