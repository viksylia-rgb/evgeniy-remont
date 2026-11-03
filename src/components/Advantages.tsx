import { Award, Clock, FileSignature, Ruler, ShieldCheck, ShoppingCart, SprayCan, Users } from 'lucide-react';
import { advantages, clientTypes, images } from '../data/site';
import { Reveal } from './ui';

const icons = { award: Award, file: FileSignature, shield: ShieldCheck, spray: SprayCan, users: Users, ruler: Ruler, clock: Clock, cart: ShoppingCart };

export default function Advantages() {
  return (
    <section id="preimushchestva" aria-labelledby="preim-title" className="bg-graphite py-24 md:py-36">
      <div className="container-site grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          {/* container-type: размер заголовка считается от ширины колонки, чтобы длинное слово влезало целиком */}
          <Reveal className="[container-type:inline-size]">
            <p className="label flex items-center gap-4">
              <span className="h-px w-10 bg-gold" aria-hidden="true" />
              Почему выбирают нас
            </p>
            <h2 id="preim-title" className="h-display mt-7 text-[clamp(1.7rem,7vw,4rem)] md:text-[clamp(2.6rem,5vw,4rem)] lg:text-[clamp(2.2rem,3.4vw,3.6rem)]"
              style={{ fontSize: 'min(3.6rem, 8.8cqi)' }}
            >
              <span className="block font-display text-[clamp(6rem,16vw,11rem)] leading-[0.85] text-gold">30</span>
              лет опыта. <span className="whitespace-nowrap italic text-gold-light">Профессиональный</span> подход.
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <figure className="relative max-w-[440px] bg-paper">
              <img
                src={images.master}
                alt="Евгений, мастер по покраске, с аппаратом безвоздушной покраски"
                width={900}
                height={1268}
                loading="lazy"
                decoding="async"
                className="h-auto w-full"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-6 pb-5 pt-16">
                <span className="block font-display text-[26px] leading-none text-paper">Евгений</span>
                <span className="mt-1 block text-[12px] uppercase tracking-[0.16em] text-gold">Мастер по покраске и отделке</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:pt-4">
          <ul className="grid border-l border-t border-slate sm:grid-cols-2">
            {advantages.map((a, i) => {
              const Icon = icons[a.icon];
              return (
                <Reveal as="li" key={a.title} delay={(i % 2) * 0.08} className="group border-b border-r border-slate p-7 transition-colors duration-500 hover:bg-ink md:p-9">
                  <Icon className="h-7 w-7 text-gold transition-transform duration-500 ease-arch group-hover:-translate-y-1" strokeWidth={1.2} aria-hidden="true" />
                  <h3 className="mt-8 text-[17px] font-semibold text-paper">{a.title}</h3>
                  <p className="mt-2 text-[14.5px] text-mist">{a.text}</p>
                </Reveal>
              );
            })}
          </ul>

          <Reveal className="mt-12">
            <p className="label">Работаем с</p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-paper/85">
              {clientTypes.map((c, i) => (
                <li key={c} className="flex items-center gap-6">
                  {c}
                  {i < clientTypes.length - 1 && <span className="h-1 w-1 rounded-full bg-gold" aria-hidden="true" />}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
