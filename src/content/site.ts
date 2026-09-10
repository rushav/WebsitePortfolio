/**
 * All site copy lives here. Edit text in this file; layout lives in src/components.
 *
 * Conventions
 *  - `[TODO: …]`  → something only Rushav can fill in (metric, link, confirmation).
 *  - `// DRAFT`   → prose written by Claude from repo READMEs / the old site; review before publishing.
 *  - `// REVIEW`  → a specific, opinionated line drafted from the repo; check it reads as your own view.
 *  - Links set to `null` are not rendered.
 *  - Image paths are relative to `public/` (the `base` prefix is added at build time).
 */

export type ProjectStatus = 'in-progress' | 'completed';

export interface ProjectLinks {
  github: string | null;
  cad: string | null;
  video: string | null;
  report: string | null;
}

export interface Project {
  slug: string;
  name: string;
  status: ProjectStatus;
  /** Hero image, 16:9. `placeholder: true` renders the neutral placeholder SVG. */
  image: { src: string; alt: string; placeholder: boolean };
  /** One line, shown collapsed. */
  description: string;
  /** 4–5 monospace tags. */
  tags: string[];
  /** "Result:" line, shown collapsed. */
  result: string;
  links: ProjectLinks;
  /** Expanded section. */
  sponsor: string;
  teamRole: string;
  longDescription: string;
  contribution: [string, string, string];
  /** Optional; the block is not rendered when absent. */
  differently?: string;
}

export interface ExperienceEntry {
  company: string;
  title: string;
  /** e.g. "Jun 2026 – Present" */
  dates: string;
  bullets: string[];
  tags: string[];
}

export const site = {
  name: 'Rushav Dash',
  title: 'Rushav Dash — Robotics Engineer',
  metaDescription:
    'Rushav Dash — robotics engineer (MS Technology Innovation, BS Mechanical Engineering, University of Washington). Projects in autonomy, machine vision, and biomimetic hardware.',
  year: 2026,
  location: 'Seattle, WA', // [TODO: confirm]
  availability: 'available April 2027',
  email: 'rushavsd@gmail.com',
  linkedin: 'https://www.linkedin.com/in/rushav-dash/',
  github: 'https://github.com/rushav',
  resume: 'resume.pdf', // public/resume.pdf
  profileImage: 'images/profile.jpg',

  hero: {
    education: [
      'MS Technology Innovation (Robotics) · University of Washington',
      'BS Mechanical Engineering · University of Washington',
    ],
    statement:
      "I'm building a career in robotics, with a focus on the more novel directions of the field — biomimicry and on-board autonomy.",
    currently: {
      text: 'Capstone — on-board machine-vision autonomous drone landing (Project Roost)',
      href: '#roost',
    },
    previously: [
      'OneCourt',
      'Zap Energy',
      'Posner Research Group',
      'Integrated Fabrication Lab',
      'GIX',
    ],
  },

  contact: {
    lead: 'Open to robotics and mechatronics roles',
  },
};

export const projects: Project[] = [
  // 1 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'roost',
    name: 'Project Roost',
    status: 'in-progress',
    image: {
      src: 'images/projects/roost/placeholder.svg',
      alt: 'Project Roost — image placeholder',
      placeholder: true, // [TODO: add a 16:9 image or video of the drone]
    },
    // DRAFT
    description:
      'Bio-inspired quadcopter that perches autonomously using on-board machine vision.',
    tags: ['TBD'],
    result: 'TBD',
    links: { github: null, cad: null, video: null, report: null }, // [TODO: add links when public]
    sponsor: 'None (student-led)',
    teamRole: 'Project lead / captain · Mechanical lead · Motion capture lead',
    // DRAFT — expanded from the one-liner in the brief; nothing here is verified against a repo.
    longDescription:
      'Capstone project: a bio-inspired quadcopter that lands and perches on its own. Instead of relying on an off-board system or a pre-surveyed target, the drone finds and evaluates a landing site with machine vision running on its own compute, then executes the approach and landing autonomously. [TODO: confirm scope — target type, platform, and what "perching" means mechanically.]',
    contribution: [
      'Pitched the project and got it approved as a student-led capstone.',
      'Assembled the team.',
      'Began initial design and research with the team.',
    ],
    // No "What I'd do differently" yet — the field is optional and omitted while the project is in progress.
  },

  // 2 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'intrinsic',
    name: 'Intrinsic AI Challenge',
    status: 'completed',
    image: {
      src: 'images/projects/intrinsic/hero.webp',
      alt: 'Wrist-camera view of the task board in simulation with the target SFP port marked by a red crosshair',
      placeholder: false,
    },
    // DRAFT — from github.com/rushav/aic-workspace README
    description:
      'Solo entry to Intrinsic’s AI for Industry Challenge: teaching a UR5e to insert fiber-optic connectors using only wrist cameras and a force/torque sensor.',
    tags: ['ROS 2', 'PyTorch', 'ResNet-18', 'ACT / LeRobot', 'Docker'],
    // Scores from the README results table in aic-workspace (best portal score, best local run). Ranking claim removed.
    result: '123/300 on the competition portal · best local run 160.9/300 with two partial insertions',
    links: {
      github: 'https://github.com/rushav/aic-workspace',
      cad: null,
      video: null,
      report: null,
    },
    sponsor: 'Intrinsic (Alphabet) with Google DeepMind — AI for Industry Challenge 2026',
    teamRole: 'Solo — perception, control, imitation learning, and submission infrastructure',
    // DRAFT
    longDescription:
      'The qualification task puts a UR5e in Gazebo in front of a task board whose position, orientation, and port layout are randomized every run, and asks it to insert SFP and SC fiber-optic connectors using only three wrist cameras, a force/torque sensor, and joint states. Over ten weeks I built the whole stack from zero: per-port ResNet-18 regressors that locate ports in camera pixels, back-projection through the camera intrinsics to a 3D target, and a Cartesian impedance controller that approaches, aligns, and descends with force-modulated step sizes. A parallel imitation-learning track collected 530 demonstrations (169 GB) and trained an ACT policy with LeRobot on an RTX 5090. I did not achieve a full insertion; the gap between "close" and "inserted" on a 14 mm port from pixels alone is the honest headline.',
    contribution: [
      'Trained eight generations of per-port ResNet-18 detectors (four models, one per port) and fixed the biggest score jump of the project by retraining on 360° yaw data, which added roughly 60 points on hard board configurations.',
      'Wrote 20+ versions of the classical policy on top of the Cartesian impedance controller, including the force-modulated descent (full step below 5 N, half step 5–10 N, halt above 12 N) and the SFP descent-depth fix that removed a 24-point contact penalty per trial.',
      'Built the data-collection recorder, the LeRobot/ACT training track, and a multi-config docker-compose benchmark that exposed detector overfitting; shipped 46+ Docker images to the competition portal under the sensor whitelist.',
    ],
    // REVIEW — condensed from the README "What I Would Do Differently" section
    differently:
      'Build the multi-config benchmark on day one instead of tuning against the single sample config my detector had memorized, and use the wrist camera for closed-loop visual servoing during the approach rather than one snapshot from survey height.',
  },

  // 3 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'thoth',
    name: 'Project Thoth',
    status: 'completed',
    image: {
      src: 'images/projects/thoth/hero.webp',
      alt: 'Thoth title card: enterprise AI knowledge platform, with the chat UI answering a T-Mobile 5G network question',
      placeholder: false,
    },
    // DRAFT — from github.com/rushav/T-Mobile-Thoth README
    description:
      'Orchestrator-agent platform for T-Mobile that captures expert knowledge through AI-led interviews and answers only from approved, subject-scoped sources with citations.',
    tags: ['FastAPI', 'ChromaDB', 'Claude API', 'React', 'RAG'],
    result: 'Selected as the team to present to T-Mobile leadership.',
    links: {
      github: 'https://github.com/rushav/T-Mobile-Thoth',
      cad: null,
      video: null,
      report: null,
    },
    sponsor: 'T-Mobile — GIX × T-Mobile hackathon',
    teamRole: 'Backend, classifier, and benchmark API — team of four',
    // DRAFT
    longDescription:
      'Large companies keep deep expertise in the heads of senior staff, and documenting it is slow and rarely searchable in context. Thoth turns capture into a guided AI interview, storage into a per-subject ChromaDB collection, and retrieval into scoped, grounded answers with mandatory citations. It is an orchestrator, not an answerer: a Claude Haiku 4.5 classifier routes each question by confidence to a subject-scoped Sonnet 4 agent, a clarifying question, or an admin escalation. Knowledge passes a two-stage SME-then-admin approval before it is indexed, and with zero approved entries the query path refuses to call the model at all. Stack: FastAPI, SQLAlchemy + SQLite, ChromaDB, React + Vite + Tailwind.',
    // From git log --author=rushav on the repo (9 of 21 commits; the other author is John).
    contribution: [
      'Scaffolded the backend (agents, routes, services, models, seed data) and the React frontend, then built the four-role single-window UI and the one-command launcher.',
      'Built the /api/v1 benchmark surface for the evaluation harness (query, knowledge, health, system endpoints), per-call token telemetry, session handling, and the benchmark test script.',
      'Owned the subject classifier and confidence routing, tightened the SME answering prompts, and wrote the README, architecture, demo, and production-recommendations docs.',
    ],
    // REVIEW — from PRODUCTION_RECOMMENDATIONS.md and services/sessions.py in the repo
    differently:
      'Put real auth and a persistent session store in from the start: the PoC lets you pick any profile with no login and keeps sessions in a process-local dict, so it cannot run on more than one worker or be shown to anyone outside the demo without a rewrite.',
  },

  // 4 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'drunky',
    name: 'Drunky',
    status: 'completed',
    image: {
      src: 'images/projects/drunky/hero.webp',
      alt: 'Overhead RealSense view of the bottle shelf, glass, and the two SO-101 gripper arms',
      placeholder: false,
    },
    // DRAFT — from github.com/tonyechen/drunky_ros README
    description:
      'Two-armed SO-101 robot bartender: overhead YOLO finds the bottle, a wrist-camera visual-servo loop aligns the grasp, MoveIt 2 plans the motion, and a recorded trajectory pours.',
    tags: ['ROS 2', 'MoveIt 2', 'YOLO', 'RealSense', 'Visual Servoing'],
    // From README.md + results/trials.csv in drunky_ros.
    result: '62.7% success over 480 trials (71.7% top shelf, 53.8% bottom shelf) · ~68 s per arm, ~2 min 15 s for a two-ingredient cocktail',
    links: {
      github: 'https://github.com/tonyechen/drunky_ros',
      cad: null,
      video: 'https://drive.google.com/file/d/1KCtPUdbRQUp0AxLsTXaB8Tctw3aSBFr7/view?usp=sharing',
      report: null,
    },
    sponsor: 'TECHIN 517 (UW GIX course project)',
    // Role and contribution from the README "Contributors" section of tonyechen/drunky_ros.
    teamRole: 'System orchestration, wrist-camera detection, and visual-servo alignment — team of three',
    // DRAFT
    longDescription:
      'Pick a drink from the menu and two SO-101 arms make it: the right arm handles alcohols, the left handles mixers, and each runs six phases (find, go, align, grab, pour, toss) in sequence so they never share the workspace. An overhead RealSense D435 plus an eight-bottle YOLO model gives a coarse 3D bottle pose from the nearest 10% of depth pixels; at standoff a wrist-camera YOLO drives a proportional visual-servo loop to center the bottle before a TF-computed grasp, and MoveIt 2 plans the collision-aware motion. The team first trained an end-to-end ACT/LeRobot policy, which learned to grab and pour but failed unpredictably with no way to inspect a bad rollout, and pivoted to this explicit per-stage pipeline.',
    // DRAFT — expanded from the README Contributors credit ("system orchestration, wrist-camera COCO YOLO, visual-servo alignment,
    // and end-to-end tuning of the full pipeline") using the README's own description of those parts.
    contribution: [
      'System orchestration: sequenced the six phases (find, go, align, grab, pour, toss) per arm and the right-then-left hand-off between arms, with a stop-after-stage switch for step-by-step bring-up.',
      'Wrist-camera detection and visual-servo alignment: a stock COCO YOLO on each wrist camera that accepts bottle or vase and locks onto the largest box, driving a proportional loop on shoulder pan until the bottle is centered before the grasp.',
      'End-to-end tuning of the full pipeline through the 480-trial evaluation: standoff distance, per-shelf grasp offsets, gripper-axis approach, gravity-sag compensation, and retry-then-continue on the pour and toss.',
    ],
    // REVIEW — from the README failure-mode analysis and "Challenges & improvements"
    differently:
      'Fix the occluded bottom-shelf case, which drags success from 71.7% to 53.8%: about 45% of failures are detection or alignment loss, so a second overhead vantage or a shelf redesign would pay off more than further controller tuning.',
  },

  // 5 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'shoehugger',
    name: 'ShoeHugger',
    status: 'completed',
    image: {
      src: 'images/projects/shoehugger/hero.webp',
      alt: 'Render of the ShoeHugger shell: a translucent grey body with amber spine LEDs, a long snout, and folding wings',
      placeholder: false,
    },
    // DRAFT — ported from the old site
    description:
      'Autonomous TurtleBot3 that locks onto your feet with YOLOv8 pose keypoints, follows you between rooms, and flaps motorized wings in Attack or Stalk mode.',
    tags: ['ROS 2', 'YOLOv8', 'Nav2', 'SLAM', 'Dynamixel'],
    result: 'Live multi-room demo with both behavior modes; the full ROS 2 stack and control UI launch from a single command',
    links: {
      github: 'https://github.com/rushav/ShoeHugger-TECHIN516-Final',
      cad: null,
      video: null,
      report: null,
    },
    sponsor: 'University of Washington GIX — TECHIN 516 final project',
    teamRole: 'Autonomy lead — team of three',
    // DRAFT — ported from the old site
    longDescription:
      'The TECHIN 516 brief asked for a robot that navigates dynamic indoor spaces and interacts with people; we wanted ours to have personality. ShoeHugger is a modified TurtleBot3 Waffle that detects a person with YOLOv8n-pose, tracks their ankle keypoints through an EMA-smoothed lock, and follows at a set distance while a three-zone LiDAR guard (stop, slow, nominal) keeps it safe. SLAM localization and Nav2 planning run underneath, a custom TF broadcast exposes the person frame, and a third Dynamixel drives a four-bar wing linkage for the Attack and Stalk behaviors. Everything, including the Tkinter control UI, comes up from one launch script.',
    contribution: [
      'Built the person-following perception: YOLOv8n-pose ankle-keypoint tracking at imgsz 256 with an EMA-tracked lock so the foot target stays stable through occlusion.',
      'Integrated SLAM, Nav2, and a custom TF tree, and wrote the three-zone LiDAR obstacle logic that governs stop, slow-down, and nominal following.',
      'Designed the Attack/Stalk state machine, the Tkinter control UI over ROS topics, and the single-command launch orchestration for the whole stack.',
    ],
    // REVIEW — from the repo: slam_toolbox only feeds RViz; person_follower.py is reactive on LiDAR and spins in place when the target is lost
    differently:
      'Actually use the map. SLAM only draws the RViz view; following and avoidance are purely reactive on the LiDAR, so a lost person means spinning in place to search. Planning on the live map would let it re-acquire someone around a corner instead of guessing.',
  },

  // 6 ─────────────────────────────────────────────────────────────────────
  {
    slug: 'vitreaclear',
    name: 'VitreaClear',
    status: 'completed',
    image: {
      src: 'images/projects/vitreaclear/hero.webp',
      alt: 'CAD render of the VitreaClear transducer rod assembly with exploded and sectioned views',
      placeholder: false, // letterboxed portrait render — [TODO: replace with a 16:9 bench photo]
    },
    // DRAFT — ported from the old site
    description:
      'Non-invasive ultrasound device that uses acoustic radiation force to push vitreous floaters out of the visual axis, as an alternative to vitrectomy surgery.',
    tags: ['SolidWorks', 'Transducer Design', 'Closed-loop Control', 'MATLAB', 'Python'],
    result: 'Patent pending · externally funded · finalist, UW Hollomon Health Innovation Challenge',
    links: { github: null, cad: null, video: null, report: null }, // [TODO: add report / CAD links if shareable]
    sponsor: 'Scott Lipsky, Seattle entrepreneur',
    teamRole: 'Project lead',
    // DRAFT — ported from the old site
    longDescription:
      'Eye floaters affect millions of people, and the only current treatment, vitrectomy, is invasive surgery that risks retinal detachment and cataract progression. VitreaClear applies focused ultrasound from outside the eye so that acoustic radiation force displaces floaters out of the visual axis. We characterized transducer beam profiles to set a focal geometry that targets the vitreous chamber without crossing the retinal plane, validated therapeutic parameters (geometry, drive amplitude, pulse duration) over dozens of water-bath runs, and built a real-time closed-loop power controller to hold acoustic output steady across trials.',
    contribution: [
      'Led transducer system design: beam-profile characterization and focal-geometry optimization for the vitreous chamber.',
      'Developed the real-time closed-loop power controller and the Python/MATLAB signal-processing layer that closes the loop.',
      'Ran the iterative water-bath validation campaign and assembled the bench prototype.',
    ],
    // REVIEW — from the old site's project write-up (no public repo): the closed-loop controller came after most of the water-bath tuning
    differently:
      'Build the closed-loop power controller and data logging before the parameter sweeps, not after. We tuned focal geometry, drive amplitude, and pulse duration over dozens of water-bath runs without steady acoustic output, so the early runs are not directly comparable to the later ones.',
  },
];

// Dates converted from the old site's decimal-year data (e.g. 2026.42 → Jun 2026).
export const experience: ExperienceEntry[] = [
  {
    company: 'OneCourt',
    title: 'Production Tech Intern',
    dates: 'Jun 2026 – Present',
    bullets: [
      'Refurbished eight retired units into a demo fleet and onboarded every device to the latest software architecture.',
      'Wrote battery and charger spec sheets for the manufacturing partner for EV1 prototype sourcing, plus PCB packaging procedures, build schedules, and device validation docs.',
      'Set up a vibration test bench, pursued ESD safety certification for production devices, and soldered 128-motor arrays onto direct-to-consumer builds.',
    ],
    tags: ['Battery Systems', 'PCB Assembly', 'ESD Safety', 'Raspberry Pi'],
  },
  {
    company: 'Zap Energy',
    title: 'R&D Engineering Intern',
    dates: 'Jul – Aug 2023 · Jun – Aug 2024',
    bullets: [
      'Designed a ±10 µm precision fuel-injection system for fusion reactor prototypes: SolidWorks, GD&T, thermal FEA at 200 °C, 5-axis CNC.',
      'Built an Arduino-controlled thermal cycling system holding ±0.5 °C at 250 °C with PID, solid-state relays, and a custom PCB with hardware safety interlocks.',
      'Built a 26 kN high-speed force test rig (custom DAQ, signal conditioning, K-type thermocouples, LabVIEW) and automated stress-strain analysis in Python, cutting component evaluation time by 40%.',
    ],
    tags: ['SolidWorks', 'GD&T', 'FEA', 'DAQ Systems'],
  },
  {
    company: 'Global Innovation Exchange, UW',
    title: 'Prototype Lab Assistant',
    dates: 'Dec 2025 – Present',
    bullets: [
      'Beta-tested the full robotics curriculum (SLAM, LiDAR, YOLO, sensor fusion, waypoint navigation) ahead of 70+ graduate students.',
      'Support students with FDM/SLA printing and PCB cutting for robotics projects, and troubleshoot mechanical assemblies and electronics integration.',
    ],
    tags: ['ROS 2', '3D Printing (FDM/SLA)', 'SLAM', 'Electronics Integration'],
  },
  {
    company: 'Posner Research Group, UW',
    title: 'Research Lab Assistant',
    dates: 'Apr – Aug 2024',
    bullets: [
      'Fabricated a biomimetic artificial finger with strain-gauge arrays for robotic tactile sensing using 6 µm silicone molding.',
      'Reached 2 µm repeatability and 0.1 N force resolution through iterative FEA and calibrated signal processing.',
    ],
    tags: ['Biomimetics', 'Silicone Molding', 'FEA', 'Signal Processing'],
  },
];

// Regrouped from the old site's skill list into the four groups in the brief.
export const skills: Record<'Mechanical' | 'Electrical' | 'Software' | 'Fabrication', string[]> = {
  Mechanical: ['SolidWorks', 'Fusion 360', 'FEA', 'GD&T', 'Transducer Design', 'Battery Systems'],
  Electrical: ['PCB Design', 'PCB Assembly', 'Soldering', 'Arduino', 'Raspberry Pi', 'DAQ Systems', 'Sensor Integration', 'ESD Safety'],
  Software: ['Python', 'C++', 'MATLAB', 'ROS 2', 'Nav2', 'SLAM', 'MoveIt 2', 'OpenCV', 'YOLO', 'PyTorch', 'Docker', 'Linux', 'Git'],
  Fabrication: ['3D Printing (FDM/SLA)', 'Laser Cutting', '5-axis CNC', 'Silicone Molding', 'PCB Cutting'],
};
