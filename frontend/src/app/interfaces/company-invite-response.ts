export interface CompanyInviteResponse {
  id: number,
  recipientEmail: string,
  preliminaryCompanyName: string,
  setupToken?: string,
  setupPassword?: string
}
