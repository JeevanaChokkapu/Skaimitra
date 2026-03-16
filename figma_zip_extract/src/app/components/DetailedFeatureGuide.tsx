import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function DetailedFeatureGuide() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Cover Page */}
        <div className="text-center mb-16 py-12 border-b-2">
          <h1 className="text-6xl font-bold mb-4 text-gray-900">SkaiMitra LMS</h1>
          <h2 className="text-3xl text-gray-700 mb-6">Comprehensive Feature Documentation</h2>
          <p className="text-xl text-gray-600 mb-8">
            Modern Learning Management System for CBSE Schools (Classes 6-8)
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Badge className="text-lg px-6 py-2">Admin Portal</Badge>
            <Badge className="text-lg px-6 py-2">Teacher Portal</Badge>
            <Badge className="text-lg px-6 py-2">Student Portal</Badge>
          </div>
          <p className="text-gray-500">Executive Review - February 2026</p>
        </div>

        {/* Executive Summary */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Executive Summary</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-lg">
                SkaiMitra LMS is a comprehensive, role-based learning management system designed specifically for CBSE schools teaching Classes 6-8. The platform provides distinct, feature-rich dashboards for three user roles:
              </p>
              <ul className="space-y-2 text-lg ml-6">
                <li><strong>Administrators:</strong> Complete oversight of users, courses, and system analytics</li>
                <li><strong>Teachers:</strong> Tools for content creation, assignment management, and student assessment</li>
                <li><strong>Students:</strong> Seamless access to courses, assignments, grades, and progress tracking</li>
              </ul>
              <p className="text-lg">
                The platform integrates with CK-12 educational resources and provides comprehensive analytics to improve learning outcomes and administrative efficiency.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Platform Overview */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Platform Overview</h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Key Differentiators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">CBSE-Aligned Content</h4>
                    <p className="text-sm text-gray-700">All course materials and assessments are mapped to CBSE curriculum standards for Classes 6, 7, and 8.</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold mb-2">CK-12 Integration</h4>
                    <p className="text-sm text-gray-700">Seamless embedding of CK-12 FlexBooks and digital textbooks directly into course modules.</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Real-Time Analytics</h4>
                    <p className="text-sm text-gray-700">Comprehensive dashboards with live data on student performance, attendance, and course completion.</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Modern UI/UX</h4>
                    <p className="text-sm text-gray-700">Clean, intuitive interface designed for ease of use across all user roles and devices.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Target Users</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Role</th>
                      <th className="text-left py-3">Primary Functions</th>
                      <th className="text-left py-3">Key Metrics</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3"><strong>Administrator</strong></td>
                      <td className="py-3">System oversight, user management, analytics</td>
                      <td className="py-3">1,247 students, 89 teachers, 156 courses</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3"><strong>Teacher</strong></td>
                      <td className="py-3">Content creation, grading, student monitoring</td>
                      <td className="py-3">4 courses, 145 students, 23 pending grades</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3"><strong>Student</strong></td>
                      <td className="py-3">Learning, assignment submission, progress tracking</td>
                      <td className="py-3">5 courses, 85% avg score, 95% attendance</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Administrator Features - Detailed */}
        <section className="mb-16 page-break">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Administrator Dashboard</h2>
          
          <Card className="mb-6">
            <CardHeader className="bg-purple-100">
              <CardTitle className="text-2xl">Overview & Purpose</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg mb-4">
                The Administrator Dashboard provides complete control over the LMS platform, with tools for managing users, monitoring courses, and analyzing system-wide performance metrics.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">1. Dashboard Overview Tab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold mb-2">Key Statistics Cards</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Total Students (1,247) with growth trend (+12%)</li>
                    <li>Total Teachers (89) with hiring metrics (+5%)</li>
                    <li>Active Courses (156) with expansion tracking (+8%)</li>
                    <li>Average Performance (78.5%) with improvement trend (+3.2%)</li>
                  </ul>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold mb-2">Visual Analytics</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li><strong>Student Enrollment Trend:</strong> Line chart showing 6-month growth from 980 to 1,247 students</li>
                    <li><strong>Course Distribution:</strong> Pie chart breaking down enrollments by subject (Mathematics, Science, English, etc.)</li>
                    <li><strong>Performance by Class:</strong> Bar chart comparing average scores for Classes 6, 7, and 8</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">2. Teacher Management Tab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Searchable table of all teachers with real-time filtering</li>
                    <li>View teacher profiles including subject specialization, student count, and active courses</li>
                    <li>Add new teachers with role assignment</li>
                    <li>Edit teacher information and permissions</li>
                    <li>Export teacher data for reporting</li>
                    <li>Track teacher activity and course statistics</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-700"><strong>Example:</strong> Dr. Rajesh Kumar - Mathematics - 145 students across 4 courses</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">3. Student Management Tab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Comprehensive student database with search and filter</li>
                    <li>View student profiles: class, courses enrolled, average score</li>
                    <li>Bulk student import/export functionality</li>
                    <li>Track individual student progress and attendance</li>
                    <li>Visual progress indicators for each student</li>
                    <li>Quick access to edit student information</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-700"><strong>Example:</strong> Aarav Mehta - Class 6-A - 5 courses - 85% average score</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">4. Course Management Tab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Overview of all courses across the platform</li>
                    <li>Monitor course completion rates and student enrollment</li>
                    <li>Assign teachers to courses</li>
                    <li>Approve or modify course content</li>
                    <li>Track course effectiveness through completion metrics</li>
                    <li>Generate course-specific reports</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">5. Analytics Tab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold mb-2">Advanced Metrics</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li><strong>Login Activity:</strong> Track student and teacher engagement by day</li>
                    <li><strong>Assignment Completion:</strong> View submission rates by class</li>
                    <li><strong>Performance Trends:</strong> Analyze score improvements over time</li>
                    <li><strong>System Usage:</strong> Monitor platform adoption and activity levels</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Teacher Features - Detailed */}
        <section className="mb-16 page-break">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Teacher Dashboard</h2>
          
          <Card className="mb-6">
            <CardHeader className="bg-blue-100">
              <CardTitle className="text-2xl">Overview & Purpose</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg mb-4">
                The Teacher Dashboard empowers educators with comprehensive tools for course creation, content management, assignment distribution, and student assessment. Integrated with CK-12 resources for CBSE-aligned content.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">1. Overview Tab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold mb-2">Quick Stats</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>My Courses: 4 active courses</li>
                    <li>Total Students: 145 across all courses</li>
                    <li>Pending Submissions: 23 awaiting grading</li>
                    <li>Average Performance: 82% across all students</li>
                  </ul>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold mb-2">Performance Analytics</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li><strong>Student Performance Trend:</strong> 6-week line chart showing improvement from 75% to 85%</li>
                    <li><strong>Assignment Submissions:</strong> Stacked bar chart showing on-time, late, and missing submissions by class</li>
                  </ul>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold mb-2">Pending Grading Queue</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Real-time list of submissions awaiting review</li>
                    <li>Displays assignment name, course, student, and submission time</li>
                    <li>One-click access to grading interface</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">2. My Courses Tab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold mb-2">Course Creation</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Create new courses with intuitive dialog form</li>
                    <li>Set course name, class, subject, and description</li>
                    <li>Select from Classes 6-8 (A and B sections)</li>
                    <li>Choose subjects: Mathematics, Science, English, Social Studies</li>
                  </ul>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold mb-2">Course Management Cards</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Visual cards displaying each course with key metrics</li>
                    <li>Student enrollment count</li>
                    <li>Total modules and completed modules</li>
                    <li>Progress percentage with visual bar</li>
                    <li>Quick actions: View Details, Manage Content</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-700"><strong>Example Course Card:</strong> Mathematics - Class 6 | 42 Students | 12 Modules | 67% Progress</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">3. Create Content Tab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold mb-2">Course Module Creation</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Add lessons and learning materials to courses</li>
                    <li>Module title and content editor</li>
                    <li>Content types: Video Lesson, Reading Material, Interactive Content, CK-12 FlexBook</li>
                    <li>File upload for resources (PDF, DOC, PPT up to 10MB)</li>
                  </ul>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold mb-2">CK-12 Integration</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li><strong>Embed CBSE-aligned FlexBooks:</strong> Direct integration with CK-12 library</li>
                    <li><strong>Subject selection:</strong> Mathematics, Science, Physics, Chemistry, Biology</li>
                    <li><strong>Grade level mapping:</strong> Classes 6, 7, and 8</li>
                    <li><strong>Resource browser:</strong> Access thousands of lessons, simulations, and assessments</li>
                    <li><strong>Easy embedding:</strong> Paste CK-12 URL or ID to integrate content</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-gray-700"><strong>Note:</strong> CK-12 FlexBooks are free, open-source, and aligned with CBSE curriculum standards, making them ideal for Indian schools.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">4. Assignments Tab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold mb-2">Assignment Creation</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Create assignments with detailed instructions</li>
                    <li>Set assignment type: Homework, Quiz, Test, or Project</li>
                    <li>Define due dates and point values</li>
                    <li>Assign to specific courses</li>
                  </ul>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold mb-2">Assignment Tracking</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Comprehensive table showing all assignments</li>
                    <li>Track submission status: Students enrolled vs. submitted vs. graded</li>
                    <li>Color-coded indicators for completion status</li>
                    <li>Edit or view assignments with one click</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">5. Grading Tab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold mb-2">Centralized Grading Queue</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>All pending submissions in one organized list</li>
                    <li>Filter by course or search by student name</li>
                    <li>Timestamp showing when assignment was submitted</li>
                    <li>Direct access to view submission and grade</li>
                  </ul>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold mb-2">Feedback System</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Provide detailed written feedback for each assignment</li>
                    <li>Assign scores and letter grades</li>
                    <li>Students receive instant notification when graded</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">6. Students Tab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold mb-2">Student Performance Monitoring</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>View all students across teacher's courses</li>
                    <li>Track individual assignment completion rates</li>
                    <li>Monitor average scores with visual progress bars</li>
                    <li>Check attendance percentages</li>
                    <li>Detailed view for in-depth student analysis</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Student Features - Detailed */}
        <section className="mb-16 page-break">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Student Dashboard</h2>
          
          <Card className="mb-6">
            <CardHeader className="bg-green-100">
              <CardTitle className="text-2xl">Overview & Purpose</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-lg mb-4">
                The Student Dashboard provides a seamless learning experience with easy access to courses, assignments, grades, and performance analytics. Designed to keep students engaged and informed about their academic progress.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">1. Overview Tab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold mb-2">At-a-Glance Dashboard</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Enrolled Courses: 5 active courses</li>
                    <li>Completed Assignments: 18 out of 25</li>
                    <li>Average Score: 85%</li>
                    <li>Attendance: 95%</li>
                  </ul>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold mb-2">Urgent Assignments Alert</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Prominent notification for assignments due soon</li>
                    <li>Quick link to view all pending assignments</li>
                    <li>Color-coded urgency indicators</li>
                  </ul>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold mb-2">Visual Analytics</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li><strong>Course Progress:</strong> Progress bars for top 3 courses with next lesson preview</li>
                    <li><strong>Performance Radar:</strong> Spider chart showing scores across all 5 subjects</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">2. My Courses Tab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold mb-2">Course Cards</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Visual card layout for each enrolled course</li>
                    <li>Displays course name, teacher, and current grade</li>
                    <li>Shows total modules and completed modules</li>
                    <li>Progress percentage with visual bar</li>
                    <li>Preview of next lesson in the course</li>
                  </ul>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold mb-2">Course Actions</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li><strong>"Continue Learning" button:</strong> Resume where you left off</li>
                    <li><strong>Course materials access:</strong> Download notes and resources</li>
                    <li><strong>Module navigation:</strong> Jump to any lesson in the course</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-700"><strong>Example:</strong> Mathematics | Dr. Rajesh Kumar | Grade: A | 8/12 modules completed (67%)</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">3. Assignments Tab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold mb-2">Upcoming Assignments</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Comprehensive table of all pending assignments</li>
                    <li>Shows assignment title, course, type (Quiz/Test/Project)</li>
                    <li>Due date with countdown (days remaining)</li>
                    <li>Point value for each assignment</li>
                    <li>Color-coded status badges:
                      <ul className="ml-6 mt-1">
                        <li>• Red: Due within 1 day</li>
                        <li>• Orange: Due within 3 days</li>
                        <li>• Gray: Upcoming</li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold mb-2">Assignment Submission</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>One-click "Submit" button for each assignment</li>
                    <li>File upload interface (PDF, DOC, DOCX up to 10MB)</li>
                    <li>Optional comments field for teacher</li>
                    <li>Submission confirmation</li>
                  </ul>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold mb-2">Completed Assignments</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>View all past submissions</li>
                    <li>See scores, grades, and submission dates</li>
                    <li>Read detailed teacher feedback</li>
                    <li>Download graded assignments</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">4. Grades & Progress Tab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold mb-2">Progress Visualization</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li><strong>Progress Trend:</strong> Line chart showing 6-week performance improvement</li>
                    <li><strong>Subject Performance:</strong> Bar chart comparing scores across all subjects</li>
                    <li><strong>Motivational Messages:</strong> Positive feedback for improving trends</li>
                  </ul>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold mb-2">Course Grades Table</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Detailed breakdown for each enrolled course</li>
                    <li>Teacher name, completed assignments, average score</li>
                    <li>Letter grade (A+, A, B+, etc.)</li>
                    <li>Visual progress bars for quick comparison</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">5. Attendance Tab</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold mb-2">Attendance Analytics</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li><strong>Attendance Trend:</strong> 6-month line chart showing consistency (92-96%)</li>
                    <li><strong>Summary Cards:</strong> Overall percentage, total present days, total absent days</li>
                    <li><strong>Current Month:</strong> Days present this month with percentage</li>
                  </ul>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold mb-2">Monthly Calendar View</h4>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    <li>Visual calendar showing each day of the month</li>
                    <li>Color-coded indicators:
                      <ul className="ml-6 mt-1">
                        <li>• Green: Present</li>
                        <li>• Red: Absent</li>
                        <li>• Gray: Weekend</li>
                        <li>• Light gray: Future dates</li>
                      </ul>
                    </li>
                    <li>Easy-to-read format for tracking attendance patterns</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technical Implementation */}
        <section className="mb-16 page-break">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Technical Implementation</h2>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Frontend Technologies</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>React 18:</strong> Modern component-based architecture</li>
                    <li><strong>TypeScript:</strong> Type-safe development</li>
                    <li><strong>Tailwind CSS:</strong> Utility-first styling</li>
                    <li><strong>Recharts:</strong> Interactive data visualization</li>
                    <li><strong>Radix UI:</strong> Accessible component primitives</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Design Features</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Responsive Design:</strong> Works on desktop, tablet, and mobile</li>
                    <li><strong>Clean Light Theme:</strong> Professional, easy on the eyes</li>
                    <li><strong>Modern Cards:</strong> Organized information display</li>
                    <li><strong>Interactive Charts:</strong> Data visualization for insights</li>
                    <li><strong>Role-Based UI:</strong> Customized for each user type</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Integration Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold mb-2">CK-12 FlexBooks</h4>
                  <p className="text-gray-700">Direct integration with CK-12's library of CBSE-aligned digital textbooks, simulations, and assessments for Classes 6-8.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold mb-2">Data Export</h4>
                  <p className="text-gray-700">Export user lists, grades, and reports in common formats for school administration.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold mb-2">Future Backend Integration</h4>
                  <p className="text-gray-700">Ready to integrate with database solutions like Supabase for real-time data synchronization, user authentication, and file storage.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Competitive Advantages */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Competitive Advantages</h2>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Why Choose EduPlatform LMS?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
                    <div>
                      <h4 className="font-semibold mb-1">CBSE-Specific Design</h4>
                      <p className="text-sm text-gray-700">Built specifically for Indian CBSE curriculum, unlike generic international platforms.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
                    <div>
                      <h4 className="font-semibold mb-1">Free Quality Content</h4>
                      <p className="text-sm text-gray-700">Integration with CK-12 provides access to thousands of free, high-quality educational resources.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
                    <div>
                      <h4 className="font-semibold mb-1">Modern User Experience</h4>
                      <p className="text-sm text-gray-700">Clean, intuitive interface that both students and teachers can use without extensive training.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">4</div>
                    <div>
                      <h4 className="font-semibold mb-1">Comprehensive Analytics</h4>
                      <p className="text-sm text-gray-700">Real-time dashboards provide insights for better decision-making at all levels.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">5</div>
                    <div>
                      <h4 className="font-semibold mb-1">Role-Based Access</h4>
                      <p className="text-sm text-gray-700">Three distinct user experiences ensure everyone has the tools they need, nothing more.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">6</div>
                    <div>
                      <h4 className="font-semibold mb-1">Scalable Architecture</h4>
                      <p className="text-sm text-gray-700">Built to grow with your school, from 100 to 10,000+ students.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Use Cases */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Real-World Use Cases</h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-xl">Use Case 1: Teacher Creates and Assigns CK-12 Content</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">1.</span>
                    <p>Dr. Rajesh Kumar logs into the Teacher Dashboard</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">2.</span>
                    <p>Navigates to "Create Content" tab and selects "Embed CK-12 Content"</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">3.</span>
                    <p>Chooses his "Mathematics - Class 6" course, selects "Mathematics" subject and "Class 6" grade level</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">4.</span>
                    <p>Opens CK-12 browser and finds a FlexBook on "Algebra Basics"</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">5.</span>
                    <p>Embeds the FlexBook URL, creating a new module in his course</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">6.</span>
                    <p>Students immediately see the new content in their course dashboard</p>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-green-50">
                <CardTitle className="text-xl">Use Case 2: Student Submits Assignment Before Deadline</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="font-bold text-green-600">1.</span>
                    <p>Aarav Mehta logs into the Student Dashboard and sees an urgent alert: "Algebra Quiz due in 1 day"</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-green-600">2.</span>
                    <p>Goes to "Assignments" tab and clicks on "Algebra Quiz - Chapter 4"</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-green-600">3.</span>
                    <p>Clicks "Submit" button, which opens the submission dialog</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-green-600">4.</span>
                    <p>Uploads his completed quiz as a PDF file</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-green-600">5.</span>
                    <p>Adds a comment: "Struggled with question 7, would appreciate feedback"</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-green-600">6.</span>
                    <p>Submits the assignment and receives confirmation</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-green-600">7.</span>
                    <p>The assignment moves to Dr. Rajesh's grading queue, and Aarav's assignment list updates to show "Submitted"</p>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-xl">Use Case 3: Admin Analyzes School Performance</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600">1.</span>
                    <p>School administrator logs into the Admin Dashboard</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600">2.</span>
                    <p>Overview shows 1,247 students with +12% growth, 156 active courses, and 78.5% average performance</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600">3.</span>
                    <p>Reviews "Student Enrollment Trend" chart showing steady growth from 980 to 1,247 over 6 months</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600">4.</span>
                    <p>Navigates to "Analytics" tab to view login activity and assignment completion rates</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600">5.</span>
                    <p>Identifies that Class 8-B has low assignment completion (81%) compared to Class 7-A (92%)</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-purple-600">6.</span>
                    <p>Exports the data and schedules a meeting with Class 8-B teachers to discuss intervention strategies</p>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Conclusion */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Conclusion & Next Steps</h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">
                EduPlatform LMS provides a complete, modern solution for CBSE schools looking to enhance their digital learning infrastructure. With dedicated portals for administrators, teachers, and students, the platform streamlines course management, improves student engagement, and provides actionable insights through comprehensive analytics.
              </p>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">Key Highlights:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Three role-based dashboards with specialized features</li>
                  <li>✓ Integration with CK-12 for free, CBSE-aligned content</li>
                  <li>✓ Real-time analytics and performance tracking</li>
                  <li>✓ Modern, intuitive user interface requiring minimal training</li>
                  <li>✓ Scalable architecture suitable for schools of all sizes</li>
                  <li>✓ Focus on Classes 6-8 with room for expansion</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-2xl">Recommended Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-lg">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600">1.</span>
                  <p><strong>Live Demo Session:</strong> Schedule a walkthrough of all three dashboards with key stakeholders</p>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600">2.</span>
                  <p><strong>Pilot Program:</strong> Select 2-3 classes to test the platform for one term</p>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600">3.</span>
                  <p><strong>Backend Integration:</strong> Connect to database for persistent data storage and user authentication</p>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600">4.</span>
                  <p><strong>Content Development:</strong> Work with teachers to create CBSE-aligned modules and assessments</p>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600">5.</span>
                  <p><strong>Training Sessions:</strong> Conduct workshops for teachers and administrators on platform usage</p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <div className="text-center py-8 border-t-2">
          <h3 className="text-2xl font-bold mb-2">EduPlatform LMS</h3>
          <p className="text-gray-600 mb-4">Transforming Education Through Technology</p>
          <p className="text-sm text-gray-500">
            For more information or to schedule a demo, please contact the development team.
          </p>
        </div>
      </div>
    </div>
  );
}