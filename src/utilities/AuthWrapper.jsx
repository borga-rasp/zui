import React from 'react';
import { Navigate, Outlet } from 'react-router';

const AuthWrapper = ({ isLoggedIn, redirect, hasHeader = false }) => {
  return isLoggedIn ? (
    <div className={hasHeader ? 'mt-[10vh] min-h-[90vh] h-full' : undefined}>
      <Outlet />
    </div>
  ) : (
    <Navigate to={redirect} replace={true} />
  );
};

export { AuthWrapper };
