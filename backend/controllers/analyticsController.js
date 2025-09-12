const Lead = require('../models/Lead');
const Customer = require('../models/Customer');
const User = require('../models/User');

// @desc    Get leads by status analytics
// @route   GET /api/analytics/leads-by-status
// @access  Private
const getLeadsByStatus = async (req, res) => {
  try {
    let query = {};
    
    // Role-based filtering
    if (req.user.role !== 'admin') {
      query.ownerId = req.user._id;
    }

    const leadsByStatus = await Lead.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          totalValue: 1,
          _id: 0
        }
      }
    ]);

    // Ensure all statuses are represented
    const allStatuses = ['New', 'Contacted', 'Converted', 'Lost'];
    const result = allStatuses.map(status => {
      const found = leadsByStatus.find(item => item.status === status);
      return {
        status,
        count: found?.count || 0,
        totalValue: found?.totalValue || 0
      };
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get overall statistics
// @route   GET /api/analytics/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    let customerQuery = {};
    let leadQuery = {};
    
    // Role-based filtering
    if (req.user.role !== 'admin') {
      customerQuery.ownerId = req.user._id;
      leadQuery.ownerId = req.user._id;
    }

    const [
      totalCustomers,
      totalLeads,
      convertedLeads,
      totalValue
    ] = await Promise.all([
      Customer.countDocuments(customerQuery),
      Lead.countDocuments(leadQuery),
      Lead.countDocuments({ ...leadQuery, status: 'Converted' }),
      Lead.aggregate([
        { $match: { ...leadQuery, status: 'Converted' } },
        { $group: { _id: null, total: { $sum: '$value' } } }
      ])
    ]);

    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalLeads,
        convertedLeads,
        conversionRate: parseFloat(conversionRate),
        totalConvertedValue: totalValue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  getLeadsByStatus,
  getStats
};