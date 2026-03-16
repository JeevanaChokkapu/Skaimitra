import { SkaiMitraAssistant } from './SkaiMitraAssistant';
import { SkaiMitraLogo } from './SkaiMitraLogo';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  GraduationCap, ArrowLeft, Shield, Plus, Edit, Trash2,
  Bell, Settings, LogOut
} from 'lucide-react';

interface RolePermissionsProps {
  onBack: () => void;
  onLogout: () => void;
}

export function RolePermissions({ onBack, onLogout }: RolePermissionsProps) {
  const [selectedRole, setSelectedRole] = useState('admin');

  const roles = [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access and management',
      color: 'bg-purple-500',
      users: 5
    },
    {
      id: 'teacher',
      name: 'Teacher',
      description: 'Manage courses and students',
      color: 'bg-blue-500',
      users: 89
    },
    {
      id: 'student',
      name: 'Student',
      description: 'Access courses and assignments',
      color: 'bg-green-500',
      users: 1247
    }
  ];

  const permissions = {
    admin: {
      users: { view: true, create: true, edit: true, delete: true },
      courses: { view: true, create: true, edit: true, delete: true },
      assignments: { view: true, create: true, edit: true, delete: true },
      grades: { view: true, create: true, edit: true, delete: true },
      reports: { view: true, create: true, edit: true, delete: true },
      settings: { view: true, create: true, edit: true, delete: true },
      announcements: { view: true, create: true, edit: true, delete: true }
    },
    teacher: {
      users: { view: true, create: false, edit: false, delete: false },
      courses: { view: true, create: true, edit: true, delete: false },
      assignments: { view: true, create: true, edit: true, delete: true },
      grades: { view: true, create: true, edit: true, delete: false },
      reports: { view: true, create: false, edit: false, delete: false },
      settings: { view: false, create: false, edit: false, delete: false },
      announcements: { view: true, create: true, edit: true, delete: true }
    },
    student: {
      users: { view: false, create: false, edit: false, delete: false },
      courses: { view: true, create: false, edit: false, delete: false },
      assignments: { view: true, create: false, edit: false, delete: false },
      grades: { view: true, create: false, edit: false, delete: false },
      reports: { view: true, create: false, edit: false, delete: false },
      settings: { view: false, create: false, edit: false, delete: false },
      announcements: { view: true, create: false, edit: false, delete: false }
    }
  };

  const permissionCategories = [
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'courses', label: 'Course Management', icon: '📚' },
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'grades', label: 'Grading', icon: '📊' },
    { id: 'reports', label: 'Reports & Analytics', icon: '📈' },
    { id: 'settings', label: 'System Settings', icon: '⚙️' },
    { id: 'announcements', label: 'Announcements', icon: '📢' }
  ];

  const permissionActions = ['view', 'create', 'edit', 'delete'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SkaiMitraLogo subtitle="Role & Permissions" />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={onLogout} size="sm" className="hidden sm:flex">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button and Title */}
          <div className="mb-6">
            <Button onClick={onBack} variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Role & Permissions Management</h2>
                <p className="text-gray-600">Configure access control for different user roles</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Role
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Role</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-sm text-gray-600">Custom role creation is a premium feature. Contact support to enable it.</p>
                    <Button className="w-full">Contact Support</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Roles List */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Roles</CardTitle>
                  <CardDescription>Select a role to manage permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedRole === role.id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 ${role.color} rounded-lg flex items-center justify-center`}>
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{role.name}</h4>
                          <p className="text-xs text-gray-600">{role.users} users</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{role.description}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Role Actions */}
              <Card>
                <CardContent className="p-4 space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Role Details
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Role
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Permissions Matrix */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Permissions for {roles.find(r => r.id === selectedRole)?.name}
                  </CardTitle>
                  <CardDescription>
                    Configure what this role can access and modify
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {permissionCategories.map((category) => (
                      <div key={category.id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl">{category.icon}</span>
                          <h4 className="font-semibold text-lg">{category.label}</h4>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {permissionActions.map((action) => {
                            const isEnabled = permissions[selectedRole as keyof typeof permissions][category.id as keyof typeof permissions.admin][action as keyof typeof permissions.admin.users];
                            return (
                              <div key={action} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <Label htmlFor={`${category.id}-${action}`} className="cursor-pointer capitalize text-sm">
                                  {action}
                                </Label>
                                <Switch
                                  id={`${category.id}-${action}`}
                                  checked={isEnabled}
                                  className="data-[state=checked]:bg-purple-600"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Save Button */}
                  <div className="mt-6 flex gap-3">
                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                      Save Changes
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Reset to Default
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Permission Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Permission Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => {
                  const rolePerms = permissions[role.id as keyof typeof permissions];
                  const totalPerms = Object.values(rolePerms).reduce((acc, perms) => {
                    return acc + Object.values(perms).filter(Boolean).length;
                  }, 0);
                  return (
                    <div key={role.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 ${role.color} rounded-lg flex items-center justify-center`}>
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="font-semibold">{role.name}</h4>
                      </div>
                      <p className="text-2xl font-bold mb-1">{totalPerms}</p>
                      <p className="text-sm text-gray-600">Active Permissions</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <SkaiMitraAssistant />
    </div>
  );
}