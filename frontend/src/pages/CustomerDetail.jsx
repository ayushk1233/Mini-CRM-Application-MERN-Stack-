import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import LeadForm from '../components/LeadForm';
import CustomerForm from '../components/CustomerForm';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State management
  const [customer, setCustomer] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  
  console.log('Fetched leads:', leads); // For debugging

  // Fetch functions
  const fetchCustomer = useCallback(async () => {
    try {
      const res = await axios.get(`/customers/${id}`);
      setCustomer(res.data.data);
    } catch (error) {
      console.error('Error fetching customer:', error);
      navigate('/customers');
    }
  }, [id, navigate]);

  const fetchLeads = useCallback(async () => {
    try {
      const url = statusFilter === 'all' 
        ? `/customers/${id}/leads`
        : `/customers/${id}/leads?status=${statusFilter}`;
      const res = await axios.get(url);
      console.log('Lead response:', res.data); // Debug log
      setLeads(res.data.data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  }, [id, statusFilter]);

  // Lead management functions
  const handleDeleteLead = async (leadId) => {
    if (user?.role !== 'admin') {
      toast.error('Only admins can delete leads');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await axios.delete(`/leads/${leadId}`);
        fetchLeads();
        toast.success('Lead deleted successfully');
      } catch (error) {
        console.error('Error deleting lead:', error);
        toast.error('Failed to delete lead');
      }
    }
  };

  // Using server-side filtering now
  const filteredLeads = leads;

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchCustomer(), fetchLeads()]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, statusFilter, fetchCustomer, fetchLeads]);

  if (loading || !customer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Customer Profile */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-blue-600">
                    {customer.name[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-semibold text-gray-900">{customer.name}</h2>
                  <p className="text-gray-500">{customer.company}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCustomerForm(true)}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    user?.role === 'admin'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
                  disabled={user?.role !== 'admin'}
                  title={user?.role !== 'admin' ? 'Only admins are allowed' : ''}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Customer
                </button>
                <button
                  onClick={() => {
                    setSelectedLead(null);
                    setShowLeadForm(true);
                  }}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    user?.role === 'admin'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
                  disabled={user?.role !== 'admin'}
                  title={user?.role !== 'admin' ? 'Only admins are allowed' : ''}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Lead
                </button>
              </div>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-gray-800">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {customer.email}
                  </div>
                  {customer.phone && (
                    <div className="flex items-center text-gray-800">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {customer.phone}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Additional Information</h3>
                <div className="mt-2 space-y-2">
                  {customer.address && (
                    <div className="text-gray-800">
                      <span className="font-medium">Address:</span> {customer.address}
                    </div>
                  )}
                  {customer.industry && (
                    <div className="text-gray-800">
                      <span className="font-medium">Industry:</span> {customer.industry}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Leads</h3>
            <div className="mt-4 flex space-x-2">
              {['all', 'New', 'Contacted', 'Qualified', 'Lost', 'Won'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusFilter === status
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <div key={lead._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{lead.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{lead.description}</p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                          lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                          lead.status === 'lost' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowLeadForm(true);
                        }}
                        disabled={user?.role !== 'admin'}
                        title={user?.role !== 'admin' ? 'Only admins are allowed' : ''}
                        className={`${
                          user?.role === 'admin'
                            ? 'text-blue-600 hover:text-blue-800'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead._id)}
                        disabled={user?.role !== 'admin'}
                        title={user?.role !== 'admin' ? 'Only admins are allowed' : ''}
                        className={`${
                          user?.role === 'admin'
                            ? 'text-red-600 hover:text-red-800'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {lead.value && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Value:</span>{' '}
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(lead.value)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Form Modal */}
        {showLeadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {selectedLead ? 'Edit Lead' : 'Add New Lead'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowLeadForm(false);
                      setSelectedLead(null);
                    }}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <LeadForm
                  customerId={id}
                  lead={selectedLead}
                  onClose={() => {
                    setShowLeadForm(false);
                    setSelectedLead(null);
                  }}
                  onSubmitSuccess={() => {
                    setShowLeadForm(false);
                    setSelectedLead(null);
                    fetchLeads();
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Customer Edit Form Modal */}
        {showCustomerForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Edit Customer Information
                  </h2>
                  <button
                    onClick={() => setShowCustomerForm(false)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <CustomerForm
                  customer={customer}
                  onClose={() => setShowCustomerForm(false)}
                  onSubmitSuccess={() => {
                    setShowCustomerForm(false);
                    fetchCustomer();
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default CustomerDetail;
