(() => {
  const canvas = document.getElementById('siteCanvas');
  const contextMenu = document.getElementById('contextMenu');
  const toast = document.getElementById('toast');
  const layerList = document.getElementById('layerList');
  const selectedName = document.getElementById('selectedName');
  const headingInput = document.getElementById('headingInput');
  const descriptionInput = document.getElementById('descriptionInput');
  const labelInput = document.getElementById('labelInput');
  const spacingRange = document.getElementById('spacingRange');
  const spacingOutput = document.getElementById('spacingOutput');
  const bgColor = document.getElementById('bgColor');
  const bgColorPicker = document.getElementById('bgColorPicker');
  const borderRadiusControl = document.getElementById('borderRadiusControl');
  const propertiesContent = document.getElementById('propertiesContent');
  const emptyProperties = document.getElementById('emptyProperties');
  const imageProperties = document.getElementById('imageProperties');
  const imageFields = document.getElementById('imageFields');
  const transparentDragImage = document.createElement('canvas');
  transparentDragImage.width = transparentDragImage.height = 1;
  let selected = null, contextTarget = null, copiedSection = null, dragSource = null, dragPreview = null;
  let undoStack = [], redoStack = [];
  let pages = [];
  let activePageId = 'home';
  let pageIdCounter = 1;
  const names = {hero:'Hero section',logos:'Logo cloud',features:'Features section',testimonials:'Testimonials',pricing:'Pricing section',cta:'Call to action',text:'Text block',footer:'Footer',stats:'Stats',team:'Team',faq:'FAQ',newsletter:'Newsletter',imageShowcase:'Image showcase',gallery:'Gallery'};
  const icons = {hero:'▤',logos:'◎',features:'▦',testimonials:'❞',pricing:'＄',cta:'↗',text:'T',footer:'▱',stats:'↗',team:'♙',faq:'?',newsletter:'✉',imageShowcase:'▧',gallery:'▦'};
  const sectionTemplates = {
    pricing: `<div class="section-intro"><span class="eyebrow">SIMPLE, TRANSPARENT PRICING</span><h2>Plans that grow<br><em>with your team.</em></h2><p>Choose the right plan for your next big idea.</p></div><div class="feature-grid"><article><h3>Starter</h3><p>For small teams getting started.</p><h2>$19 <small>/ month</small></h2><a>Choose Starter →</a></article><article><h3>Growth</h3><p>For teams ready to scale.</p><h2>$49 <small>/ month</small></h2><a>Choose Growth →</a></article><article><h3>Business</h3><p>For organizations moving fast.</p><h2>$99 <small>/ month</small></h2><a>Choose Business →</a></article></div>`,
    text: `<div class="section-intro"><span class="eyebrow">A LITTLE ABOUT US</span><h2>Good work starts<br><em>with a clear idea.</em></h2><p>Use this section to tell your story. Explain what you do, who you help, and why it matters. Keep it clear, useful, and human.</p></div>`,
    hero: `<div class="hero-content" style="width:100%;text-align:center;padding:58px 10%;min-height:260px"><div class="eyebrow" style="justify-content:center">✦ YOUR NEXT BIG IDEA</div><h1>Make your next<br><em>big thing happen.</em></h1><p style="margin:0 auto">A beautiful new section, ready for your content and ideas.</p><div class="hero-buttons" style="justify-content:center"><button class="primary-pill">Get started <span>↗</span></button></div></div>`,
    features: `<div class="section-intro"><span class="eyebrow">WHY CHOOSE US</span><h2>Tools for your<br><em>best work.</em></h2><p>Everything your team needs to move forward.</p></div><div class="feature-grid"><article><span class="feature-icon purple">✦</span><h3>Stay focused</h3><p>Keep your work organized and moving.</p><a>Learn more →</a></article><article><span class="feature-icon blue">◈</span><h3>Work together</h3><p>Bring your team together around ideas.</p><a>Learn more →</a></article><article><span class="feature-icon orange">⌁</span><h3>Grow confidently</h3><p>Build a foundation for what's next.</p><a>Learn more →</a></article></div>`,
    logos: `<p>TRUSTED BY TEAMS EVERYWHERE</p><div class="logo-row"><strong>◈ layers</strong><strong>◉ circooles</strong><strong>◒ catalog</strong><strong>✳ quotient</strong><strong>◈ sisyphus</strong></div>`,
    testimonials: `<div class="quote-mark">“</div><blockquote>“This team makes it easier to turn ambitious ideas into real results. We couldn't imagine working without it.”</blockquote><div class="quote-person"><div class="person-avatar">JD</div><div><strong>Jordan Davis</strong><small>Founder, Studio North</small></div></div>`,
    cta: `<div><span class="eyebrow">LET'S BUILD SOMETHING</span><h2>Good things are<br><em>just getting started.</em></h2><p>Take the next step with us today.</p><button class="primary-pill">Get started <span>↗</span></button></div><div class="cta-decoration">✳</div>`,
    footer: `<div class="footer-main"><div class="footer-brand"><span class="tiny-logo">A</span><strong>Acme</strong><p>Make good things happen.</p></div><div><strong>Product</strong><a>Features</a><a>Integrations</a><a>Changelog</a></div><div><strong>Company</strong><a>About us</a><a>Careers</a><a>Contact</a></div><div><strong>Resources</strong><a>Blog</a><a>Help center</a><a>Community</a></div></div><div class="footer-bottom">© 2025 Acme Studio <span>Privacy · Terms · Status</span></div>`,
    stats: `<div class="section-intro"><span class="eyebrow">OUR IMPACT</span><h2>Progress you can<br><em>measure.</em></h2></div><div class="stats-grid"><article><strong>2.4k</strong><span>Teams growing with us</span></article><article><strong>98%</strong><span>Customer satisfaction</span></article><article><strong>42</strong><span>Countries represented</span></article><article><strong>24/7</strong><span>Support when it matters</span></article></div>`,
    team: `<div class="section-intro"><span class="eyebrow">THE PEOPLE BEHIND THE WORK</span><h2>Built by a thoughtful<br><em>team.</em></h2><p>Different perspectives, shared care for doing great work.</p></div><div class="team-grid"><article><span class="team-avatar">AM</span><h3>Avery Morgan</h3><p>Creative Director</p></article><article><span class="team-avatar peach">JL</span><h3>Jordan Lee</h3><p>Product Designer</p></article><article><span class="team-avatar mint">RS</span><h3>Riley Shah</h3><p>Engineering Lead</p></article></div>`,
    faq: `<div class="section-intro"><span class="eyebrow">QUESTIONS, ANSWERED</span><h2>Everything you need<br><em>to know.</em></h2></div><div class="faq-list"><details open><summary>How quickly can I get started?<span>+</span></summary><p>Create your workspace in minutes, then invite your team when you are ready.</p></details><details><summary>Can I change plans later?<span>+</span></summary><p>Yes. Move between plans whenever your needs change.</p></details><details><summary>Is there a free trial?<span>+</span></summary><p>Every plan includes time to explore the product before you commit.</p></details></div>`,
    newsletter: `<div class="newsletter-copy"><span class="eyebrow">STAY IN THE LOOP</span><h2>Useful ideas, once<br><em>a month.</em></h2><p>Thoughtful notes on building better products and teams.</p></div><form class="newsletter-form"><input type="email" placeholder="Your email address" aria-label="Email address"><button type="button" class="primary-pill">Subscribe <span>↗</span></button><small>No spam. Unsubscribe anytime.</small></form>`,
    imageShowcase: `<div class="image-showcase-copy"><span class="eyebrow">DESIGNED FOR REAL MOMENTUM</span><h2>Bring your best<br><em>ideas to life.</em></h2><p>Build a clear, memorable presence with a flexible system that makes every detail feel considered.</p><button class="primary-pill">Explore the work <span>↗</span></button></div><img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&amp;fit=crop&amp;w=1200&amp;q=85" alt="Modern creative studio workspace">`,
    gallery: `<div class="section-intro"><span class="eyebrow">A CLOSER LOOK</span><h2>Work made with<br><em>care.</em></h2></div><div class="image-gallery"><img src="https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&amp;fit=crop&amp;w=900&amp;q=85" alt="Bright modern office"><img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&amp;fit=crop&amp;w=900&amp;q=85" alt="Collaborative workspace"><img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&amp;fit=crop&amp;w=900&amp;q=85" alt="Team meeting"></div>`
  };
  function showToast(message) {
    toast.textContent = message; toast.classList.add('show');
    clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
  }
  function sections() { return [...canvas.querySelectorAll(':scope > .editable-section')]; }
  function pageTitle() { return pages.find(p => p.id === activePageId)?.name || 'Home'; }
  function setPageBreadcrumb() { const crumb = document.querySelector('.breadcrumb strong'); if (crumb) crumb.textContent = pageTitle(); }
  function pageSlug(name) { return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-') || 'new-page'; }
  function createSectionForPage(type, source) {
    let section = source ? source.cloneNode(true) : document.createElement('section');
    if (!source) {
      section.className = 'editable-section'; section.dataset.section = type; section.tabIndex = 0;
      const content = sectionTemplates[type] || sectionTemplates.text;
      section.innerHTML = `<div class="section-tools"><span class="drag-handle" title="Drag to reorder">⠿</span><span class="section-label">${type.toUpperCase()}</span><button class="more-btn" aria-label="Section actions">•••</button></div>${content}`;
    }
    section.dataset.section = type; section.classList.remove('selected');
    section.classList.remove('logo-section','features-section','testimonial-section','cta-section','footer-section','stats-section','team-section','faq-section','newsletter-section','image-showcase-section','gallery-section');
    if(type==='logos') section.classList.add('logo-section');
    if(['features','pricing','text'].includes(type)) section.classList.add('features-section');
    if(type==='testimonials') section.classList.add('testimonial-section');
    if(type==='cta') section.classList.add('cta-section');
    if(type==='footer') section.classList.add('footer-section');
    if(type==='stats') section.classList.add('stats-section');
    if(type==='team') section.classList.add('team-section');
    if(type==='faq') section.classList.add('faq-section');
    if(type==='newsletter') section.classList.add('newsletter-section');
    if(type==='imageShowcase') section.classList.add('image-showcase-section');
    if(type==='gallery') section.classList.add('gallery-section');
    const label = section.querySelector('.section-label'); if(label) label.textContent = type.toUpperCase();
    return section;
  }
  function makePageContent(name, types) {
    const original = document.createElement('div'); original.innerHTML = homeMarkup;
    const top = original.querySelector('.site-topline');
    const sourceSections = [...original.querySelectorAll('.editable-section')];
    const byType = Object.fromEntries(sourceSections.map(el => [el.dataset.section, el]));
    const wrapper = document.createElement('div'); if(top) wrapper.appendChild(top.cloneNode(true));
    types.forEach(type => wrapper.appendChild(createSectionForPage(type, byType[type])));
    const hero = wrapper.querySelector('[data-section=hero]');
    if (hero) {
      const h = hero.querySelector('h1'); const p = hero.querySelector('.hero-content > p');
      const copy = {About:['A little about\nwho we are.','We help ambitious teams turn thoughtful ideas into meaningful work.'],Services:['Services built for\nyour next chapter.','Explore practical solutions designed to help your business move forward.'],Contact:['Let’s start a\nconversation.','Tell us what you are working on. We would love to hear from you.']};
      if(copy[name]) { if(h) h.innerHTML = copy[name][0].replace(/\n/g,'<br>'); if(p) p.textContent = copy[name][1]; }
    }
    const feature = wrapper.querySelector('[data-section=features]');
    if(feature && name==='Services') { const h=feature.querySelector('h2'); const p=feature.querySelector('.section-intro > p'); if(h) h.innerHTML='What we do<br><em>and how we help.</em>'; if(p) p.textContent='Flexible services for every stage of your journey.'; }
    const text = wrapper.querySelector('[data-section=text]');
    if(text && name==='Contact') {
      text.classList.add('contact-form-section');
      text.innerHTML = `<div class="contact-layout"><div class="contact-copy"><span class="eyebrow">GET IN TOUCH</span><h2>Let’s talk about<br><em>your next idea.</em></h2><p>Have a question or a project in mind? Send us a message and we’ll get back to you soon.</p><div class="contact-detail"><span>✉</span><div><strong>Email us</strong><small>hello@acmestudio.com</small></div></div><div class="contact-detail"><span>◷</span><div><strong>Office hours</strong><small>Monday–Friday, 9am–5pm</small></div></div></div><form class="demo-contact-form"><label>Your name<input type="text" placeholder="Jane Smith"></label><label>Email address<input type="email" placeholder="jane@example.com"></label><label>What can we help with?<select><option>Choose a topic</option><option>Website project</option><option>Services and pricing</option><option>Something else</option></select></label><label>Message<textarea rows="3" placeholder="Tell us a little about it..."></textarea></label><button type="button" class="primary-pill" onclick="this.textContent='Message ready ✓'">Send message <span>↗</span></button><small class="form-note">Prototype form · no message will be sent</small></form></div>`;
    }
    if(name==='About') {
      const feature=wrapper.querySelector('[data-section=features]');
      if(feature) { feature.classList.add('about-stats-section'); feature.innerHTML=`<div class="section-intro"><span class="eyebrow">A FEW THINGS ABOUT US</span><h2>Small team. <em>Big-hearted work.</em></h2><p>We bring strategy, design, and technology together to make useful things for real people.</p></div><div class="stats-grid"><article><strong>8+</strong><span>Years creating</span></article><article><strong>120</strong><span>Projects launched</span></article><article><strong>18</strong><span>Creative minds</span></article><article><strong>12</strong><span>Countries reached</span></article></div>`; }
      const testimonial=wrapper.querySelector('[data-section=testimonials]');
      if(testimonial) { testimonial.classList.add('about-values-section'); testimonial.innerHTML=`<div class="section-intro"><span class="eyebrow">WHAT GUIDES US</span><h2>Good work, done <em>with care.</em></h2></div><div class="values-grid"><article><span>✳</span><h3>Stay curious</h3><p>We ask better questions before jumping to answers.</p></article><article><span>♡</span><h3>Be thoughtful</h3><p>We make choices with people and purpose in mind.</p></article><article><span>↗</span><h3>Keep improving</h3><p>We learn, test, and make each version better.</p></article></div>`; }
    }
    if(name==='Services') {
      const feature=wrapper.querySelector('[data-section=features]');
      if(feature) { feature.classList.add('service-catalog-section'); feature.innerHTML=`<div class="section-intro"><span class="eyebrow">HOW WE CAN HELP</span><h2>Good ideas, meet <em>good execution.</em></h2><p>Pick the kind of help you need. We’ll shape the details together.</p></div><div class="service-catalog"><article><span class="service-symbol">✦</span><div><h3>Brand & strategy</h3><p>Find your message, audience, and next move.</p><a>Explore service ↗</a></div><b>01</b></article><article><span class="service-symbol">▧</span><div><h3>Website design</h3><p>Clear, polished experiences that feel like you.</p><a>Explore service ↗</a></div><b>02</b></article><article><span class="service-symbol">⌘</span><div><h3>Web development</h3><p>Fast, accessible websites built to grow.</p><a>Explore service ↗</a></div><b>03</b></article></div>`; }
    }
    return wrapper.innerHTML;
  }
  function renderPages() {
    const list = document.getElementById('pagesList'); if(!list) return; list.innerHTML='';
    pages.forEach(page => {
      const row=document.createElement('button'); row.className='page-row'+(page.id===activePageId?' active':''); row.type='button';
      const icon=page.id==='home'?'⌂':page.name.toLowerCase().includes('contact')?'✉':'▤';
      row.innerHTML=`<span>${icon}</span><span><strong></strong><small></small></span><span class="page-menu" role="button" tabindex="0" aria-label="Page actions">•••</span>`;
      row.querySelector('strong').textContent=page.name; row.querySelector('small').textContent=page.path;
      row.addEventListener('click', e => { if(e.target.closest('.page-menu')) { e.stopPropagation(); pageActions(page); return; } switchPage(page.id); });
      row.querySelector('.page-menu').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pageActions(page);}});
      list.appendChild(row);
    });
  }
  function switchPage(id) {
    const current=pages.find(p=>p.id===activePageId); if(current) { current.content=canvas.innerHTML; current.templateId=canvas.dataset.homeTemplate || 'default'; }
    const next=pages.find(p=>p.id===id); if(!next) return;
    activePageId=id; canvas.innerHTML=next.content; canvas.dataset.homeTemplate=next.templateId || 'default'; selected=null; hideContext(); bindSections(); renderLayers(); updateCount(); updateProperties(); renderPages(); setPageBreadcrumb();
    document.getElementById('canvasScroll').scrollTop=0; showToast(`Opened ${next.name} page`);
  }
  function pageActions(page) {
    const action=prompt(`Page: ${page.name}\nType rename or delete`, 'rename'); if(!action) return;
    if(action.toLowerCase()==='rename') { const name=prompt('New page name',page.name); if(!name||!name.trim()) return; page.name=name.trim(); page.path=page.id==='home'?'/':'/'+pageSlug(page.name); renderPages(); setPageBreadcrumb(); showToast('Page renamed'); }
    else if(action.toLowerCase()==='delete') { if(page.id==='home'){showToast('The Home page cannot be deleted');return;} if(!confirm(`Delete the ${page.name} page?`)) return; pages=pages.filter(p=>p.id!==page.id); if(activePageId===page.id) switchPage('home'); else renderPages(); showToast('Page deleted'); }
    else showToast('Choose rename or delete');
  }
  function snapshot() { return canvas.innerHTML; }
  function saveHistory() {
    undoStack.push(snapshot()); if (undoStack.length > 40) undoStack.shift(); redoStack = [];
  }
  function restore(html) { canvas.innerHTML = html; selected = null; hideContext(); bindSections(); renderLayers(); updateCount(); updateProperties(); }
  function selectSection(section) {
    if (selected) selected.classList.remove('selected');
    selected = section;
    if (selected) selected.classList.add('selected');
    renderLayers(); updateProperties();
  }
  function clearSelection() {
    if (!selected) return;
    selected.classList.remove('selected'); selected = null;
    hideContext(); renderLayers(); updateProperties();
  }
  function startDragPreview(section, x, y) {
    const rect = section.getBoundingClientRect();
    dragPreview = section.cloneNode(true);
    dragPreview.classList.remove('selected','dragging','drop-before','drop-after');
    dragPreview.classList.add('drag-preview');
    dragPreview.style.width = rect.width + 'px';
    document.body.appendChild(dragPreview);
    moveDragPreview(x, y);
  }
  function moveDragPreview(x, y) {
    if (!dragPreview || (!x && !y)) return;
    dragPreview.style.left = (x + 18) + 'px';
    dragPreview.style.top = (y + 18) + 'px';
  }
  function finishDragPreview(section) {
    if (!dragPreview) return;
    const rect = section.getBoundingClientRect();
    dragPreview.classList.add('settling');
    dragPreview.style.left = rect.left + 'px';
    dragPreview.style.top = rect.top + 'px';
    dragPreview.style.opacity = '0';
    const preview = dragPreview; dragPreview = null;
    setTimeout(() => preview.remove(), 180);
  }
  function bindSections() {
    sections().forEach(section => {
      section.draggable = false;
      section.addEventListener('click', e => { if (e.target.closest('.more-btn')) { e.preventDefault(); openContext(section, e.clientX, e.clientY); return; } selectSection(section); });
      section.addEventListener('contextmenu', e => { e.preventDefault(); selectSection(section); openContext(section, e.clientX, e.clientY); });
      const handle = section.querySelector('.drag-handle');
      if (handle) {
        handle.addEventListener('pointerdown', () => { section.draggable = true; });
        handle.addEventListener('pointerup', () => { setTimeout(() => section.draggable = false, 0); });
      }
      section.addEventListener('dragstart', e => {
        if (!section.draggable) { e.preventDefault(); return; }
        saveHistory();
        dragSource = section; section.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain','section');
        e.dataTransfer.setDragImage(transparentDragImage, 0, 0);
        startDragPreview(section, e.clientX, e.clientY);
      });
      section.addEventListener('drag', e => moveDragPreview(e.clientX, e.clientY));
      section.addEventListener('dragend', () => { section.classList.remove('dragging'); section.draggable = false; finishDragPreview(section); dragSource = null; sections().forEach(s => s.classList.remove('drop-before','drop-after')); renderLayers(); });
      section.addEventListener('dragover', e => {
        if (!dragSource || dragSource === section) return;
        e.preventDefault(); e.dataTransfer.dropEffect = 'move';
        moveDragPreview(e.clientX, e.clientY);
        const rect = section.getBoundingClientRect();
        const after = e.clientY > rect.top + rect.height / 2;
        sections().forEach(s => s.classList.remove('drop-before','drop-after'));
        section.classList.add(after ? 'drop-after' : 'drop-before');
        if (after ? dragSource.previousElementSibling !== section : dragSource.nextElementSibling !== section) {
          canvas.insertBefore(dragSource, after ? section.nextSibling : section);
        }
      });
      section.addEventListener('drop', e => {
        if (!dragSource || dragSource === section) return;
        e.preventDefault();
        renderLayers(); updateCount(); showToast('Section order updated');
      });
      const more = section.querySelector('.more-btn');
      if (more) more.onclick = e => { e.stopPropagation(); selectSection(section); openContext(section, e.clientX, e.clientY); };
    });
  }
  function renderLayers() {
    layerList.innerHTML = '';
    sections().forEach((section, index) => {
      const type = section.dataset.section;
      const row = document.createElement('div');
      row.className = 'layer-row' + (selected === section ? ' selected' : '');
      row.draggable = true;
      row.innerHTML = `<span class="layer-symbol">${icons[type] || '▤'}</span><strong>${names[type] || type}</strong><span class="layer-dots">•••</span>`;
      row.addEventListener('click', () => { selectSection(section); section.scrollIntoView({behavior:'smooth',block:'center'}); });
      row.addEventListener('contextmenu', e => { e.preventDefault(); selectSection(section); openContext(section,e.clientX,e.clientY); });
      row.addEventListener('dragstart', e => { dragSource = section; row.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/plain','layer'); });
      row.addEventListener('dragend', () => { dragSource=null; row.classList.remove('dragging'); });
      row.addEventListener('dragover', e => { if (dragSource && dragSource !== section) e.preventDefault(); });
      row.addEventListener('drop', e => {
        if (!dragSource || dragSource === section) return;
        e.preventDefault(); saveHistory();
        const rect = row.getBoundingClientRect();
        canvas.insertBefore(dragSource, e.clientY > rect.top + rect.height/2 ? section.nextSibling : section);
        renderLayers(); updateCount(); showToast('Section order updated');
      });
      layerList.appendChild(row);
    });
  }
  function updateCount() { document.getElementById('sectionCount').textContent = `${sections().length} sections`; }
  function updateProperties() {
    if (!selected) { selectedName.textContent='No section selected'; propertiesContent.classList.add('hidden'); emptyProperties.classList.remove('hidden'); imageProperties.classList.add('hidden'); return; }
    propertiesContent.classList.remove('hidden'); emptyProperties.classList.add('hidden');
    const type = selected.dataset.section; selectedName.textContent = names[type] || type;
    labelInput.value = (selected.querySelector('.section-label')?.textContent || type.toUpperCase()).trim();
    const h = selected.querySelector('h1,h2,h3');
    const p = selected.querySelector('.hero-content > p,.section-intro > p,.cta-section p,.testimonial-section blockquote,.logo-section > p');
    headingInput.value = h ? h.innerText.replace(/\n/g,' ') : '';
    descriptionInput.value = p ? p.innerText : '';
    const bg = getComputedStyle(selected).backgroundColor;
    if (bg && bg.startsWith('rgb')) { const m = bg.match(/\d+/g); if (m) setBackgroundControls('#'+m.slice(0,3).map(n=>Number(n).toString(16).padStart(2,'0')).join('').toUpperCase()); }
    const radius = parseFloat(getComputedStyle(selected).borderTopLeftRadius) || 0;
    setRadiusControl(radius);
    updateImageProperties();
  }
  function updateImageProperties() {
    imageFields.replaceChildren();
    const images = selected ? [...selected.querySelectorAll('img')] : [];
    imageProperties.classList.toggle('hidden', images.length === 0);
    images.forEach((image, index) => {
      const urlLabel = document.createElement('label'); urlLabel.className = 'field-label'; urlLabel.textContent = `Image ${index + 1} URL`;
      const url = document.createElement('input'); url.className = 'text-input image-url-input'; url.type = 'url'; url.value = image.getAttribute('src') || ''; url.setAttribute('aria-label', `Image ${index + 1} URL`);
      url.addEventListener('change', () => { const value = url.value.trim(); if (!value) { showToast('Enter an image URL'); return; } saveHistory(); image.src = value; });
      const altLabel = document.createElement('label'); altLabel.className = 'field-label'; altLabel.textContent = `Image ${index + 1} description`;
      const alt = document.createElement('input'); alt.className = 'text-input'; alt.value = image.alt; alt.setAttribute('aria-label', `Image ${index + 1} description`);
      alt.addEventListener('change', () => { saveHistory(); image.alt = alt.value; });
      imageFields.append(urlLabel, url, altLabel, alt);
    });
  }
  function setBackgroundControls(color) {
    bgColor.value = color; bgColorPicker.value = color;
    document.querySelector('.color-swatch').style.backgroundColor = color;
  }
  function setRadiusControl(radius) {
    const selectedRadius = radius >= 18 ? 24 : radius >= 6 ? 12 : 0;
    borderRadiusControl.querySelectorAll('button').forEach(button => button.classList.toggle('active', Number(button.dataset.radius) === selectedRadius));
  }
  function applyBackground(color) {
    if (!selected) return;
    if (!/^#[0-9a-f]{6}$/i.test(color)) { showToast('Enter a valid hex color'); updateProperties(); return; }
    saveHistory(); selected.style.backgroundColor = color; setBackgroundControls(color.toUpperCase());
  }
  function setSectionLabel(section, text) {
    let tag=section.querySelector('.section-label');
    if (!tag) { const tools=document.createElement('div'); tools.className='section-tools'; tools.innerHTML='<span class="drag-handle">⠿</span><span class="section-label"></span><button class="more-btn" aria-label="Section actions">•••</button>'; section.prepend(tools); tag=tools.querySelector('.section-label'); }
    tag.textContent=text.toUpperCase();
  }
  function replaceHeading(section, value) {
    const h=section.querySelector('h1,h2,h3'); if (!h) return;
    const em=h.querySelector('em');
    if (em && value.includes(' ')) {
      const words=value.trim().split(/\s+/); const pivot=Math.max(1,Math.ceil(words.length/2));
      h.innerHTML = `${escapeHTML(words.slice(0,pivot).join(' '))}<br><em>${escapeHTML(words.slice(pivot).join(' '))}</em>`;
    } else h.textContent=value;
  }
  function escapeHTML(s) { return s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function openContext(section,x,y) {
    contextTarget=section; contextMenu.classList.remove('hidden');
    const w=218,h=contextMenu.offsetHeight;
    contextMenu.style.left=Math.min(x,window.innerWidth-w-10)+'px';
    contextMenu.style.top=Math.min(y,window.innerHeight-h-10)+'px';
  }
  function hideContext() { contextMenu.classList.add('hidden'); contextTarget=null; }
  function duplicate(section) {
    if (!section) return; saveHistory();
    const clone=section.cloneNode(true); clone.classList.remove('selected'); clone.dataset.section=section.dataset.section;
    canvas.insertBefore(clone,section.nextSibling); bindSections(); selectSection(clone); updateCount(); showToast('Section duplicated');
  }
  function deleteSection(section) {
    if (!section) return; saveHistory(); const next=section.nextElementSibling; section.remove();
    selected=next?.classList.contains('editable-section')?next:null;
    if(selected) selectSection(selected); else { renderLayers(); updateProperties(); }
    updateCount(); showToast('Section deleted');
  }
  function moveSection(section,delta) {
    if (!section) return; const all=sections(), idx=all.indexOf(section), target=all[idx+delta];
    if (!target) { showToast(delta<0?'Already at the top':'Already at the bottom'); return; }
    saveHistory(); if(delta<0) canvas.insertBefore(section,target); else canvas.insertBefore(target,section);
    renderLayers(); updateCount(); showToast('Section moved');
  }
  contextMenu.addEventListener('click',e=>{
    const btn=e.target.closest('button[data-action]'); if(!btn) return;
    const target=contextTarget; const action=btn.dataset.action; hideContext();
    if(action==='edit'){ selectSection(target); document.querySelector('.right-panel').scrollTop=0; }
    if(action==='duplicate') duplicate(target);
    if(action==='moveUp') moveSection(target,-1);
    if(action==='moveDown') moveSection(target,1);
    if(action==='delete') deleteSection(target);
    if(action==='copy'){copiedSection=target?.cloneNode(true);showToast(copiedSection?'Section copied':'Nothing to copy');}
    if(action==='paste'){
      if(!copiedSection){showToast('Copy a section first');return;}
      saveHistory(); const clone=copiedSection.cloneNode(true); clone.classList.remove('selected'); canvas.insertBefore(clone,target?target.nextSibling:null); bindSections(); selectSection(clone); updateCount(); showToast('Section pasted');
    }
  });
  document.addEventListener('click',e=>{if(!e.target.closest('#contextMenu')&&!e.target.closest('.more-btn')) hideContext();});
  window.addEventListener('scroll',hideContext,true);
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape') hideContext();
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='d'&&selected){e.preventDefault();duplicate(selected);}
    if((e.key==='Delete'||e.key==='Backspace')&&selected&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();deleteSection(selected);}
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z'){e.preventDefault();document.getElementById(e.shiftKey?'redoBtn':'undoBtn').click();}
  });
  document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t===tab));
    ['add','layers','pages','templates'].forEach(name=>document.getElementById(name+'Panel').classList.toggle('hidden',tab.dataset.tab!==name));
  }));
  function applyHomeTemplate(templateId) {
    if (activePageId !== 'home') {
      const goHome = confirm('Templates can only be applied to the Home page. Switch to Home now?');
      if (!goHome) return;
      switchPage('home');
    }
    const home = pages.find(p => p.id === 'home');
    if (!home) return;
    if (!confirm('Apply this template to Home? This replaces the current Home layout.')) return;
    const source = document.createElement('div'); source.innerHTML = homeMarkup;
    const top = source.querySelector('.site-topline');
    const sourceSections = [...source.querySelectorAll('.editable-section')];
    const byType = Object.fromEntries(sourceSections.map(section => [section.dataset.section, section.cloneNode(true)]));
    const wrapper = document.createElement('div'); if (top) wrapper.appendChild(top.cloneNode(true));
    const tools = section => section.querySelector('.section-tools')?.outerHTML || '<div class="section-tools"><span class="drag-handle">⠿</span><span class="section-label">SECTION</span><button class="more-btn">•••</button></div>';
    const setContent = (type, html, extraClass='') => {
      const section = byType[type]; if (!section) return;
      const toolMarkup = tools(section); section.innerHTML = toolMarkup + html;
      if (extraClass) section.classList.add(extraClass);
      const label = section.querySelector('.section-label'); if (label) label.textContent = type.toUpperCase();
      wrapper.appendChild(section);
    };
    if (templateId === 'portfolio') {
      setContent('hero', `<div class="portfolio-hero"><div><span class="eyebrow">INDEPENDENT DIGITAL STUDIO</span><h1>Thoughtful design.<br><em>Work that matters.</em></h1><p>We partner with ambitious people to create memorable brands and useful digital experiences.</p><div class="hero-buttons"><button class="primary-pill">Explore our work <span>↗</span></button><button class="secondary-pill">Meet the studio</button></div></div><div class="portfolio-art"><div class="art-window"><span></span><span></span><span></span><div class="art-shape"></div><b>FORM<br>FOLLOWS<br>FEELING.</b></div><small>SELECTED WORK · 2024—26</small></div></div>`);
      setContent('features', `<div class="section-intro"><span class="eyebrow">SELECTED PROJECTS</span><h2>A few things we've<br><em>put into the world.</em></h2><p>A mix of strategy, visual identity, and digital experiences.</p></div><div class="project-grid"><article class="project-tile project-one"><div class="project-art"><span>nōta</span><b>Ideas,<br>in good<br>company.</b></div><strong>Nōta — Brand identity</strong><small>Strategy · Identity · Digital</small></article><article class="project-tile project-two"><div class="project-art"><span>FIELDWORK</span><b>Make room<br>to grow.</b></div><strong>Fieldwork — Digital experience</strong><small>Research · Design · Development</small></article><article class="project-tile project-three"><div class="project-art"><span>COMMON</span><b>Better<br>together.</b></div><strong>Common — Campaign</strong><small>Art direction · Campaign</small></article></div>`, 'portfolio-projects');
      setContent('testimonials', `<div class="portfolio-quote"><span class="eyebrow">A NOTE FROM A PARTNER</span><blockquote>“They understood what we were trying to say before we had the words for it.”</blockquote><div class="quote-person"><div class="person-avatar">AM</div><div><strong>Alex Morgan</strong><small>Founder, Nōta</small></div></div></div>`);
      setContent('cta', `<div><span class="eyebrow">HAVE A GOOD ONE IN MIND?</span><h2>Let's make it<br><em>real together.</em></h2><p>Tell us what you're imagining. We'll bring the right people to the table.</p><button class="primary-pill">Start a project <span>↗</span></button></div><div class="cta-decoration">✳</div>`);
      setContent('footer', sectionTemplates.footer);
    } else if (templateId === 'startup') {
      setContent('hero', `<div class="startup-hero"><div class="startup-copy"><span class="eyebrow">THE WORKSPACE FOR WHAT'S NEXT</span><h1>Less busywork.<br><em>More breakthrough.</em></h1><p>One clear place to plan projects, bring people together, and turn big ideas into progress.</p><div class="hero-buttons"><button class="primary-pill">Start for free <span>↗</span></button><button class="secondary-pill">See how it works</button></div><small>✓ No credit card required &nbsp; ✓ Set up in minutes</small></div><div class="startup-dashboard"><div class="dash-top"><b>◈ Acme / Workspace</b><span>•••</span></div><div class="dash-task"><i>✓</i><div><strong>Website launch</strong><small>Project · On track</small></div><b>82%</b></div><div class="dash-task"><i>✓</i><div><strong>Spring campaign</strong><small>Marketing · In progress</small></div><b>64%</b></div><div class="dash-task"><i>○</i><div><strong>Customer research</strong><small>Product · Planned</small></div><b>28%</b></div><div class="dash-chart"><span>Team momentum</span><div><i style="height:38%"></i><i style="height:55%"></i><i style="height:45%"></i><i style="height:72%"></i><i style="height:62%"></i><i style="height:88%"></i><i style="height:95%"></i></div></div></div></div>`);
      setContent('logos', `<p>TEAMS BUILDING BETTER THINGS WITH ACME</p><div class="logo-row"><strong>◈ layers</strong><strong>◉ circooles</strong><strong>◒ catalog</strong><strong>✳ quotient</strong><strong>◈ sisyphus</strong></div>`);
      setContent('features', `<div class="section-intro"><span class="eyebrow">A BETTER WAY TO WORK</span><h2>From scattered tasks<br><em>to shared momentum.</em></h2><p>Everything your team needs to make progress visible.</p></div><div class="feature-grid"><article><span class="feature-icon purple">↗</span><h3>Plan with clarity</h3><p>Turn priorities into a plan everyone can follow.</p><a>Explore planning →</a></article><article><span class="feature-icon blue">◎</span><h3>Keep work moving</h3><p>See what is happening and what needs attention.</p><a>Explore workflows →</a></article><article><span class="feature-icon orange">✦</span><h3>Celebrate progress</h3><p>Make wins visible and help great work compound.</p><a>Explore reporting →</a></article></div>`);
      setContent('testimonials', sectionTemplates.testimonials);
      setContent('pricing', sectionTemplates.pricing);
      setContent('cta', `<div><span class="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h2>Ready to do your<br><em>best work yet?</em></h2><p>Join teams turning good ideas into real progress.</p><button class="primary-pill">Create your workspace <span>↗</span></button></div><div class="cta-decoration">✳</div>`);
      setContent('footer', sectionTemplates.footer);
    } else {
      setContent('hero', `<div class="minimal-hero"><span class="eyebrow">DESIGN · STRATEGY · DIGITAL</span><h1>Make it clear.<br><em>Make it count.</em></h1><p>A small, thoughtful studio for brands ready to move forward with purpose.</p><div class="hero-buttons"><button class="primary-pill">What we do <span>↗</span></button><button class="secondary-pill">Our approach</button></div><div class="minimal-hero-note"><span>01 / STRATEGY</span><span>02 / DESIGN</span><span>03 / BUILD</span></div></div>`);
      setContent('features', `<div class="minimal-services"><div class="section-intro"><span class="eyebrow">WHAT WE DO</span><h2>Good work, made<br><em>with intention.</em></h2></div><div class="service-list"><article><span>01</span><div><h3>Brand & strategy</h3><p>Find the heart of your story and a clear path forward.</p></div><b>↗</b></article><article><span>02</span><div><h3>Web design</h3><p>Useful, elegant experiences that make things easier.</p></div><b>↗</b></article><article><span>03</span><div><h3>Development</h3><p>Fast, accessible digital products built to last.</p></div><b>↗</b></article><article><span>04</span><div><h3>Ongoing support</h3><p>A reliable partner as your business evolves.</p></div><b>↗</b></article></div></div>`, 'minimal-services-section');
      setContent('testimonials', `<div class="minimal-note"><span class="eyebrow">OUR APPROACH</span><blockquote>“Simple isn't the absence of detail. It's the result of getting the details right.”</blockquote><p>We keep the process collaborative, considered, and refreshingly straightforward.</p></div>`);
      setContent('cta', `<div><span class="eyebrow">HAVE A PROJECT IN MIND?</span><h2>Let's make something<br><em>worth sharing.</em></h2><p>One clear conversation is a good place to start.</p><button class="primary-pill">Say hello <span>↗</span></button></div><div class="cta-decoration">✳</div>`);
      setContent('footer', sectionTemplates.footer);
    }
    canvas.innerHTML = wrapper.innerHTML;
    canvas.dataset.homeTemplate = templateId;
    home.content = canvas.innerHTML; home.templateId = templateId;
    selected = null; hideContext(); bindSections(); renderLayers(); updateCount(); updateProperties(); setPageBreadcrumb();
    document.querySelector('[data-tab="templates"]').click();
    showToast(`${templateId === 'portfolio' ? 'Studio Portfolio' : templateId === 'startup' ? 'Bold Startup' : 'Minimal Agency'} applied to Home`);
  }
  document.querySelectorAll('.apply-template').forEach(button => button.addEventListener('click', () => applyHomeTemplate(button.dataset.template)));

  document.addEventListener('pointerdown', event => {
    if (!selected || event.target.closest('.editable-section, #propertiesContent, .context-menu')) return;
    if (event.target.closest('.left-panel, .topbar, .canvas-toolbar, .canvas-bottom, .right-heading, .canvas-scroll')) clearSelection();
  });

  document.querySelectorAll('.component-card').forEach(card=>card.addEventListener('click',()=>{
    const type=card.dataset.component; saveHistory();
    const section=document.createElement('section'); section.className='editable-section'; section.dataset.section=type; section.tabIndex=0;
    const content=sectionTemplates[type]||sectionTemplates.text;
    section.innerHTML=`<div class="section-tools"><span class="drag-handle" title="Drag to reorder">⠿</span><span class="section-label">${type.toUpperCase()}</span><button class="more-btn" aria-label="Section actions">•••</button></div>${content}`;
    if(type==='logos') section.classList.add('logo-section');
    if(type==='features'||type==='pricing'||type==='text') section.classList.add('features-section');
    if(type==='testimonials') section.classList.add('testimonial-section');
    if(type==='cta') section.classList.add('cta-section');
    if(type==='footer') section.classList.add('footer-section');
    if(type==='stats') section.classList.add('stats-section');
    if(type==='team') section.classList.add('team-section');
    if(type==='faq') section.classList.add('faq-section');
    if(type==='newsletter') section.classList.add('newsletter-section');
    if(type==='imageShowcase') section.classList.add('image-showcase-section');
    if(type==='gallery') section.classList.add('gallery-section');
    canvas.appendChild(section); bindSections(); selectSection(section); updateCount(); section.scrollIntoView({behavior:'smooth',block:'center'}); showToast(`${names[type]||type} added`);
  }));
  document.getElementById('componentSearch').addEventListener('input',e=>{
    const q=e.target.value.toLowerCase();
    document.querySelectorAll('.component-card').forEach(c=>c.classList.toggle('hidden',!c.innerText.toLowerCase().includes(q)));
  });
  labelInput.addEventListener('change',()=>{if(selected){saveHistory();setSectionLabel(selected,labelInput.value);renderLayers();}});
  headingInput.addEventListener('change',()=>{if(selected){saveHistory();replaceHeading(selected,headingInput.value);}});
  descriptionInput.addEventListener('change',()=>{if(selected){saveHistory();const p=selected.querySelector('.hero-content > p,.section-intro > p,.cta-section p,.testimonial-section blockquote,.logo-section > p');if(p)p.textContent=descriptionInput.value;}});
  spacingRange.addEventListener('input',()=>{spacingOutput.value=spacingRange.value+' px';if(selected){selected.style.paddingTop=spacingRange.value+'px';selected.style.paddingBottom=spacingRange.value+'px';}});
  spacingRange.addEventListener('change',()=>{if(selected)saveHistory();});
  bgColor.addEventListener('change',()=>applyBackground(bgColor.value));
  bgColorPicker.addEventListener('change',()=>applyBackground(bgColorPicker.value));
  document.getElementById('openColorPicker').addEventListener('click',()=>bgColorPicker.click());
  borderRadiusControl.addEventListener('click',event=>{
    const button = event.target.closest('button[data-radius]'); if (!button || !selected) return;
    saveHistory(); const radius = Number(button.dataset.radius); selected.style.borderRadius = radius+'px'; setRadiusControl(radius);
  });
  document.getElementById('deleteSelectedBtn').addEventListener('click',()=>deleteSection(selected));
  document.getElementById('addLayerBtn').addEventListener('click',()=>document.querySelector('[data-tab="add"]').click());
  document.getElementById('newPageBtn').addEventListener('click',()=>{
    const name=prompt('What should this page be called?','New page'); if(!name||!name.trim()) return;
    const clean=name.trim(); const id='page-'+(pageIdCounter++);
    if(pages.some(p=>p.name.toLowerCase()===clean.toLowerCase())) { showToast('A page with that name already exists'); return; }
    pages.push({id,name:clean,path:'/'+pageSlug(clean),content:makePageContent(clean,['hero','features','cta','footer'])});
    renderPages(); switchPage(id);
  });
  document.querySelectorAll('.device').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.device').forEach(b=>b.classList.toggle('active',b===btn));
    canvas.classList.remove('desktop','tablet','mobile');canvas.classList.add(btn.dataset.device);
    document.getElementById('canvasSize').textContent=btn.dataset.device==='desktop'?'1440 × Auto':btn.dataset.device==='tablet'?'768 × Auto':'390 × Auto';
  }));
  document.getElementById('undoBtn').addEventListener('click',()=>{if(!undoStack.length){showToast('Nothing to undo');return;}redoStack.push(snapshot());restore(undoStack.pop());showToast('Change undone');});
  document.getElementById('redoBtn').addEventListener('click',()=>{if(!redoStack.length){showToast('Nothing to redo');return;}undoStack.push(snapshot());restore(redoStack.pop());showToast('Change restored');});
  document.getElementById('previewBtn').addEventListener('click',()=>{
    const preview=document.getElementById('previewContent');preview.innerHTML=canvas.innerHTML;
    preview.querySelectorAll('.editable-section').forEach(s=>s.classList.remove('selected'));
    document.getElementById('previewOverlay').classList.remove('hidden');
  });
  document.getElementById('closePreview').addEventListener('click',()=>document.getElementById('previewOverlay').classList.add('hidden'));
  document.getElementById('exportBtn').addEventListener('click',()=>{
    const sectionsHTML=sections().map(s=>s.outerHTML.replace(/ class="editable-section[^"]*"/,' class="section"').replace(/<div class="section-tools">[\s\S]*?<\/div>/,'')).join('\n\n');
    const astro=`---\n// Generated by Astro Studio prototype\n---\n<html lang="en">\n<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /><title>Acme Studio</title></head>\n<body>\n${sectionsHTML}\n</body>\n</html>`;
    const blob=new Blob([astro],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='index.astro';a.click();URL.revokeObjectURL(a.href);showToast('Downloaded starter index.astro');
  });
  // Initialize page routes with independent editable canvas content.
  const homeMarkup = canvas.innerHTML;
  canvas.dataset.homeTemplate = 'default';
  pages = [
    {id:'home',name:'Home',path:'/',content:homeMarkup,templateId:'default'},
    {id:'about',name:'About',path:'/about',content:makePageContent('About',['hero','features','testimonials','footer'])},
    {id:'services',name:'Services',path:'/services',content:makePageContent('Services',['hero','features','pricing','cta','footer'])},
    {id:'contact',name:'Contact',path:'/contact',content:makePageContent('Contact',['hero','text','cta','footer'])}
  ];
  bindSections(); renderLayers(); updateCount(); renderPages(); setPageBreadcrumb();
  const first=sections()[0]; if(first)selectSection(first);
})();
