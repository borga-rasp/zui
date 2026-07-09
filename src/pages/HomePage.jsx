// components
import React from 'react';
import Header from '../components/Header/Header.jsx';
import Home from 'components/Home/Home.jsx';

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#090d16]" data-testid="homepage-container">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <Home />
      </main>
    </div>
  );
}

export default HomePage;
