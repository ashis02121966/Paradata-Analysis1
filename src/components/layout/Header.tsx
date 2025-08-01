import React, { useState } from 'react';
import { Database, LogOut, User, Settings, Users, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ChangePasswordModal } from '../auth/ChangePasswordModal';

interface HeaderProps {
  onUserManagementClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onUserManagementClick }) => {
  const { user, logout, canCreateUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const getDashboardTitle = () => {
    if (!user) return 'Survey Dashboard';
    
    if (user.role === 'central_admin' || user.role === 'central_user') {
      return 'Survey Dashboard - Central';
    }
    
    if ((user.role === 'state_admin' || user.role === 'state_user') && user.state) {
      return `Survey Dashboard - ${user.state}`;
    }
    
    return 'Survey Dashboard';
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'central_admin': return 'Central Admin';
      case 'state_admin': return 'State Admin';
      case 'central_user': return 'Central User';
      case 'state_user': return 'State User';
      default: return role;
    }
  };

  const canManageUsers = canCreateUser('central_admin') || canCreateUser('state_admin') || 
                        canCreateUser('central_user') || canCreateUser('state_user');

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{getDashboardTitle()}</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Field Data Review & Performance Analytics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {canManageUsers && (
                <button
                  onClick={onUserManagementClick}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Users</span>
                </button>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{getRoleDisplay(user?.role || '')}</p>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      {user?.state && (
                        <p className="text-xs text-gray-500">State: {user.state}</p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowChangePasswordModal(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Key className="w-4 h-4" />
                      <span>Change Password</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </>
  );
};