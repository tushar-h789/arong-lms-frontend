/**
 * Branding & Theme — Aarong look & feel. Logo, color palette, typography, UI density, default language. Large text mode for field users.
 */

export type UIDensity = 'compact' | 'comfortable'

export type DefaultLanguage = 'en' | 'bn'

export type BrandingConfig = {
  logoHeaderUrl: string
  logoSidebarUrl: string
  primaryColor: string
  secondaryColor: string
  neutralColor: string
  fontFamily: string
  fontSizeBase: string
  uiDensity: UIDensity
  defaultLanguage: DefaultLanguage
  largeTextMode: boolean
}

export const FONT_OPTIONS = [
  { id: 'inter', label: 'Inter' },
  { id: 'system', label: 'System default' },
]

export const DENSITY_OPTIONS: { id: UIDensity; label: string }[] = [
  { id: 'compact', label: 'Compact' },
  { id: 'comfortable', label: 'Comfortable' },
]

export const LANGUAGE_OPTIONS: { id: DefaultLanguage; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'bn', label: 'Bengali' },
]

export const DEFAULT_BRANDING: BrandingConfig = {
  logoHeaderUrl: '',
  logoSidebarUrl: '',
  primaryColor: '#ea580c',
  secondaryColor: '#c2410c',
  neutralColor: '#6b7280',
  fontFamily: 'inter',
  fontSizeBase: '16px',
  uiDensity: 'comfortable',
  defaultLanguage: 'en',
  largeTextMode: false,
}
