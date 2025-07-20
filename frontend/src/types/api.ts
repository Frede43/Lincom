// Types basés sur les modèles Django du backend

// ===== TYPES DE BASE =====
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  username: string
  profile_picture?: string
  bio?: string
  location?: string
  phone?: string
  date_joined: string
  is_active: boolean
  role: 'student' | 'entrepreneur' | 'mentor' | 'admin'
}

export interface Profile {
  id: string
  user: User
  bio?: string
  location?: string
  phone?: string
  linkedin_url?: string
  github_url?: string
  website_url?: string
  skills: string[]
  interests: string[]
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  created_at: string
  updated_at: string
}

// ===== EDUCATION TYPES =====
export interface Course {
  id: number
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  thumbnail?: string | null
  syllabus: string
  prerequisites: string
  objectives: string
  duration_weeks: number
  is_active: boolean
  created_at: string
  updated_at: string
  instructor: number
  // Champs optionnels pour l'UI
  category?: string
  isEnrolled?: boolean
  progress?: number
  studentsCount?: number
  rating?: number
}

export interface CourseCategory {
  id: string
  name: string
  description: string
  icon?: string
  color?: string
  course_count: number
}

export interface CourseModule {
  id: string
  course: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
  duration_minutes: number
  is_published: boolean
}

export interface Lesson {
  id: string
  module: string
  title: string
  content: string
  video_url?: string
  duration_minutes: number
  order: number
  is_published: boolean
  resources: LessonResource[]
  quiz?: Quiz
}

export interface LessonResource {
  id: string
  lesson: string
  title: string
  file_url: string
  resource_type: 'pdf' | 'video' | 'audio' | 'document' | 'code'
  file_size: number
}

export interface Quiz {
  id: string
  lesson: string
  title: string
  description: string
  questions: QuizQuestion[]
  passing_score: number
  time_limit_minutes?: number
  max_attempts: number
}

export interface QuizQuestion {
  id: string
  quiz: string
  question: string
  question_type: 'multiple_choice' | 'true_false' | 'short_answer'
  options: string[]
  correct_answer: string
  explanation?: string
  order: number
}

export interface Enrollment {
  id: string
  user: User
  course: Course
  enrolled_at: string
  progress_percentage: number
  completed_at?: string
  certificate_url?: string
  is_active: boolean
}

// ===== ENTREPRENEURSHIP TYPES =====
export interface Project {
  id: string
  title: string
  description: string
  short_description: string
  founder: User
  team_members: ProjectMember[]
  category: ProjectCategory
  stage: 'idea' | 'prototype' | 'mvp' | 'growth' | 'scale'
  status: 'active' | 'paused' | 'completed' | 'cancelled'
  location: string
  website_url?: string
  github_url?: string
  demo_url?: string
  pitch_deck_url?: string
  logo?: string
  images: string[]
  tags: string[]
  funding_goal?: number
  funding_raised?: number
  currency: string
  created_at: string
  updated_at: string
  view_count: number
  like_count: number
  comment_count: number
  is_featured: boolean
}

export interface ProjectCategory {
  id: string
  name: string
  description: string
  icon?: string
  color?: string
  project_count: number
}

export interface ProjectMember {
  id: string
  project: string
  user: User
  role: string
  joined_at: string
  is_active: boolean
  permissions: string[]
}

export interface ProjectUpdate {
  id: string
  project: string
  author: User
  title: string
  content: string
  created_at: string
  is_milestone: boolean
}

export interface ProjectComment {
  id: string
  project: string
  author: User
  content: string
  created_at: string
  updated_at: string
  parent?: string
  replies: ProjectComment[]
}

// ===== LAB EQUIPMENT TYPES =====
export interface Equipment {
  id: string
  name: string
  description: string
  category: EquipmentCategory
  manufacturer: string
  model: string
  serial_number: string
  location: string
  status: 'available' | 'reserved' | 'maintenance' | 'out_of_order'
  hourly_rate: number
  currency: string
  specifications: Record<string, any>
  images: string[]
  manual_url?: string
  training_required: boolean
  created_at: string
  updated_at: string
  reservation_count: number
  rating_average: number
  rating_count: number
}

export interface EquipmentCategory {
  id: string
  name: string
  description: string
  icon?: string
  equipment_count: number
}

export interface EquipmentReservation {
  id: string
  equipment: Equipment
  user: User
  start_datetime: string
  end_datetime: string
  duration_hours: number
  purpose: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  total_cost: number
  currency: string
  notes?: string
  created_at: string
  updated_at: string
}

// ===== FORUM TYPES =====
export interface ForumCategory {
  id: string
  name: string
  description: string
  icon?: string
  color?: string
  topic_count: number
  post_count: number
  last_post?: ForumPost
  order: number
  is_active: boolean
}

export interface ForumTopic {
  id: string
  category: ForumCategory
  author: User
  title: string
  content: string
  is_pinned: boolean
  is_locked: boolean
  view_count: number
  reply_count: number
  like_count: number
  tags: string[]
  created_at: string
  updated_at: string
  last_post?: ForumPost
}

export interface ForumPost {
  id: string
  topic: string
  author: User
  content: string
  created_at: string
  updated_at: string
  like_count: number
  is_solution: boolean
  parent?: string
  replies: ForumPost[]
}

// ===== ORGANIZATION TYPES =====
export interface Organization {
  id: string
  name: string
  description: string
  type: 'university' | 'company' | 'ngo' | 'government' | 'international'
  website_url?: string
  logo?: string
  location: string
  contact_email: string
  contact_phone?: string
  partnership_type: 'sponsor' | 'mentor' | 'resource' | 'academic' | 'technical'
  is_active: boolean
  created_at: string
  projects: Project[]
  member_count: number
}

// ===== NOTIFICATION TYPES =====
export interface Notification {
  id: string
  recipient: User
  title: string
  message: string
  notification_type: 'course' | 'project' | 'forum' | 'lab' | 'system' | 'mentorship'
  related_object_id?: string
  related_object_type?: string
  is_read: boolean
  created_at: string
  action_url?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface NotificationSettings {
  id: string
  user: User
  email_notifications: boolean
  push_notifications: boolean
  sms_notifications: boolean
  course_notifications: boolean
  project_notifications: boolean
  forum_notifications: boolean
  lab_notifications: boolean
  system_notifications: boolean
  created_at: string
  updated_at: string
}

// ===== SEARCH TYPES =====
export interface SearchResult {
  id: string
  title: string
  description: string
  type: 'course' | 'project' | 'forum_topic' | 'equipment' | 'organization' | 'user'
  url: string
  thumbnail?: string
  relevance_score: number
  created_at: string
  metadata: Record<string, any>
}

export interface SearchFilters {
  type?: string[]
  category?: string[]
  date_range?: {
    start: string
    end: string
  }
  location?: string
  price_range?: {
    min: number
    max: number
  }
  rating_min?: number
  tags?: string[]
}

// ===== API RESPONSE TYPES =====
export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
  page_size: number
  current_page: number
  total_pages: number
}

export interface ApiError {
  message: string
  status: number
  field_errors?: Record<string, string[]>
  non_field_errors?: string[]
}

// ===== DASHBOARD TYPES =====
export interface DashboardStats {
  total_users: number
  total_courses: number
  total_projects: number
  total_equipment: number
  active_reservations: number
  recent_activities: Activity[]
}

export interface Activity {
  id: string
  user: User
  action: string
  object_type: string
  object_id: string
  object_name: string
  timestamp: string
  metadata: Record<string, any>
}
