// AsciiLidarMaze — Roomba-style bot with LiDAR rays in a square ASCII maze.
// Renders via <canvas> so the maze fills the square edge-to-edge regardless
// of character aspect ratio. Each cell is drawn as a square, characters are
// centered in their cells. Bot uses right-hand wall-following to roam.

(function(){
  // Square-ish maze: 21×21 (same cols as rows). 1 = wall, 0 = open.
  const RAW = [
    "111111111111111111111",
    "100000001000000000001",
    "101111101111111011101",
    "100010000000001010001",
    "111010111110111010111",
    "100000100000100010001",
    "101111101111101110101",
    "100000100010001000101",
    "111110111010111011101",
    "100000001010000010001",
    "101111111011111110111",
    "100010000000000010001",
    "101010111111111010101",
    "101010100000001010101",
    "101010101110111010101",
    "100010100010000010001",
    "111110111010111111101",
    "100000000010100000001",
    "101111111110101111101",
    "100000000000100000001",
    "111111111111111111111",
  ];
  const H = RAW.length, W = RAW[0].length;
  const grid = RAW.map(r => r.split('').map(c => +c));

  function isWall(x,y){
    if (x<0||y<0||x>=W||y>=H) return true;
    return grid[y][x]===1;
  }

  const DIRS = [
    { dx: 1, dy: 0, ch:'►' },  // E
    { dx: 0, dy: 1, ch:'▼' },  // S
    { dx:-1, dy: 0, ch:'◄' },  // W
    { dx: 0, dy:-1, ch:'▲' },  // N
  ];

  function findStart(){
    const order = [[10,10],[5,5],[15,15],[10,5],[5,10]];
    for (const [x,y] of order) if (!isWall(x,y)) return {x,y};
    for (let y=1;y<H-1;y++) for (let x=1;x<W-1;x++) if (!isWall(x,y)) return {x,y};
    return {x:1,y:1};
  }

  function getCssVar(el, name){
    return getComputedStyle(el).getPropertyValue(name).trim();
  }

  function AsciiLidarMaze(){
    const wrapRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    const botRef = React.useRef({ ...findStart(), dir: 0, trail: [] });
    const [, force] = React.useState(0);

    // movement step loop
    React.useEffect(() => {
      let raf, last = 0;
      const speed = 180;
      const step = (t) => {
        if (t - last > speed) {
          last = t;
          const b = botRef.current;
          const tryOrder = [(b.dir+1)%4, b.dir, (b.dir+3)%4, (b.dir+2)%4];
          for (const d of tryOrder) {
            const nx = b.x + DIRS[d].dx, ny = b.y + DIRS[d].dy;
            if (!isWall(nx,ny)) {
              b.dir = d;
              b.trail.push({x:b.x,y:b.y});
              if (b.trail.length > 80) b.trail.shift();
              b.x = nx; b.y = ny;
              break;
            }
          }
          force(n => (n+1) % 10000);
        }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, []);

    // draw loop — resize-aware
    React.useEffect(() => {
      const cvs = canvasRef.current;
      const wrap = wrapRef.current;
      if (!cvs || !wrap) return;
      let rafDraw;
      const draw = () => {
        const rect = wrap.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const size = Math.min(rect.width, rect.height);
        if (cvs.width !== Math.round(size*dpr) || cvs.height !== Math.round(size*dpr)) {
          cvs.width = Math.round(size*dpr);
          cvs.height = Math.round(size*dpr);
          cvs.style.width = size+'px';
          cvs.style.height = size+'px';
        }
        const ctx = cvs.getContext('2d');
        ctx.setTransform(dpr,0,0,dpr,0,0);
        ctx.clearRect(0,0,size,size);

        const cell = size / W;
        const fontSize = Math.max(8, cell * 0.9);
        ctx.font = `700 ${fontSize}px 'JetBrains Mono', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const fg    = getCssVar(wrap,'--fg')   || '#f4f1ea';
        const mute  = getCssVar(wrap,'--fg-mute') || '#8f8778';
        const prompt= getCssVar(wrap,'--prompt') || '#5ce26b';

        const b = botRef.current;

        // 1) walls — solid cells, no gaps
        ctx.fillStyle = fg;
        for (let y=0;y<H;y++) for (let x=0;x<W;x++){
          if (grid[y][x]===1){
            ctx.fillRect(x*cell, y*cell, cell+0.5, cell+0.5);
          }
        }

        // 2) trail (fading)
        const trail = b.trail;
        for (let i=0;i<trail.length;i++){
          const a = 0.15 + 0.35 * (i / trail.length);
          ctx.fillStyle = `${hexWithAlpha(mute, a)}`;
          ctx.fillText('·', trail[i].x*cell + cell/2, trail[i].y*cell + cell/2);
        }

        // 3) LiDAR rays (cast 28 rays up to RANGE cells)
        const N_RAYS = 28, RANGE = 14;
        ctx.fillStyle = prompt;
        for (let i=0;i<N_RAYS;i++){
          const theta = (i / N_RAYS) * Math.PI * 2;
          const dx = Math.cos(theta), dy = Math.sin(theta);
          let fx = b.x + 0.5, fy = b.y + 0.5;
          for (let s=0;s<RANGE*2;s++){
            fx += dx * 0.5; fy += dy * 0.5;
            const cx = Math.floor(fx), cy = Math.floor(fy);
            if (cx===b.x && cy===b.y) continue;
            if (isWall(cx,cy)){
              ctx.save();
              ctx.shadowColor = prompt;
              ctx.shadowBlur = cell*0.9;
              ctx.fillStyle = prompt;
              ctx.fillText('▓', cx*cell + cell/2, cy*cell + cell/2);
              ctx.restore();
              break;
            }
            const a = Math.abs(Math.tan(theta));
            let ch = '·';
            if (a < 0.4) ch = '─';
            else if (a > 2.5) ch = '│';
            else ch = (Math.sin(theta) * Math.cos(theta) > 0) ? '╲' : '╱';
            ctx.fillStyle = hexWithAlpha(prompt, 0.38);
            ctx.fillText(ch, cx*cell + cell/2, cy*cell + cell/2);
          }
        }

        // 4) bot
        ctx.save();
        ctx.shadowColor = prompt;
        ctx.shadowBlur = cell*1.2;
        ctx.fillStyle = prompt;
        ctx.fillText(DIRS[b.dir].ch, b.x*cell + cell/2, b.y*cell + cell/2);
        ctx.restore();

        rafDraw = requestAnimationFrame(draw);
      };
      rafDraw = requestAnimationFrame(draw);
      const ro = new ResizeObserver(()=>{});
      ro.observe(wrap);
      return () => { cancelAnimationFrame(rafDraw); ro.disconnect(); };
    }, []);

    const b = botRef.current;

    return (
      <div aria-hidden="true">
        <div className="maze-label">
          <span>[ lidar.scan · biomimetic nav ]</span>
          <span>{W} × {H} · 28 rays</span>
        </div>
        <div className="maze-wrap" ref={wrapRef}>
          <canvas ref={canvasRef}/>
        </div>
        <div className="maze-stats">
          <span>pose ({String(b.x).padStart(2,'0')},{String(b.y).padStart(2,'0')}) · hdg {['E','S','W','N'][b.dir]}</span>
          <span className="blink">● scanning 28ch</span>
        </div>
      </div>
    );
  }

  function hexWithAlpha(color, a){
    color = (color||'').trim();
    if (color.startsWith('#')){
      const h = color.slice(1);
      const full = h.length===3 ? h.split('').map(c=>c+c).join('') : h;
      const r = parseInt(full.slice(0,2),16);
      const g = parseInt(full.slice(2,4),16);
      const b = parseInt(full.slice(4,6),16);
      return `rgba(${r},${g},${b},${a})`;
    }
    if (color.startsWith('rgb')){
      const inside = color.slice(color.indexOf('(')+1, color.lastIndexOf(')'));
      const parts = inside.split(',').map(s=>s.trim()).slice(0,3);
      return `rgba(${parts.join(',')},${a})`;
    }
    return color;
  }

  window.AsciiLidarMaze = AsciiLidarMaze;
})();
