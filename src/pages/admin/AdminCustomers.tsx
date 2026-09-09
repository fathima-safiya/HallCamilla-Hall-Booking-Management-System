import React, { useState, useEffect } from 'react';
import { Search, Users, RefreshCw, Eye, Calendar, Mail, Phone } from 'lucide-react';
import { customerService } from '../../services/customerService';
import type { CustomerUser, Booking } from '../../types/app';
import CustomerDetailsCard from '../../components/admin/CustomerDetailsCard';
import { useToast } from '../../context/ToastContext';
import { ADMIN_EMAILS } from '../../lib/firebase';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-red-600 bg-red-50 rounded-xl m-10 border border-red-200">
          <h2 className="text-2xl font-bold mb-4">Something went wrong.</h2>
          <pre className="whitespace-pre-wrap font-mono text-sm">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AdminCustomersWrapper() {
  return (
    <ErrorBoundary>
      <AdminCustomers />
    </ErrorBoundary>
  );
}

function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(null);
  const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  const { showToast } = useToast();

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await customerService.getAllCustomers();
      // Filter out admin users from the customer directory
      const nonAdminCustomers = data.filter(c => !ADMIN_EMAILS.includes((c.email || '').toLowerCase()));
      // Sort by joinedDate descending (newest first)
      nonAdminCustomers.sort((a, b) => (b.joinedDate ? new Date(b.joinedDate).getTime() : 0) - (a.joinedDate ? new Date(a.joinedDate).getTime() : 0));
      setCustomers(nonAdminCustomers);
      setFilteredCustomers(nonAdminCustomers);
    } catch (error) {
      console.error('Failed to load customers:', error);
      showToast('Failed to load customers. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = customers.filter(c => {
      const nameMatch = String(c.name || '').toLowerCase().includes(term);
      const emailMatch = String(c.email || '').toLowerCase().includes(term);
      const phoneMatch = c.phone ? String(c.phone).toLowerCase().includes(term) : false;
      return nameMatch || emailMatch || phoneMatch;
    });
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const handleViewCustomer = async (customer: CustomerUser) => {
    setSelectedCustomer(customer);
    setIsLoadingBookings(true);
    try {
      const bookings = await customerService.getCustomerBookings(customer.email || '');
      setCustomerBookings(bookings);
    } catch (error) {
      console.error('Failed to load customer bookings:', error);
      showToast('Failed to load customer booking history.', 'error');
      setCustomerBookings([]);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setCustomerBookings([]);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-luxury-emerald-950">Customer Directory</h1>
          <p className="text-sm text-stone-500 mt-1">Manage and view registered customer details and their booking histories.</p>
        </div>
        <button 
          onClick={fetchCustomers}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50 hover:text-luxury-emerald-900 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          Refresh List
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-luxury-emerald-900/20 focus:border-luxury-emerald-900 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-stone-500 font-medium bg-stone-50 px-4 py-2.5 rounded-lg border border-stone-200">
          <Users size={16} className="text-luxury-emerald-700" />
          <span>Total Customers: <strong className="text-luxury-emerald-950">{filteredCustomers.length}</strong></span>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-stone-500">
            <RefreshCw size={32} className="animate-spin mx-auto mb-4 text-luxury-emerald-700" />
            <p className="font-medium">Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            <Users size={48} className="mx-auto mb-4 text-stone-300" />
            <p className="text-lg font-medium text-stone-700">No customers found</p>
            <p className="text-sm mt-1">Try adjusting your search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs uppercase tracking-widest text-stone-500">
                  <th className="p-4 font-bold">Customer Name</th>
                  <th className="p-4 font-bold hidden md:table-cell">Contact Details</th>
                  <th className="p-4 font-bold hidden sm:table-cell">Registered Date</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id || customer.email || Math.random().toString()} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-luxury-emerald-50 text-luxury-emerald-900 flex items-center justify-center font-bold shadow-inner">
                          {String(customer.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-stone-800 text-sm">{customer.name || 'Unknown'}</p>
                          <p className="text-xs text-stone-500 md:hidden mt-0.5">{customer.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-stone-600">
                          <Mail size={14} className="text-stone-400" />
                          {customer.email || 'No email'}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-stone-600">
                            <Phone size={14} className="text-stone-400" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <Calendar size={14} className="text-stone-400" />
                        {customer.joinedDate ? new Date(customer.joinedDate).toLocaleDateString() : 'Unknown'}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleViewCustomer(customer)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-luxury-emerald-50 text-luxury-emerald-900 hover:bg-luxury-emerald-900 hover:text-luxury-gold-400 rounded text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                      >
                        <Eye size={14} />
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedCustomer && (
        <CustomerDetailsCard 
          customer={selectedCustomer} 
          bookings={customerBookings} 
          isLoadingBookings={isLoadingBookings}
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}
