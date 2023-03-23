import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function RequireAuth({allowedRoles}) {
 const {auth} = useAuth()
 const location  = useLocation()

 return(
    auth?.role === allowedRoles || auth?.role === 'admin'
        ? <Outlet/>
        : auth?.name
        ? <Navigate to="/unauthorized" state={{from:location}} replace />
        : <Navigate to="/login" state={{from:location}} replace/>
 )
}
