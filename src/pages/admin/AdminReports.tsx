import { useState, useRef } from 'react';
import { Download, TrendingUp, PartyPopper, Briefcase, Cake, Award, Loader2, Sparkles, Users, Activity, CreditCard, XCircle } from 'lucide-react';
import { useReportData } from '../../hooks/useReportData';
import { format } from 'date-fns';
import { PrintableReportTemplate } from './components/PrintableReportTemplate';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export default function AdminReports() {
  const { data, loading } = useReportData();
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 text-stone-400">
        <Loader2 size={36} className="animate-spin text-luxury-emerald-700" />
        <p className="text-sm font-semibold">Generating reporting data…</p>
      </div>
    );
  }

  const exportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    
    try {
      const element = reportRef.current;
      
      // Use html-to-image which properly supports modern CSS like oklch (unlike html2canvas)
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        style: {
          transform: 'none', // Prevent any transforms from messing up the capture
        }
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      let heightLeft = pdfHeight;
      let position = 0;
      
      pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Camilla-Report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error("PDF Export failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in w-full pb-12">
      {/* Hidden PDF Template */}
      <div className="fixed left-[200vw] top-0 pointer-events-none w-[210mm] bg-white text-stone-900 font-sans p-8 print-container">
        <PrintableReportTemplate ref={reportRef} data={data} />
      </div>

      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-[0.1em] text-luxury-gold-600 mb-2">Management Dashboard</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-luxury-emerald-950">Professional Reports</h2>
        </div>
        <button 
          onClick={exportPDF}
          disabled={isExporting}
          className="flex items-center gap-2 bg-luxury-emerald-950 text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:shadow-lg hover:bg-luxury-emerald-900 transition-all active:scale-95 disabled:opacity-50"
        >
          {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {isExporting ? 'Generating PDF...' : 'Export Professional PDF'}
        </button>
      </header>

      {/* Section 1: Executive KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-0 animate-slide-up" style={{ animationDelay: '50ms', animationFillMode: 'forwards' }}>
        {[
          { label: 'Total Bookings', value: data.kpis.totalBookings, icon: <Briefcase size={20}/> },
          { label: 'Total Revenue', value: `LKR ${(data.kpis.totalRevenue / 1000000).toFixed(2)}M`, icon: <TrendingUp size={20}/> },
          { label: 'Total Customers', value: data.kpis.totalCustomers, icon: <Users size={20}/> },
          { label: 'Active Halls', value: data.kpis.activeHalls, icon: <Award size={20}/> },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-luxury-emerald-950">{kpi.value}</p>
            </div>
            <div className="text-luxury-gold-500 opacity-50 bg-luxury-gold-50 p-3 rounded-full">{kpi.icon}</div>
          </div>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Revenue Bar Chart */}
        <section className="lg:col-span-8 bg-white border border-luxury-gold-300 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-x-auto opacity-0 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <div className="flex justify-between items-center mb-8 min-w-[500px]">
            <h3 className="font-serif text-2xl font-bold text-luxury-emerald-950">Monthly Revenue</h3>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase text-stone-500 tracking-wider">
                <span className="w-3 h-3 bg-luxury-emerald-950 rounded-full"></span> {data.currentYear}
              </span>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 px-4 border-b border-stone-200/60 pb-2 min-w-[500px]">
            {data.monthlyRevenueFormatted.map((bar, i) => (
              <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                <div className="w-full bg-luxury-emerald-50 rounded-t-lg relative group h-[85%] cursor-pointer">
                  <div 
                    className="absolute bottom-0 w-full bg-luxury-emerald-950 rounded-t-lg group-hover:bg-luxury-gold-600 transition-colors" 
                    style={{ height: bar.height === '0%' ? '2px' : bar.height }}
                  ></div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    LKR {(bar.revenue / 1000000).toFixed(1)}M
                  </div>
                </div>
                <span className="mt-4 text-[10px] font-bold text-stone-400 tracking-wider">{bar.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Hall Utilization Donut */}
        <section className="lg:col-span-4 bg-white border border-luxury-gold-300 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col opacity-0 animate-slide-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <h3 className="font-serif text-2xl font-bold text-luxury-emerald-950 mb-8">Hall Preference</h3>
          <div className="flex-grow flex flex-col items-center justify-center relative">
            <div className="w-48 h-48 relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#f5f5f4" strokeWidth="4"></circle>
                {data.hallStats.map((hall, i) => {
                  const offset = data.hallStats.slice(0, i).reduce((acc, curr) => acc + curr.utilization, 0);
                  return (
                    <circle 
                      key={hall.id}
                      cx="18" cy="18" 
                      fill="transparent" 
                      r="15.915" 
                      stroke={i === 0 ? '#064e3b' : (i === 1 ? '#ca8a04' : '#2563eb')} 
                      strokeDasharray={`${hall.utilization} ${100 - hall.utilization}`} 
                      strokeDashoffset={100 - offset} 
                      strokeWidth="4"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif text-4xl font-bold text-luxury-emerald-950 leading-none">{data.hallStats[0]?.utilization || 0}%</span>
                <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider mt-1 text-center leading-tight w-24">Top Hall Share</span>
              </div>
            </div>
            
            <div className="mt-8 space-y-4 w-full">
              {data.hallStats.map((hall, i) => (
                <div key={hall.id} className="flex justify-between items-center px-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-luxury-emerald-950' : (i === 1 ? 'bg-luxury-gold-600' : 'bg-blue-600')}`}></span>
                    <span className="text-sm font-semibold text-stone-700 truncate max-w-[120px]">{hall.name}</span>
                  </div>
                  <span className="text-sm font-bold text-luxury-emerald-950">{hall.utilization}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Booking Trends Area Chart */}
        <section className="lg:col-span-7 bg-white border border-luxury-gold-300 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 opacity-0 animate-slide-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-serif text-2xl font-bold text-luxury-emerald-950">Booking Trends</h3>
              <p className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">6-Month Volume Trend</p>
            </div>
            <span className="text-luxury-gold-600 flex items-center gap-1 font-bold">
              <TrendingUp size={18} />
              Verified
            </span>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-4 px-4 border-b border-stone-200/60 pb-2">
            {data.sixMonthTrendFormatted.map((trend, i) => (
              <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
                <div className="w-full flex justify-center h-[85%] items-end relative group">
                  <div 
                    className="w-full bg-luxury-gold-100 rounded-t-lg group-hover:bg-luxury-gold-200 transition-colors border-t-2 border-luxury-gold-500" 
                    style={{ height: trend.height === '0%' ? '2px' : trend.height }}
                  ></div>
                  <div className="absolute -top-10 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {trend.count} Bookings
                  </div>
                </div>
                <span className="mt-4 text-[10px] font-bold text-stone-400 tracking-wider">{trend.label}</span>
              </div>
            ))}
          </div>

        </section>

        {/* Top Performing Packages Table */}
        <section className="lg:col-span-5 bg-white border border-luxury-gold-300 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 opacity-0 animate-slide-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          <h3 className="font-serif text-2xl font-bold text-luxury-emerald-950 mb-6">Top Packages</h3>
          {data.topPackages.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-sm">No package data available yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="pb-3 text-[10px] uppercase font-bold text-stone-500 tracking-wider">Package</th>
                    <th className="pb-3 text-[10px] uppercase font-bold text-stone-500 tracking-wider text-right">Bookings</th>
                    <th className="pb-3 text-[10px] uppercase font-bold text-stone-500 tracking-wider text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {data.topPackages.slice(0, 5).map((pkg, i) => (
                    <tr key={pkg.id} className="group hover:bg-stone-50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-luxury-emerald-50 flex items-center justify-center text-luxury-gold-600 shrink-0">
                            {i === 0 ? <Award size={16} /> : (i === 1 ? <PartyPopper size={16} /> : <Briefcase size={16} />)}
                          </div>
                          <span className="font-semibold text-sm text-stone-800 line-clamp-1">{pkg.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-right text-sm font-medium text-stone-600">{pkg.count}</td>
                      <td className="py-4 text-right text-sm font-bold text-luxury-emerald-950 whitespace-nowrap">
                        LKR {(pkg.revenue / 1000000).toFixed(1)}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Extra Services & Business Insights Grid */}
        <section className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 opacity-0 animate-slide-up" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
          {/* Extra Services */}
          <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-luxury-emerald-950 mb-6 flex items-center gap-2">
              <Sparkles size={20} className="text-luxury-gold-500" /> Top Extra Services
            </h3>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="pb-3 text-[10px] uppercase font-bold text-stone-500 tracking-wider">Service Name</th>
                  <th className="pb-3 text-[10px] uppercase font-bold text-stone-500 tracking-wider text-right">Added</th>
                  <th className="pb-3 text-[10px] uppercase font-bold text-stone-500 tracking-wider text-right">Est. Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data.topServices.slice(0, 5).map((srv, i) => (
                  <tr key={i} className="hover:bg-stone-50">
                    <td className="py-3 font-medium text-sm text-stone-700">{srv.name}</td>
                    <td className="py-3 text-right text-sm">{srv.count}</td>
                    <td className="py-3 text-right text-sm font-bold text-luxury-emerald-950">LKR {srv.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payments & Cancellations */}
          <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-luxury-emerald-950 mb-6 flex items-center gap-2">
              <CreditCard size={20} className="text-luxury-gold-500" /> Payment & Cancellations
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-2">Payment Methods</h4>
                {data.paymentAnalysis.methods.map((m, i) => (
                  <div key={i} className="flex justify-between items-center text-sm py-1 border-b border-stone-50">
                    <span className="text-stone-700">{m.name}</span>
                    <span className="font-semibold text-luxury-emerald-950">LKR {(m.revenue/1000000).toFixed(1)}M</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold text-stone-500 tracking-wider mb-2">Cancellation Overview</h4>
                <div className="flex justify-between items-center text-sm py-1 border-b border-stone-50">
                  <span className="text-red-600 flex items-center gap-1"><XCircle size={14}/> Total Cancelled</span>
                  <span className="font-bold">{data.cancellationStats.total} Bookings</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Featured Analysis - AI Insights */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-luxury-emerald-950 rounded-2xl overflow-hidden relative min-h-[300px] mt-8 shadow-lg hover:shadow-xl transition-shadow duration-300 print:hidden opacity-0 animate-slide-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
        <div className="md:col-span-7 p-8 md:p-12 z-10 text-white relative">
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-luxury-gold-500 mb-4 flex items-center gap-2"><Activity size={14}/> Strategic Automated Insights</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Business Intelligence</h2>
          <ul className="space-y-3 mb-8">
            {data.insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-3 text-sm md:text-base text-luxury-emerald-100">
                <span className="text-luxury-gold-500 mt-0.5">✦</span>
                <span className="leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-5 absolute right-0 top-0 h-full w-full md:w-1/2 opacity-30 md:opacity-100 mix-blend-overlay md:mix-blend-normal">
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-emerald-950 to-transparent hidden md:block z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-luxury-emerald-950 via-luxury-emerald-950/20 to-transparent z-10"></div>
          <img 
            className="w-full h-full object-cover" 
            alt="Data Dashboard" 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80" 
          />
        </div>
      </section>
    </div>
  );
}
