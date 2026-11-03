import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, Phone, X } from 'lucide-react';
import { contacts, images, nav } from '../data/site';
import { TelegramIcon, WhatsAppIcon } from './ui';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Пока открыто мобильное меню, страница под ним не прокручивается; Esc закрывает
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ease-arch ${
        scrolled || open ? 'border-b border-paper/10 bg-ink/80 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="container-site flex h-[72px] items-center justify-between gap-6 lg:h-[84px]">
        <a href="#top" className="flex shrink-0 items-center" aria-label="Евгений Ремонт — в начало страницы" onClick={() => setOpen(false)}>
          <img src={images.monogram} alt="" width={64} height={56} className="h-9 w-auto lg:hidden" />
          <img src={images.logo} alt="Евгений Ремонт, Новосибирск" width={900} height={300} className="hidden h-[52px] w-auto lg:block" />
        </a>

        <nav aria-label="Разделы сайта" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="group relative py-2 text-[13px] font-medium uppercase tracking-[0.14em] text-paper/80 transition-colors hover:text-paper">
                  {item.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 ease-arch group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-5">
          <a href={contacts.phoneHref} className="hidden whitespace-nowrap text-[15px] font-medium tracking-[0.04em] text-paper transition-colors hover:text-gold-light xl:block">
            {contacts.phoneDisplay}
          </a>
          <a href={contacts.phoneHref} className="btn-gold hidden min-h-[46px] px-6 sm:inline-flex">
            <Phone size={16} strokeWidth={1.8} aria-hidden="true" />
            Позвонить
          </a>
          <a href={contacts.phoneHref} className="flex h-11 w-11 items-center justify-center bg-gold text-ink sm:hidden" aria-label={`Позвонить: ${contacts.phoneDisplay}`}>
            <Phone size={18} strokeWidth={1.8} />
          </a>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center border border-paper/20 text-paper lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} strokeWidth={1.6} /> : <Menu size={20} strokeWidth={1.6} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 top-[calc(72px+env(safe-area-inset-top,0px))] overflow-y-auto bg-ink lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Меню" className="container-site flex min-h-full flex-col py-10">
              <ul className="border-t border-slate">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.id}
                    className="border-b border-slate"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
                  >
                    <a href={`#${item.id}`} onClick={() => setOpen(false)} className="flex items-center justify-between py-5 font-display text-[30px] uppercase leading-none text-paper">
                      {item.label}
                      <span className="text-[12px] font-sans tracking-label text-gold">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto grid gap-3 pt-10">
                <a href={contacts.phoneHref} className="btn-gold w-full">
                  <Phone size={16} aria-hidden="true" /> {contacts.phoneDisplay}
                </a>
                <div className="grid grid-cols-2 gap-3">
                  <a href={contacts.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-line">
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </a>
                  <a href={contacts.telegramHref} target="_blank" rel="noopener noreferrer" className="btn-line">
                    <TelegramIcon className="h-4 w-4" /> Telegram
                  </a>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
