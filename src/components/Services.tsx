import { useState } from 'react';
import { ArrowUpRight, PaintRoller } from 'lucide-react';
import { extraServices, services, type Service } from '../data/site';
import { Reveal, SectionHeading } from './ui';

function ServiceImage({ service }: { service: Service }) {
  const [failed, setFailed] = useState(!service.image);
  if (failed) {
    // Если фото для услуги ещё нет — аккуратная графическая плашка вместо пустого места
    return (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#171719_0%,#242426_100%)]" aria-hidden="true">
        <PaintRoller className="h-14 w-14 text-gold/60" strokeWidth={1} />
      </div>
    );
  }
  return (
    <img
      src={service.image}
      alt={service.alt}
      width={900}
      height={675}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-[1.4s] ease-arch group-hover:scale-[1.05]"
    />
  );
}

export default function Services({ onQuote }: { onQuote: (service: string) => void }) {
  return (
    <section id="uslugi" aria-labelledby="uslugi-title" className="py-24 md:py-36">
      <div className="container-site">
        <SectionHeading
          id="uslugi-title"
          label="Услуги"
          title={<>Профессиональная покраска <span className="italic text-gold-light">и отделка</span></>}
          text="Выполняем малярные и ремонтные работы на жилых, коммерческих и промышленных объектах."
        />

        <ul className="mt-16 grid gap-x-8 gap-y-14 md:mt-24 md:grid-cols-2 xl:grid-cols-3">
          {services.map((s, i) => (
            <Reveal as="li" key={s.title} delay={(i % 3) * 0.08} className="group flex flex-col">
              <article className="flex h-full flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-graphite">
                  <ServiceImage service={s} />
                  <span className="absolute left-4 top-4 bg-ink/70 px-2.5 py-1 text-[11px] font-semibold tracking-label text-gold backdrop-blur">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-7 font-display text-[28px] font-medium leading-[1.1] text-paper">{s.title}</h3>
                <p className="mt-3 text-[15px] text-mist">{s.text}</p>
                <div className="mt-auto pt-7">
                  <span className="gold-rule" aria-hidden="true" />
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-5">
                    <span className="text-[15px] font-semibold text-gold-light">{s.price}</span>
                    <button
                      type="button"
                      onClick={() => onQuote(s.title)}
                      className="inline-flex min-h-[44px] items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-paper transition-colors hover:text-gold-light"
                    >
                      Получить расчёт
                      <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-24 grid gap-8 border-t border-slate pt-12 md:grid-cols-12">
          <h3 className="label md:col-span-3 md:pt-1">Также выполняем</h3>
          <ul className="flex flex-wrap gap-x-3 gap-y-3 md:col-span-9">
            {extraServices.map((e) => (
              <li key={e} className="border border-slate px-4 py-2.5 text-[14px] text-paper/85">
                {e}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
