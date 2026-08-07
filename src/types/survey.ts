export type SurveyStatus = 'draft' | 'published' | 'archived' | 'closed' | 'scheduled';

export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'number'
  | 'phone'
  | 'email'
  | 'password'
  | 'date'
  | 'time'
  | 'datetime'
  | 'radio'
  | 'checkbox'
  | 'dropdown'
  | 'multi_select'
  | 'file_upload'
  | 'image_upload'
  | 'rating'
  | 'linear_scale'
  | 'yes_no'
  | 'address'
  | 'color_picker'
  | 'signature'
  | 'location'
  | 'section_title'
  | 'divider'
  | 'info_block'
  | 'jshshir'
  | 'passport'
  | 'student_id'
  | 'url';

export interface VisibilityRule {
  targetQuestionId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'is_filled';
  value: any;
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
  minLabel?: string;
  maxLabel?: string;
  regex?: string;
  maxLength?: number;
  minLength?: number;
  allowedFileTypes?: string[];
  maxFileSizeMb?: number;
  defaultValue?: any;
  visibilityRules?: VisibilityRule[];
  infoContent?: string;
  charCounter?: boolean;
}

export interface Question {
  id: string;
  survey_id: string;
  page_id?: string | null;
  type: QuestionType;
  label: string;
  placeholder?: string | null;
  help_text?: string | null;
  required: boolean;
  order_index: number;
  config: QuestionConfig;
  created_at?: string;
  updated_at?: string;
}

export interface SurveyPage {
  id: string;
  survey_id: string;
  title: string;
  description?: string | null;
  order_index: number;
  questions?: Question[];
}

export interface ThemeConfig {
  primaryColor: string;
  backgroundColor: string;
  cardStyle: 'glass' | 'solid' | 'bordered';
  fontFamily: string;
  headerImageUrl?: string;
  logoUrl?: string;
}

export interface Survey {
  id: string;
  title: string;
  description?: string | null;
  cover_image?: string | null;
  status: SurveyStatus;
  custom_url?: string | null;
  scheduled_at?: string | null;
  expires_at?: string | null;
  is_multistep: boolean;
  theme_config: ThemeConfig;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  pages?: SurveyPage[];
  questions?: Question[];
  responses_count?: number;
}

export interface Answer {
  id?: string;
  response_id?: string;
  question_id: string;
  value: any;
  file_urls?: string[];
}

export interface RespondentMeta {
  ip?: string;
  userAgent?: string;
  device?: 'desktop' | 'mobile' | 'tablet';
  group?: string;
  course?: string;
  gender?: string;
  region?: string;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  submission_id: string;
  respondent_meta: RespondentMeta;
  status: 'completed' | 'partial';
  started_at: string;
  completed_at: string;
  answers: Answer[];
}

export interface GoogleSheetsConfig {
  id?: string;
  survey_id: string;
  spreadsheet_id?: string | null;
  sheet_name?: string | null;
  webhook_url?: string | null;
  is_enabled: boolean;
  synced_at?: string | null;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  details: Record<string, any>;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  role: 'admin';
  created_at?: string;
  updated_at?: string;
}

export interface Statistics {
  totalSurveys: number;
  activeSurveys: number;
  totalResponses: number;
  completionRate: number;
  avgCompletionTimeSeconds: number;
}

