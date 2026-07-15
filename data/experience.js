// Experience data for the terminal Gantt chart.
// start / end are decimal years (e.g. 2024.42 = June 2024).

const EXPERIENCE = [
  {
    role: 'Production Tech Intern',
    org: 'OneCourt',
    location: 'Seattle, WA',
    start: 2026.42,
    end: 2026.5,
    current: true,
    kind: 'work',
    bullets: [
      'Building battery and charger spec sheets for manufacturing partner Metaline — EV1 prototype battery sourcing.',
      'Refurbished 8 retired units into a demo fleet; onboarded all devices to the latest software architecture.',
      'Soldering 128-motor arrays onto D2C builds for initial testing.',
      'Creating PCB packaging procedures, build schedules, and device validation documentation.',
      'Setting up a vibration test bench and pursuing ESD safety certification for production devices.',
      'Flashing and configuring Raspberry Pis for device firmware deployment.',
    ],
  },
  {
    role: 'Prototype Lab Assistant',
    org: 'Global Innovation Exchange, UW',
    location: 'Bellevue, WA',
    start: 2025.92,
    end: 2026.33,
    current: true,
    kind: 'work',
    bullets: [
      'Assisting students with 3D printing (FDM/SLA) and PCB cutting for robotics projects.',
      'Beta-tested full robotics curriculum — SLAM, LiDAR, YOLO, sensor fusion, waypoint nav — for 70+ grad students.',
      'Troubleshooting mechanical assemblies, electronics integration, fabrication.',
    ],
  },
  {
    role: 'R&D Engineering Intern',
    org: 'Zap Energy',
    location: 'Everett, WA',
    start: 2024.42,
    end: 2024.67,
    kind: 'work',
    bullets: [
      'Designed ±10μm precision fuel injection system for fusion reactor prototypes (SolidWorks, GD&T, thermal FEA at 200°C, 5-axis CNC).',
      'Built Arduino-controlled thermal cycling system: ±0.5°C at 250°C, PID, SSRs, custom PCB with hardware safety interlocks.',
    ],
  },
  {
    role: 'R&D Engineering Intern',
    org: 'Zap Energy',
    location: 'Everett, WA',
    start: 2023.5,
    end: 2023.67,
    kind: 'work',
    bullets: [
      'Built 26kN high-speed force testing rig — custom DAQ, signal conditioning, K-type thermocouples, LabVIEW.',
      'Automated stress-strain analysis in Python (NumPy/Pandas); cut component eval time by 40%.',
    ],
  },
  {
    role: 'Research Lab Assistant',
    org: 'Posner Research Group, UW',
    location: 'Seattle, WA',
    start: 2024.25,
    end: 2024.58,
    kind: 'research',
    bullets: [
      'Fabricated biomimetic artificial finger with strain gauge arrays for robotic tactile sensing (6μm silicone molding).',
      'Achieved 2μm repeatability, 0.1N force resolution via iterative FEA and calibrated signal processing.',
    ],
  },
  {
    role: 'Research Lab Assistant',
    org: 'Integrated Fabrication Lab, UW',
    location: 'Seattle, WA',
    start: 2023.08,
    end: 2025.42,
    kind: 'research',
    bullets: [
      'Built automated analysis pipeline (MATLAB/Python) for 3D-printed Li-ion battery characterization.',
      'Statistical modeling + data viz to optimize electrode print parameters.',
      'Presented at Mary Gates Symposium to 100+ faculty and students.',
    ],
  },
  {
    role: 'MSc Technology Innovation (Robotics)',
    org: 'University of Washington',
    location: 'Bellevue, WA',
    start: 2025.67,
    end: 2026.33,
    current: true,
    kind: 'edu',
    bullets: [],
  },
  {
    role: 'B.S. Mechanical Engineering',
    org: 'University of Washington',
    location: 'Seattle, WA',
    start: 2021.67,
    end: 2025.42,
    kind: 'edu',
    bullets: [],
  },
];

Object.assign(window, { EXPERIENCE });
