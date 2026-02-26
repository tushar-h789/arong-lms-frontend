/**
 * SSO / Authentication — corp login. SAML/OIDC, allowed domains, role mapping (SSO claim → LMS role), session duration, test login.
 */

export type SSOProvider = 'saml' | 'oidc'

export const ROLE_MAPPING_PLACEHOLDER = [
  { claim: 'department', value: 'hr', lmsRole: 'hr' },
  { claim: 'role', value: 'admin', lmsRole: 'admin' },
]
