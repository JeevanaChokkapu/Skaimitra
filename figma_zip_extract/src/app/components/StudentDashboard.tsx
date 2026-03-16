import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { 
  BookOpen, GraduationCap, ClipboardList, Award, Calendar, 
  BarChart3, Settings, Bell, LogOut, Play, FileText, 
  CheckCircle, Clock, Upload, Download, TrendingUp, Menu, X
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StudentDashboardProps {
  onLogout: () => void;
}

export function StudentDashboard({ onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock Data
  const stats = [
    { title: 'Enrolled Courses', value: '5', icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Completed Assignments', value: '18/25', icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Average Score', value: '85%', icon: Award, color: 'bg-purple-500' },
    { title: 'Attendance', value: '95%', icon: Calendar, color: 'bg-orange-500' }
  ];

  const enrolledCourses = [
    { 
      id: 1, 
      name: 'Mathematics', 
      teacher: 'Dr. Rajesh Kumar', 
      progress: 67, 
      grade: 'A',
      modules: 12,
      completed: 8,
      nextLesson: 'Chapter 5: Trigonometry',
      dueDate: '2026-02-15'
    },
    { 
      id: 2, 
      name: 'Science', 
      teacher: 'Ms. Priya Sharma', 
      progress: 72, 
      grade: 'A+',
      modules: 14,
      completed: 10,
      nextLesson: 'Unit 3: Chemical Reactions',
      dueDate: '2026-02-12'
    },
    { 
      id: 3, 
      name: 'English', 
      teacher: 'Mr. Amit Patel', 
      progress: 58, 
      grade: 'B+',
      modules: 10,
      completed: 6,
      nextLesson: 'Poetry Analysis',
      dueDate: '2026-02-18'
    },
    { 
      id: 4, 
      name: 'Social Studies', 
      teacher: 'Ms. Sneha Gupta', 
      progress: 80, 
      grade: 'A',
      modules: 8,
      completed: 6,
      nextLesson: 'Indian History - Mughal Empire',
      dueDate: '2026-02-10'
    },
    { 
      id: 5, 
      name: 'Hindi', 
      teacher: 'Dr. Vikram Singh', 
      progress: 85, 
      grade: 'A+',
      modules: 10,
      completed: 9,
      nextLesson: 'Grammar - Sandhi',
      dueDate: '2026-02-14'
    }
  ];

  const upcomingAssignments = [
    {
      id: 1,
      title: 'Algebra Quiz - Chapter 4',
      course: 'Mathematics',
      dueDate: '2026-02-10',
      daysLeft: 1,
      points: 50,
      type: 'Quiz',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Chemical Reactions Lab Report',
      course: 'Science',
      dueDate: '2026-02-12',
      daysLeft: 3,
      points: 100,
      type: 'Project',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Essay: My Favorite Book',
      course: 'English',
      dueDate: '2026-02-15',
      daysLeft: 6,
      points: 75,
      type: 'Assignment',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Mughal Empire Timeline',
      course: 'Social Studies',
      dueDate: '2026-02-18',
      daysLeft: 9,
      points: 50,
      type: 'Assignment',
      status: 'pending'
    }
  ];

  const completedAssignments = [
    {
      id: 5,
      title: 'Geometry Assignment',
      course: 'Mathematics',
      submittedDate: '2026-02-05',
      score: 88,
      maxScore: 100,
      grade: 'A',
      feedback: 'Excellent work! Clear understanding of concepts.'
    },
    {
      id: 6,
      title: 'Plant Cell Structure',
      course: 'Science',
      submittedDate: '2026-02-03',
      score: 95,
      maxScore: 100,
      grade: 'A+',
      feedback: 'Outstanding presentation and detail.'
    },
    {
      id: 7,
      title: 'Reading Comprehension',
      course: 'English',
      submittedDate: '2026-02-01',
      score: 78,
      maxScore: 100,
      grade: 'B+',
      feedback: 'Good effort. Work on analysis depth.'
    }
  ];

  const performanceData = [
    { subject: 'Math', score: 85 },
    { subject: 'Science', score: 92 },
    { subject: 'English', score: 78 },
    { subject: 'Social', score: 88 },
    { subject: 'Hindi', score: 90 }
  ];

  const progressData = [
    { week: 'Week 1', score: 78 },
    { week: 'Week 2', score: 80 },
    { week: 'Week 3', score: 82 },
    { week: 'Week 4', score: 85 },
    { week: 'Week 5', score: 83 },
    { week: 'Week 6', score: 87 }
  ];

  const attendanceData = [
    { month: 'Aug', rate: 92 },
    { month: 'Sep', rate: 95 },
    { month: 'Oct', rate: 93 },
    { month: 'Nov', rate: 96 },
    { month: 'Dec', rate: 94 },
    { month: 'Jan', rate: 95 }
  ];

  const recentActivity = [
    { action: 'Submitted assignment', detail: 'Geometry Assignment - Mathematics', time: '2 hours ago' },
    { action: 'Completed lesson', detail: 'Chemical Reactions - Science', time: '1 day ago' },
    { action: 'Received grade', detail: 'Reading Comprehension - English (78/100)', time: '2 days ago' },
    { action: 'Started quiz', detail: 'Algebra Quiz - Mathematics', time: '3 days ago' }
  ];

  const handleSubmitAssignment = (assignment: any) => {
    setSelectedAssignment(assignment);
    setSubmitDialogOpen(true);
  };

  const getStatusBadge = (daysLeft: number) => {
    if (daysLeft <= 1) return <Badge variant="destructive">Due Soon!</Badge>;
    if (daysLeft <= 3) return <Badge className="bg-orange-500">Due This Week</Badge>;
    return <Badge variant="secondary">Upcoming</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold">Student Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Welcome back, Aarav Mehta</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={onLogout} size="sm" className="hidden sm:flex">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 bg-white">
            <div className="px-3 py-3 space-y-2">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" onClick={onLogout} className="w-full justify-start" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="p-3 sm:p-6">
        <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setMobileMenuOpen(false); }}>
          <div className="mb-4 sm:mb-6 overflow-x-auto">
            <TabsList className="w-full sm:w-auto grid grid-cols-5 sm:inline-flex min-w-max">
              <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-4">
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">Home</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="text-xs sm:text-sm px-2 sm:px-4">
                <span className="hidden sm:inline">My Courses</span>
                <span className="sm:hidden">Courses</span>
              </TabsTrigger>
              <TabsTrigger value="assignments" className="text-xs sm:text-sm px-2 sm:px-4">
                <span className="hidden sm:inline">Assignments</span>
                <span className="sm:hidden">Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="grades" className="text-xs sm:text-sm px-2 sm:px-4">
                <span className="hidden sm:inline">Grades & Progress</span>
                <span className="sm:hidden">Grades</span>
              </TabsTrigger>
              <TabsTrigger value="attendance" className="text-xs sm:text-sm px-2 sm:px-4">
                <span className="hidden sm:inline">Attendance</span>
                <span className="sm:hidden">Attend</span>
              </TabsTrigger>
            </TabsList>
          </div>

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

            {/* Urgent Assignments Alert */}
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-900">Assignments Due Soon!</h3>
                    <p className="text-sm text-orange-700">You have 2 assignments due within the next 3 days.</p>
                  </div>
                  <Button variant="outline" onClick={() => setActiveTab('assignments')}>
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Course Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Progress</CardTitle>
                  <CardDescription>Your learning journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {enrolledCourses.slice(0, 3).map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{course.name}</span>
                        <span className="text-sm text-gray-600">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                      <p className="text-xs text-gray-600">Next: {course.nextLesson}</p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('courses')}>
                    View All Courses
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>Your scores across subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={performanceData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

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
            <div className="mb-6">
              <h2 className="text-2xl font-bold">My Courses</h2>
              <p className="text-gray-600">Access your course materials and lessons</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{course.name}</CardTitle>
                        <CardDescription>{course.teacher}</CardDescription>
                      </div>
                      <Badge className="text-lg px-3">{course.grade}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <BookOpen className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                        <p className="text-lg font-bold">{course.modules}</p>
                        <p className="text-xs text-gray-600">Total Modules</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 mx-auto mb-1 text-green-600" />
                        <p className="text-lg font-bold">{course.completed}</p>
                        <p className="text-xs text-gray-600">Completed</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} />
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Next Lesson</p>
                      <p className="font-medium text-sm">{course.nextLesson}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Continue Learning
                      </Button>
                      <Button variant="outline">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            {/* Upcoming Assignments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Assignments</CardTitle>
                <CardDescription>Complete these assignments before the deadline</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingAssignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell className="font-medium">{assignment.title}</TableCell>
                          <TableCell>{assignment.course}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{assignment.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{new Date(assignment.dueDate).toLocaleDateString()}</p>
                              <p className="text-xs text-gray-600">{assignment.daysLeft} days left</p>
                            </div>
                          </TableCell>
                          <TableCell>{assignment.points}</TableCell>
                          <TableCell>{getStatusBadge(assignment.daysLeft)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleSubmitAssignment(assignment)}>
                                Submit
                              </Button>
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {upcomingAssignments.map((assignment) => (
                    <Card key={assignment.id} className="border-2">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{assignment.title}</h4>
                            <p className="text-xs text-gray-600">{assignment.course}</p>
                          </div>
                          {getStatusBadge(assignment.daysLeft)}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-gray-600">Type</p>
                            <Badge variant="outline" className="text-xs">{assignment.type}</Badge>
                          </div>
                          <div>
                            <p className="text-gray-600">Points</p>
                            <p className="font-medium">{assignment.points}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Due Date</p>
                            <p className="font-medium">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Days Left</p>
                            <p className="font-medium">{assignment.daysLeft} days</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1" onClick={() => handleSubmitAssignment(assignment)}>
                            Submit
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Completed Assignments */}
            <Card>
              <CardHeader>
                <CardTitle>Completed Assignments</CardTitle>
                <CardDescription>Review your past submissions and feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedAssignments.map((assignment) => (
                    <Card key={assignment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{assignment.title}</h4>
                              <Badge className="text-lg px-2">{assignment.grade}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{assignment.course}</p>
                            <div className="flex items-center gap-4 text-sm mb-2">
                              <span>
                                Score: <span className="font-medium">{assignment.score}/{assignment.maxScore}</span>
                              </span>
                              <span className="text-gray-600">
                                Submitted: {new Date(assignment.submittedDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="p-2 bg-blue-50 rounded text-sm">
                              <p className="text-gray-600">Teacher Feedback:</p>
                              <p className="text-gray-800">{assignment.feedback}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grades & Progress Tab */}
          <TabsContent value="grades" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Trend</CardTitle>
                  <CardDescription>Your performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} name="Average Score" />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-4 flex items-center gap-2 text-green-600">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-medium">You're improving! Keep up the great work!</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Compare your scores across subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#8b5cf6" name="Score %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Course Grades */}
            <Card>
              <CardHeader>
                <CardTitle>Course Grades</CardTitle>
                <CardDescription>Detailed breakdown of your grades</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Assignments</TableHead>
                      <TableHead>Average Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrolledCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.name}</TableCell>
                        <TableCell>{course.teacher}</TableCell>
                        <TableCell>{course.completed}/{course.modules}</TableCell>
                        <TableCell>
                          <span className="font-semibold">{course.progress}%</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="text-base px-3">{course.grade}</Badge>
                        </TableCell>
                        <TableCell>
                          <Progress value={course.progress} className="w-24" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Trend</CardTitle>
                  <CardDescription>Your attendance over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} name="Attendance %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attendance Summary</CardTitle>
                  <CardDescription>Overview of your attendance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">95%</p>
                      <p className="text-sm text-gray-600">Overall</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-3xl font-bold text-blue-600">142</p>
                      <p className="text-sm text-gray-600">Present</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-3xl font-bold text-orange-600">8</p>
                      <p className="text-sm text-gray-600">Absent</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">This Month</span>
                      <span className="font-semibold">20/21 days</span>
                    </div>
                    <Progress value={95} className="h-3" />
                    <p className="text-sm text-green-600 font-medium">Excellent attendance! Keep it up!</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Calendar View */}
            <Card>
              <CardHeader>
                <CardTitle>This Month's Attendance</CardTitle>
                <CardDescription>February 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-sm p-2">
                      {day}
                    </div>
                  ))}
                  {[...Array(28)].map((_, i) => {
                    const isAbsent = [7, 15].includes(i + 1);
                    const isWeekend = (i % 7 === 0 || (i + 1) % 7 === 0);
                    const isFuture = i + 1 > 9;
                    return (
                      <div
                        key={i}
                        className={`
                          text-center p-3 rounded-lg border-2
                          ${isAbsent ? 'bg-red-50 border-red-200' : ''}
                          ${!isAbsent && !isWeekend && !isFuture ? 'bg-green-50 border-green-200' : ''}
                          ${isWeekend ? 'bg-gray-100' : ''}
                          ${isFuture ? 'bg-gray-50 text-gray-400' : ''}
                        `}
                      >
                        <div className="text-sm font-medium">{i + 1}</div>
                        {!isWeekend && !isFuture && (
                          <div className="text-xs mt-1">
                            {isAbsent ? '❌' : '✓'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-50 border-2 border-green-200 rounded" />
                    <span>Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-50 border-2 border-red-200 rounded" />
                    <span>Absent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 border-2 border-gray-200 rounded" />
                    <span>Weekend</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Submit Assignment Dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              {selectedAssignment?.title} - {selectedAssignment?.course}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Your Submission</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX (max 10MB)</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Comments (Optional)</Label>
              <Input placeholder="Add any notes for your teacher" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setSubmitDialogOpen(false)}>
              Submit Assignment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}