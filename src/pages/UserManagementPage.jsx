import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { isEmpty } from 'lodash';
import { getLoggedInUser } from 'utilities/authUtilities.js';
import Header from '../components/Header/Header.jsx';
import ApiKeys from '../components/User/ApiKeys/ApiKeys.jsx';

function UserManagementPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isEmpty(getLoggedInUser())) {
      navigate('/home');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#090d16]" data-testid="explore-container">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="w-full">
          <ApiKeys />
        </div>
      </main>
    </div>
  );
}

export default UserManagementPage;
