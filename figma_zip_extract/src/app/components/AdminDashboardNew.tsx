import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  GraduationCap, Bell, Settings, LogOut, Home, BookOpen,
  ClipboardList, Users, Settings as SettingsIcon, MessageSquare,
  BarChart3, Mail, Phone, Edit, Trash2, Send
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { SkaiMitraAssistant } from './SkaiMitraAssistant';
import { SkaiMitraLogo } from './SkaiMitraLogo';
import bgImage from 'figma:asset/7280b9bb2443d06a2dd7ab56b34ecee081080853.png';

interface AdminDashboardNewProps {
  onLogout: () => void;
  onNavigate: (page: 'users' | 'permissions') => void;
}

export function AdminDashboardNew({ onLogout, onNavigate }: AdminDashboardNewProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [question, setQuestion] = useState('');

  // Mock data
  const performanceData = [
    { class: 'Class 6', score: 78 },
    { class: 'Class 7', score: 82 },
    { class: 'Class 8', score: 80 }
  ];

  const loginActivity = [
    { day: 'Mon', logins: 950 },
    { day: 'Tue', logins: 1020 },
    { day: 'Wed', logins: 980 },
    { day: 'Thu', logins: 1100 },
    { day: 'Fri', logins: 890 },
    { day: 'Sat', logins: 450 },
    { day: 'Sun', logins: 320 }
  ];

  const teachers = [
    { id: 1, name: 'Dr. Rajesh Kumar', subject: 'Mathematics', email: 'rajesh@school.edu', phone: '+91 98765 43211', students: 120, courses: 3 },
    { id: 2, name: 'Ms. Priya Patel', subject: 'Science', email: 'priya@school.edu', phone: '+91 98765 43213', students: 110, courses: 2 },
    { id: 3, name: 'Mr. Sharma', subject: 'English', email: 'sharma@school.edu', phone: '+91 98765 43215', students: 115, courses: 3 },
    { id: 4, name: 'Ms. Gupta', subject: 'History', email: 'gupta@school.edu', phone: '+91 98765 43217', students: 105, courses: 2 }
  ];

  const students = [
    { id: 1, name: 'Aarav Mehta', class: 'Class 6', email: 'aarav@school.edu', performance: 91.7, attendance: 95 },
    { id: 2, name: 'Diya Sharma', class: 'Class 7', email: 'diya@school.edu', performance: 90, attendance: 98 },
    { id: 3, name: 'Rohan Verma', class: 'Class 8', email: 'rohan@school.edu', performance: 82.3, attendance: 92 },
    { id: 4, name: 'Ananya Singh', class: 'Class 6', email: 'ananya@school.edu', performance: 88.5, attendance: 96 }
  ];

  const courses = [
    { id: 1, name: 'Mathematics - Class 6', teacher: 'Dr. Rajesh Kumar', students: 40, status: 'active', completion: 75 },
    { id: 2, name: 'Science - Class 7', teacher: 'Ms. Priya Patel', students: 38, status: 'active', completion: 82 },
    { id: 3, name: 'English - Class 8', teacher: 'Mr. Sharma', students: 42, status: 'active', completion: 68 },
    { id: 4, name: 'History - Class 6', teacher: 'Ms. Gupta', students: 35, status: 'active', completion: 90 }
  ];

  const reportData = [
    { month: 'Jan', students: 1150, teachers: 82, courses: 142 },
    { month: 'Feb', students: 1247, teachers: 89, courses: 156 },
    { month: 'Mar', students: 1280, teachers: 91, courses: 165 }
  ];

  const enrollmentData = [
    { name: 'Class 6', value: 420, color: '#3B82F6' },
    { name: 'Class 7', value: 410, color: '#8B5CF6' },
    { name: 'Class 8', value: 417, color: '#10B981' }
  ];

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'reports', label: 'Reports', icon: ClipboardList },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'settings', label: 'System Settings', icon: SettingsIcon }
  ];

  const renderContent = () => {
    if (activeTab === 'teachers') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Teachers Management</h2>
              <p className="text-gray-600">Manage teaching staff and their courses</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => onNavigate('users')}>
              View All Users
            </Button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-3xl font-bold mb-1">89</h3>
                <p className="text-sm text-gray-600">Total Teachers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-3xl font-bold mb-1">156</h3>
                <p className="text-sm text-gray-600">Active Courses</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-3xl font-bold mb-1">14:1</h3>
                <p className="text-sm text-gray-600">Student-Teacher Ratio</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Teaching Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-semibold">{teacher.name}</h4>
                        <p className="text-sm text-gray-600">{teacher.subject}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {teacher.email}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {teacher.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-sm font-medium">{teacher.students} Students</p>
                      <p className="text-xs text-gray-600">{teacher.courses} Courses</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeTab === 'students') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Students Management</h2>
              <p className="text-gray-600">Monitor student enrollment and performance</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => onNavigate('users')}>
              View All Users
            </Button>
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-3xl font-bold mb-1">1,247</h3>
                <p className="text-sm text-gray-600">Total Students</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-3xl font-bold mb-1">420</h3>
                <p className="text-sm text-gray-600">Class 6</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-3xl font-bold mb-1">410</h3>
                <p className="text-sm text-gray-600">Class 7</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-3xl font-bold mb-1">417</h3>
                <p className="text-sm text-gray-600">Class 8</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-sm">{student.name}</h4>
                        <p className="text-xs text-gray-600">{student.class} • {student.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-500">{student.performance}%</Badge>
                        <p className="text-xs text-gray-600 mt-1">{student.attendance}% attendance</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Class Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    if (activeTab === 'courses') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Course Management</h2>
              <p className="text-gray-600">Manage courses and curriculum</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Create New Course
            </Button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-3xl font-bold mb-1">156</h3>
                <p className="text-sm text-gray-600">Active Courses</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-3xl font-bold mb-1">1,247</h3>
                <p className="text-sm text-gray-600">Enrolled Students</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-3xl font-bold mb-1">78.5%</h3>
                <p className="text-sm text-gray-600">Avg Completion</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{course.name}</h4>
                      <p className="text-sm text-gray-600">Teacher: {course.teacher}</p>
                      <p className="text-sm text-gray-500 mt-1">{course.students} students enrolled</p>
                    </div>
                    <div className="mr-4">
                      <div className="text-right mb-2">
                        <span className="text-sm font-medium">{course.completion}%</span>
                        <span className="text-xs text-gray-600"> completion</span>
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${course.completion}%` }}
                        ></div>
                      </div>
                    </div>
                    <Badge variant="default">{course.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeTab === 'reports') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Analytics & Reports</h2>
            <p className="text-gray-600">System-wide analytics and performance metrics</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="teachers" stroke="#8B5CF6" strokeWidth={2} />
                    <Line type="monotone" dataKey="courses" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance by Class</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="class" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <p className="font-medium">Student Performance Report</p>
                    <p className="text-xs text-gray-600">Detailed academic performance metrics</p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <p className="font-medium">Attendance Report</p>
                    <p className="text-xs text-gray-600">Student and teacher attendance data</p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <p className="font-medium">Course Completion Report</p>
                    <p className="text-xs text-gray-600">Track course progress across classes</p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <p className="font-medium">Financial Report</p>
                    <p className="text-xs text-gray-600">Fee collection and expenditure</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeTab === 'communications') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Communications</h2>
            <p className="text-gray-600">Manage announcements and system messages</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Announcements</CardTitle>
                <Button className="bg-purple-600 hover:bg-purple-700">New Announcement</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'Mid-term Examinations Schedule', date: 'Feb 15, 2026', audience: 'All Students' },
                  { title: 'Parent-Teacher Meeting', date: 'Feb 20, 2026', audience: 'Parents & Teachers' },
                  { title: 'New Course Launch', date: 'Feb 18, 2026', audience: 'All Users' }
                ].map((announcement, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{announcement.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{announcement.date} • {announcement.audience}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (activeTab === 'settings') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">System Settings</h2>
            <p className="text-gray-600">Configure system-wide settings and preferences</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onNavigate('users')}
                >
                  Manage Users
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onNavigate('permissions')}
                >
                  Role Permissions
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Academic Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Grade Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Notification Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Default Home tab
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Stats and Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 text-xs">+12%</Badge>
                </div>
                <h3 className="text-3xl font-bold mb-1">1,247</h3>
                <p className="text-sm text-gray-600">Total Students</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 text-xs">+5%</Badge>
                </div>
                <h3 className="text-3xl font-bold mb-1">89</h3>
                <p className="text-sm text-gray-600">Total Teachers</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-green-100 text-green-700 text-xs">+8%</Badge>
                </div>
                <h3 className="text-3xl font-bold mb-1">156</h3>
                <p className="text-sm text-gray-600">Active Courses</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 text-xs">+3.2%</Badge>
                </div>
                <h3 className="text-3xl font-bold mb-1">78.5%</h3>
                <p className="text-sm text-gray-600">Avg. Performance</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto p-4"
                  onClick={() => onNavigate('users')}
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">User Management</span>
                    </div>
                    <p className="text-xs text-gray-600">Add, edit, or remove users</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-auto p-4"
                  onClick={() => onNavigate('permissions')}
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Settings className="w-4 h-4" />
                      <span className="font-medium">Role Permissions</span>
                    </div>
                    <p className="text-xs text-gray-600">Manage user roles and access</p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen className="w-4 h-4" />
                      <span className="font-medium">Course Management</span>
                    </div>
                    <p className="text-xs text-gray-600">Create and manage courses</p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="w-4 h-4" />
                      <span className="font-medium">View Reports</span>
                    </div>
                    <p className="text-xs text-gray-600">Access analytics and insights</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Average Performance by Class */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-2">Average Performance by Class</h3>
              <p className="text-sm text-gray-600 mb-4">Overall student performance metrics</p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="class" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Calendar and Activity */}
        <div className="space-y-6">
          {/* School Calendar */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">School Calendar</h3>
                <Button variant="link" size="sm" className="text-xs text-blue-600">
                  Set new reminder date
                </Button>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium">February 2026</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">&lt;</Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">&gt;</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                    <div key={`day-${idx}-${day}`} className="font-medium text-gray-600 py-2">{day[0]}</div>
                  ))}
                  {Array.from({ length: 28 }, (_, i) => {
                    const isToday = i + 1 === 16;
                    return (
                      <div
                        key={`date-${i}`}
                        className={`py-2 rounded-lg ${
                          isToday ? 'bg-purple-600 text-white font-bold' : 'hover:bg-gray-100'
                        }`}
                      >
                        {i + 1}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Login Activity */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-2">Login Activity</h3>
              <p className="text-xs text-gray-600 mb-4">User logins over the past week</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={loginActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="logins" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Ask a Question */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-2">
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question"
                  className="flex-1"
                />
                <Button className="bg-blue-600 hover:bg-blue-700" size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen bg-gray-50"
      style={{
        backgroundImage: activeTab === 'home' ? `url(${bgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Welcome */}
            <SkaiMitraLogo subtitle="Welcome back, Admin" />

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-purple-50 border-purple-600 text-purple-700'
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* SkaiMitra Assistant */}
      <SkaiMitraAssistant />
    </div>
  );
}