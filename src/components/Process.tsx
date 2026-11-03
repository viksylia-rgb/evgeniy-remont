import { steps } from '../data/site';
import { Reveal, SectionHeading } from './ui';

export default function Process() {
  return (
    <section id="etapy" aria-labelledby="etapy-title" className="bg-graphite py-24 md:py-36">
      <div className="container-site">
        <SectionHeading id="etapy-title" label="Как мы работаем" title={<>Простой и понятный <span className="italic text-gold-light">процесс</span></>} />

        <ol className="mt-16 grid md:mt-24 md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={(i % 3) * 0.08} className="group border-t border-slate py-9">
              <span className="font-display text-[56px] leading-none text-gold/90 transition-colors duration-500 group-hover:text-gold-light">{s.n}</span>
              <h3 className="mt-6 text-[19px] font-semibold text-paper">{s.title}</h3>
              <p className="mt-2 max-w-[34ch] text-[15px] text-mist">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
