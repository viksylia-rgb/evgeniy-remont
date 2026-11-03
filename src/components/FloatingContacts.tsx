import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Phone } from 'lucide-react';
import { contacts } from '../data/site';
import { TelegramIcon, WhatsAppIcon } from './ui';

/** Быстрые кнопки связи: на телефоне — панель снизу, на компьютере — колонка справа */
export default function FloatingContacts() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

  return (
    <>
      {/* Панель снизу для телефонов и планшетов: всегда на месте, чтобы позвонить можно было с любого экрана */}
      <nav aria-label="Быстрая связь" className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-paper/10 bg-ink/90 backdrop-blur-xl min-[1440px]:hidden">
        <ul className="grid grid-cols-[1.4fr_1fr_1fr]">
          <li>
            <a href={contacts.phoneHref} className="flex h-[60px] items-center justify-center gap-2 bg-gold text-[13px] font-semibold uppercase tracking-[0.12em] text-ink">
              <Phone size={17} strokeWidth={1.8} aria-hidden="true" /> Позвонить
            </a>
          </li>
          <li>
            <a href={contacts.whatsappHref} {...ext} className="flex h-[60px] items-center justify-center gap-2 text-[12px] font-medium text-paper">
              <WhatsAppIcon className="h-5 w-5 text-gold" /> WhatsApp
            </a>
          </li>
          <li>
            <a href={contacts.telegramHref} {...ext} className="flex h-[60px] items-center justify-center gap-2 border-l border-paper/10 text-[12px] font-medium text-paper">
              <TelegramIcon className="h-5 w-5 text-gold" /> Telegram
            </a>
          </li>
        </ul>
      </nav>

      {/* Колонка на компьютере появляется после первого экрана */}
      <AnimatePresence>
        {visible && (
          <motion.nav
            aria-label="Быстрая связь"
            className="fixed bottom-8 right-8 z-40 hidden flex-col gap-2 min-[1440px]:flex"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href={contacts.whatsappHref} {...ext} aria-label="Написать в WhatsApp" className="flex h-12 w-12 items-center justify-center border border-paper/15 bg-ink/85 text-paper backdrop-blur transition-colors hover:border-gold hover:text-gold">
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a href={contacts.telegramHref} {...ext} aria-label="Написать в Telegram" className="flex h-12 w-12 items-center justify-center border border-paper/15 bg-ink/85 text-paper backdrop-blur transition-colors hover:border-gold hover:text-gold">
              <TelegramIcon className="h-5 w-5" />
            </a>
            <a href={contacts.phoneHref} aria-label={`Позвонить: ${contacts.phoneDisplay}`} className="group flex h-12 items-center justify-end overflow-hidden bg-gold text-ink transition-colors hover:bg-gold-light">
              <span className="max-w-0 overflow-hidden whitespace-nowrap text-[14px] font-semibold transition-[max-width,padding] duration-500 ease-arch group-hover:max-w-[200px] group-hover:pl-5">
                {contacts.phoneDisplay}
              </span>
              <span className="flex h-12 w-12 items-center justify-center"><Phone size={18} strokeWidth={1.8} /></span>
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
