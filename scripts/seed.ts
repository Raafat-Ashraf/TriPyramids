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
    description_en:
      'Stand before the last surviving wonder of the ancient world. A private day on the Giza plateau — the three great pyramids, the Sphinx, and a camel ride along the sands at golden hour, with an Egyptologist at your side.',
    description_ar:
      'قف أمام أعجوبة العالم القديم الباقية. يوم خاص على هضبة الجيزة — الأهرامات الثلاثة وأبو الهول وركوب الجمال على الرمال وقت الغروب، برفقة عالم مصريات.',
    location: 'Giza, Cairo',
    price: 180,
    duration_days: 1,
    image_url: img('photo-1568322445389-f64ac2515020'),
  },
  {
    title_en: 'Luxor: Valley of the Kings & Karnak',
    title_ar: 'الأقصر: وادي الملوك ومعبد الكرنك',
    description_en:
      "The world's greatest open-air museum. Descend into the painted tombs of the pharaohs, walk the great hypostyle hall of Karnak, and cross to the West Bank temples — two unforgettable days in ancient Thebes.",
    description_ar:
      'أعظم متحف مفتوح في العالم. انزل إلى مقابر الفراعنة المزخرفة، وتجوّل في بهو الأعمدة الكبير بالكرنك، واعبر إلى معابد البر الغربي — يومان لا يُنسيان في طيبة القديمة.',
    location: 'Luxor',
    price: 340,
    duration_days: 2,
    image_url: img('photo-1503177119275-0aa32b3a9368'),
  },
  {
    title_en: 'Nile Cruise: Luxor to Aswan',
    title_ar: 'رحلة نيلية: من الأقصر إلى أسوان',
    description_en:
      'Sail the timeless Nile aboard a boutique cruiser. Four nights gliding past palm-lined banks and riverside temples — Edfu, Kom Ombo and Philae — with sunset feluccas and starlit decks.',
    description_ar:
      'أبحر في النيل الخالد على متن سفينة فاخرة. أربع ليالٍ تمرّ فيها بالضفاف المزروعة بالنخيل ومعابد النهر — إدفو وكوم أمبو وفيلة — مع فلوكة عند الغروب وسطوح تحت النجوم.',
    location: 'Luxor · Aswan',
    price: 720,
    duration_days: 5,
    image_url: img('photo-1734461255986-048992c9d15d'),
  },
  {
    title_en: 'Abu Simbel Sun Temples',
    title_ar: 'معابد أبو سمبل',
    description_en:
      'The colossal temples Ramses II carved into the mountain, saved from the rising Nile stone by stone. A dawn journey across the desert to stand beneath four seated giants at the edge of Nubia.',
    description_ar:
      'المعابد الضخمة التي نحتها رمسيس الثاني في الجبل، وأُنقذت من مياه النيل حجرًا حجرًا. رحلة عند الفجر عبر الصحراء لتقف تحت أربعة عمالقة على حدود النوبة.',
    location: 'Aswan',
    price: 260,
    duration_days: 1,
    image_url: img('photo-1640005438758-861043e64aa5'),
  },
  {
    title_en: 'Cairo: Egyptian Museum & Old Cairo',
    title_ar: 'القاهرة: المتحف المصري والقاهرة القديمة',
    description_en:
      "The treasures of Tutankhamun, the medieval lanes of Islamic Cairo, and the spice-scented bustle of Khan el-Khalili. A full day through five thousand years of the capital's history.",
    description_ar:
      'كنوز توت عنخ آمون، وأزقة القاهرة الإسلامية العتيقة، وصخب خان الخليلي بعبق البهارات. يوم كامل عبر خمسة آلاف عام من تاريخ العاصمة.',
    location: 'Cairo',
    price: 150,
    duration_days: 1,
    image_url: img('photo-1572252009286-268acec5ca0a'),
  },
  {
    title_en: 'Giza by Sunset & Sound-and-Light',
    title_ar: 'الجيزة عند الغروب وعرض الصوت والضوء',
    description_en:
      'The plateau at its most magical hour. Watch the light turn the limestone to gold, then stay for the Sound-and-Light show as the story of the pharaohs is projected across the pyramids themselves.',
    description_ar:
      'الهضبة في أكثر ساعاتها سحرًا. شاهد الضوء يحيل الحجر الجيري إلى ذهب، ثم ابقَ لعرض الصوت والضوء حيث تُروى قصة الفراعنة على الأهرامات نفسها.',
    location: 'Giza',
    price: 95,
    duration_days: 1,
    image_url: img('photo-1539768942893-daf53e448371'),
  },
];

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
  const { data: insertedTrips, error: tripError } = await supabase
    .from('trips')
    .insert(trips)
    .select('id, title_en');
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
