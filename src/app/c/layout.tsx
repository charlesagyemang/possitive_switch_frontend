import React from 'react'
import ProtectSuperAdmin from '../shared/wrappers/auth/protect-super-admin'
import SuperAdminRoot from '../shared/wrappers/sadmin-root'

function SinglCompanyAreaLayout({children}: {children: React.ReactNode}) {
  return (
    <ProtectSuperAdmin>
      <SuperAdminRoot>{children}</SuperAdminRoot>
    </ProtectSuperAdmin>
  )
}

export default SinglCompanyAreaLayout