import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Phone } from 'lucide-react';
import { contacts, heroFacts, images } from '../data/site';

/** Число «30+», которое плавно отсчитывается при появлении */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to]);

  return <span ref={ref}>{value}</span>;
}

export default function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <picture>
        <source media="(max-width: 767px)" srcSet={images.heroMobile} />
        <motion.img
          src={images.hero}
          alt={images.heroAlt}
          className="absolute inset-x-0 top-0 -z-20 h-[58%] w-full object-cover object-center md:inset-0 md:h-full md:object-[70%_center]"
          fetchPriority="high"
          {...(reduce ? {} : { initial: { scale: 1.08 }, animate: { scale: 1 }, transition: { duration: 2.4, ease: [0.22, 1, 0.36, 1] } })}
        />
      </picture>
      {/* затемнение для читаемости текста */}
      {/* телефон: фото сверху плавно уходит в чёрный; компьютер: затемнение слева под текстом */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[58%] bg-gradient-to-b from-ink/40 via-ink/20 to-ink md:hidden" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-ink via-ink/80 to-ink/20 md:block" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 hidden h-1/2 bg-gradient-to-t from-ink to-transparent md:block" aria-hidden="true" />

      <div className="container-site flex flex-1 flex-col justify-end pb-24 pt-36 md:justify-center md:pb-28 lg:pt-44">
        <motion.p className="label flex items-center gap-4" {...rise(0.15)}>
          <span className="h-px w-10 bg-gold" aria-hidden="true" />
          Новосибирск и Новосибирская область
        </motion.p>

        <motion.h1
          id="hero-title"
          className="h-display mt-7 max-w-[980px] text-[7.6vw] md:text-[clamp(3rem,5.2vw,4.9rem)]"
          {...rise(0.3)}
        >
          Покраска стен, потолков и <span className="italic text-gold-light">металлоконструкций</span> под ключ
        </motion.h1>

        <motion.p className="mt-7 max-w-[52ch] text-[17px] leading-relaxed text-paper/75 md:text-[19px]" {...rise(0.45)}>
          Профессиональная безвоздушная покраска, ремонт квартир и отделка помещений. Более 30 лет опыта. Работа по договору с гарантией.
        </motion.p>

        <motion.div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5" {...rise(0.6)}>
          <a href={contacts.phoneHref} className="btn-gold min-h-[58px] px-9 text-[14px]">
            <Phone size={18} strokeWidth={1.8} aria-hidden="true" />
            Позвонить
          </a>
          <a href={contacts.phoneHref} className="text-[20px] font-medium tracking-[0.04em] text-paper transition-colors hover:text-gold-light">
            {contacts.phoneDisplay}
          </a>
        </motion.div>

        <motion.ul
          className="mt-12 grid lg:mt-14 max-w-[880px] grid-cols-2 border-t border-paper/15 sm:grid-cols-4"
          {...rise(0.8)}
        >
          <li className="col-span-2 flex items-baseline gap-3 border-b border-paper/15 py-5 sm:col-span-1 sm:border-b-0 sm:pr-6">
            <span className="font-display text-[54px] leading-none text-gold" aria-label="30+">
              <CountUp to={30} />+
            </span>
            <span className="text-[13px] leading-tight text-paper/70">лет<br />опыта</span>
          </li>
          {heroFacts.map((fact, i) => (
            <li
              key={fact}
              className={`flex items-center border-paper/15 py-5 pr-4 text-[13px] font-medium uppercase leading-snug tracking-[0.12em] text-paper/85 sm:border-l sm:pl-6 ${
                i === 1 ? 'border-l pl-4' : ''
              } ${i === 2 ? 'col-span-2 border-t sm:col-span-1 sm:border-t-0' : ''}`}
            >
              {fact}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
