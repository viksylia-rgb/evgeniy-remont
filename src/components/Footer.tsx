import { contacts, images, legal, nav } from '../data/site';

export default function Footer() {
  return (
    <footer className="border-t border-slate pb-28 pt-16 min-[1440px]:pb-16">
      <div className="container-site grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <img src={images.logo} alt="Евгений Ремонт, Новосибирск" width={900} height={300} loading="lazy" className="h-auto w-[240px]" />
        </div>
        <nav aria-label="Разделы сайта в подвале" className="md:col-span-3">
          <ul className="grid gap-3 text-[14px] text-mist">
            {nav.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="transition-colors hover:text-gold-light">{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="grid content-start gap-1.5 text-[13px] text-mist md:col-span-4">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-label text-paper">{contacts.brand}</p>
          <p>{legal.name}</p>
          <p>ИНН {legal.inn}</p>
          <p>ОГРНИП {legal.ogrnip}</p>
          <p>Новосибирск и Новосибирская область</p>
          <a href={contacts.phoneHref} className="mt-3 text-[15px] text-paper hover:text-gold-light">{contacts.phoneDisplay}</a>
        </div>
      </div>
      <div className="container-site mt-14 flex flex-col gap-2 border-t border-slate pt-6 text-[12px] text-mist/70 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {contacts.brand}</p>
        <p>Информация на сайте не является публичной офертой</p>
      </div>
    </footer>
  );
}
