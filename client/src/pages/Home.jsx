import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Facilities from '../components/home/Facilities';
import Gallery from '../components/home/Gallery';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import Contact from '../components/home/Contact';
import CTA from '../components/home/CTA';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';

export default function Home({ currentUser, onLogin, onLogout, redirectPath }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('student');

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const openRegisterModal = (tab = 'student') => {
    setActiveTab(tab);
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const closeModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        onOpenLoginModal={openLoginModal} 
        currentUser={currentUser}
        onLogout={onLogout}
      />
      
      <main className="flex-grow">
        <Hero onOpenLoginModal={openLoginModal} />
        <Features />
        <Facilities />
        <Gallery />
        <Testimonials />
        <FAQ />
        <Contact />
        <CTA onOpenLoginModal={openLoginModal} />
      </main>
      
      <Footer />
      
      {/* Auth Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeModals} 
        onShowRegister={openRegisterModal}
        onLogin={onLogin}
        redirectPath={redirectPath}
      />
      
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={closeModals} 
        onShowLogin={(tab) => {
          setActiveTab(tab);
          openLoginModal();
        }}
        initialTab={activeTab}
      />
    </div>
  );
}
