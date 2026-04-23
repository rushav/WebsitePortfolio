// Single source of truth for all portfolio projects.
// Ordered for the terminal card grid (in-progress first, then done).
// Image paths assume /assets/images/<slug>/...

const PROJECTS = [
  {
    slug: 'intrinsic',
    name: 'Intrinsic AI Challenge',
    tagline: 'AI for Industry competition entry',
    status: 'in-progress',
    year: '2026',
    category: 'AI / Industrial Robotics',
    context:
      'Competing in the Intrinsic AI for Industry challenge — applying learning-based methods to real-world manufacturing problems.',
    approach: 'Competition details arriving June 2026.',
    technicalDetails: ['Writeup arriving June 2026.'],
    role: 'Active development.',
    techStack: ['AI', 'Robotics', 'Industrial Automation'],
    links: {},
    images: [],
    featured: false,
    sponsor: 'Open Robotics',
    glow: '#6d7bdc',
    tag: 'Industrial AI Robotics',
    when: 'Coming May 2026',
    shortDesc:
      'Competition entry applying AI to real-world industrial robotics problems. In progress. Details arriving June 2026.',
  },
  {
    slug: 'thoth',
    name: 'T-Mobile Project Thoth',
    tagline: 'Multi-agent knowledge-base platform',
    status: 'in-progress',
    year: '2026',
    category: 'Multi-agent AI',
    context:
      'Hackathon collaboration with T-Mobile to build a multi-agent system that distills subject-matter expertise into a queryable knowledge base.',
    approach: 'Writeup arriving June 2026.',
    technicalDetails: ['Writeup arriving June 2026.'],
    role: 'Active development.',
    techStack: ['Multi-Agent', 'RAG', 'LLMs', 'Python'],
    links: {},
    images: [],
    featured: false,
    sponsor: 'T-Mobile',
    glow: '#e20074',
    tag: 'Multi-agent AI',
    when: 'Coming June 2026',
    shortDesc:
      'Multi-agent platform that builds a knowledge base from subject-matter experts so clients get accurate answers faster. Hackathon with T-Mobile.',
  },
  {
    slug: 'drunky',
    name: 'Drunky',
    tagline: 'Autonomous robot bartender',
    status: 'in-progress',
    year: '2026',
    category: 'Robotics / Manipulation',
    context:
      'Bartending is repetitive, precise, and full of constrained manipulation problems — a rich sandbox for autonomous pouring and tool use.',
    approach:
      'In development. Using ROS2, computer vision for bottle/cup detection and pose estimation, and manipulation planning for autonomous pouring with volume control.',
    technicalDetails: ['Writeup arriving June 2026.'],
    role: 'Active development.',
    techStack: ['ROS2', 'Computer Vision', 'Manipulation', 'LeRobot'],
    links: {},
    images: [],
    featured: false,
    sponsor: 'UW',
    glow: '#8a62d4',
    tag: 'Robotic Manipulation',
    when: 'Coming June 2026',
    shortDesc:
      'Teaching a robot to mix drinks autonomously — vision, manipulation, pour control. Arriving June 2026.',
  },
  {
    slug: 'shoehugger',
    name: 'ShoeHugger',
    tagline: 'Autonomous person-following robot with personality',
    status: 'complete',
    year: '2025',
    category: 'Robotics',
    context:
      'TECHIN 516 robotics final project: build an autonomous robot that can navigate dynamic indoor environments and interact with people. The brief asked for autonomy; we wanted ours to have personality. "ShoeHugger" because it literally locks onto your feet.',
    approach:
      'Modified a TurtleBot3 Waffle with YOLOv8 ankle-keypoint person-following, motorized wings driven by a third Dynamixel motor, three-zone LiDAR obstacle avoidance, and two behavior modes (Attack and Stalk). The stack runs on ROS2 with SLAM, Nav2, custom TF broadcasting, and a Tkinter control UI. Everything launches from a single one-command script. Demoed live across multiple rooms with stable localization and real-time tracking.',
    technicalDetails: [
      'YOLOv8n-pose person detection with ankle keypoint tracking (imgsz=256), smoothed via an EMA-tracked locked_area for stable foot-following.',
      'SLAM-based localization stable across multi-room live demonstrations on an unmodified TurtleBot3 Waffle platform.',
      'Nav2 path planning with three-zone LiDAR obstacle avoidance (immediate-stop, slow-down, nominal).',
      'Third Dynamixel motor integration for motorized wing actuation — the expressive hardware layer behind Attack/Stalk modes.',
      'Full ROS2 launch orchestration + Tkinter control UI; entire system brought up by one command.',
    ],
    role:
      'Built the full autonomy stack — person following, obstacle avoidance, SLAM integration, behavior modes, and launch scripts. Teammates Eason (hardware/URDF) and Phoenix (pub/sub infrastructure) partnered on the embodied and message-layer pieces.',
    techStack: ['ROS2', 'SLAM', 'YOLOv8', 'Nav2', 'LiDAR', 'Python', 'TurtleBot3', 'Dynamixel', 'Docker'],
    links: {
      github: 'https://github.com/rushav/ShoeHugger-TECHIN516-Final',
    },
    images: [
      {
        src: '/assets/images/shoehugger/render-front.jpg',
        alt: 'ShoeHugger front render with wings deployed',
        caption: 'Front render — wings in Attack position.',
      },
      {
        src: '/assets/images/shoehugger/render-orthographic.jpg',
        alt: 'ShoeHugger orthographic CAD render',
        caption: 'Orthographic CAD.',
      },
      {
        src: '/assets/images/shoehugger/real-orthographic.jpg',
        alt: 'ShoeHugger physical build, orthographic view',
        caption: 'As-built hardware.',
      },
      {
        src: '/assets/images/shoehugger/inner-structure.jpg',
        alt: 'ShoeHugger internal CAD showing wing actuation',
        caption: 'Internal structure — third Dynamixel driving the wing linkage.',
        diagram: true,
      },
      {
        src: '/assets/images/shoehugger/build-02.jpg',
        alt: 'ShoeHugger during integration testing',
        caption: 'Integration testing.',
      },
      {
        src: '/assets/images/shoehugger/build-03.jpg',
        alt: 'ShoeHugger tracking a subject during live demo',
      },
      {
        src: '/assets/images/shoehugger/build-04.jpg',
        alt: 'ShoeHugger wing mechanism close-up',
      },
      {
        src: '/assets/images/shoehugger/build-05.jpg',
        alt: 'ShoeHugger multi-robot demo setup',
      },
    ],
    featured: true,
    sponsor: 'UW',
    glow: '#8a62d4',
    tag: 'Autonomous Systems',
    when: 'Finished Dec 2025',
    shortDesc:
      'Autonomous robot that stalks you using YOLO + LiDAR, then flaps its wings. Full ROS2 stack — SLAM, Nav2, person-following, two behavior modes.',
    period: 'Sep 2025 — Dec 2025',
    roleTitle: 'Autonomy Lead',
    team: '3 engineers',
    details: [
      { k: 'Platform', v: 'TurtleBot3 Waffle · 2D LiDAR · 3× Dynamixel' },
      { k: 'Runtime', v: 'ROS2 Humble on Ubuntu 22.04 · Docker' },
      { k: 'Perception', v: 'YOLOv8n-pose ankle keypoints · EMA-smoothed locked_area · imgsz=256' },
      { k: 'Navigation', v: 'Nav2 · SLAM localization · custom TF broadcast' },
      { k: 'Obstacle logic', v: 'Three-zone LiDAR: immediate-stop · slow-down · nominal' },
      { k: 'Actuation', v: 'Third Dynamixel drives the wing linkage' },
      { k: 'Controls', v: 'Tkinter UI · one-command launch for the full stack' },
    ],
    outcomes: [
      { metric: '2/2', label: 'behavior modes (Attack, Stalk) demoed live' },
      { metric: '3-zone', label: 'LiDAR obstacle logic keeps follow safe at close range' },
      { metric: 'multi-room', label: 'SLAM localization stable across demo spaces' },
      { metric: '1-cmd', label: 'ROS2 + UI brought up by a single launch script' },
    ],
    milestones: [
      {
        id: 'M1',
        title: 'Scope & platform',
        date: 'Sep 25',
        note: 'Locked the follow + greet brief. Chose TurtleBot3 Waffle so we could add the wing mechanism without a new base.',
      },
      {
        id: 'M2',
        title: 'Perception stack',
        date: 'Oct 09',
        note: 'YOLOv8n-pose ankle keypoints wired to an EMA-tracked locked_area; stable foot-lock at imgsz=256.',
      },
      {
        id: 'M3',
        title: 'SLAM & Nav2',
        date: 'Oct 23',
        note: 'Saved the lab map, stood up Nav2, and broadcast a custom TF tree so the follower could plan against the person frame.',
      },
      {
        id: 'M4',
        title: 'Behavior modes',
        date: 'Nov 06',
        note: 'Three-zone LiDAR safety + Attack / Stalk state machine. Tkinter UI exposes mode switch over ROS topics.',
      },
      {
        id: 'M5',
        title: 'Wing linkage',
        date: 'Nov 20',
        note: 'Third Dynamixel drives a four-bar wing linkage; tuned the flap cycle against the Attack-mode trigger.',
      },
      {
        id: 'M6',
        title: 'Live demo',
        date: 'Dec 10',
        note: 'End-of-quarter showcase: multi-room tracking, both modes, recovery from visual occlusion under 2 m.',
      },
    ],
  },
  {
    slug: 'vitreaclear',
    name: 'VitreaClear',
    tagline: 'Non-invasive ultrasound system for treating eye floaters',
    status: 'complete',
    year: '2025',
    category: 'Medical Devices',
    context:
      'Eye floaters affect millions of people. The only current treatment — vitrectomy — is invasive surgery with risks of retinal detachment, cataract progression, and permanent vision changes. There is a clear clinical need for a non-invasive alternative.',
    approach:
      'Designed and prototyped an ultrasound acoustic radiation force system that displaces vitreous floaters out of the visual axis without surgery. Characterized transducer beam profiles to optimize focal geometry, validated therapeutic parameters through iterative water-bath testing, and built a real-time closed-loop power controller to regulate acoustic output intensity across repeated trials. The capstone culminated in a patent-pending device, externally funded and advanced to the finals of UW’s Hollomon Health Innovation Challenge.',
    technicalDetails: [
      'Transducer beam-profile characterization with focal-geometry optimization to target the vitreous chamber without crossing the retinal plane.',
      'Real-time closed-loop power control maintaining consistent acoustic force delivery across trial repeats.',
      'Iterative water-bath validation of therapeutic parameters — transducer geometry, drive amplitude, pulse duration — across dozens of test runs.',
      'Externally-funded mechanical-engineering capstone, patent pending, Hollomon Health Innovation Challenge finalist.',
    ],
    role:
      'Led transducer system design and closed-loop power-control development in a team of four for my mechanical-engineering capstone at UW. Responsible for acoustic characterization, prototype assembly, and the Python/MATLAB signal-processing layer that closed the control loop.',
    techStack: ['SolidWorks', 'FEA', 'GD&T', 'Transducer Design', 'Signal Processing', 'MATLAB', 'Python'],
    links: {},
    images: [
      {
        src: '/assets/images/vitreaclear/rod-assembly.jpg',
        alt: 'VitreaClear prototype rod assembly during bench testing',
        caption: 'Rod-assembly prototype during June 2025 bench validation.',
      },
    ],
    featured: true,
    sponsor: 'UW',
    glow: '#8a62d4',
    tag: 'Medical Technology',
    when: 'Finished Jun 2025',
    shortDesc:
      'Prototype of an ultrasound system that pushes eye floaters out of vision without surgery. Built transducer and real-time power control loop.',
  },
  {
    slug: 'mini-desktop',
    name: 'Mini Desktop Arcade',
    tagline: 'ESP32-C3 space shooter in a miniature desktop enclosure',
    status: 'complete',
    year: '2024',
    category: 'Embedded / Hardware',
    context:
      'A personal project combining embedded development with mechanical fabrication: build a self-contained retro arcade game in a custom enclosure that looks like a miniature desktop workstation.',
    approach:
      'Wrote a vertical-scrolling space shooter in CircuitPython for an ESP32-C3 driving a 128×64 OLED. MPU-6050 accelerometer provides tap-to-shake events, a rotary encoder handles menu navigation, and three dedicated buttons run gameplay. Difficulty scaling, progressive speed increase, and a persistent high-score store are layered on top. The enclosure is a laser-cut mini desktop — monitor, tower, keyboard deck, and a base that grounds the rotary encoder.',
    technicalDetails: [
      'ESP32-C3 MCU driving 128×64 I2C OLED, MPU-6050 accelerometer, rotary encoder, 3 gameplay buttons, PWM buzzer, and a NeoPixel status LED.',
      'Custom enclosure designed as a miniature desktop workstation — OLED as monitor, keyboard-style button layout, PC-tower compartment, desk-surface base.',
      'Persistent high-score storage across power cycles; progressive difficulty and speed scaling.',
      'Full hardware-and-software build — from wiring/PCB layout to gameplay state machine.',
    ],
    role:
      'Solo end-to-end build — hardware integration, enclosure design, embedded firmware, and gameplay loop.',
    techStack: ['CircuitPython', 'ESP32-C3', 'I2C', 'MPU-6050', 'PWM', 'Fusion 360', 'Laser Cutting'],
    links: {
      github: 'https://github.com/rushav/Mini-Desktop-Arcade-Game',
    },
    images: [
      {
        src: '/assets/images/mini-desktop/rendered-desktop.png',
        alt: 'CAD render of the mini desktop arcade enclosure',
        caption: 'Fusion 360 render — tower, monitor, keyboard deck, base.',
      },
      {
        src: '/assets/images/mini-desktop/desktop-01.png',
        alt: 'Fabricated mini desktop arcade viewed from the front',
        caption: 'Fabricated enclosure — OLED monitor and keyboard-style input deck.',
      },
      {
        src: '/assets/images/mini-desktop/desktop-02.jpg',
        alt: 'Mini desktop arcade during gameplay',
        caption: 'In play.',
      },
      {
        src: '/assets/images/mini-desktop/system-diagram.png',
        alt: 'System diagram showing ESP32-C3 wiring to peripherals',
        caption: 'System wiring — ESP32-C3 to OLED, MPU, encoder, buttons, buzzer, NeoPixel.',
        diagram: true,
      },
    ],
    featured: false,
    sponsor: 'UW',
    glow: '#8a62d4',
    tag: 'Embedded Systems',
    when: 'Finished Dec 2024',
    shortDesc:
      'Custom-built a retro arcade as a mini PC — hardware and game from scratch. Because sometimes you just need to build something fun.',
  },
  {
    slug: 'synthetic-data',
    name: 'Synthetic Sleep Data',
    tagline: 'Generating realistic PSG signals for ML training',
    status: 'complete',
    year: '2025',
    category: 'Signal Processing / ML',
    context:
      'Sleep-staging classifiers need large labeled polysomnography datasets, but clinical recordings are scarce, expensive, and privacy-restricted. Synthetic data that preserves the physiological statistics of real PSG widens the training pool without the access problem.',
    approach:
      'Built a generative pipeline that produces physiologically plausible synthetic EEG, EOG, and EMG channels. Used Butterworth filtering for spectral shaping, pink-noise modeling for 1/f structure, Poisson processes for stochastic event generation, and sinusoidal HVAC simulation for ambient artifacts. Validated against real-world PSG distributions using KS tests and feature-distribution comparisons, then augmented a sleep-staging classifier with the synthetic data and measured the lift.',
    technicalDetails: [
      'Synthetic EEG/EOG/EMG channels validated against real PSG distributions via Kolmogorov-Smirnov tests and feature-correlation matching.',
      'Pink-noise + Poisson + sinusoidal-HVAC compositing for physiologically faithful background structure.',
      'Augmentation of a Random Forest sleep-staging classifier improved F1 by 11 percent over the baseline.',
      'Reduces dependency on scarce labeled clinical recordings for downstream sleep-staging models.',
    ],
    role:
      'Co-developed with collaborator Lisa. Built the signal-generation pipeline (Butterworth filtering, pink-noise and Poisson event synthesis, HVAC modeling) and ran the statistical validation end-to-end.',
    techStack: ['Python', 'Signal Processing', 'Random Forest', 'Butterworth Filters', 'NumPy', 'SciPy'],
    links: {
      github: 'https://github.com/rushav/SyntheticData-TECHIN513-Final',
    },
    images: [
      {
        src: '/assets/images/synthetic-data/example-session.png',
        alt: 'Example synthetic PSG session showing EEG EOG and EMG channels',
        caption: 'Synthetic PSG session — EEG, EOG, EMG channels over one sleep window.',
        diagram: true,
      },
      {
        src: '/assets/images/synthetic-data/signals-by-class.png',
        alt: 'Signal distributions grouped by sleep-stage class',
        caption: 'Channel signatures by sleep stage.',
      },
      {
        src: '/assets/images/synthetic-data/label-distributions.png',
        alt: 'Sleep stage label distribution across synthetic dataset',
        caption: 'Stage-label distribution across the synthetic corpus.',
      },
      {
        src: '/assets/images/synthetic-data/ks-test-comparison.png',
        alt: 'KS-test comparison of synthetic vs real signal distributions',
        caption: 'KS-test validation against real PSG distributions.',
      },
      {
        src: '/assets/images/synthetic-data/confusion-matrix.png',
        alt: 'Confusion matrix for sleep-staging classifier augmented with synthetic data',
        caption: 'Classifier confusion matrix post-augmentation.',
      },
      {
        src: '/assets/images/synthetic-data/model-performance.png',
        alt: 'Model performance comparison baseline vs augmented',
        caption: 'F1 lift vs the synthetic-free baseline.',
        diagram: true,
      },
    ],
    featured: false,
    sponsor: 'UW',
    glow: '#8a62d4',
    tag: 'Signal Processing',
    when: 'Finished Mar 2025',
    shortDesc:
      'Generated fake brain signals realistic enough to fool a sleep-staging classifier. Improved model F1 by 11% with zero real patient recordings.',
  },
  {
    slug: 'skinsafe',
    name: 'SkinSafe',
    tagline: "Mobile skin lesion classifier — DubHacks '23",
    status: 'complete',
    year: '2023',
    category: 'ML / Mobile',
    context:
      'Skin cancer is the most common cancer in the United States. Early detection dramatically improves outcomes, but most people do not have easy access to dermatological screening. A phone-based triage tool lowers that barrier.',
    approach:
      'Built an iOS app at DubHacks ’23 that classifies skin lesions from a phone camera photo. ResNet50 CNN backend fine-tuned on a dermatological image dataset, Swift iOS frontend for capture and display, and a mobile-optimized inference pipeline. Entire build shipped in 24 hours.',
    technicalDetails: [
      'ResNet50 fine-tuned on a dermatological image dataset for binary lesion classification.',
      'iOS frontend with on-device camera capture and real-time prediction display.',
      'Complete build-and-deploy cycle inside DubHacks ’23’s 24-hour window.',
    ],
    role:
      'Built the ML backend — model architecture, training pipeline, and iOS integration — in a three-person hackathon team.',
    techStack: ['PyTorch', 'ResNet50', 'Swift', 'iOS', 'Computer Vision'],
    links: {
      github: 'https://github.com/rushav/Skin-Lesion-Detector',
      devpost: 'https://devpost.com/software/skinsafe-c2f1tj',
    },
    images: [
      {
        src: '/assets/images/skinsafe/screen-01.png',
        alt: 'SkinSafe app main screen',
        caption: 'SkinSafe iOS capture view.',
      },
      {
        src: '/assets/images/skinsafe/screen-02.png',
        alt: 'SkinSafe classification result screen',
        caption: 'Classification result.',
      },
      {
        src: '/assets/images/skinsafe/screen-03.png',
        alt: 'SkinSafe result detail view',
      },
      {
        src: '/assets/images/skinsafe/screen-04.png',
        alt: 'SkinSafe secondary classification result',
      },
      {
        src: '/assets/images/skinsafe/screen-05.png',
        alt: 'SkinSafe onboarding screen',
      },
    ],
    featured: false,
    sponsor: 'UW',
    glow: '#8a62d4',
    tag: 'Machine Learning',
    when: 'Finished Mar 2023',
    shortDesc:
      "Point your phone at a skin lesion, get an instant cancer risk classification. ResNet50 backend, iOS app, built in 24 hours at DubHacks '23.",
  },
];

function getProject(slug) {
  return PROJECTS.find((p) => p.slug === slug);
}

function getAdjacentProjects(slug) {
  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? PROJECTS[idx - 1] : null,
    next: idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null,
  };
}

Object.assign(window, { PROJECTS, getProject, getAdjacentProjects });
