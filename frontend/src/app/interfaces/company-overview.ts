export interface CompanyOverview {
  companyId: number | null;
  setupInviteId: number | null;
  companyName: string;
  status: 'SETUP' | 'ACTIVE' | 'DISABLED';
  setupInviteStatus: string | null;
  recipientEmail: string | null;
}
