import { useToast } from '../../context/ToastContext';
import { useState } from 'react';
import { PlusCircle, Utensils, Loader2, Trash2, Edit2, Package as PackageIcon, Upload } from 'lucide-react';
import { useCatalog } from '../../hooks/useCatalog';
import PackageForm from './components/PackageForm';
import ServiceForm from './components/ServiceForm';
import type { Package, Service } from '../../types/app';
import { ConfirmModal } from '../shared/components/ConfirmModal';
import { defaultServices } from '../../data/defaults';
import { seedDemoPackages } from '../../scripts/seedPackages';
import { seedDemoServices } from '../../scripts/seedServices';
import { getHotelServiceImage, getExactServiceImage } from '../../utils/imageUtils';

export default function AdminPackages() {
  const { showToast } = useToast();
  const { packages, services, catalogService, loading } = useCatalog();
  
  // Package Modal State
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isSeedingPackages, setIsSeedingPackages] = useState(false);

  // Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSeedingServices, setIsSeedingServices] = useState(false);

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'package' | 'service';
    id: string;
    name: string;
  } | null>(null);

  if (loading) {
    return (
      <div className="pt-32 pb-24 flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 text-luxury-emerald-900 animate-spin" />
      </div>
    );
  }

  // --- Package Handlers ---
  const handleSavePackage = async (pkgData: Omit<Package, 'id' | 'createdAt'> | Partial<Package>) => {
    try {
      if (editingPackage) {
        await catalogService.updatePackage(editingPackage.id, pkgData);
      } else {
        await catalogService.createPackage(pkgData as Omit<Package, 'id' | 'createdAt'>);
      }
      setIsPackageModalOpen(false);
      setEditingPackage(null);
      showToast('Package saved successfully.');
    } catch (error) {
      console.error("Failed to save package", error);
      showToast("Failed to save package. Please try again.", "error");
    }
  };

  const handleDeletePackage = (id: string, name: string) => {
    setDeleteConfirm({ type: 'package', id, name });
  };

  const openAddPackageModal = () => {
    setEditingPackage(null);
    setIsPackageModalOpen(true);
  };

  const openEditPackageModal = (pkg: Package) => {
    setEditingPackage(pkg);
    setIsPackageModalOpen(true);
  };

  const handleSeedPackages = async () => {
    setIsSeedingPackages(true);
    try {
      const result = await seedDemoPackages();
      showToast(result.message, result.success > 0 ? 'success' : 'info');
    } catch (error) {
      console.error('Failed to seed packages:', error);
      showToast('Failed to seed demo packages.', 'error');
    } finally {
      setIsSeedingPackages(false);
    }
  };

  // --- Service Handlers ---
  const handleSaveService = async (serviceData: Omit<Service, 'id'> | Partial<Service>) => {
    try {
      if (editingService) {
        await catalogService.updateService(editingService.id, serviceData);
      } else {
        await catalogService.createService(serviceData as Omit<Service, 'id'>);
      }
      setIsServiceModalOpen(false);
      setEditingService(null);
      showToast('Service saved successfully.');
    } catch (error) {
      console.error("Failed to save service", error);
      showToast("Failed to save service. Please try again.", "error");
    }
  };

  const handleDeleteService = (id: string, name: string) => {
    setDeleteConfirm({ type: 'service', id, name });
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    try {
      if (deleteConfirm.type === 'package') {
        await catalogService.deletePackage(deleteConfirm.id);
      } else {
        await catalogService.deleteService(deleteConfirm.id);
      }
      showToast(`${deleteConfirm.type === 'package' ? 'Package' : 'Service'} deleted successfully.`);
      setDeleteConfirm(null);
    } catch (error) {
      console.error(`Failed to delete ${deleteConfirm.type}`, error);
      showToast(`Failed to delete ${deleteConfirm.type}.`, "error");
    }
  };

  const openAddServiceModal = () => {
    setEditingService(null);
    setIsServiceModalOpen(true);
  };

  const openEditServiceModal = (service: Service) => {
    setEditingService(service);
    setIsServiceModalOpen(true);
  };

  const handleSeedServices = async () => {
    setIsSeedingServices(true);
    try {
      const result = await seedDemoServices();
      showToast(result.message, result.success ? 'success' : 'info');
    } catch (error) {
      console.error('Failed to seed services:', error);
      showToast('Failed to seed demo services.', 'error');
    } finally {
      setIsSeedingServices(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in w-full pb-12">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-luxury-gold-600 mb-2 block">Catalog Settings</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-luxury-emerald-950">Package Management</h2>
          <p className="text-stone-500 mt-2 max-w-2xl text-sm leading-relaxed">
            Manage your base package templates and extra services offered to customers.
          </p>
        </div>
      </header>

      {/* Package List Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <PackageIcon size={24} className="text-luxury-gold-600" />
            <h3 className="font-serif text-2xl font-bold text-luxury-emerald-950">Base Packages</h3>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={openAddPackageModal}
              className="bg-luxury-emerald-950 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-luxury-emerald-900 transition flex items-center gap-2 shadow-sm border border-luxury-gold-500/30"
            >
              <PlusCircle size={14} /> Add Package
            </button>
          </div>
        </div>

        {packages.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-xl p-12 text-center text-stone-500 shadow-sm">
            <PackageIcon size={48} className="mx-auto mb-4 text-stone-300" />
            <p className="text-sm">No base packages found. Click "Add Package" to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, i) => {
              const pricePerPerson = pkg.packagePrice / pkg.guestLimit;
              return (
              <div key={pkg.id} className="bg-white/80 backdrop-blur-md border border-stone-200/60 rounded-2xl flex flex-col shadow-xl shadow-stone-200/20 hover:shadow-2xl hover:shadow-stone-200/40 transition-all duration-300 relative overflow-hidden group">
                {/* Image Section */}
                <div className="h-48 bg-stone-100 relative overflow-hidden">
                  <img src={pkg.image || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80"} alt={pkg.packageName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={() => openEditPackageModal(pkg)}
                      className="bg-white/90 backdrop-blur text-luxury-emerald-950 p-2 rounded-lg hover:bg-white shadow-md transition-colors"
                      title="Edit Package"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeletePackage(pkg.id, pkg.packageName)}
                      className="bg-white/90 backdrop-blur text-red-600 p-2 rounded-lg hover:bg-white shadow-md transition-colors"
                      title="Delete Package"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Badges & Titles */}
                  <div className="absolute top-4 left-4">
                    {pkg.category && (
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm">
                        {pkg.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white drop-shadow-md">{pkg.packageName}</h3>
                    </div>
                  </div>
                </div>
                
                {/* Details Section */}
                <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-white to-stone-50/50">
                  <p className="text-sm text-stone-500 mb-4 flex-grow line-clamp-2 leading-relaxed">{pkg.notes}</p>
                  
                  {pkg.suitableFor && (
                    <div className="mb-4">
                      <span className="text-[10px] uppercase font-bold text-luxury-gold-500 tracking-wider block mb-1">Suitable For</span>
                      <p className="text-xs text-luxury-emerald-950 font-medium truncate">{pkg.suitableFor}</p>
                    </div>
                  )}
                  
                  <div className="bg-stone-50/80 rounded-xl p-4 border border-stone-100 mb-6 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-stone-500 font-medium">Guest Capacity</span>
                      <span className="font-bold text-luxury-emerald-950 px-3 py-1 bg-white rounded-lg shadow-sm border border-stone-100">
                        Up to {pkg.guestLimit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-stone-500 font-medium">Included Services</span>
                      <span className="font-bold text-luxury-emerald-950">{pkg.includedServices?.length || 0} Items</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex justify-between items-end mt-auto">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Base Package Price</span>
                      <div className="font-serif text-2xl font-bold text-luxury-emerald-950">LKR {pkg.packagePrice.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">Price Per Person</span>
                      <div className="font-serif text-lg font-bold text-luxury-gold-700">LKR {pricePerPerson.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}
      </section>

      {/* Extra Services Section */}
      <section className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <Utensils size={24} className="text-luxury-gold-600" />
            <h4 className="font-serif text-2xl font-bold text-luxury-emerald-950">Extra Services</h4>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={openAddServiceModal}
              className="bg-stone-100 text-luxury-emerald-950 px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-stone-200 transition flex items-center gap-2 border border-stone-200 shadow-sm"
            >
              <PlusCircle size={14} /> Add Service
            </button>
          </div>
        </div>
        
        {services.length === 0 ? (
          <div className="text-center py-8 text-stone-500 text-sm">
            No extra services available. Click "Add Service" to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-white/80 backdrop-blur-md border border-stone-200/60 rounded-2xl flex flex-col shadow-xl shadow-stone-200/20 hover:shadow-2xl hover:shadow-stone-200/40 transition-all duration-300 relative overflow-hidden group">
                
                {/* Image Section */}
                <div className="h-40 overflow-hidden relative">
                  <img src={getExactServiceImage(service.serviceName) || service.image || getHotelServiceImage(service.serviceName)} alt={service.serviceName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={() => openEditServiceModal(service)}
                      className="bg-white/90 backdrop-blur text-luxury-emerald-950 p-2 rounded-lg hover:bg-white shadow-md transition-colors"
                      title="Edit Service"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service.id, service.serviceName)} 
                      className="bg-white/90 backdrop-blur text-red-600 p-2 rounded-lg hover:bg-white shadow-md transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm">
                      {service.category || 'Other'}
                    </span>
                    {service.status && (
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm border ${
                        service.status === 'Active' 
                          ? 'bg-emerald-500/20 text-emerald-100 border-emerald-500/30' 
                          : 'bg-stone-500/20 text-stone-200 border-stone-500/30'
                      }`}>
                        {service.status}
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-serif text-xl font-bold text-white drop-shadow-md">{service.serviceName}</h3>
                  </div>
                </div>
                
                {/* Details Section */}
                <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-white to-stone-50/50">
                  <p className="text-sm text-stone-500 mb-4 flex-grow line-clamp-2 leading-relaxed">{service.description}</p>
                  
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between mt-auto">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 block">Price</span>
                    <span className="font-bold text-luxury-emerald-950 text-lg">LKR {service.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Package Form Modal */}
      {isPackageModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-serif text-2xl font-bold text-luxury-emerald-950">
                  {editingPackage ? 'Edit Base Package' : 'Create New Package'}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  {editingPackage ? 'Update the details of the package.' : 'Add a new base package to the catalog.'}
                </p>
              </div>
              <button 
                onClick={() => { setIsPackageModalOpen(false); setEditingPackage(null); }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <PackageForm 
                pkg={editingPackage || undefined} 
                onSave={handleSavePackage} 
                onCancel={() => { setIsPackageModalOpen(false); setEditingPackage(null); }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Service Form Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-serif text-2xl font-bold text-luxury-emerald-950">
                  {editingService ? 'Edit Extra Service' : 'Add New Service'}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  {editingService ? 'Update the service details.' : 'Add a new optional service for customers to choose.'}
                </p>
              </div>
              <button 
                onClick={() => { setIsServiceModalOpen(false); setEditingService(null); }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <ServiceForm 
                service={editingService || undefined} 
                onSave={handleSaveService} 
                onCancel={() => { setIsServiceModalOpen(false); setEditingService(null); }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <ConfirmModal
          title={deleteConfirm.type === 'package' ? 'Delete Package?' : 'Delete Service?'}
          message={
            deleteConfirm.type === 'package'
              ? `Are you sure you want to delete the "${deleteConfirm.name}" package? This will permanently remove it from the catalog.`
              : `Are you sure you want to delete the "${deleteConfirm.name}" service?`
          }
          confirmLabel="Yes, Delete"
          onConfirm={executeDelete}
          onCancel={() => setDeleteConfirm(null)}
          danger={true}
        />
      )}

    </div>
  );
}
