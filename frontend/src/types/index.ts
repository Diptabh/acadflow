export type UserRole = 'admin' | 'faculty' | 'hod' | 'student'

export interface User {
  id: string
  email: string
  role: UserRole
  name?: string
  is_active?: boolean
  created_at: string
  updated_at?: string
}

export interface Student {
  id: string
  user_id?: string
  university_roll: string
  upid?: string
  name: string
  programme: string
  year: number
  semester: number
  section?: string
  mobile?: string
  email?: string
  created_at?: string
  updated_at?: string
}

export interface Faculty {
  id: string
  user_id?: string
  name: string
  designation?: string
  department: string
  signature_url?: string
  mobile?: string
  email?: string
  created_at?: string
  updated_at?: string
}

export interface Subject {
  id: string
  code: string
  name: string
  programme: string
  semester: number
  full_marks_ca1: number
  full_marks_ca2: number
  full_marks_ca3: number
  faculty_id?: string
  faculty?: Faculty
  created_at?: string
  updated_at?: string
}

export interface CourseOutcome {
  id: string
  subject_id: string
  co_number: string
  description?: string
  bloom_level?: string
  created_at?: string
}

export type AssessmentStatus = 'draft' | 'submitted' | 'approved'

export interface CA1Assessment {
  id: string
  student_id: string
  subject_id: string
  ppt_title?: string
  ppt_url?: string
  date?: string
  submitted_by?: string
  status: AssessmentStatus
  topsheet_url?: string
  student?: Student
  criteria_marks?: CA1CriteriaMark[]
}

export interface CA1CriteriaMark {
  id: string
  assessment_id: string
  criteria_name: string
  marks_allotted: number
  marks_awarded: number
  co_id?: string
  remarks?: string
}

export interface CA2Assessment {
  id: string
  student_id: string
  subject_id: string
  assignment_title?: string
  submission_url?: string
  date?: string
  submitted_by?: string
  status: AssessmentStatus
  topsheet_url?: string
  student?: Student
  criteria_marks?: CA2CriteriaMark[]
}

export interface CA2CriteriaMark {
  id: string
  assessment_id: string
  criteria_name: string
  marks_allotted: number
  marks_awarded: number
  co_id?: string
  remarks?: string
}

export interface CA3Assessment {
  id: string
  student_id: string
  subject_id: string
  date?: string
  submitted_by?: string
  status: AssessmentStatus
  topsheet_url?: string
  student?: Student
  question_marks?: CA3QuestionMark[]
}

export interface CA3QuestionMark {
  id: string
  assessment_id: string
  question_number: string
  marks_allotted: number
  marks_awarded: number
  co_id?: string
  bloom_level?: string
  ar_reference?: string
  remarks?: string
}

export interface CombinedMarksheet {
  id: string
  student_id: string
  subject_id: string
  ca1_total: number
  ca2_total: number
  ca3_total: number
  internal_total: number
  grade?: string
  generated_at: string
  pdf_url?: string
  student?: Student
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  page_size: number
}
