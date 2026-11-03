import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Advantages from './components/Advantages';
import Prices from './components/Prices';
import Works from './components/Works';
import Reviews from './components/Reviews';
import Process from './components/Process';
import Contacts from './components/Contacts';
import Footer from './components/Footer';
import FloatingContacts from './components/FloatingContacts';

export default function App() {
  // Услуга, выбранная кнопкой «Получить расчёт», подставляется в форму
  const [requestedService, setRequestedService] = useState<string>('');

  const requestQuote = (service = '') => {
    setRequestedService(service);
    document.getElementById('raschet')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink">
        Перейти к содержанию
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Services onQuote={requestQuote} />
        <Advantages />
        <Prices onQuote={() => requestQuote('')} />
        <Works />
        <Reviews />
        <Process />
        <Contacts requestedService={requestedService} />
      </main>
      <Footer />
      <FloatingContacts />
    </>
  );
}
