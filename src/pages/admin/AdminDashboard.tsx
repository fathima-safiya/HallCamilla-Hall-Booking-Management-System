import { useBookings } from '../../hooks/useBookings';
import { useHalls } from '../../hooks/useHalls';
import { useApp } from '../../context/AppContext';
import { useCatalog } from '../../hooks/useCatalog';
import { 
  CheckCircle, 
  XCircle,
  FileText,
  Users,
  Calendar,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useMemo } from 'react';
import { ADMIN_EMAILS } from '../../lib/firebase';
import { format, parseISO } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#064e3b', '#b45309', '#1e3a8a', '#991b1b', '#4c1d95'];

export default function AdminDashboard() {
  const { bookings, updateStatus } = useBookings();
  const { halls } = useHalls();
  const { customers } = useApp();
  const { packages } = useCatalog();
  const { showToast } = useToast();


  // Aggregations
  const totalRevenue = useMemo(() => {
    return bookings
      .filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'COMPLETED')
      .reduce((sum, b) => sum + b.totalAmount, 0);
  }, [bookings]);

  const pendingPayments = useMemo(() => {
    return bookings
      .filter(b => b.paymentStatus === 'PENDING')
      .reduce((sum, b) => sum + b.totalAmount, 0);
  }, [bookings]);

  const pendingBookings = bookings.filter(b => b.bookingStatus === 'PENDING');

  // Analytics Data
  const monthlyRevenueData = useMemo(() => {
    const data: Record<string, number> = {};
    bookings
      .filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'COMPLETED')
      .forEach(b => {
        try {
          const month = format(parseISO(b.createdAt), 'MMM yyyy');
          data[month] = (data[month] || 0) + b.totalAmount;
        } catch { /* ignore invalid dates */ }
      });
    return Object.entries(data).map(([name, amount]) => ({ name, amount }));
  }, [bookings]);

  const bookingStatusData = useMemo(() => {
    const counts = { PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0 };
    bookings.forEach(b => {
      if (counts[b.bookingStatus as keyof typeof counts] !== undefined) {
        counts[b.bookingStatus as keyof typeof counts]++;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
  }, [bookings]);

  const popularHallsData = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach(b => {
      counts[b.hallId] = (counts[b.hallId] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([hallId, count]) => {
        const hall = halls.find(h => h.id === hallId);
        return { name: hall ? hall.hallName : hallId, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [bookings, halls]);

  const popularPackagesData = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach(b => {
      if (b.packageId) {
        counts[b.packageId] = (counts[b.packageId] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([packageId, count]) => {
        const pkg = packages.find(p => p.id === packageId);
        return { name: pkg ? pkg.packageName : packageId, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [bookings, packages]);

  const handleApprove = async (id: string) => {
    try {
      await updateStatus(id, 'CONFIRMED');
      showToast('Booking approved successfully.');
    } catch {
      showToast('Failed to approve booking.', 'error');
    }
  };
  const handleCancel = async (id: string) => {
    try {
      await updateStatus(id, 'CANCELLED');
      showToast('Booking cancelled successfully.');
    } catch {
      showToast('Failed to cancel booking.', 'error');
    }
  };

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in w-full pb-12">
      
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-luxury-emerald-950">Dashboard Analytics</h1>
        <p className="text-stone-500 text-sm">Real-time performance reports and booking insights.</p>
      </div>

      {/* Grid Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        
        <div className="bg-white border border-stone-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden xl:col-span-2">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-luxury-gold-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2">Total Gross Revenue</p>
              <h3 className="font-serif text-2xl font-bold text-luxury-emerald-950">LKR {totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-luxury-gold-50 text-luxury-gold-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden xl:col-span-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2">Pending Payments</p>
              <h3 className="font-serif text-2xl font-bold text-amber-600">LKR {pendingPayments.toLocaleString()}</h3>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <CreditCard size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2">Total Bookings</p>
              <h3 className="font-serif text-2xl font-bold text-luxury-emerald-950">{bookings.length}</h3>
            </div>
            <div className="p-2 bg-stone-50 text-stone-500 rounded-lg"><Calendar size={18} /></div>
          </div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2">Customers</p>
              <h3 className="font-serif text-2xl font-bold text-luxury-emerald-950">
                {customers.filter(c => !ADMIN_EMAILS.includes((c.email || '').toLowerCase())).length}
              </h3>
            </div>
            <div className="p-2 bg-stone-50 text-stone-500 rounded-lg"><Users size={18} /></div>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Revenue Chart */}
        <div className="bg-white border border-stone-200/80 rounded-xl p-6 shadow-sm">
          <h4 className="font-serif text-lg font-bold text-luxury-emerald-950 mb-6">Monthly Revenue</h4>
          <div className="h-72 w-full">
            {monthlyRevenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `LKR ${(val / 1000)}k`} />
                  <Tooltip 
                    cursor={{ fill: '#f3f4f6' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`LKR ${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="amount" fill="#064e3b" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-400 text-sm">No revenue data available</div>
            )}
          </div>
        </div>

        {/* Booking Status Chart */}
        <div className="bg-white border border-stone-200/80 rounded-xl p-6 shadow-sm">
          <h4 className="font-serif text-lg font-bold text-luxury-emerald-950 mb-6">Booking Status Distribution</h4>
          <div className="h-72 w-full">
            {bookingStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-stone-400 text-sm">No booking data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Popular Rankings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-stone-200/80 rounded-xl p-6 shadow-sm">
          <h4 className="font-serif text-lg font-bold text-luxury-emerald-950 mb-6">Most Popular Halls</h4>
          <div className="space-y-4">
            {popularHallsData.length > 0 ? (
              popularHallsData.map((hall, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-luxury-gold-100 text-luxury-gold-700 flex items-center justify-center font-bold text-xs">
                      #{idx + 1}
                    </div>
                    <span className="font-bold text-stone-700 text-sm">{hall.name}</span>
                  </div>
                  <span className="text-xs font-bold text-luxury-emerald-900 bg-luxury-emerald-100 px-2 py-1 rounded">
                    {hall.count} Bookings
                  </span>
                </div>
              ))
            ) : (
              <div className="text-stone-400 text-sm py-4">No hall booking data available</div>
            )}
          </div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-xl p-6 shadow-sm">
          <h4 className="font-serif text-lg font-bold text-luxury-emerald-950 mb-6">Most Popular Packages</h4>
          <div className="space-y-4">
            {popularPackagesData.length > 0 ? (
              popularPackagesData.map((pkg, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-xs">
                      #{idx + 1}
                    </div>
                    <span className="font-bold text-stone-700 text-sm">{pkg.name}</span>
                  </div>
                  <span className="text-xs font-bold text-luxury-emerald-900 bg-luxury-emerald-100 px-2 py-1 rounded">
                    {pkg.count} Bookings
                  </span>
                </div>
              ))
            ) : (
              <div className="text-stone-400 text-sm py-4">No package booking data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Action Drawer & Recent bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 border-t border-stone-200 pt-8">
        
        {/* Pending approvals drawer */}
        <div className="lg:col-span-6 bg-white border border-stone-200/80 rounded-xl p-6 shadow-sm">
          <h4 className="font-serif text-lg font-bold text-luxury-emerald-950 mb-6 flex items-center justify-between">
            <span>Pending Authorizations</span>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
              {pendingBookings.length} Action Needed
            </span>
          </h4>

          <div className="space-y-4">
            {pendingBookings.length > 0 ? (
              pendingBookings.map(b => (
                <div key={b.id} className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold text-luxury-gold-600">REF: {b.id}</span>
                      <span className="text-xs font-bold text-stone-800">{b.customerName}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-serif font-bold">{b.hallId}</p>
                    <p className="text-[10px] text-stone-400">Date: {b.eventDate} | Guest count: {b.guestCount}</p>
                    <p className="text-[11px] font-bold text-luxury-emerald-950">LKR {b.totalAmount.toLocaleString()}</p>
                    {b.externalServices && b.externalServices.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-stone-200">
                        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">External Services Requires Approval:</p>
                        <ul className="text-[10px] text-stone-600 space-y-0.5">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {b.externalServices.map((ext: any, idx: number) => (
                            <li key={idx} className="flex flex-col gap-0.5 border-b border-stone-200/50 pb-2 last:border-0 last:pb-0">
                              <div className="flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                                <span className="font-bold text-luxury-emerald-900">{ext.serviceName || ext}</span>
                              </div>
                              {ext.vendorName && (
                                <div className="pl-2">
                                  <span className="font-semibold">{ext.vendorName}</span>
                                  {ext.contactNumber && <span className="text-stone-500"> | {ext.contactNumber}</span>}
                                </div>
                              )}
                              <div className="pl-2 flex flex-wrap gap-x-2 text-stone-500 text-[9px]">
                                {ext.arrivalTime && <span>Arrival: {ext.arrivalTime}</span>}
                                {ext.numberOfStaff ? <span>Staff: {ext.numberOfStaff}</span> : null}
                              </div>
                              {ext.notes && <div className="pl-2 text-stone-400 italic text-[9px]">Note: {ext.notes}</div>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <button 
                      onClick={() => handleApprove(b.id)}
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                      title="Approve Booking"
                    >
                      <CheckCircle size={15} />
                    </button>
                    <button 
                      onClick={() => handleCancel(b.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                      title="Reject Booking"
                    >
                      <XCircle size={15} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-stone-400 text-xs">
                Excellent! All client authorizations have been completed.
              </div>
            )}
          </div>
        </div>

        {/* Recent booking logs */}
        <div className="lg:col-span-6 bg-white border border-stone-200/80 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-serif text-lg font-bold text-luxury-emerald-950">Recent System Activities</h4>
            <Link to="/admin/bookings" className="text-xs font-bold text-luxury-gold-600 hover:underline uppercase tracking-wider">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentBookings.map(b => (
              <div key={b.id} className="flex items-start space-x-3 text-xs border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                <div className="p-2 bg-stone-100 text-stone-500 rounded mt-0.5">
                  <FileText size={14} />
                </div>
                <div className="flex-grow">
                  <p className="text-stone-700">
                    Reservation <strong>{b.id}</strong> was registered by <strong className="text-stone-900">{b.customerName}</strong>.
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1 uppercase font-semibold">
                    {b.hallId} • Status: <span className={`font-bold ${
                      b.bookingStatus === 'CONFIRMED' ? 'text-emerald-700' : b.bookingStatus === 'PENDING' ? 'text-amber-600' : 'text-stone-500'
                    }`}>{b.bookingStatus}</span>
                  </p>
                </div>
                <span className="text-[9px] text-stone-400 font-mono">
                  {new Date(b.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
