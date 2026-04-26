export type PermissionAction = 'view' | 'create' | 'edit' | 'delete'

export type PermissionModule = {
  key: string
  label: string
  icon: 'users' | 'book' | 'clipboard' | 'badge' | 'chart' | 'settings' | 'megaphone'
}

export type PermissionRole = 'administrator' | 'teacher' | 'student' | 'parent'

export type RolePermissionRoleMeta = {
  role: PermissionRole
  name: string
  icon: 'shield' | 'graduation' | 'student' | 'parent'
  userCount: number
  description: string
  accentClass: string
}

export type RolePermissionsState = Record<PermissionRole, Record<string, Record<PermissionAction, boolean>>>

export const permissionActions: PermissionAction[] = ['view', 'create', 'edit', 'delete']

export const permissionModules: PermissionModule[] = [
  { key: 'userManagement', label: 'User Management', icon: 'users' },
  { key: 'courseManagement', label: 'Course Management', icon: 'book' },
  { key: 'assignments', label: 'Assignments', icon: 'clipboard' },
  { key: 'grading', label: 'Grading', icon: 'badge' },
  { key: 'reportsAnalytics', label: 'Reports & Analytics', icon: 'chart' },
  { key: 'systemSettings', label: 'System Settings', icon: 'settings' },
  { key: 'announcements', label: 'Announcements', icon: 'megaphone' },
]

const createPermissionSet = (enabledActions: PermissionAction[]) =>
  permissionActions.reduce<Record<PermissionAction, boolean>>((accumulator, action) => {
    accumulator[action] = enabledActions.includes(action)
    return accumulator
  }, { view: false, create: false, edit: false, delete: false })

const createDefaultRolePermissions = (overrides: Partial<Record<string, PermissionAction[]>>) =>
  permissionModules.reduce<Record<string, Record<PermissionAction, boolean>>>((accumulator, module) => {
    accumulator[module.key] = createPermissionSet(overrides[module.key] || [])
    return accumulator
  }, {})

export const createDefaultRolePermissionsState = (): RolePermissionsState => ({
  administrator: createDefaultRolePermissions({
    userManagement: ['view', 'create', 'edit', 'delete'],
    courseManagement: ['view', 'create', 'edit', 'delete'],
    assignments: ['view', 'create', 'edit', 'delete'],
    grading: ['view', 'create', 'edit', 'delete'],
    reportsAnalytics: ['view', 'create', 'edit', 'delete'],
    systemSettings: ['view', 'create', 'edit', 'delete'],
    announcements: ['view', 'create', 'edit', 'delete'],
  }),
  teacher: createDefaultRolePermissions({
    userManagement: ['view'],
    courseManagement: ['view', 'edit'],
    assignments: ['view', 'create', 'edit', 'delete'],
    grading: ['view', 'create', 'edit', 'delete'],
    reportsAnalytics: ['view'],
    systemSettings: ['view'],
    announcements: ['view', 'create', 'edit'],
  }),
  student: createDefaultRolePermissions({
    courseManagement: ['view'],
    assignments: ['view'],
    grading: ['view'],
    reportsAnalytics: ['view'],
    announcements: ['view'],
  }),
  parent: createDefaultRolePermissions({
    courseManagement: ['view'],
    assignments: ['view'],
    grading: ['view'],
    reportsAnalytics: ['view'],
    announcements: ['view'],
  }),
})

export const countActivePermissions = (permissionsByModule: Record<string, Record<PermissionAction, boolean>>) =>
  Object.values(permissionsByModule).reduce(
    (total, permissionSet) => total + permissionActions.filter((action) => permissionSet[action]).length,
    0,
  )
