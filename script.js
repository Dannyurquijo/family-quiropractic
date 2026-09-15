const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const modal=$('#booking-modal'), chat=$('.chat-panel'), video=$('.video-modal');
let booking={care:'Primera evaluación',doctor:'',time:''};
function showStage(n){$$('.booking-stage').forEach(el=>el.classList.toggle('hidden',el.dataset.stage!=n));$$('.booking-progress span').forEach((el,i)=>el.classList.toggle('active',i<Math.min(n,3)));}
function openBooking(route){booking={care:route||'Primera evaluación',doctor:'',time:''};$('#summary-care').textContent=booking.care;showStage(1);modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function closeBooking(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
$$('.js-book').forEach(b=>b.addEventListener('click',()=>openBooking()));
$$('[data-route]').forEach(b=>b.addEventListener('click',()=>openBooking(b.dataset.route)));
$$('[data-care]').forEach(b=>b.addEventListener('click',()=>{booking.care=b.dataset.care;$('#summary-care').textContent=booking.care;showStage(2)}));
$$('[data-doctor]').forEach(b=>b.addEventListener('click',()=>{$$('[data-doctor]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');booking.doctor=b.dataset.doctor}));
$$('.time-grid button').forEach(b=>b.addEventListener('click',()=>{if(!booking.doctor)booking.doctor='Dra. Azucena';$$('.time-grid button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');booking.time=b.textContent;$('#summary-slot').textContent=`${booking.doctor} · ${booking.time}`;setTimeout(()=>showStage(3),180)}));
$('.fake-pay').addEventListener('click',()=>{const btn=$('.fake-pay');btn.textContent='Procesando anticipo…';btn.disabled=true;setTimeout(()=>{showStage(4);btn.textContent='Simular pago y confirmar';btn.disabled=false},900)});
$('.modal-close').addEventListener('click',closeBooking);$('.close-success').addEventListener('click',closeBooking);$('.modal-backdrop',modal).addEventListener('click',closeBooking);
$('.pixie-button').addEventListener('click',()=>{chat.classList.toggle('open');chat.setAttribute('aria-hidden',String(!chat.classList.contains('open')))});$('.chat-head button').addEventListener('click',()=>chat.classList.remove('open'));
function pixieAnswer(question){const body=$('.chat-body');$('.typing').classList.remove('hidden');setTimeout(()=>{ $('.typing').classList.add('hidden');const answers={'Quiero agendar':'¡Claro! Puedo ayudarte a elegir especialista y horario. Pulsa “Agenda tu evaluación” para ver la experiencia demo.','¿Atienden bebés?':'Sí. El cuidado para bebés utiliza ajustes muy suaves y se adapta a cada etapa de desarrollo.','¿Qué es INSiGHT?':'Es tecnología de evaluación que ayuda al equipo a observar patrones del sistema nervioso y explicar los hallazgos con claridad.'};const m=document.createElement('div');m.className='bot-message';m.style.marginTop='12px';m.textContent=answers[question]||'Gracias por tu pregunta. En la versión final podré responder con la base de conocimiento de la clínica y ayudarte a agendar.';body.insertBefore(m,$('.quick-replies'));body.scrollTop=body.scrollHeight},650)}
$$('.quick-replies button').forEach(b=>b.addEventListener('click',()=>pixieAnswer(b.textContent)));$('.chat-input').addEventListener('submit',e=>{e.preventDefault();const input=$('.chat-input input');if(input.value.trim()){pixieAnswer(input.value.trim());input.value=''}});
$('.js-storm').addEventListener('click',()=>{video.classList.add('open');video.setAttribute('aria-hidden','false')});$('.video-close').addEventListener('click',()=>video.classList.remove('open'));$('.modal-backdrop',video).addEventListener('click',()=>video.classList.remove('open'));
$('.menu-toggle').addEventListener('click',e=>{const nav=$('.main-nav');nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(nav.classList.contains('open')))});$$('.main-nav a').forEach(a=>a.addEventListener('click',()=>$('.main-nav').classList.remove('open')));
$$('.story-filter button').forEach(b=>b.addEventListener('click',()=>{$$('.story-filter button').forEach(x=>x.classList.remove('active'));b.classList.add('active')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeBooking();chat.classList.remove('open');video.classList.remove('open')}});

// Premium motion system — progressive, performant and accessibility-aware.
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js-motion');

function initMotion(){
  const loader=$('.page-loader');
  if(reduceMotion){loader?.classList.add('is-gone');document.body.classList.add('page-ready');return}

  // Short branded reveal: enough to feel intentional, never long enough to block the visitor.
  setTimeout(()=>{
    loader?.classList.add('is-gone');
    document.body.classList.add('page-ready');
  },1050);

  const revealGroups=[
    ['.intro .section-kicker,.intro-grid>*',''],
    ['.care-card,.route-chips','scale-in'],
    ['.storm-orbit','from-left'],['.storm-copy>*','from-right'],
    ['.process .section-kicker,.process-head>*',''],['.steps article',''],
    ['.booking-banner>div:first-child>*','from-left'],['.mini-calendar','scale-in'],
    ['.team .section-kicker,.team-head>*',''],['.team-grid article','scale-in'],
    ['.stories-copy>*','from-left'],['.quote-card','from-right'],
    ['.final-overlay>*','from-left'],['footer>div','']
  ];
  let targets=[];
  revealGroups.forEach(([selector,type])=>{
    $$(selector).forEach((el,index)=>{
      el.classList.add('motion-reveal');
      if(type)el.classList.add(type);
      el.style.transitionDelay=`${Math.min(index%4,3)*90}ms`;
      targets.push(el);
    });
  });
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('motion-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:.14,rootMargin:'0px 0px -5%'});
  targets.forEach(el=>revealObserver.observe(el));

  const steps=$('.steps');
  if(steps){
    const stepsObserver=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting){steps.style.setProperty('--line-progress','100%');stepsObserver.disconnect()}
    },{threshold:.35});
    stepsObserver.observe(steps);
  }

  // Cursor with a soft lag for a crafted, desktop-only feel.
  if(window.matchMedia('(pointer:fine)').matches){
    const dot=$('.cursor-dot'),ring=$('.cursor-ring');
    let mouseX=-40,mouseY=-40,ringX=-40,ringY=-40;
    window.addEventListener('pointermove',e=>{
      mouseX=e.clientX;mouseY=e.clientY;
      dot.style.transform=`translate3d(${mouseX}px,${mouseY}px,0)`;
      document.body.style.setProperty('--mouse-x',`${mouseX}px`);
      document.body.style.setProperty('--mouse-y',`${mouseY}px`);
    },{passive:true});
    const follow=()=>{ringX+=(mouseX-ringX)*.14;ringY+=(mouseY-ringY)*.14;ring.style.transform=`translate3d(${ringX}px,${ringY}px,0)`;requestAnimationFrame(follow)};follow();
    $$('a,button,.care-card,.team-grid article').forEach(el=>{
      el.addEventListener('mouseenter',()=>ring.classList.add('is-active'));
      el.addEventListener('mouseleave',()=>ring.classList.remove('is-active'));
    });
  }

  // Depth on editorial cards, kept subtle enough for clinical credibility.
  $$('.care-card,.team-grid article').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      if(!window.matchMedia('(pointer:fine)').matches)return;
      const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      card.style.setProperty('--card-x',`${x*100}%`);card.style.setProperty('--card-y',`${y*100}%`);
      card.style.transform=`perspective(900px) rotateX(${(0.5-y)*4}deg) rotateY(${(x-0.5)*5}deg) translateY(-5px)`;
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });

  // Magnetic primary actions.
  $$('.button:not(.fake-pay):not(.close-success)').forEach(btn=>{
    btn.addEventListener('pointermove',e=>{
      if(!window.matchMedia('(pointer:fine)').matches)return;
      const r=btn.getBoundingClientRect();
      btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.12}px)`;
    });
    btn.addEventListener('pointerleave',()=>btn.style.transform='');
  });

  let ticking=false;
  const renderScroll=()=>{
    const y=window.scrollY,max=document.documentElement.scrollHeight-innerHeight,progress=max>0?y/max:0;
    $('.scroll-progress i').style.transform=`scaleX(${progress})`;
    $('.site-header').classList.toggle('is-scrolled',y>40);
    const heroImg=$('.hero-photo img');
    if(heroImg&&y<innerHeight*1.2)heroImg.style.transform=`scale(1.04) translate3d(0,${y*.055}px,0)`;
    const final=$('.final-cta'),finalImg=$('.final-cta>img');
    if(final&&finalImg){const r=final.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)finalImg.style.transform=`scale(1.08) translate3d(0,${(r.top-innerHeight/2)*-.025}px,0)`}
    const a1=$('.aurora-one'),a2=$('.aurora-two');
    if(a1)a1.style.transform=`translate3d(0,${y*.08}px,0)`;
    if(a2)a2.style.transform=`translate3d(0,${y*-.045}px,0)`;
    ticking=false;
  };
  window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(renderScroll);ticking=true}},{passive:true});
  renderScroll();

  // Navigation reflects the chapter currently in view.
  const navLinks=$$('.main-nav>a');
  const sections=navLinks.map(link=>$(link.getAttribute('href'))).filter(Boolean);
  const navObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${entry.target.id}`))}});
  },{rootMargin:'-35% 0px -55%'});
  sections.forEach(section=>navObserver.observe(section));
}

initMotion();
