import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CreateUserModal } from './CreateUserModal';

export const UserManagement: React.FC = () => {
  const { user, canCreateUser } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Mock users data (in real app, this would come from API)
  const mockUsers = [
    {
      id: '1',
      username: 'central_admin',
      email: 'admin@central.gov.in',
      firstName: 'Central',
      lastName: 'Admin',
      role: 'central_admin',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      username: 'mh_admin',
      email: 'admin@maharashtra.gov.in',
      firstName: 'Maharashtra',
      lastName: 'Admin',
      role: 'state_admin',
      state: 'Maharashtra',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      username: 'up_admin',
      email: 'admin@up.gov.in',
      firstName: 'Uttar Pradesh',
      lastName: 'Admin',
      role: 'state_admin',
      state: 'Uttar Pradesh',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: '2024-01-15T08:45:00Z'
    },
    {
      id: '4',
      username: 'central_user1',
      email: 'user1@central.gov.in',
      firstName: 'Central',
      lastName: 'User',
      role: 'central_user',
      isActive: true,
      createdAt: '2024-01-02T00:00:00Z',
      lastLogin: '2024-01-15T11:20:00Z'
    },
    {
      id: '5',
      username: 'mh_user1',
      email: 'user1@maharashtra.gov.in',
      firstName: 'Maharashtra',
      lastName: 'User',
      role: 'state_user',
      state: 'Maharashtra',
      isActive: true,
      createdAt: '2024-01-02T00:00:00Z',
      lastLogin: '2024-01-15T10:00:00Z'
    }
  ];

  const filteredUsers = mockUsers.filter(u => {
    const matchesSearch = u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    
    // Filter based on user permissions
    if (user?.role === 'state_admin') {
      return matchesSearch && matchesRole && (u.state === user.state || u.id === user.id);
    }
    
    return matchesSearch && matchesRole;
  });

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'central_admin': return 'Central Admin';
      case 'state_admin': return 'State Admin';
      case 'central_user': return 'Central User';
      case 'state_user': return 'State User';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'central_admin': return 'bg-red-100 text-red-800';
      case 'state_admin': return 'bg-orange-100 text-orange-800';
      case 'central_user': return 'bg-blue-100 text-blue-800';
      case 'state_user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canCreateAnyUser = canCreateUser('central_admin') || canCreateUser('state_admin') || 
                          canCreateUser('central_user') || canCreateUser('state_user');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        {canCreateAnyUser && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create User</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Roles</option>
                <option value="central_admin">Central Admin</option>
                <option value="state_admin">State Admin</option>
                <option value="central_user">Central User</option>
                <option value="state_user">State User</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {u.firstName} {u.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                        <div className="text-xs text-gray-400">@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(u.role)}`}>
                      <Shield className="w-3 h-3 mr-1" />
                      {getRoleDisplay(u.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    {u.state || 'All States'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200">
                        <Edit className="w-4 h-4" />
                      </button>
                      {u.id !== user?.id && (
                        <button className="text-red-600 hover:text-red-900 transition-colors duration-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};