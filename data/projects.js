// Single source of truth for all portfolio projects.
// Ordered for the terminal card grid (in-progress first, then done).
// Image paths assume /assets/images/<slug>/...

const PROJECTS = [
  {
    slug: 'intrinsic',
    name: 'Intrinsic AI Challenge',
    tagline: 'Vision-guided fiber-optic connector insertion on a UR5e',
    status: 'complete',
    year: '2026',
    category: 'AI / Industrial Robotics',
    context:
      'The AI for Industry Challenge (AIC), organized by Intrinsic (an Alphabet company) with Google DeepMind, tasks a UR5e arm with autonomously inserting SFP and SC fiber-optic connectors into ports on a task board whose position, orientation, and layout are randomized every run. Only three wrist cameras, a force/torque sensor, and joint states are available — no ground-truth poses, no hardcoding. I entered solo, having never written a ROS node or trained a network for a real task, competing against established robotics labs.',
    approach:
      'Built the full perception-and-control stack from scratch over 10 weeks. Per-port ResNet-18 detectors regress port pixel coordinates from the wrist cameras; back-projection through camera intrinsics plus a Cartesian impedance controller drives the approach and a force-modulated descent. I iterated 20+ policy versions and 8 detector versions, and ran a parallel imitation-learning track — 530 demonstrations auto-collected via a CheatCode recorder, converted to LeRobot format, and trained as an ACT (Action Chunking Transformer) policy on an RTX 5090. Systematic multi-config Docker benchmarking replaced single-config overfitting and drove the final gains.',
    technicalDetails: [
      'Per-port ResNet-18 detectors regress normalized (u,v) pixel coordinates from three wrist cameras, back-projected to 3D via camera intrinsics and a ray–plane constant-Z assumption.',
      'Cartesian impedance control (F = K·Δx + D·Δẋ) with force-modulated descent — full step below 5 N, half step 5–10 N, halt above 12 N — and an ALIGN dwell to settle oscillation before insertion.',
      'Imitation-learning track: 530 episodes (432 SFP + 98 SC, 169 GB) auto-collected and trained as an ACT policy via LeRobot on an RTX 5090 (Blackwell / CUDA 12.8).',
      'Multi-config benchmark harness runs random board configs through docker-compose and parses scores — exposed detector overfitting (131 → 94 mean) and guided every later fix.',
      'Diverse 360° yaw retraining (v6 detectors) added +60 pts on hard configs; correcting the SFP descent depth removed a −24 contact penalty per trial.',
      '46+ Docker images submitted to the competition portal, strictly compliant with the AIC topic/service whitelist (cameras, F/T, joint states only).',
    ],
    role:
      'Solo entry — designed and built everything: the detector training pipeline, the classical control policies, the ACT imitation-learning track, the data-collection automation, and the Docker submission workflow. My first-ever ROS 2, computer-vision, and neural-network project, taken end-to-end against established teams.',
    techStack: ['ROS2', 'PyTorch', 'ResNet-18', 'ACT / LeRobot', 'Gazebo', 'Impedance Control', 'Computer Vision', 'Docker', 'Python', 'UR5e'],
    links: {
      github: 'https://github.com/rushav/aic-workspace',
    },
    images: [
      {
        src: 'assets/images/intrinsic/port-labeled.png',
        alt: 'Wrist-camera view of the task board with the target port marked by a red crosshair',
        caption: 'Wrist-camera view with the target port labeled — the detector regresses this pixel coordinate.',
      },
      {
        src: 'assets/images/intrinsic/center-camera.png',
        alt: 'Center wrist camera showing the SFP ports and the plug hanging below the gripper',
        caption: 'Center wrist camera — SFP ports, with the plug hanging ~25° below the gripper TCP.',
      },
      {
        src: 'assets/images/intrinsic/left-camera.png',
        alt: 'Left wrist camera view of the randomized task board',
        caption: 'Left wrist camera — one of three feeds into the perception stack.',
      },
      {
        src: 'assets/images/intrinsic/right-camera.png',
        alt: 'Right wrist camera view of the randomized task board',
        caption: 'Right wrist camera; board pose is randomized every run.',
      },
    ],
    featured: true,
    sponsor: 'Open Robotics',
    glow: '#6d7bdc',
    tag: 'Industrial AI Robotics',
    when: 'Finished May 2026',
    shortDesc:
      'Solo entry in Intrinsic & Google DeepMind’s robot-assembly challenge — teaching a UR5e to insert fiber-optic connectors from camera alone. 14th place; best local score 160.9/300 with 2 partial insertions.',
    period: 'Mar 2026 — May 2026',
    roleTitle: 'Solo — full stack',
    team: 'Solo',
    details: [
      { k: 'Robot', v: 'UR5e 6-DoF arm · 3 wrist cameras · force/torque sensor' },
      { k: 'Simulator', v: 'Gazebo Harmonic · ROS 2 Kilted · Python 3.12' },
      { k: 'Perception', v: 'Per-port ResNet-18 regressors · 3-camera · ray–plane Z' },
      { k: 'Control', v: 'Cartesian impedance · position + velocity modes · force-modulated descent' },
      { k: 'Learning', v: 'ACT via LeRobot · 530 demos (169 GB) · RTX 5090, CUDA 12.8' },
      { k: 'Iteration', v: '20+ policy versions · 8 detector versions · 46+ Docker images' },
      { k: 'Runtime', v: 'Distrobox + Pixi · docker-compose submission · L4 24 GB eval target' },
    ],
    outcomes: [
      { metric: '14th', label: 'final ranking vs established robotics labs (solo entry)' },
      { metric: '160.9', label: 'best local score /300 — 2 partial SFP insertions at yaw=4.71' },
      { metric: '123', label: 'best competition portal score /300' },
      { metric: '530', label: 'imitation-learning demos auto-collected (432 SFP + 98 SC)' },
    ],
    milestones: [
      {
        id: 'M1',
        title: 'Learning the stack',
        date: 'Wk 1–2',
        note: 'From zero: ROS 2 Kilted, Distrobox, Pixi, Gazebo, and the Cartesian impedance controller. Reverse-engineered the reference CheatCode policy that uses ground-truth TF.',
      },
      {
        id: 'M2',
        title: 'Classical baseline',
        date: 'Wk 3–4',
        note: 'MyPolicy V1 — ResNet-18 port detectors + back-projection + descent. ~120 pts, all proximity. Hit the SC Z=0.14 wall: a 123° rotation unreachable without ground truth.',
      },
      {
        id: 'M3',
        title: 'Imitation pivot',
        date: 'Wk 5–6',
        note: '530 demos auto-collected via a CheatCode recorder, converted to LeRobot, trained as an ACT policy on an RTX 5090. Learned the approach but not sub-millimeter insertion.',
      },
      {
        id: 'M4',
        title: 'Docker grind',
        date: 'Wk 7–8',
        note: 'v21–v36 back to classical control in containers. Built a multi-config benchmark that exposed detector overfitting; the SFP descent-depth fix removed a −24 penalty.',
      },
      {
        id: 'M5',
        title: 'Better detectors',
        date: 'Wk 9–10',
        note: '360° yaw retraining (v6 detectors) added +60 pts on hard configs. v44 hit 160.9 with two partial SFP insertions — the first tier-3 scores above proximity.',
      },
      {
        id: 'M6',
        title: 'Evaluation',
        date: 'May 26',
        note: 'Final portal score 123/300; ranked 14th. Zero full insertions — the honest gap between “getting close” and actually inserting a 14 mm port from pixels alone.',
      },
    ],
  },
  {
    slug: 'thoth',
    name: 'T-Mobile Project Thoth',
    tagline: 'Multi-agent SME knowledge capture & grounded retrieval',
    status: 'complete',
    year: '2026',
    category: 'Multi-agent AI',
    context:
      'T-Mobile — like most large enterprises — has deep subject expertise locked in the heads of senior employees. Documenting it is slow and lossy, and the result is rarely searchable in context. Project Thoth, a GIX × T-Mobile hackathon build, turns knowledge capture into a guided AI interview, storage into a per-subject vector index, and retrieval into scoped, grounded answers with mandatory citations.',
    approach:
      'Thoth is an orchestrator, not an answerer. A cheap Haiku 4.5 classifier reads each incoming question and routes it by confidence: high → a subject-scoped SME agent (Sonnet 4) that retrieves only from that subject’s ChromaDB collection; mid → a clarifying question; low → admin escalation. Knowledge enters through an AI-led interview synthesized strictly from what the SME said, then passes a two-stage approval (SME, then admin) before it is ever indexed. Cross-domain contamination, parametric leakage, and unverified content are blocked at the architectural level — with zero approved entries, the query endpoint refuses to invoke the LLM at all.',
    technicalDetails: [
      'Orchestrator–agent design: a Haiku 4.5 classifier routes questions by confidence (≥0.7 answer · 0.4–0.7 clarify · <0.4 escalate); subject SME agents run on Sonnet 4 and see only their own knowledge.',
      'Per-subject ChromaDB collections (all-MiniLM-L6-v2 embeddings) make cross-subject contamination structurally impossible — retrieval is scoped at the collection level.',
      'Two-stage approval lifecycle (draft → sme_approved → approved); indexing happens only at admin approval, so drafts are never retrievable.',
      'Closed-book guarantee: with no approved entries the query path short-circuits before any LLM call, preventing training-data leakage; every grounded answer ships mandatory sources + a disclaimer.',
      'Model-tier token strategy: Haiku for classification and interview follow-ups, Sonnet for synthesis and final answers, with per-call token telemetry surfacing cost regressions.',
      'Bearer-authenticated /api/v1 surface implements the evaluation-harness contract, backed by FastAPI + SQLAlchemy/SQLite and a Vite/React/Tailwind single-window UI.',
    ],
    role:
      'Backend, classifier, and the V1 benchmark surface — subject classification and confidence routing, the /api/v1 contract for the evaluation harness, token telemetry, and frontend integration. Four-person team (Rushav, John, Lisa Li, Mengting Li).',
    techStack: ['FastAPI', 'Python', 'ChromaDB', 'RAG', 'Multi-Agent', 'Claude (Anthropic)', 'React', 'Vite', 'Tailwind', 'SQLAlchemy'],
    links: {
      github: 'https://github.com/rushav/T-Mobile-Thoth',
    },
    images: [],
    featured: false,
    sponsor: 'T-Mobile',
    glow: '#e20074',
    tag: 'Multi-agent AI',
    when: 'Finished 2026',
    shortDesc:
      'Orchestrator-agent platform that captures expert knowledge via AI interviews and answers only from approved, subject-scoped sources — closed-book, cited, and leak-proof by design. GIX × T-Mobile hackathon.',
    roleTitle: 'Backend & Benchmark',
    team: '4 — backend, pipeline, design',
    details: [
      { k: 'Type', v: 'GIX × T-Mobile hackathon · orchestrator-agent RAG platform' },
      { k: 'Backend', v: 'FastAPI · SQLAlchemy + SQLite · ChromaDB' },
      { k: 'Agents', v: 'Classifier (Haiku 4.5) · SME answerer (Sonnet 4) · Interviewer (Haiku + Sonnet)' },
      { k: 'Retrieval', v: 'Per-subject ChromaDB collections · all-MiniLM-L6-v2 · top-5' },
      { k: 'Frontend', v: 'React 18 · Vite · Tailwind · react-markdown' },
      { k: 'Guarantees', v: 'Closed-book refusal · mandatory citation + disclaimer · two-stage approval' },
    ],
    outcomes: [
      { metric: '3', label: 'agent roles — classifier, subject SME answerer, interviewer' },
      { metric: '0-leak', label: 'closed-book guard refuses to answer without approved knowledge' },
      { metric: '2-stage', label: 'SME → admin approval before anything is indexed' },
      { metric: '8', label: 'harness capabilities implemented on the /api/v1 surface' },
    ],
  },
  {
    slug: 'drunky',
    name: 'Drunky',
    tagline: 'Bimanual vision-servo robot bartender (SO-101)',
    status: 'complete',
    year: '2026',
    category: 'Robotics / Manipulation',
    context:
      'Bartending is repetitive, precise, and full of constrained manipulation — a rich sandbox for autonomous grasping and pouring. Drunky is a two-armed robotic bartender: pick a drink from an on-screen menu and the system finds the required bottles on a shelf with computer vision, grabs them — one arm per liquid type (right = alcohols, left = mixers) — and pours and tosses each ingredient into the glass.',
    approach:
      'A modular pipeline blending ML and classical robotics. An overhead RealSense plus a YOLO detector trained on the 8 bottles localizes the target in 3D (sampling the nearest 10% of depth pixels so the table doesn’t skew the estimate); at standoff, a wrist-camera YOLO drives a proportional visual-servo loop to center the bottle before a TF-computed grasp. MoveIt plans collision-aware motions and the pour/toss replays a recorded joint-space trajectory. The two arms run sequentially through 6 phases each (find → go → align → grab → pour → toss), never sharing the workspace. An earlier end-to-end ACT/LeRobot imitation policy worked as a proof of concept but failed unpredictably, so the team pivoted to this explicit, debuggable, per-stage design.',
    technicalDetails: [
      'Overhead RealSense D435 + YOLO (8-bottle detector) for coarse 3D localization; a bottle_depth node samples the nearest 10% of depth pixels per box and transforms the pose into base_link.',
      'Wrist-camera proportional visual-servo loop closes bottle alignment; COCO labels bottles as bottle or vase by material, so both classes are accepted and the largest (closest) box is locked.',
      '5-DoF grasp geometry from TF: wrist leveled to the ground (not the forearm), approach along the gripper axis to avoid tipping, and joint-space lifts (cartesian lifts loop on this arm).',
      'MoveIt 2 collision-aware planning with custom ROS 2 action servers (move_to_pose w/ cartesian option, move_to_joint_states, gripper, pose_estimation); pour/toss is a recorded joint-space trajectory per arm.',
      'Two arms run sequentially (right alcohols, then left mixers) to stay collision-free under one shared move_group; a tkinter UI manages the menu, live camera liveness, and wrist-YOLO processes.',
      'Evaluated over 480 trials across a 6-position shelf grid — 62.7% overall success, with a clear top-shelf (71.7%) vs occluded bottom-shelf (53.8%) gap.',
    ],
    role:
      'System orchestration, the wrist-camera COCO-YOLO detector, the visual-servo alignment loop, and end-to-end tuning of the full pipeline. Contributor on Tony Chen’s team (Rushav Dash, Tony Chen, Joyce Zhou).',
    techStack: ['ROS2', 'MoveIt 2', 'YOLO', 'Ultralytics', 'RealSense', 'Visual Servoing', 'Computer Vision', 'Python', 'SO-101', 'tkinter'],
    links: {
      github: 'https://github.com/tonyechen/drunky_ros',
      live: 'https://drive.google.com/file/d/1KCtPUdbRQUp0AxLsTXaB8Tctw3aSBFr7/view?usp=sharing',
    },
    images: [
      {
        src: 'assets/images/drunky/success-rate.png',
        alt: 'Bar charts of bimanual bartender success rate by shelf position and top vs bottom shelf',
        caption: 'Success rate across 480 trials — by shelf position and top-vs-bottom shelf.',
        diagram: true,
      },
      {
        src: 'assets/images/drunky/confusion-matrix.png',
        alt: 'Confusion matrix for the 8-class bottle YOLO detector',
        caption: '8-bottle YOLO detector confusion matrix on the held-out validation set.',
        diagram: true,
      },
      {
        src: 'assets/images/drunky/training-curves.png',
        alt: 'YOLO training loss and mAP curves over epochs',
        caption: 'YOLO training curves — box/cls/dfl losses and mAP over epochs.',
        diagram: true,
      },
      {
        src: 'assets/images/drunky/label-distribution.jpg',
        alt: 'Training-set label distribution across the 8 bottle classes',
        caption: 'Training-set label distribution across the 8 bottle classes.',
      },
      {
        src: 'assets/images/drunky/pr-curve.png',
        alt: 'Precision-recall curve for the overhead bottle detector',
        caption: 'Precision–recall curve for the overhead bottle detector.',
        diagram: true,
      },
    ],
    featured: true,
    sponsor: 'UW',
    glow: '#8a62d4',
    tag: 'Robotic Manipulation',
    when: 'Finished 2026',
    shortDesc:
      'A two-armed robot bartender that finds bottles with YOLO, aligns by visual servoing, and pours 8 cocktails — 62.7% success across 480 trials. Modular vision + MoveIt pipeline on dual SO-101 arms.',
    period: 'Spring 2026',
    roleTitle: 'Orchestration & Perception',
    team: '3 — Rushav Dash, Tony Chen, Joyce Zhou',
    details: [
      { k: 'Platform', v: '2× SO-101 5-DoF follower arms + grippers, side by side' },
      { k: 'Cameras', v: 'Overhead RealSense D435 + 2× wrist USB cams' },
      { k: 'Runtime', v: 'ROS 2 Humble · MoveIt 2 · Ultralytics YOLO · pymoveit2' },
      { k: 'Perception', v: 'Overhead 8-bottle YOLO + depth sampling · wrist COCO-YOLO visual servo' },
      { k: 'Motion', v: 'MoveIt planning · TF grasp geometry · recorded joint-space pour/toss' },
      { k: 'Menu', v: '8 cocktails + 8 single liquids · tkinter UI · sequential two-arm' },
      { k: 'Timing', v: '~68 s per arm · ~2 min 15 s for a full two-ingredient cocktail' },
    ],
    outcomes: [
      { metric: '62.7%', label: 'overall success across 480 trials' },
      { metric: '480', label: 'trials — 6 shelf positions × 8 liquids × 10 runs' },
      { metric: '71.7%', label: 'top-shelf success vs 53.8% on the occluded bottom shelf' },
      { metric: '8+8', label: 'cocktails and single liquids on the live menu' },
    ],
    milestones: [
      {
        id: 'M1',
        title: 'Learned-policy PoC',
        date: 'Phase 0',
        note: 'Teleoperated demos trained as an ACT policy via LeRobot. It learned grab-and-pour but failed unpredictably and gave no way to inspect a bad rollout.',
      },
      {
        id: 'M2',
        title: 'Pivot to modular',
        date: 'Rebuild',
        note: 'Traded end-to-end autonomy for a per-stage pipeline: find → align → grab → pour → toss, each explicit, testable, and tunable, with failures attributable to a stage.',
      },
      {
        id: 'M3',
        title: 'Overhead detection',
        date: 'Perception',
        note: 'YOLO trained on the 8 bottles + a depth-sampling node (nearest 10% of pixels) yields a 3D bottle pose in base_link from the overhead RealSense.',
      },
      {
        id: 'M4',
        title: 'Wrist visual servo',
        date: 'Alignment',
        note: 'A proportional servo loop drives shoulder_pan until the wrist-camera bottle box hits target; accepts COCO bottle/vase and locks the closest box.',
      },
      {
        id: 'M5',
        title: 'Grasp & pour',
        date: 'Manipulation',
        note: '5-DoF grasp geometry from TF, gripper-axis approach, joint-space lift, then a recorded pour/toss trajectory per arm; sequential two-arm coordination stays collision-free.',
      },
      {
        id: 'M6',
        title: 'Evaluation',
        date: '480 trials',
        note: '62.7% overall success; the top-vs-bottom-shelf gap (71.7% vs 53.8%) traces to occlusion and glare — 45% of failures are detection/alignment loss.',
      },
    ],
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
        src: 'assets/images/shoehugger/render-front.jpg',
        alt: 'ShoeHugger front render with wings deployed',
        caption: 'Front render — wings in Attack position.',
      },
      {
        src: 'assets/images/shoehugger/render-orthographic.jpg',
        alt: 'ShoeHugger orthographic CAD render',
        caption: 'Orthographic CAD.',
      },
      {
        src: 'assets/images/shoehugger/real-orthographic.jpg',
        alt: 'ShoeHugger physical build, orthographic view',
        caption: 'As-built hardware.',
      },
      {
        src: 'assets/images/shoehugger/inner-structure.jpg',
        alt: 'ShoeHugger internal CAD showing wing actuation',
        caption: 'Internal structure — third Dynamixel driving the wing linkage.',
        diagram: true,
      },
      {
        src: 'assets/images/shoehugger/build-02.jpg',
        alt: 'ShoeHugger during integration testing',
        caption: 'Integration testing.',
      },
      {
        src: 'assets/images/shoehugger/build-03.jpg',
        alt: 'ShoeHugger tracking a subject during live demo',
      },
      {
        src: 'assets/images/shoehugger/build-04.jpg',
        alt: 'ShoeHugger wing mechanism close-up',
      },
      {
        src: 'assets/images/shoehugger/build-05.jpg',
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
        src: 'assets/images/vitreaclear/rod-assembly.jpg',
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
        src: 'assets/images/mini-desktop/rendered-desktop.png',
        alt: 'CAD render of the mini desktop arcade enclosure',
        caption: 'Fusion 360 render — tower, monitor, keyboard deck, base.',
      },
      {
        src: 'assets/images/mini-desktop/desktop-01.png',
        alt: 'Fabricated mini desktop arcade viewed from the front',
        caption: 'Fabricated enclosure — OLED monitor and keyboard-style input deck.',
      },
      {
        src: 'assets/images/mini-desktop/desktop-02.jpg',
        alt: 'Mini desktop arcade during gameplay',
        caption: 'In play.',
      },
      {
        src: 'assets/images/mini-desktop/system-diagram.png',
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
        src: 'assets/images/synthetic-data/example-session.png',
        alt: 'Example synthetic PSG session showing EEG EOG and EMG channels',
        caption: 'Synthetic PSG session — EEG, EOG, EMG channels over one sleep window.',
        diagram: true,
      },
      {
        src: 'assets/images/synthetic-data/signals-by-class.png',
        alt: 'Signal distributions grouped by sleep-stage class',
        caption: 'Channel signatures by sleep stage.',
      },
      {
        src: 'assets/images/synthetic-data/label-distributions.png',
        alt: 'Sleep stage label distribution across synthetic dataset',
        caption: 'Stage-label distribution across the synthetic corpus.',
      },
      {
        src: 'assets/images/synthetic-data/ks-test-comparison.png',
        alt: 'KS-test comparison of synthetic vs real signal distributions',
        caption: 'KS-test validation against real PSG distributions.',
      },
      {
        src: 'assets/images/synthetic-data/confusion-matrix.png',
        alt: 'Confusion matrix for sleep-staging classifier augmented with synthetic data',
        caption: 'Classifier confusion matrix post-augmentation.',
      },
      {
        src: 'assets/images/synthetic-data/model-performance.png',
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
        src: 'assets/images/skinsafe/screen-01.png',
        alt: 'SkinSafe app main screen',
        caption: 'SkinSafe iOS capture view.',
      },
      {
        src: 'assets/images/skinsafe/screen-02.png',
        alt: 'SkinSafe classification result screen',
        caption: 'Classification result.',
      },
      {
        src: 'assets/images/skinsafe/screen-03.png',
        alt: 'SkinSafe result detail view',
      },
      {
        src: 'assets/images/skinsafe/screen-04.png',
        alt: 'SkinSafe secondary classification result',
      },
      {
        src: 'assets/images/skinsafe/screen-05.png',
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
