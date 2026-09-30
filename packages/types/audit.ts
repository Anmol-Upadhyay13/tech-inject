export interface AuditLogEntry {
  id: string;
  userId?: string | null;
  userEmail?: string | null;
  action: string;
  resource: string;
  details?: Record<string, unknown> | null;
  createdAt: string;
}
