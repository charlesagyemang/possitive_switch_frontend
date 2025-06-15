import SuperAdminRoot from '@/app/shared/wrappers/sadmin-root'
import React from 'react'

function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SuperAdminRoot>
        {children}
    </SuperAdminRoot>
  )
}

export default SuperAdminLayout