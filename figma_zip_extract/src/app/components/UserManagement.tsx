import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { 
  GraduationCap, ArrowLeft, Search, Plus, Edit, Trash2, Users, 
  Bell, Settings, LogOut, UserPlus
} from 'lucide-react';
import { SkaiMitraLogo } from './SkaiMitraLogo';

interface UserManagementProps {
  onBack: () => void;
  onLogout: () => void;
}

export function UserManagement({ onBack, onLogout }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    class: '',
    phone: '',
    status: 'active'
  });

  const users = [
    { id: 1, name: 'Aarav Mehta', email: 'aarav@school.edu', role: 'Student', class: 'Class 6', status: 'Active', phone: '+91 98765 43210' },
    { id: 2, name: 'Dr. Rajesh Kumar', email: 'rajesh@school.edu', role: 'Teacher', class: 'Mathematics', status: 'Active', phone: '+91 98765 43211' },
    { id: 3, name: 'Diya Sharma', email: 'diya@school.edu', role: 'Student', class: 'Class 7', status: 'Active', phone: '+91 98765 43212' },
    { id: 4, name: 'Ms. Priya Patel', email: 'priya@school.edu', role: 'Teacher', class: 'Science', status: 'Active', phone: '+91 98765 43213' },
    { id: 5, name: 'Admin User', email: 'admin@school.edu', role: 'Admin', class: 'N/A', status: 'Active', phone: '+91 98765 43214' },
    { id: 6, name: 'Rohan Verma', email: 'rohan@school.edu', role: 'Student', class: 'Class 8', status: 'Inactive', phone: '+91 98765 43215' }
  ];

  const handleSaveUser = () => {
    // Handle save user logic
    setIsAddDialogOpen(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'student', class: '', phone: '', status: 'active' });
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role.toLowerCase(),
      class: user.class,
      phone: user.phone,
      status: user.status.toLowerCase()
    });
    setIsAddDialogOpen(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role.toLowerCase() === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SkaiMitraLogo subtitle="User Management" />
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
                <h2 className="text-2xl font-bold mb-2">User Management</h2>
                <p className="text-gray-600">Manage all users in the system</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <h3 className="text-2xl font-bold">{users.length}</h3>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Students</p>
                    <h3 className="text-2xl font-bold">{users.filter(u => u.role === 'Student').length}</h3>
                  </div>
                  <GraduationCap className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Teachers</p>
                    <h3 className="text-2xl font-bold">{users.filter(u => u.role === 'Teacher').length}</h3>
                  </div>
                  <UserPlus className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active</p>
                    <h3 className="text-2xl font-bold">{users.filter(u => u.status === 'Active').length}</h3>
                  </div>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="teacher">Teachers</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Class/Subject</Label>
                        <Input
                          value={formData.class}
                          onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                          placeholder="e.g., Class 6 or Mathematics"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleSaveUser} className="flex-1">
                          {editingUser ? 'Update User' : 'Add User'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsAddDialogOpen(false);
                            setEditingUser(null);
                            setFormData({ name: '', email: '', role: 'student', class: '', phone: '', status: 'active' });
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Class/Subject</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={
                            user.role === 'Admin' ? 'destructive' :
                            user.role === 'Teacher' ? 'default' : 'secondary'
                          }>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.class}</TableCell>
                        <TableCell className="text-sm text-gray-600">{user.phone}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

    </div>
  );
}