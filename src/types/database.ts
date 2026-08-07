export interface DbOrganization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbRole {
  id: string;
  name: string;
  permissions: string[];
  created_at: string;
}

export interface DbAdmin {
  id: string;
  email: string;
  role_id?: string | null;
  org_id?: string | null;
  created_at: string;
}

export interface DbProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  org_id?: string | null;
  role: 'admin' | 'super_admin';
  created_at: string;
  updated_at: string;
}

export interface DbUploadedFile {
  id: string;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface DbNotification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
