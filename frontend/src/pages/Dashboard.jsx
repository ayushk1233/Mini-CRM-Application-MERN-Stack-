import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pie, Bar, Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import api from "../api/axios";
import { pieChartOptions, barChartOptions, chartColors, leadStatuses } from "../config/chartConfig";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stats display helper
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toLocaleString() || '0';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [analyticsRes, customersRes, statsRes] = await Promise.all([
          api.get("/analytics/leads"),
          api.get("/customers?page=1&limit=5"), // Recent customers
          api.get("/analytics/stats") // Get overall stats
        ]);
        
        setAnalytics(analyticsRes.data.data);
        setCustomers(customersRes.data.data);
        setStats(statsRes.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare chart data
  const pieChartData = {
    labels: leadStatuses,
    datasets: [{
      data: analytics?.leadsByStatus.map(s => s.count) || [],
      backgroundColor: chartColors.pie
    }]
  };

  const barChartData = {
    labels: leadStatuses,
    datasets: [{
      data: analytics?.valueByStatus.map(s => s.totalValue) || [],
      backgroundColor: chartColors.bar
    }]
  };

  // Calculate totals
  const totalLeads = analytics?.leadsByStatus.reduce((acc, s) => acc + s.count, 0) || 0;
  const totalRevenue = analytics?.valueByStatus.reduce((acc, s) => acc + s.totalValue, 0) || 0;
  const averageDealSize = totalLeads > 0 ? totalRevenue / totalLeads : 0;

  // Loading and error states are handled in the main return

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dashboard Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">ClientSphere Dashboard</h1>
          <p className="text-gray-600">A clear view of your customers, leads, and business growth.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Total Customers Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalCustomers || 0}</p>
              </div>
            </div>
          </div>

          {/* Total Leads Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Leads</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalLeads || 0}</p>
              </div>
            </div>
          </div>

          {/* Converted Leads Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-full">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Converted Leads</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.convertedLeads || 0}</p>
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${formatNumber(stats?.totalConvertedValue || 0)}
                </p>
                <p className="text-sm text-green-600">
                  {stats?.conversionRate}% Conversion Rate
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Performance Charts */}
          <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lead Status Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Status Distribution</h3>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-500">Loading charts...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-red-500 flex items-center space-x-2">
                    <span>{error}</span>
                  </div>
                </div>
              ) : analytics ? (
                <div className="h-64">
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  No lead data available
                </div>
              )}
            </motion.div>

            {/* Revenue by Lead Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by Lead Status</h3>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-500">Loading charts...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-red-500 flex items-center space-x-2">
                    <span>{error}</span>
                  </div>
                </div>
              ) : analytics ? (
                <div className="h-64">
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  No revenue data available
                </div>
              )}
            </motion.div>

            {/* Monthly Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow p-6 lg:col-span-2"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Performance</h3>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-64 text-red-500">{error}</div>
              ) : (
                <div className="space-y-6">
                  {/* Revenue Progress */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Monthly Revenue Target</span>
                      <span className="text-sm font-medium text-blue-600">{stats?.monthlyTargetProgress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${stats?.monthlyTargetProgress || 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">${formatNumber(stats?.currentMonthRevenue || 0)}</span>
                      <span className="text-xs text-gray-500">Target: ${formatNumber(stats?.monthlyTarget || 0)}</span>
                    </div>
                  </div>

                  {/* Lead Conversion Progress */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Lead Conversion Rate</span>
                      <span className="text-sm font-medium text-green-600">{stats?.conversionRate || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${stats?.conversionRate || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Recent Customers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Recent Customers</h3>
              <Link to="/customers" className="text-sm text-blue-600 hover:text-blue-800">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-32 text-red-500">{error}</div>
              ) : customers.length > 0 ? (
                customers.map(customer => (
                  <motion.div
                    key={customer._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">{customer.name[0]?.toUpperCase()}</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.company}</p>
                      </div>
                    </div>
                    <Link 
                      to={`/customers/${customer._id}`}
                      className="text-sm text-indigo-600 hover:text-indigo-900 font-medium hover:underline"
                    >
                      View
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  No customers available
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
