export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: Pagination;
}

export interface User extends BaseEntity {
  email: string;
  full_name: string;
  avatar_url?: string | null;
  role: 'admin' | 'super_admin';
  org_id?: string | null;
}

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface QuestionConfig {
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  regex?: string;
  maxLength?: number;
  minLength?: number;
  defaultValue?: any;
  visibilityRules?: any[];
}

export interface Question extends BaseEntity {
  survey_id: string;
  page_id?: string | null;
  type: string;
  label: string;
  placeholder?: string | null;
  help_text?: string | null;
  required: boolean;
  order_index: number;
  config: QuestionConfig;
}

export interface Survey extends BaseEntity {
  title: string;
  description?: string | null;
  status: 'draft' | 'published' | 'archived' | 'closed' | 'scheduled';
  custom_url?: string | null;
  scheduled_at?: string | null;
  expires_at?: string | null;
  is_multistep: boolean;
  theme_config?: Record<string, any>;
  questions?: Question[];
  responses_count?: number;
}

export interface Answer {
  id?: string;
  question_id: string;
  value: any;
  file_urls?: string[];
}

export interface Response extends BaseEntity {
  survey_id: string;
  submission_id: string;
  respondent_meta: Record<string, any>;
  status: 'completed' | 'partial';
  started_at: string;
  completed_at: string;
  answers: Answer[];
}

export interface Statistics {
  totalSurveys: number;
  activeSurveys: number;
  totalResponses: number;
  completionRate: number;
  avgCompletionTimeSeconds: number;
}

export interface FileAsset extends BaseEntity {
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
}

export interface NotificationItem extends BaseEntity {
  title: string;
  message: string;
  is_read: boolean;
}

export interface Settings {
  autoSyncGoogleSheets: boolean;
  maxUploadSizeMb: number;
  sessionTimeoutHours: number;
}
