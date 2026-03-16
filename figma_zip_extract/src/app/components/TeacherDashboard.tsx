import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  BookOpen, GraduationCap, Users, FileText, Calendar, 
  BarChart3, Settings, Bell, LogOut, Plus, Search, 
  Upload, CheckCircle, Clock, AlertCircle, Edit, Trash2,
  ClipboardList, Award, BookPlus
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TeacherDashboardProps {
  onLogout: () => void;
}

export function TeacherDashboard({ onLogout }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [createCourseOpen, setCreateCourseOpen] = useState(false);
  const [createAssignmentOpen, setCreateAssignmentOpen] = useState(false);

  // Mock Data
  const stats = [
    { title: 'My Courses', value: '4', icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Total Students', value: '145', icon: Users, color: 'bg-purple-500' },
    { title: 'Pending Submissions', value: '23', icon: Clock, color: 'bg-orange-500' },
    { title: 'Avg. Performance', value: '82%', icon: Award, color: 'bg-green-500' }
  ];

  const courses = [
    { 
      id: 1, 
      name: 'Mathematics - Class 6', 
      class: 'Class 6-A', 
      students: 42, 
      modules: 12, 
      completed: 8,
      progress: 67,
      status: 'Active' 
    },
    { 
      id: 2, 
      name: 'Mathematics - Class 7', 
      class: 'Class 7-B', 
      students: 38, 
      modules: 14, 
      completed: 10,
      progress: 71,
      status: 'Active' 
    },
    { 
      id: 3, 
      name: 'Advanced Mathematics', 
      class: 'Class 8-A', 
      students: 35, 
      modules: 16, 
      completed: 12,
      progress: 75,
      status: 'Active' 
    },
    { 
      id: 4, 
      name: 'Math Remedial', 
      class: 'Mixed', 
      students: 30, 
      modules: 10, 
      completed: 5,
      progress: 50,
      status: 'Active' 
    }
  ];

  const pendingGrading = [
    { 
      id: 1, 
      assignment: 'Algebra Quiz - Chapter 4', 
      course: 'Mathematics - Class 6',
      student: 'Aarav Mehta', 
      submitted: '2 hours ago',
      status: 'Pending'
    },
    { 
      id: 2, 
      assignment: 'Geometry Assignment', 
      course: 'Mathematics - Class 7',
      student: 'Diya Sharma', 
      submitted: '5 hours ago',
      status: 'Pending'
    },
    { 
      id: 3, 
      assignment: 'Trigonometry Test', 
      course: 'Advanced Mathematics',
      student: 'Arjun Reddy', 
      submitted: '1 day ago',
      status: 'Pending'
    },
    { 
      id: 4, 
      assignment: 'Statistics Project', 
      course: 'Mathematics - Class 8',
      student: 'Ananya Singh', 
      submitted: '1 day ago',
      status: 'Pending'
    }
  ];

  const assignments = [
    {
      id: 1,
      title: 'Algebra Quiz - Chapter 4',
      course: 'Mathematics - Class 6',
      dueDate: '2026-02-15',
      totalStudents: 42,
      submitted: 38,
      graded: 35,
      status: 'Active'
    },
    {
      id: 2,
      title: 'Geometry Assignment',
      course: 'Mathematics - Class 7',
      dueDate: '2026-02-18',
      totalStudents: 38,
      submitted: 32,
      graded: 32,
      status: 'Active'
    },
    {
      id: 3,
      title: 'Trigonometry Test',
      course: 'Advanced Mathematics',
      dueDate: '2026-02-20',
      totalStudents: 35,
      submitted: 28,
      graded: 25,
      status: 'Active'
    }
  ];

  const recentActivity = [
    { action: 'New submission', detail: 'Aarav Mehta submitted Algebra Quiz', time: '2 hours ago' },
    { action: 'Assignment graded', detail: 'Completed grading for 5 students', time: '4 hours ago' },
    { action: 'Course updated', detail: 'Added new module to Mathematics - Class 6', time: '1 day ago' },
    { action: 'New assignment', detail: 'Created Trigonometry Test', time: '2 days ago' }
  ];

  const performanceData = [
    { week: 'Week 1', avg: 75 },
    { week: 'Week 2', avg: 78 },
    { week: 'Week 3', avg: 80 },
    { week: 'Week 4', avg: 82 },
    { week: 'Week 5', avg: 83 },
    { week: 'Week 6', avg: 85 }
  ];

  const submissionData = [
    { course: 'Class 6', onTime: 85, late: 10, missing: 5 },
    { course: 'Class 7', onTime: 80, late: 12, missing: 8 },
    { course: 'Class 8', onTime: 88, late: 8, missing: 4 }
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
                <h1 className="text-xl font-bold">Teacher Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, Dr. Rajesh Kumar</p>
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
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="content">Create Content</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="grading">Grading</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Performance Trend</CardTitle>
                  <CardDescription>Average scores over 6 weeks</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={2} name="Average Score" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assignment Submissions</CardTitle>
                  <CardDescription>Submission status by class</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={submissionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="course" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="onTime" fill="#10b981" name="On Time" stackId="a" />
                      <Bar dataKey="late" fill="#f59e0b" name="Late" stackId="a" />
                      <Bar dataKey="missing" fill="#ef4444" name="Missing" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Pending Grading */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Grading</CardTitle>
                <CardDescription>Recent submissions awaiting your review</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingGrading.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.assignment}</TableCell>
                        <TableCell className="text-gray-600">{item.course}</TableCell>
                        <TableCell>{item.student}</TableCell>
                        <TableCell className="text-gray-600">{item.submitted}</TableCell>
                        <TableCell>
                          <Button variant="default" size="sm">
                            Grade Now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.detail}</p>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">My Courses</h2>
                <p className="text-gray-600">Manage your course content and track student progress</p>
              </div>
              <Dialog open={createCourseOpen} onOpenChange={setCreateCourseOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <BookPlus className="w-4 h-4 mr-2" />
                    Create Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                    <DialogDescription>Set up a new course for your students</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Course Name</Label>
                      <Input placeholder="e.g., Mathematics - Class 6" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Class</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6a">Class 6-A</SelectItem>
                            <SelectItem value="6b">Class 6-B</SelectItem>
                            <SelectItem value="7a">Class 7-A</SelectItem>
                            <SelectItem value="7b">Class 7-B</SelectItem>
                            <SelectItem value="8a">Class 8-A</SelectItem>
                            <SelectItem value="8b">Class 8-B</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="math">Mathematics</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="social">Social Studies</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Course Description</Label>
                      <Textarea placeholder="Describe your course content and objectives" rows={4} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setCreateCourseOpen(false)}>Cancel</Button>
                    <Button onClick={() => setCreateCourseOpen(false)}>Create Course</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{course.name}</CardTitle>
                        <CardDescription>{course.class}</CardDescription>
                      </div>
                      <Badge>{course.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <Users className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                          <p className="text-2xl font-bold">{course.students}</p>
                          <p className="text-xs text-gray-600">Students</p>
                        </div>
                        <div>
                          <BookOpen className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                          <p className="text-2xl font-bold">{course.modules}</p>
                          <p className="text-xs text-gray-600">Modules</p>
                        </div>
                        <div>
                          <CheckCircle className="w-5 h-5 mx-auto mb-1 text-green-500" />
                          <p className="text-2xl font-bold">{course.completed}</p>
                          <p className="text-xs text-gray-600">Completed</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Course Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" variant="outline">
                          View Details
                        </Button>
                        <Button className="flex-1">
                          Manage Content
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Create Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Course Module</CardTitle>
                  <CardDescription>Add lessons and learning materials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Course</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map(course => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Module Title</Label>
                    <Input placeholder="e.g., Introduction to Algebra" />
                  </div>
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video Lesson</SelectItem>
                        <SelectItem value="reading">Reading Material</SelectItem>
                        <SelectItem value="interactive">Interactive Content</SelectItem>
                        <SelectItem value="ck12">CK-12 FlexBook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea placeholder="Enter lesson content or embed code" rows={6} />
                  </div>
                  <div className="space-y-2">
                    <Label>Upload Resources</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, DOC, PPT (max 10MB)</p>
                    </div>
                  </div>
                  <Button className="w-full">Create Module</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Embed CK-12 Content</CardTitle>
                  <CardDescription>Integrate CBSE-aligned digital textbooks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Course</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map(course => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Grade Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">Class 6</SelectItem>
                        <SelectItem value="7">Class 7</SelectItem>
                        <SelectItem value="8">Class 8</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>CK-12 FlexBook URL or ID</Label>
                    <Input placeholder="Enter CK-12 resource link" />
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Browse CK-12 Library</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Search thousands of CBSE-aligned lessons, simulations, and assessments
                    </p>
                    <Button variant="outline" className="w-full">
                      Open CK-12 Browser
                    </Button>
                  </div>
                  <Button className="w-full">Embed FlexBook</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Assignments</h2>
                <p className="text-gray-600">Create and manage student assignments</p>
              </div>
              <Dialog open={createAssignmentOpen} onOpenChange={setCreateAssignmentOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Assignment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Assignment</DialogTitle>
                    <DialogDescription>Set up an assignment for your students</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Assignment Title</Label>
                      <Input placeholder="e.g., Algebra Quiz - Chapter 4" />
                    </div>
                    <div className="space-y-2">
                      <Label>Select Course</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map(course => (
                            <SelectItem key={course.id} value={course.id.toString()}>
                              {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Assignment Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="homework">Homework</SelectItem>
                            <SelectItem value="quiz">Quiz</SelectItem>
                            <SelectItem value="test">Test</SelectItem>
                            <SelectItem value="project">Project</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Instructions</Label>
                      <Textarea placeholder="Provide instructions for students" rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Points</Label>
                      <Input type="number" placeholder="100" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setCreateAssignmentOpen(false)}>Cancel</Button>
                    <Button onClick={() => setCreateAssignmentOpen(false)}>Create Assignment</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Graded</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.title}</TableCell>
                        <TableCell className="text-gray-600">{assignment.course}</TableCell>
                        <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{assignment.totalStudents}</TableCell>
                        <TableCell>
                          <span className={assignment.submitted < assignment.totalStudents ? 'text-orange-600' : 'text-green-600'}>
                            {assignment.submitted}/{assignment.totalStudents}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={assignment.graded < assignment.submitted ? 'text-orange-600' : 'text-green-600'}>
                            {assignment.graded}/{assignment.submitted}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{assignment.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grading Tab */}
          <TabsContent value="grading" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Grading Queue</h2>
              <p className="text-gray-600">Review and grade student submissions</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search submissions..." className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  {pendingGrading.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{item.assignment}</h4>
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {item.submitted}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{item.course}</p>
                            <p className="text-sm">
                              <span className="text-gray-600">Student:</span> <span className="font-medium">{item.student}</span>
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline">
                              View Submission
                            </Button>
                            <Button>
                              Grade Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Student Performance</h2>
              <p className="text-gray-600">Track individual student progress and grades</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search students..." className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Assignments</TableHead>
                      <TableHead>Avg. Score</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Aarav Mehta</TableCell>
                      <TableCell>Mathematics - Class 6</TableCell>
                      <TableCell>12/15 completed</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">85%</span>
                          <Progress value={85} className="w-20" />
                        </div>
                      </TableCell>
                      <TableCell>95%</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Diya Sharma</TableCell>
                      <TableCell>Mathematics - Class 7</TableCell>
                      <TableCell>14/16 completed</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">92%</span>
                          <Progress value={92} className="w-20" />
                        </div>
                      </TableCell>
                      <TableCell>98%</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Arjun Reddy</TableCell>
                      <TableCell>Advanced Mathematics</TableCell>
                      <TableCell>10/14 completed</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">78%</span>
                          <Progress value={78} className="w-20" />
                        </div>
                      </TableCell>
                      <TableCell>88%</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
