// CONTENT
// ---------------------------------------------------------------------------
// This is the ONLY file that holds content. Components read from here and
// never hard-code strings.
//
// Bracket convention: any value still wrapped in [[double brackets]] is a
// placeholder that describes what belongs there, e.g. `[[Project title]]`.
// Replace the whole bracketed string (brackets included) with real content.
// Dates are written `MMM YYYY`. Anything NOT in brackets (e.g. link
// `kind`, `featured: true`) is configuration, not content.
//
// Status: everything is filled except the About photo and avatar media slots.
// media slots.
//
// To add a project, copy one of the objects in `projects` below, change its
// `slug`, and fill it in. Drop its cover at `src/assets/projects/<slug>/cover.jpg`
// and gallery images at `gallery-01.jpg`, `gallery-02.jpg`, … (Astro generates
// responsive WebP variants at build time.) Empty arrays are fine: every
// section hides itself when its list is empty.
// ---------------------------------------------------------------------------

/** The five content groups. Each gets a quiet tint (tokens.css) used wherever content is grouped. */
export type Category = 'Autonomy & Navigation' | 'Manipulation' | 'Perception' | 'Mechanical Design' | 'Software & AI';
export const categories: Category[] = [
  'Autonomy & Navigation',
  'Manipulation',
  'Perception',
  'Mechanical Design',
  'Software & AI',
];

/**
 * A sponsoring organisation. Project pages show `logo` (an SVG under
 * public/sponsors/) on a white tile; cards show `short` in the brand `color`
 * (a light-theme and a dark-theme value, each >= 4.5:1 on its surfaces).
 */
export interface Sponsor {
  name: string;
  /** Short name for the "Sponsored by" line on cards. */
  short: string;
  logo: string;
  href: string;
  color: { light: string; dark: string };
}
const UW: Sponsor = {
  name: 'University of Washington',
  short: 'UW',
  logo: '/sponsors/uw.svg',
  href: 'https://www.washington.edu/',
  color: { light: '#4b2e83', dark: '#b9a7e6' },
};
const GIX: Sponsor = {
  name: 'Global Innovation Exchange',
  short: 'GIX',
  logo: '/sponsors/gix.svg',
  href: 'https://gix.uw.edu/',
  color: { light: '#7a5c00', dark: '#fac800' },
};
const INTRINSIC: Sponsor = {
  name: 'Intrinsic',
  short: 'Intrinsic',
  logo: '/sponsors/intrinsic.svg',
  href: 'https://www.intrinsic.ai/',
  color: { light: '#007a52', dark: '#00ffab' },
};
const GOOGLE: Sponsor = {
  name: 'Google',
  short: 'Google',
  logo: '/sponsors/google.svg',
  href: 'https://www.google.com/',
  color: { light: '#1a5fc8', dark: '#8ab4f8' },
};
const TMOBILE: Sponsor = {
  name: 'T-Mobile',
  short: 'T-Mobile',
  logo: '/sponsors/tmobile.svg',
  href: 'https://www.t-mobile.com/',
  color: { light: '#d1006b', dark: '#ff6fc0' },
};

export type SocialKind = 'github' | 'linkedin' | 'scholar' | 'mail';
export type LinkKind = 'github' | 'paper' | 'demo' | 'video' | 'external';

export interface Social {
  kind: SocialKind;
  label: string;
  href: string;
}

export interface Link {
  kind: LinkKind;
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Image {
  /** Path under src/assets/, e.g. `/projects/vespr/gallery-01.jpg`. */
  src: string;
  alt: string;
}

export interface Stat {
  /** Large mono figure, e.g. `+35%` or `12 ms`. Keep it short. */
  value: string;
  /** Two short lines under the figure. */
  label: [string, string];
}

export interface Project {
  /** URL segment: /projects/<slug>/ */
  slug: string;
  /** Category eyebrow shown above the title, e.g. "Manipulation", "Perception". */
  eyebrow: string;
  title: string;
  /** Sponsoring organisations, shown as logo tiles in the project page header. */
  sponsors: Sponsor[];
  /** Primary filter category; drives the card tint and the /projects filter. */
  category: Category;
  /** Optional second category so the project also appears under that filter. */
  secondaryCategory?: Category;
  /** One line: sponsor · course · stack. */
  context: string;
  /** Two-line card description (home + index). */
  description: string;
  /** Two-line summary at the top of the project page. */
  summary: string;
  /** Most recruiter-relevant first: cards show at most 5 (or 4 + "+N"); the project page shows all. */
  tags: string[];
  links: Link[];
  /** Shown as the single hero card on the home page. Only one should be true. */
  featured: boolean;
  media: {
    /** Alt text for the cover image, or the placeholder label when `cover` is absent. */
    hero: string;
    /** Cover image path under src/assets/, e.g. `/projects/vespr/cover.jpg`. Omit to show a placeholder. */
    cover?: string;
    /** Detail images for the project page gallery (first four are shown). */
    gallery: Image[];
  };
  /** 4-up meta row. */
  role: string;
  team: string;
  timeline: string;
  stack: string;
  /** Long-form labeled blocks. */
  problem: string;
  approach: string;
  contribution: string;
  results: string[];
  /** Optional 2x2 stat tiles in the sidebar. Omit or leave empty to hide. */
  stats?: Stat[];
}

export interface Experience {
  role: string;
  org: string;
  location: string;
  /** Dominant category; drives the 3px tinted rule on the item. */
  category: Category;
  start: string;
  end: string;
  bullets: string[];
  tags: string[];
}

export interface Education {
  institution: string;
  degree: string;
  start: string;
  end: string;
  /** Logo SVG under public/, e.g. `/sponsors/uw-w.svg`, shown on a white 56x56 tile. */
  logo: string;
}

export interface SkillCategory {
  name: string;
  tools: string;
  /** Tints the icon tile. */
  category: Category;
  /** Icon name from Icon.astro. */
  icon: string;
}

export interface TechItem {
  name: string;
  /** Tints the leading dot; chips are rendered grouped by category. */
  category: Category;
}

export interface Publication {
  /** Short venue badge, e.g. "ICRA", "RSS", "TALK". */
  badge: string;
  title: string;
  venue: string;
  year: string;
  link: Link;
}

export interface AboutParagraph {
  lead: string;
  body: string;
}

export interface Site {
  name: string;
  /** Two initials for the monogram tile. */
  initials: string;
  title: string;
  descriptor: string;
  /**
   * Three lines; each is its own string so line breaks are controlled.
   * Keep each line to ~12 characters so it fits the 52px display size
   * without wrapping, e.g. "I build robots" / "that see" / "and grasp."
   */
  headline: [string, string, string];
  /** Two-line variant used on /about. */
  aboutHeadline: [string, string];
  availability: {
    from: string;
    location: string;
  };
  resumeHref: string;
  nav: NavItem[];
  socials: Social[];
  copyrightName: string;
  seo: {
    description: string;
  };
  cta: {
    headline: string;
    button: Link;
  };
  about: {
    photo: string;
    avatar: string;
    paragraphs: AboutParagraph[];
  };
  projects: Project[];
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
  tech: TechItem[];
  publications: Publication[];
}

export const site: Site = {
  name: 'Rushav Dash',
  initials: 'RD',
  title: 'Robotics & Mechatronics Engineer',
  descriptor:
    'Building bio-inspired robots with on-board autonomy, from mechanism design through the perception and control stack.',
  headline: ['Bio-inspired,', 'self-reliant', 'robots.'],
  aboutHeadline: ['Hey there,', "I'm Rushav."],
  availability: {
    from: 'March 2027',
    location: 'Seattle, WA · Open to relocation',
  },
  resumeHref: '/resume.pdf',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects/' },
    { label: 'About', href: '/about/' },
  ],
  socials: [
    { kind: 'github', label: 'GitHub', href: 'https://github.com/rushav' },
    { kind: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/rushav-dash' },
    { kind: 'mail', label: 'Email', href: 'mailto:rushavsd@gmail.com' },
  ],
  copyrightName: 'Rushav Dash',
  seo: {
    description:
      'Rushav Dash is a robotics and mechatronics engineer in Seattle focused on biomimicry and on-board autonomy. M.S. Technology Innovation (Robotics) and B.S. Mechanical Engineering, University of Washington.',
  },
  cta: {
    headline: "Let's build something that flies, grips, or perches.",
    button: { kind: 'external', label: 'Get in touch', href: 'mailto:rushavsd@gmail.com' },
  },
  about: {
    photo: '[[PHOTO 4:3]]',
    avatar: '[[AVATAR 1:1]]',
    paragraphs: [
      {
        lead: "I'm a robotics engineer with a mechanical engineering foundation, finishing my master's in robotics at the University of Washington's Global Innovation Exchange.",
        body: 'I like the part of robotics where CAD, control code, and a soldering iron all have to agree with each other. Most of what I build sits right there: the mechanism, the autonomy that drives it, and the physical prototype that proves it works.',
      },
      {
        lead: "I'm drawn to robots that borrow from biology.",
        body: 'My capstone, VESPR, is a drone with a bird-inspired perching leg that can land on a branch and hold on for hours without power, and the open-source motion-capture rig I built to test it came out of not wanting to be stuck with Windows-only vendor software. Before that I worked on a bimanual robot bartender, a fiber-optic connector insertion stack for the Intrinsic AI Challenge, and a patent-pending ultrasound device for eye floaters.',
      },
      {
        lead: "I've spent time in a few very different labs.",
        body: "I built production haptic devices at OneCourt, worked on R&D engineering at Zap Energy's fusion program, did research in the Posner Group, and currently help students run the 3D printers, laser cutters, and mills in the GIX Prototype Lab. That mix taught me to ship hardware that other people have to use, not just demo.",
      },
      {
        lead: "Outside the lab I'm usually climbing or cooking.",
        body: "Both are the same kind of problem as robotics: a plan, a lot of small adjustments, and an honest result at the end. I'm graduating in 2027 and looking for robotics roles where the hardware and the autonomy are built by the same team.",
      },
    ],
  },

  projects: [
    {
      slug: 'vespr',
      sponsors: [UW, GIX],
      eyebrow: 'GIX Capstone · In progress',
      title: 'VESPR — Bio-Inspired Autonomous Perching Drone',
      context: 'Project lead, team of 4 · 2026–27 · Vision-Enabled System for Perching and Reconnaissance',
      description:
        'A quadrotor with a bird-inspired, energy-storing perching leg that lets it land on branches and poles and hold position for hours without burning battery, aimed at wildfire reconnaissance for the WA Department of Natural Resources. I lead the mechanical design of the slow-charge / rapid-release claw and the onboard autonomy stack for vision-guided perching.',
      summary:
        'A quadrotor with a bird-inspired, energy-storing perching leg that lets it land on branches and poles and hold position for hours without burning battery, aimed at wildfire reconnaissance for the WA Department of Natural Resources. I lead the mechanical design of the slow-charge / rapid-release claw and the onboard autonomy stack for vision-guided perching.',
      category: 'Mechanical Design',
      secondaryCategory: 'Autonomy & Navigation',
      tags: ['Mechanical Design', 'Onboard Autonomy', 'Computer Vision', 'ROS 2', 'Bio-Inspired', 'Pixhawk', 'Jetson'],
      links: [{ kind: 'github', label: 'GitHub', href: 'https://github.com/cidneyho/vespr' }],
      featured: true,
      media: {
        hero: 'VESPR perching drone with its bird-inspired perching leg',
        cover: '/projects/vespr/cover.jpg',
        gallery: [],
      },
      role: 'Project lead · Mechanical lead · Motion-capture lead',
      team: '4 (Rushav Dash, Cidney Ho, John Huang, Keochonodom Taing)',
      timeline: 'Sep 2026 – Jun 2027',
      stack: 'Holybro X500 V2, Pixhawk, NVIDIA Jetson, RealSense D435i, ROS 2, Onshape, FDM printing',
      problem:
        "Fixed-position cameras and loitering drones both fail at long-duration wildfire watch: one can't move, the other can't stay up. No existing platform combines onboard vision-based perching with a passive, zero-power hold.",
      approach:
        'Elastic slow-charge / rapid-release perching leg (worm-gearmotor spring winding, two-pawl offset ratchet, Dynamixel hip) on a Holybro X500 V2 frame; vision-guided approach and perch sequence runs onboard.',
      contribution:
        'Claw and leg mechanism design in parametric CAD (~90% finalized), flight platform build-up, custom prop guards, and the ground-truth motion-capture system used to validate perch trajectories (see PANOPTES).',
      results: ['Flight platform built up.', 'Claw design ~90% finalized.', 'First perch tests scheduled.'],
    },
    {
      slug: 'panoptes',
      sponsors: [UW, GIX],
      eyebrow: 'Tooling · In progress',
      title: 'PANOPTES — Open-Source Linux Motion Capture',
      context: 'GIX · 2026 · OptiTrack Prime 13W',
      description:
        'A Linux-native motion-capture pipeline on four OptiTrack Prime 13W cameras, built because the vendor software is Windows-only and closed. Hardware-synced 120 Hz capture with intrinsic calibration at 0.32–0.39 px RMS and bundle-adjusted extrinsics at 0.45 px RMS, used as ground truth for VESPR perch trajectories.',
      summary:
        'A Linux-native motion-capture pipeline on four OptiTrack Prime 13W cameras, built because the vendor software is Windows-only and closed. Hardware-synced 120 Hz capture with intrinsic calibration at 0.32–0.39 px RMS and bundle-adjusted extrinsics at 0.45 px RMS, used as ground truth for VESPR perch trajectories.',
      category: 'Perception',
      tags: ['Computer Vision', 'Calibration', 'OpenCV', 'Python', 'Linux', 'Ground Truth'],
      links: [{ kind: 'github', label: 'GitHub', href: 'https://github.com/rushav/Panoptes' }],
      featured: false,
      media: {
        hero: 'OptiTrack Prime 13W motion-capture cameras and the PANOPTES capture pipeline',
        cover: '/projects/panoptes/cover.jpg',
        gallery: [],
      },
      role: 'Sole developer',
      team: 'Solo (within the VESPR team)',
      timeline: '2026',
      stack: 'Python, OpenCV, OptiTrack Prime 13W ×4, Linux',
      problem: "Ground-truth drone trajectories for perch testing without the vendor's Windows-only, licensed software.",
      approach:
        'Direct camera capture over the network, hardware sync, OpenCV intrinsic calibration per camera, bundle-adjusted multi-camera extrinsics, marker triangulation.',
      contribution: 'All of it.',
      results: ['4 cameras synced at 120 Hz.', '0.32–0.39 px RMS intrinsics.', '0.45 px RMS extrinsics.'],
      stats: [
        { value: '120 Hz', label: ['hardware-synced', 'capture'] },
        { value: '0.45 px', label: ['extrinsic RMS', 'reprojection'] },
        { value: '4', label: ['Prime 13W', 'cameras'] },
        { value: '0.32 px', label: ['best intrinsic', 'RMS'] },
      ],
    },
    {
      slug: 'intrinsic-aic',
      sponsors: [INTRINSIC, GOOGLE],
      eyebrow: 'Competition · Solo entry',
      title: 'Intrinsic AI Challenge — Fiber-Optic Connector Insertion',
      context: 'Intrinsic / Google DeepMind · Mar–May 2026 · UR5e in simulation',
      description:
        'A full perception-and-control stack, built solo in ten weeks, for a simulated UR5e inserting SFP and SC fiber-optic connectors into ports with randomized position, orientation, and layout and no ground-truth poses. The classical pipeline outscored the learned ACT policy 123 to 50 and shipped as the final submission.',
      summary:
        'A full perception-and-control stack, built solo in ten weeks, for a simulated UR5e inserting SFP and SC fiber-optic connectors into ports with randomized position, orientation, and layout and no ground-truth poses. The classical pipeline outscored the learned ACT policy 123 to 50 and shipped as the final submission.',
      category: 'Manipulation',
      tags: ['Manipulation', 'ROS 2', 'PyTorch', 'Impedance Control', 'Imitation Learning', 'Computer Vision', 'Docker'],
      links: [{ kind: 'github', label: 'GitHub', href: 'https://github.com/rushav/aic-workspace' }],
      featured: false,
      media: {
        hero: 'Simulated UR5e arm inserting a fiber-optic connector into a port',
        cover: '/projects/intrinsic-aic/cover.jpg',
        gallery: [],
      },
      role: 'Everything — perception, control, data collection, submissions',
      team: 'Solo',
      timeline: 'Mar 2026 – May 2026',
      stack: 'Python, ROS 2, PyTorch, LeRobot (ACT), Docker, UR5e, Gazebo',
      problem:
        'Insert small connectors into ports whose pose is unknown and randomized each episode; sub-millimeter alignment with no ground truth.',
      approach:
        'Four per-port ResNet-18 regressors with ray-plane back-projection for pose estimation; Cartesian setpoints to an impedance controller with force-gated descent (5/10/12/22 N) and stiffness modulation. Collected 530 teleoperated demos and trained an ACT policy in parallel.',
      contribution: 'All of it.',
      results: [
        'Portal score 41 → 123 across 46+ Docker submissions.',
        'Classical pipeline beat the learned policy 123 vs 50.',
      ],
      stats: [
        { value: '123', label: ['final', 'portal score'] },
        { value: '530', label: ['teleop demos', 'collected'] },
        { value: '46+', label: ['Docker', 'submissions'] },
        { value: '4', label: ['per-port', 'pose regressors'] },
      ],
    },
    {
      slug: 'drunky',
      sponsors: [UW, GIX],
      eyebrow: 'Course project · Team of 3',
      title: 'Drunky — Bimanual Vision-Servo Robot Bartender',
      context: 'GIX · Spring 2026 · Dual SO-101 arms',
      description:
        'Two 5-DoF SO-101 arms that find, grasp, and pour from miniature bottles on a shelf using a wrist-camera YOLO detector and a visual-servo alignment loop. Validated across a 480-trial grid at 62.7% success, with approach angle and occlusion isolated as the dominant failure drivers.',
      summary:
        'Two 5-DoF SO-101 arms that find, grasp, and pour from miniature bottles on a shelf using a wrist-camera YOLO detector and a visual-servo alignment loop. Validated across a 480-trial grid at 62.7% success, with approach angle and occlusion isolated as the dominant failure drivers.',
      category: 'Manipulation',
      tags: ['Manipulation', 'Visual Servoing', 'ROS 2', 'MoveIt 2', 'YOLO', 'RealSense'],
      links: [{ kind: 'github', label: 'GitHub', href: 'https://github.com/tonyechen/drunky_ros#project-evolution--from-a-learned-policy-to-a-vision-servo-pipeline' }],
      featured: false,
      media: {
        hero: 'Two SO-101 robot arms grasping miniature bottles on a shelf',
        cover: '/projects/drunky/cover.jpg',
        gallery: [],
      },
      role: 'System orchestration, wrist-camera perception, visual-servo loop',
      team: '3',
      timeline: 'Spring 2026',
      stack: 'ROS 2, MoveIt 2, YOLO, RealSense, Python, SO-101',
      problem:
        'Reliable grasping of small, reflective, partially occluded bottles from two shelf heights with low-cost arms and no fixed bottle positions.',
      approach:
        'Wrist-camera YOLO bottle detection → visual-servo alignment → MoveIt 2 grasp and pour; a state machine orchestrates both arms.',
      contribution:
        'Owned orchestration, the YOLO detector, and the visual-servo alignment loop; designed and ran the 480-trial validation grid.',
      results: ['62.7% overall success over 480 trials (71.7% top shelf vs 53.8% bottom shelf).'],
      stats: [
        { value: '62.7%', label: ['grasp-and-pour', 'success'] },
        { value: '480', label: ['validation', 'trials'] },
        { value: '71.7%', label: ['top-shelf', 'success'] },
        { value: '2', label: ['arms,', '5-DoF each'] },
      ],
    },
    {
      slug: 'shoehugger',
      sponsors: [UW, GIX],
      eyebrow: 'Course project · Team of 3',
      title: 'ShoeHugger — Autonomous Person-Following Robot',
      context: 'GIX TECHIN 516 · 2025 · TurtleBot3 Waffle',
      description:
        'A TurtleBot3 that locks onto a person via YOLOv8-pose ankle tracking and follows them through a mapped space with three-zone LiDAR safety logic, wrapped in a translucent "pet" shell with motorized wings. I owned the complete autonomy stack from perception to single-command bringup.',
      summary:
        'A TurtleBot3 that locks onto a person via YOLOv8-pose ankle tracking and follows them through a mapped space with three-zone LiDAR safety logic, wrapped in a translucent "pet" shell with motorized wings. I owned the complete autonomy stack from perception to single-command bringup.',
      category: 'Autonomy & Navigation',
      tags: ['Autonomous Navigation', 'ROS 2', 'YOLOv8', 'LiDAR', 'SLAM', 'tf2', 'Raspberry Pi'],
      links: [{ kind: 'github', label: 'GitHub', href: 'https://github.com/rushav/ShoeHugger-TECHIN516-Final' }],
      featured: false,
      media: {
        hero: 'ShoeHugger TurtleBot3 in its translucent pet shell with motorized wings',
        cover: '/projects/shoehugger/cover.jpg',
        gallery: [],
      },
      role: 'Autonomy lead',
      team: '3',
      timeline: '2025',
      stack: 'ROS 2, YOLOv8n-pose, slam_toolbox, LiDAR, Raspberry Pi 4, Docker, systemd',
      problem: 'Follow one specific person at a safe distance in a cluttered space on a Raspberry Pi 4 CPU with no GPU.',
      approach:
        'YOLOv8n-pose on CPU with EMA-smoothed target locking, three-zone LiDAR safety logic, custom tf2 broadcasting, slam_toolbox mapping, operator UI.',
      contribution: 'The full autonomy stack and single-command systemd bringup.',
      results: ['Reliable person-locking and following in live demos.', 'One-command launch from cold boot.'],
    },
    {
      slug: 'vitreaclear',
      sponsors: [UW],
      eyebrow: 'B.S. Capstone · Patent pending',
      title: 'VitreaClear — Non-Invasive Ultrasound for Eye Floaters',
      context: 'UW Mechanical Engineering · 2025 · Project lead, team of 4',
      description:
        'A therapeutic ultrasound system that displaces vitreous floaters without surgery. I led transducer system design and closed-loop acoustic power control, characterizing beam profiles through iterative water-bath testing to keep the therapeutic zone inside the vitreous chamber.',
      summary:
        'A therapeutic ultrasound system that displaces vitreous floaters without surgery. I led transducer system design and closed-loop acoustic power control, characterizing beam profiles through iterative water-bath testing to keep the therapeutic zone inside the vitreous chamber.',
      category: 'Mechanical Design',
      tags: ['Mechanical Design', 'Transducer Design', 'Control Systems', 'FEA', 'SolidWorks', 'MATLAB', 'Medical Device'],
      links: [],
      featured: false,
      media: {
        hero: 'VitreaClear therapeutic ultrasound transducer system',
        cover: '/projects/vitreaclear/cover.jpg',
        gallery: [],
      },
      role: 'Project lead · Transducer and power-control lead',
      team: '4',
      timeline: '2024–2025',
      stack: 'SolidWorks, FEA, MATLAB, Python',
      problem:
        'Existing floater treatments are laser or surgical; nothing safe and non-invasive exists for a common, vision-degrading condition.',
      approach:
        "Focused transducer geometry tuned to the eye's dimensions, closed-loop power control, water-bath beam characterization.",
      contribution: 'Transducer design, focal geometry optimization, closed-loop power control.',
      results: ['Patent pending.', 'Externally funded.', 'Hollomon Health Innovation Challenge finalist.'],
    },
    {
      slug: 'thoth',
      sponsors: [TMOBILE],
      eyebrow: 'Hackathon · GIX × T-Mobile',
      title: 'Project Thoth — Multi-Agent SME Knowledge Capture',
      context: '2026 · Team of 4 · Selected to present to T-Mobile leadership',
      description:
        'An enterprise knowledge platform where AI interviewer agents capture subject-matter-expert knowledge and a confidence-routed classifier retrieves it from per-subject vector stores with a closed-book guard. I built the backend, the classifier, and the authenticated evaluation API.',
      summary:
        'An enterprise knowledge platform where AI interviewer agents capture subject-matter-expert knowledge and a confidence-routed classifier retrieves it from per-subject vector stores with a closed-book guard. I built the backend, the classifier, and the authenticated evaluation API.',
      category: 'Software & AI',
      tags: ['LLM Agents', 'RAG', 'FastAPI', 'ChromaDB', 'Python', 'Backend'],
      links: [{ kind: 'github', label: 'GitHub', href: 'https://github.com/rushav/T-Mobile-Thoth' }],
      featured: false,
      media: {
        hero: 'Project Thoth multi-agent knowledge capture platform',
        cover: '/projects/thoth/cover.jpg',
        gallery: [],
      },
      role: 'Backend, classifier, evaluation API',
      team: '4',
      timeline: '2026',
      stack: 'FastAPI, Anthropic API, ChromaDB, Python',
      problem: 'Institutional knowledge leaves with the people who hold it; naive RAG hallucinates across subjects.',
      approach:
        'Haiku classifier routes by confidence to Sonnet SME agents; per-subject ChromaDB retrieval with a closed-book guard so answers stay cited and leak-proof.',
      contribution:
        'Backend, confidence-routed subject classifier, per-subject retrieval with the closed-book guard, and the /api/v1 benchmark surface.',
      results: ['Team selected to present to T-Mobile leadership.'],
    },
  ],

  experience: [
    {
      role: 'Production Tech Intern',
      org: 'OneCourt',
      location: 'Seattle, WA',
      category: 'Mechanical Design',
      start: 'Jun 2026',
      end: 'Sep 2026',
      bullets: [
        'Designed tactile overlays for a 100-unit production run of a haptic sports device: material selection, surface features and per-sport logo treatment, iterated against feel and durability.',
        'Built a vibration test bench that produces 3D heat maps of vibration propagation through production hardware; authored PCB packaging procedures and device-validation documentation.',
        'Assembled production units including 128-motor array soldering; refurbished 8 retired devices into a demo fleet and wrote battery and charger spec sheets with a supplier partner.',
      ],
      tags: ['Haptics', 'Vibration testing', 'DFM', 'Production assembly', 'Documentation'],
    },
    {
      role: 'Prototype Lab Assistant',
      org: 'Global Innovation Exchange, University of Washington',
      location: 'Bellevue, WA',
      category: 'Mechanical Design',
      start: 'Dec 2025',
      end: 'Present',
      bullets: [
        'Beta-tested the full robotics lab curriculum (SLAM, LiDAR obstacle avoidance, YOLO detection, sensor fusion, waypoint navigation) on hardware for 70+ graduate students, surfacing integration failures and documentation gaps before the cohort ran.',
        'Designed custom tooling and fixtures that improved part consistency; support students on FDM/SLA printing, PCB cutting and DFM.',
      ],
      tags: ['ROS 2', 'SLAM', 'LiDAR', 'YOLO', 'FDM/SLA printing', 'Fixturing'],
    },
    {
      role: 'R&D Engineering Intern',
      org: 'Zap Energy',
      location: 'Everett, WA',
      category: 'Mechanical Design',
      start: 'Summer 2023',
      end: 'Summer 2024',
      bullets: [
        'Designed a ±10-micron precision fuel injection system for fusion reactor prototypes in SolidWorks with GD&T, validated by thermal-expansion FEA at 200 °C and optimized for 5-axis CNC through design reviews with machine shops.',
        'Built an Arduino-controlled thermal cycling system holding ±0.5 °C at 250 °C using closed-loop PID and solid-state relays on a custom PCB with hardware safety interlocks.',
      ],
      tags: ['SolidWorks', 'GD&T', 'Thermal FEA', '5-axis CNC', 'PID', 'PCB design'],
    },
    {
      role: 'Research Assistant',
      org: 'Posner Research Group, University of Washington',
      location: 'Seattle, WA',
      category: 'Perception',
      start: 'Apr 2024',
      end: 'Aug 2024',
      bullets: [
        'Fabricated a biomimetic tactile finger with strain-gauge arrays via multi-layer Dragon Skin silicone molding at 6-micron layer precision.',
        'Achieved 2-micron repeatability and 0.1 N force resolution through iterative FEA and calibrated strain-to-force signal processing.',
      ],
      tags: ['Biomimicry', 'Tactile sensing', 'Silicone molding', 'FEA', 'Signal processing'],
    },
  ],

  education: [
    {
      institution: 'University of Washington',
      degree: 'M.S. Technology Innovation (Robotics) · Global Innovation Exchange',
      start: '2025',
      end: '2027',
      logo: '/sponsors/uw-w.svg',
    },
    {
      institution: 'University of Washington',
      degree: 'B.S. Mechanical Engineering',
      start: '2021',
      end: '2025',
      logo: '/sponsors/uw-w.svg',
    },
  ],

  /* Eight cells, 2x4. Tools are the resume's skill list regrouped under these headings. */
  skills: [
    {
      name: 'Robot Middleware',
      category: 'Autonomy & Navigation',
      icon: 'nodes',
      tools: 'ROS 2 (Humble, Jazzy, Kilted), PX4, tf2, MoveIt 2, slam_toolbox, LiDAR, sensor fusion, waypoint navigation',
    },
    {
      name: 'Perception & Learning',
      category: 'Perception',
      icon: 'eye',
      tools:
        'PyTorch, CNNs (ResNet-18), Transformers (ACT), imitation learning (LeRobot), YOLOv8/v11, OpenCV, camera calibration, signal processing',
    },
    {
      name: 'Embedded Hardware',
      category: 'Mechanical Design',
      icon: 'chip',
      tools: 'Arduino, Raspberry Pi, ESP32-C3, Dynamixel, PCB design, soldering, DAQ, signal conditioning',
    },
    {
      name: 'CAD & 3D Assets',
      category: 'Mechanical Design',
      icon: 'cube',
      tools: 'SolidWorks, Onshape, CadQuery, GD&T, tolerance analysis, DFM, mechanism design',
    },
    {
      name: 'Simulation & Scientific',
      category: 'Software & AI',
      icon: 'wave',
      tools: 'Gazebo, thermal & structural FEA, MATLAB, LabVIEW, Python (NumPy, SciPy)',
    },
    {
      name: 'Systems & GPU',
      category: 'Software & AI',
      icon: 'terminal',
      tools: 'Linux, Docker, systemd, Bash, Git, FastAPI, C++, NVIDIA Jetson',
    },
    {
      name: 'Fabrication & Prototyping',
      category: 'Mechanical Design',
      icon: 'wrench',
      tools: 'FDM/SLA printing, silicone molding, laser cutting, design for 5-axis CNC, fixturing, force/vibration/thermal test benches',
    },
    {
      name: 'Controls & Actuation',
      category: 'Manipulation',
      icon: 'sliders',
      tools: 'PID, impedance control, visual servoing, closed-loop power control, servo and gearmotor actuation',
    },
  ],

  /* Grouped by category family; the order here is the display order. */
  tech: [
    { name: 'ROS 2', category: 'Autonomy & Navigation' },
    { name: 'PX4', category: 'Autonomy & Navigation' },
    { name: 'slam_toolbox', category: 'Autonomy & Navigation' },
    { name: 'MoveIt 2', category: 'Manipulation' },
    { name: 'Dynamixel', category: 'Manipulation' },
    { name: 'PyTorch', category: 'Perception' },
    { name: 'OpenCV', category: 'Perception' },
    { name: 'YOLO', category: 'Perception' },
    { name: 'RealSense', category: 'Perception' },
    { name: 'SolidWorks', category: 'Mechanical Design' },
    { name: 'Onshape', category: 'Mechanical Design' },
    { name: 'CadQuery', category: 'Mechanical Design' },
    { name: 'Arduino', category: 'Mechanical Design' },
    { name: 'Raspberry Pi', category: 'Mechanical Design' },
    { name: 'Python', category: 'Software & AI' },
    { name: 'C++', category: 'Software & AI' },
    { name: 'Gazebo', category: 'Software & AI' },
    { name: 'Docker', category: 'Software & AI' },
    { name: 'Linux', category: 'Software & AI' },
    { name: 'LabVIEW', category: 'Software & AI' },
  ],

  publications: [],
};

/** Every unique tag across projects, in first-seen order (used by the index filter). */
export const allTags = (): string[] => {
  const seen = new Set<string>();
  for (const p of site.projects) for (const t of p.tags) seen.add(t);
  return [...seen];
};

export const featuredProjects = (): Project[] => {
  const featured = site.projects.filter((p) => p.featured);
  return featured.length ? featured : site.projects.slice(0, 1);
};
