import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Users, BookOpen, GraduationCap, BarChart3, Settings, 
  Search, Plus, Download, Filter, TrendingUp, TrendingDown,
  UserPlus, BookPlus, Calendar, Bell, LogOut
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Data
  const stats = [
    { title: 'Total Students', value: '1,247', change: '+12%', trend: 'up', icon: Users, color: 'bg-blue-500' },
    { title: 'Total Teachers', value: '89', change: '+5%', trend: 'up', icon: GraduationCap, color: 'bg-purple-500' },
    { title: 'Active Courses', value: '156', change: '+8%', trend: 'up', icon: BookOpen, color: 'bg-green-500' },
    { title: 'Avg. Performance', value: '78.5%', change: '+3.2%', trend: 'up', icon: BarChart3, color: 'bg-orange-500' }
  ];

  const enrollmentData = [
    { month: 'Aug', students: 980 },
    { month: 'Sep', students: 1050 },
    { month: 'Oct', students: 1120 },
    { month: 'Nov', students: 1180 },
    { month: 'Dec', students: 1210 },
    { month: 'Jan', students: 1247 }
  ];

  const performanceData = [
    { class: 'Class 6', avg: 76 },
    { class: 'Class 7', avg: 78 },
    { class: 'Class 8', avg: 81 }
  ];

  const courseDistribution = [
    { name: 'Mathematics', value: 320, color: '#3b82f6' },
    { name: 'Science', value: 280, color: '#8b5cf6' },
    { name: 'English', value: 250, color: '#10b981' },
    { name: 'Social Studies', value: 220, color: '#f59e0b' },
    { name: 'Others', value: 177, color: '#ef4444' }
  ];

  const teachers = [
    { id: 1, name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@school.edu', subject: 'Mathematics', students: 145, courses: 4, status: 'Active' },
    { id: 2, name: 'Ms. Priya Sharma', email: 'priya.sharma@school.edu', subject: 'Science', students: 132, courses: 3, status: 'Active' },
    { id: 3, name: 'Mr. Amit Patel', email: 'amit.patel@school.edu', subject: 'English', students: 128, courses: 3, status: 'Active' },
    { id: 4, name: 'Ms. Sneha Gupta', email: 'sneha.gupta@school.edu', subject: 'Social Studies', students: 115, courses: 3, status: 'Active' },
    { id: 5, name: 'Dr. Vikram Singh', email: 'vikram.singh@school.edu', subject: 'Hindi', students: 98, courses: 2, status: 'Active' }
  ];

  const students = [
    { id: 1, name: 'Aarav Mehta', class: 'Class 6-A', email: 'aarav.mehta@student.edu', enrolled: 5, avg: 85, status: 'Active' },
    { id: 2, name: 'Diya Sharma', class: 'Class 7-B', email: 'diya.sharma@student.edu', enrolled: 6, avg: 92, status: 'Active' },
    { id: 3, name: 'Arjun Reddy', class: 'Class 8-A', email: 'arjun.reddy@student.edu', enrolled: 6, avg: 78, status: 'Active' },
    { id: 4, name: 'Ananya Singh', class: 'Class 6-B', email: 'ananya.singh@student.edu', enrolled: 5, avg: 88, status: 'Active' },
    { id: 5, name: 'Kabir Verma', class: 'Class 7-A', email: 'kabir.verma@student.edu', enrolled: 6, avg: 81, status: 'Active' }
  ];

  const courses = [
    { id: 1, name: 'Mathematics - Class 6', teacher: 'Dr. Rajesh Kumar', students: 42, completion: 65, status: 'Active' },
    { id: 2, name: 'Science - Class 7', teacher: 'Ms. Priya Sharma', students: 38, completion: 72, status: 'Active' },
    { id: 3, name: 'English - Class 8', teacher: 'Mr. Amit Patel', students: 45, completion: 58, status: 'Active' },
    { id: 4, name: 'Social Studies - Class 6', teacher: 'Ms. Sneha Gupta', students: 40, completion: 68, status: 'Active' },
    { id: 5, name: 'Hindi - Class 7', teacher: 'Dr. Vikram Singh', students: 35, completion: 75, status: 'Active' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Administrator Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant={stat.trend === 'up' ? 'default' : 'secondary'} className="flex items-center gap-1">
                          <TrendIcon className="w-3 h-3" />
                          {stat.change}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enrollment Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Enrollment Trend</CardTitle>
                  <CardDescription>Monthly growth over 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={enrollmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Course Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Distribution</CardTitle>
                  <CardDescription>Students enrolled by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={courseDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {courseDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance by Class */}
            <Card>
              <CardHeader>
                <CardTitle>Average Performance by Class</CardTitle>
                <CardDescription>Overall student performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="class" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avg" fill="#8b5cf6" name="Average Score %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teachers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Teacher Management</CardTitle>
                    <CardDescription>Manage all teachers and their courses</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Teacher
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search teachers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell className="text-gray-600">{teacher.email}</TableCell>
                        <TableCell>{teacher.subject}</TableCell>
                        <TableCell>{teacher.students}</TableCell>
                        <TableCell>{teacher.courses}</TableCell>
                        <TableCell>
                          <Badge variant="default">{teacher.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Student Management</CardTitle>
                    <CardDescription>Manage all students and their progress</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Student
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Courses Enrolled</TableHead>
                      <TableHead>Avg. Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell className="text-gray-600">{student.email}</TableCell>
                        <TableCell>{student.enrolled}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{student.avg}%</span>
                            <Progress value={student.avg} className="w-20" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{student.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Course Management</CardTitle>
                    <CardDescription>Manage all courses and their content</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button>
                      <BookPlus className="w-4 h-4 mr-2" />
                      Add Course
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Students Enrolled</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.name}</TableCell>
                        <TableCell>{course.teacher}</TableCell>
                        <TableCell>{course.students}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{course.completion}%</span>
                            <Progress value={course.completion} className="w-24" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{course.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Login Activity</CardTitle>
                  <CardDescription>User logins over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { day: 'Mon', students: 850, teachers: 72 },
                      { day: 'Tue', students: 920, teachers: 78 },
                      { day: 'Wed', students: 880, teachers: 75 },
                      { day: 'Thu', students: 950, teachers: 81 },
                      { day: 'Fri', students: 1020, teachers: 85 },
                      { day: 'Sat', students: 650, teachers: 45 },
                      { day: 'Sun', students: 580, teachers: 38 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="students" fill="#3b82f6" name="Students" />
                      <Bar dataKey="teachers" fill="#8b5cf6" name="Teachers" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assignment Completion</CardTitle>
                  <CardDescription>Submission rates by class</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { class: 'Class 6-A', rate: 85 },
                      { class: 'Class 6-B', rate: 78 },
                      { class: 'Class 7-A', rate: 92 },
                      { class: 'Class 7-B', rate: 88 },
                      { class: 'Class 8-A', rate: 81 },
                      { class: 'Class 8-B', rate: 86 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="class" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="rate" fill="#10b981" name="Completion Rate %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
