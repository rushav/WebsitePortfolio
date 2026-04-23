const ABOUT = {
  email: 'rushavsd@gmail.com',
  linkedin: 'https://www.linkedin.com/in/rushav-dash/',
  linkedinLabel: '/in/rushav-dash',
  github: 'https://github.com/rushav',
  githubLabel: '/rushav',
  edu: 'MSc Technology Innovation, University of Washington',
  resumeHref: '/assets/resume/Rushav-Dash-Resume.pdf',
  // Three-paragraph hero body. Each paragraph renders with optional <mark> highlights;
  // marks are wrapped with **...** here so the renderer can split without HTML in data.
  paragraphs: [
    'Robotics engineer with a **mechanical engineering foundation** and a bias toward things that move. I want to build systems that sense, adapt, and interact based on biological mechanisms — muscle activation, tactile sensing, locomotion, swarm behavior.',
    "Currently pursuing my **MSc in Technology Innovation at UW's Global Innovation Exchange**, splitting time between prototyping in the lab and researching biomimicry-driven robotics. Previously designed precision hardware for fusion reactors at Zap Energy and fabricated biomimetic sensors for robotic hands.",
    'Most useful at the intersection of mechanical design, autonomy software, and physical prototyping — the messy middle where **CAD meets ROS2 meets the soldering iron**.',
  ],
};

Object.assign(window, { ABOUT });
