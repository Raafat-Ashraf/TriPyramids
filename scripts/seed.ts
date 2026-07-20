/**
 * Seed the Supabase database with realistic sample content so the site can be
 * evaluated with trips and approved reviews in place.
 *
 * Run with:  npm run seed
 *
 * Uses the service-role key (bypasses RLS). It clears the `trips` and `reviews`
 * tables first, so it's safe to re-run and always lands on the same dataset.
 * This is a demo seed — don't point it at a database with real bookings.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Minimal .env.local loader (standalone scripts don't get Next's env handling).
function loadEnv() {
  try {
    const text = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && process.env[match[1]] === undefined) {
        process.env[match[1]] = match[2].trim();
      }
    }
  } catch {
    /* fall back to whatever is already in the environment */
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;

const trips = [
  {
    title_en: 'Pyramids of Giza & the Great Sphinx',
    title_ar: 'أهرامات الجيزة وأبو الهول',
    title_ru: 'Пирамиды Гизы и Великий Сфинкс',
    title_it: 'Le Piramidi di Giza e la Grande Sfinge',
    description_en:
      'Stand before the last surviving wonder of the ancient world. A private day on the Giza plateau — the three great pyramids, the Sphinx, and a camel ride along the sands at golden hour, with an Egyptologist at your side.',
    description_ar:
      'قف أمام أعجوبة العالم القديم الباقية. يوم خاص على هضبة الجيزة — الأهرامات الثلاثة وأبو الهول وركوب الجمال على الرمال وقت الغروب، برفقة عالم مصريات.',
    description_ru:
      'Встаньте перед последним сохранившимся чудом древнего мира. Особый день на плато Гиза — три великие пирамиды, Сфинкс и катание на верблюдах по пескам в час заката, в сопровождении египтолога.',
    description_it:
      "Ammira l'ultima meraviglia sopravvissuta del mondo antico. Una giornata esclusiva sull'altopiano di Giza — le tre grandi piramidi, la Sfinge e un giro in cammello sulla sabbia al tramonto, accompagnati da un egittologo.",
    location: 'Giza, Cairo',
    price: 180,
    duration_days: 1,
    image_url: img('photo-1568322445389-f64ac2515020'),
  },
  {
    title_en: 'Luxor: Valley of the Kings & Karnak',
    title_ar: 'الأقصر: وادي الملوك ومعبد الكرنك',
    title_ru: 'Луксор: Долина царей и Карнак',
    title_it: 'Luxor: la Valle dei Re e Karnak',
    description_en:
      "The world's greatest open-air museum. Descend into the painted tombs of the pharaohs, walk the great hypostyle hall of Karnak, and cross to the West Bank temples — two unforgettable days in ancient Thebes.",
    description_ar:
      'أعظم متحف مفتوح في العالم. انزل إلى مقابر الفراعنة المزخرفة، وتجوّل في بهو الأعمدة الكبير بالكرنك، واعبر إلى معابد البر الغربي — يومان لا يُنسيان في طيبة القديمة.',
    description_ru:
      'Величайший музей под открытым небом в мире. Спуститесь в расписные гробницы фараонов, пройдите по большому гипостильному залу Карнака и переправьтесь к храмам западного берега — два незабываемых дня в древних Фивах.',
    description_it:
      "Il più grande museo a cielo aperto del mondo. Scendi nelle tombe dipinte dei faraoni, cammina nella grande sala ipostila di Karnak e attraversa verso i templi della sponda occidentale — due giorni indimenticabili nell'antica Tebe.",
    location: 'Luxor',
    price: 340,
    duration_days: 2,
    image_url: img('photo-1503177119275-0aa32b3a9368'),
  },
  {
    title_en: 'Nile Cruise: Luxor to Aswan',
    title_ar: 'رحلة نيلية: من الأقصر إلى أسوان',
    title_ru: 'Круиз по Нилу: из Луксора в Асуан',
    title_it: 'Crociera sul Nilo: da Luxor ad Assuan',
    description_en:
      'Sail the timeless Nile aboard a boutique cruiser. Four nights gliding past palm-lined banks and riverside temples — Edfu, Kom Ombo and Philae — with sunset feluccas and starlit decks.',
    description_ar:
      'أبحر في النيل الخالد على متن سفينة فاخرة. أربع ليالٍ تمرّ فيها بالضفاف المزروعة بالنخيل ومعابد النهر — إدفو وكوم أمبو وفيلة — مع فلوكة عند الغروب وسطوح تحت النجوم.',
    description_ru:
      'Плывите по вечному Нилу на борту элегантного круизного судна. Четыре ночи мимо пальмовых берегов и прибрежных храмов — Эдфу, Ком-Омбо и Филе — с фелюгами на закате и палубами под звёздным небом.',
    description_it:
      'Naviga sul Nilo eterno a bordo di una raffinata nave da crociera. Quattro notti scivolando lungo rive costeggiate da palme e templi fluviali — Edfu, Kom Ombo e File — con felucche al tramonto e ponti sotto le stelle.',
    location: 'Luxor · Aswan',
    price: 720,
    duration_days: 5,
    image_url: img('photo-1734461255986-048992c9d15d'),
  },
  {
    title_en: 'Abu Simbel Sun Temples',
    title_ar: 'معابد أبو سمبل',
    title_ru: 'Солнечные храмы Абу-Симбела',
    title_it: 'I Templi del Sole di Abu Simbel',
    description_en:
      'The colossal temples Ramses II carved into the mountain, saved from the rising Nile stone by stone. A dawn journey across the desert to stand beneath four seated giants at the edge of Nubia.',
    description_ar:
      'المعابد الضخمة التي نحتها رمسيس الثاني في الجبل، وأُنقذت من مياه النيل حجرًا حجرًا. رحلة عند الفجر عبر الصحراء لتقف تحت أربعة عمالقة على حدود النوبة.',
    description_ru:
      'Колоссальные храмы, высеченные Рамсесом II в скале, спасённые от вод Нила камень за камнем. Рассветное путешествие через пустыню, чтобы встать у подножия четырёх сидящих исполинов на границе Нубии.',
    description_it:
      "I templi colossali scolpiti da Ramesse II nella montagna, salvati dalle acque del Nilo pietra dopo pietra. Un viaggio all'alba attraverso il deserto per ammirare quattro giganti seduti ai confini della Nubia.",
    location: 'Aswan',
    price: 260,
    duration_days: 1,
    image_url: img('photo-1640005438758-861043e64aa5'),
  },
  {
    title_en: 'Cairo: Egyptian Museum & Old Cairo',
    title_ar: 'القاهرة: المتحف المصري والقاهرة القديمة',
    title_ru: 'Каир: Египетский музей и Старый Каир',
    title_it: 'Il Cairo: il Museo Egizio e il Cairo Vecchio',
    description_en:
      "The treasures of Tutankhamun, the medieval lanes of Islamic Cairo, and the spice-scented bustle of Khan el-Khalili. A full day through five thousand years of the capital's history.",
    description_ar:
      'كنوز توت عنخ آمون، وأزقة القاهرة الإسلامية العتيقة، وصخب خان الخليلي بعبق البهارات. يوم كامل عبر خمسة آلاف عام من تاريخ العاصمة.',
    description_ru:
      'Сокровища Тутанхамона, средневековые улочки исламского Каира и шумный, пропитанный ароматом специй базар Хан-эль-Халили. Целый день сквозь пять тысяч лет истории столицы.',
    description_it:
      "I tesori di Tutankhamon, i vicoli medievali del Cairo islamico e il vivace mercato speziato di Khan el-Khalili. Un'intera giornata attraverso cinquemila anni di storia della capitale.",
    location: 'Cairo',
    price: 150,
    duration_days: 1,
    image_url: img('photo-1572252009286-268acec5ca0a'),
  },
  {
    title_en: 'Giza by Sunset & Sound-and-Light',
    title_ar: 'الجيزة عند الغروب وعرض الصوت والضوء',
    title_ru: 'Гиза на закате и шоу «Звук и свет»',
    title_it: 'Giza al tramonto e lo spettacolo Suoni e Luci',
    description_en:
      'The plateau at its most magical hour. Watch the light turn the limestone to gold, then stay for the Sound-and-Light show as the story of the pharaohs is projected across the pyramids themselves.',
    description_ar:
      'الهضبة في أكثر ساعاتها سحرًا. شاهد الضوء يحيل الحجر الجيري إلى ذهب، ثم ابقَ لعرض الصوت والضوء حيث تُروى قصة الفراعنة على الأهرامات نفسها.',
    description_ru:
      'Плато в свой самый волшебный час. Смотрите, как свет превращает известняк в золото, а затем останьтесь на шоу «Звук и свет», где история фараонов оживает прямо на пирамидах.',
    description_it:
      "L'altopiano nella sua ora più magica. Guarda la luce trasformare il calcare in oro, poi resta per lo spettacolo Suoni e Luci, dove la storia dei faraoni prende vita proiettata sulle piramidi stesse.",
    location: 'Giza',
    price: 95,
    duration_days: 1,
    image_url: img('photo-1539768942893-daf53e448371'),
  },
];

/** Strip the optional ru/it columns, for the fallback insert below. */
function withoutRuIt(rows: typeof trips) {
  return rows.map(
    ({ title_ru, title_it, description_ru, description_it, ...rest }) => rest,
  );
}

// Reviews reference trips by their array index above (mapped to real ids after
// insert). `tripIndex: null` means a general review.
const reviews = [
  {
    tripIndex: 0,
    name: 'Sarah Mitchell',
    email: 'sarah.m@example.com',
    rating: 5,
    comment:
      'Standing at the foot of the Great Pyramid at sunset was the moment of a lifetime. Our guide made three thousand years feel alive. TriPyramids handled every detail flawlessly.',
  },
  {
    tripIndex: 2,
    name: 'أحمد عبد الله',
    email: null,
    rating: 5,
    comment:
      'رحلة نيلية لا تُنسى. المركب رائع، والطاقم مهتم بأدق التفاصيل، والمعابد على طول الطريق كانت مذهلة. أنصح بها بشدة.',
  },
  {
    tripIndex: 1,
    name: 'Daniel & Emma',
    email: 'de.travels@example.com',
    rating: 4,
    comment:
      'Luxor exceeded every expectation — the tombs are breathtaking. Two days felt a little short for everything there is to see, but that just means we have to come back.',
  },
  {
    tripIndex: null,
    name: 'Leïla Haddad',
    email: null,
    rating: 5,
    comment:
      'From the first email to the last goodbye, everything was warm, professional and genuinely personal. This is how travel in Egypt should feel. شكراً TriPyramids!',
  },
];

async function main() {
  const impossibleId = '00000000-0000-0000-0000-000000000000';
  console.log('Clearing existing rows…');
  await supabase.from('reviews').delete().neq('id', impossibleId);
  await supabase.from('trips').delete().neq('id', impossibleId);

  console.log('Inserting trips…');
  let { data: insertedTrips, error: tripError } = await supabase
    .from('trips')
    .insert(trips)
    .select('id, title_en');

  // title_ru/title_it are an optional migration (add-ru-it-columns.sql). If it
  // hasn't been run yet, retry without those fields rather than failing outright.
  if (tripError) {
    console.warn(
      'Insert with Russian/Italian fields failed (likely add-ru-it-columns.sql hasn\'t been run yet). Retrying without them…',
    );
    ({ data: insertedTrips, error: tripError } = await supabase
      .from('trips')
      .insert(withoutRuIt(trips))
      .select('id, title_en'));
  }

  if (tripError) {
    console.error('Trip insert failed:', tripError.message);
    process.exit(1);
  }

  // Insert order is preserved, but match by title to be safe.
  const idByTitle = new Map(
    (insertedTrips ?? []).map((t) => [t.title_en, t.id]),
  );
  const reviewRows = reviews.map((r) => ({
    trip_id:
      r.tripIndex === null ? null : idByTitle.get(trips[r.tripIndex].title_en) ?? null,
    name: r.name,
    email: r.email,
    rating: r.rating,
    comment: r.comment,
    status: 'approved' as const,
  }));

  console.log('Inserting approved reviews…');
  const { error: reviewError } = await supabase.from('reviews').insert(reviewRows);
  if (reviewError) {
    console.error('Review insert failed:', reviewError.message);
    process.exit(1);
  }

  console.log(
    `✓ Seeded ${insertedTrips?.length ?? 0} trips and ${reviewRows.length} approved reviews.`,
  );
  process.exit(0);
}

main();
