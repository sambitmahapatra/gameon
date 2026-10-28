import { FeatureBlock } from '@/components/feature-block';
import { FlightSimArt, StreamingPodArt, VrArenaArt } from '@/components/feature-art';
import { Reveal } from '@/components/motion/reveal';

const FEATURES = [
  {
    eyebrow: 'VR Arena',
    heading: 'Walk around inside the game.',
    body: 'Most VR you have tried kept you standing still. Our arena tracks your body across 40 square metres, so you duck behind real cover, climb real ledges, and the headset shows you somewhere else entirely. Six wireless rigs, run by trained staff.',
    specs: ['Wireless Quest Pro', '6 free-roam players', 'Staff-run session'],
    cta: { href: '/book?zone=vr-arena', label: 'Reserve the arena' },
    art: <VrArenaArt />,
    imageSide: 'left' as const,
  },
  {
    eyebrow: 'Flight Simulator',
    heading: 'Hand-fly a 737 into a city at dusk.',
    body: 'A full cockpit replica with the switches where they belong, three curved screens, and an instructor beside you for the first circuit. Beginners take off within ten minutes. Pilots come back for the crosswind landings.',
    specs: ['Full cockpit', 'Briefing included', 'Logbook on request'],
    cta: { href: '/book?zone=flight-sim', label: 'Reserve the sim' },
    art: <FlightSimArt />,
    imageSide: 'right' as const,
  },
  {
    eyebrow: 'Streaming Pod',
    heading: 'Go live without buying a studio.',
    body: 'A sound-treated booth with the camera, mic and lighting already dialled in, and OBS scenes ready to go. Sign in to your own accounts, stream, then take the local recording home on your drive.',
    specs: ['Shure SM7B', 'Elgato lights', 'OBS preset'],
    cta: { href: '/book?zone=streaming-pod', label: 'Reserve the pod' },
    art: <StreamingPodArt />,
    imageSide: 'left' as const,
  },
];

export function SignatureExperiences() {
  return (
    <section className="section section--elevated" id="experiences">
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">Signature experiences</div>
          <h2>Three rooms you will not find in a mall arcade</h2>
          <p className="sub">
            Every zone is good. These three are the reason people take an evening off and
            travel across the city to come here.
          </p>
        </Reveal>

        {FEATURES.map((feature) => (
          <Reveal key={feature.eyebrow} className="feature-row">
            <FeatureBlock {...feature} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
