import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode, SVGProps } from 'react';

/** Плавное появление блока снизу вверх при прокрутке */
export function Reveal({ children, delay = 0, className = '', as = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'article' }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}

/** Заголовок секции: подпись, крупный заголовок, подзаголовок */
export function SectionHeading({ label, title, text, id }: { label: string; title: ReactNode; text?: string; id: string }) {
  return (
    <Reveal className="grid gap-6 md:grid-cols-12 md:gap-10">
      <div className="flex items-center gap-4 md:col-span-3 md:items-start md:pt-4">
        <span className="h-px w-10 bg-gold" aria-hidden="true" />
        <span className="label">{label}</span>
      </div>
      <div className="min-w-0 md:col-span-9">
        <h2 id={id} className="h-display text-[clamp(1.7rem,7.2vw,4.4rem)] md:text-[clamp(2.6rem,5.4vw,4.4rem)]">
          {title}
        </h2>
        {text && <p className="mt-6 max-w-[58ch] text-[17px] text-mist">{text}</p>}
      </div>
    </Reveal>
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.1-1.34A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.03.8.81-2.95-.2-.31a8.2 8.2 0 1 1 6.92 3.79Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.72-1.34.08-.16.04-.3-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47a.9.9 0 0 0-.66.31 2.77 2.77 0 0 0-.86 2.06 4.8 4.8 0 0 0 1 2.56 11 11 0 0 0 4.22 3.73c1.57.68 2.19.74 2.97.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.94 4.3 18.9 18.63c-.23 1.01-.83 1.26-1.68.79l-4.63-3.41-2.23 2.15c-.25.25-.45.45-.93.45l.33-4.72 8.59-7.76c.37-.33-.08-.52-.58-.19L7.16 12.62l-4.57-1.43c-.99-.31-1.01-.99.21-1.47L20.65 2.9c.83-.31 1.55.18 1.29 1.4Z" />
    </svg>
  );
}

export function VkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.77 17.3c-5.47 0-8.59-3.75-8.72-9.99h2.74c.09 4.58 2.11 6.52 3.71 6.92V7.31h2.58v3.95c1.58-.17 3.24-1.97 3.8-3.95h2.58a7.62 7.62 0 0 1-3.51 4.98 7.9 7.9 0 0 1 4.11 5.01h-2.84a4.94 4.94 0 0 0-4.14-3.57v3.57h-.31Z" />
    </svg>
  );
}
