import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import AdminLayout from '../components/admin/AdminLayout';
import DashboardOverview from '../components/admin/DashboardOverview';
import AnalyticsView from '../components/admin/AnalyticsView';
import CakesManager from './admin/CakesManager';
import AcademyManager from './admin/AcademyManager';
import RegistrationTracker from './admin/RegistrationTracker';
import InquiryManager from './admin/InquiryManager';
import TestimonialManager from './admin/TestimonialManager';
import CustomersManager from './admin/CustomersManager';
import RefundsManager from './admin/RefundsManager';
import RolesManager from './admin/RolesManager';
import SettingsManager from './admin/SettingsManager';

export default function AdminDashboard() {
  const { goToAdminLogin } = useNavigation();
  const [activeTab, setActiveTab] = useState('Overview');
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('admin_user');
    if (userStr) setAdmin(JSON.parse(userStr));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    goToAdminLogin();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <DashboardOverview />;
      case 'Analytics':
        return <AnalyticsView />;
      case 'Inquiries':
      case 'Notifications':
        return <InquiryManager />;
      case 'Courses':
        return <AcademyManager section="courses" />;
      case 'Batches':
        return <AcademyManager section="batches" />;
      case 'Registrations':
        return <RegistrationTracker variant="academy" />;
      case 'Orders':
        return <RegistrationTracker variant="orders" />;
      case 'Cakes':
      case 'Products':
        return <CakesManager />;
      case 'Customers':
        return <CustomersManager />;
      case 'Refunds':
        return <RefundsManager />;
      case 'Roles':
        return <RolesManager />;
      case 'Testimonials':
        return <TestimonialManager />;
      case 'Settings':
        return <SettingsManager />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <AdminLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      admin={admin} 
      onLogout={handleLogout}
    >
      <div className="pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </div>
    </AdminLayout>
  );
}
