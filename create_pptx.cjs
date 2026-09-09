const PptxGenJS = require('pptxgenjs');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches

// ── Palette ────────────────────────────────────────────
const C = {
  darkGreen:  '022C22',
  midGreen:   '054F38',
  lightGreen: '065C40',
  paleGreen:  'ECFDF5',
  gold:       'D97706',
  lightGold:  'FCD34D',
  white:      'FFFFFF',
  offWhite:   'F5F5F4',
  bodyGray:   '44403C',
  darkBar:    '011A14',
};

// ── Shared helpers ──────────────────────────────────────
function darkHeader(slide, tagText, titleText) {
  // full-width dark top band
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.45, y: 0, w: 12.88, h: 1.35,
    fill: { color: C.darkGreen }, line: { type: 'none' },
  });
  // gold tag pill
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.65, y: 0.12, w: 2.1, h: 0.28,
    fill: { color: C.gold }, line: { type: 'none' },
  });
  slide.addText(tagText, {
    x: 0.65, y: 0.12, w: 2.1, h: 0.28,
    fontSize: 8, bold: true, color: C.darkGreen,
    align: 'center', valign: 'middle',
  });
  // heading
  slide.addText(titleText, {
    x: 0.65, y: 0.45, w: 11.5, h: 0.75,
    fontSize: 28, bold: true, color: C.white,
    align: 'left', valign: 'middle',
  });
  // gold divider
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.65, y: 1.41, w: 11.8, h: 0.045,
    fill: { color: C.gold }, line: { type: 'none' },
  });
}

function leftAccentBar(slide) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.45, h: 7.5,
    fill: { color: C.darkGreen }, line: { type: 'none' },
  });
}

function bgRect(slide) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 7.5,
    fill: { color: C.offWhite }, line: { type: 'none' },
  });
}

function card(slide, x, y, w, h, headerH, headerColor, titleText, bullets, titleSize = 13) {
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h, fill: { color: C.white }, line: { type: 'none' } });
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h: headerH, fill: { color: headerColor }, line: { type: 'none' } });
  slide.addText(titleText, {
    x: x + 0.15, y: y + 0.07, w: w - 0.2, h: headerH - 0.06,
    fontSize: titleSize, bold: true, color: C.white, valign: 'middle',
  });
  const bulletObjs = bullets.map(b => ([
    { text: '◆  ', options: { color: C.gold, fontSize: 11, bold: true } },
    { text: b, options: { color: C.bodyGray, fontSize: 12 } },
  ])).flat();

  bullets.forEach((b, i) => {
    slide.addText([
      { text: '◆  ', options: { color: C.gold, fontSize: 10, bold: true } },
      { text: b,    options: { color: C.bodyGray, fontSize: 12 } },
    ], {
      x: x + 0.18, y: y + headerH + 0.12 + i * 0.42,
      w: w - 0.3, h: 0.38,
    });
  });
}

// ══════════════════════════════════════════════════════════
// SLIDE 1 — TITLE
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();

  // Full dark bg
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.darkGreen }, line: { type: 'none' } });
  // Left bar
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.5, h: 7.5, fill: { color: C.darkBar }, line: { type: 'none' } });
  // Right decorative panel
  s.addShape(pptx.ShapeType.rect, { x: 9.2, y: 0, w: 4.13, h: 7.5, fill: { color: C.midGreen }, line: { type: 'none' } });
  // Right edge gold strip
  s.addShape(pptx.ShapeType.rect, { x: 9.15, y: 0, w: 0.07, h: 7.5, fill: { color: C.gold }, line: { type: 'none' } });
  // Bottom gold divider
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 6.6, w: 9.15, h: 0.07, fill: { color: C.gold }, line: { type: 'none' } });

  // Decorative circles on right panel
  const circles = [
    { x: 9.8, y: 0.4, size: 1.8, color: '045C3E' },
    { x: 10.8, y: 2.2, size: 1.3, color: '033D2A' },
    { x: 9.6, y: 3.8, size: 1.0, color: '066B4C' },
    { x: 11.5, y: 4.5, size: 1.5, color: '044F37' },
  ];
  circles.forEach(c => {
    s.addShape(pptx.ShapeType.ellipse, {
      x: c.x, y: c.y, w: c.size, h: c.size,
      fill: { color: c.color }, line: { type: 'none' },
    });
  });

  // Building icon
  s.addText('🏛', { x: 9.8, y: 2.8, w: 2.5, h: 1.5, fontSize: 64, align: 'center' });

  // Tag
  s.addShape(pptx.ShapeType.rect, { x: 0.75, y: 1.05, w: 2.8, h: 0.3, fill: { color: C.gold }, line: { type: 'none' } });
  s.addText('MID PROJECT PRESENTATION', {
    x: 0.75, y: 1.05, w: 2.8, h: 0.3,
    fontSize: 8, bold: true, color: C.darkGreen, align: 'center', valign: 'middle',
  });

  // Main title
  s.addText('Hall Booking and\nManagement System', {
    x: 0.75, y: 1.45, w: 8.1, h: 2.0,
    fontSize: 40, bold: true, color: C.white, align: 'left',
  });

  // Gold line separator
  s.addShape(pptx.ShapeType.rect, { x: 0.75, y: 3.55, w: 5.5, h: 0.06, fill: { color: C.gold }, line: { type: 'none' } });

  // Info rows
  const info = [
    ['Student',     'Safiya'],
    ['Course',      'Software Engineering'],
    ['Institution', 'University / College'],
    ['Year',        '2026'],
  ];
  info.forEach(([label, value], i) => {
    const y = 3.72 + i * 0.48;
    s.addText(label + ':', { x: 0.75, y, w: 1.7, h: 0.42, fontSize: 11, bold: true, color: C.gold });
    s.addText(value,       { x: 2.35, y, w: 5.5, h: 0.42, fontSize: 11, bold: false, color: C.white });
  });
}

// ══════════════════════════════════════════════════════════
// SLIDE 2 — INTRODUCTION
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bgRect(s); leftAccentBar(s);
  darkHeader(s, 'SLIDE  02 / 07', 'Introduction');

  // Main content card
  s.addShape(pptx.ShapeType.rect, { x: 0.65, y: 1.55, w: 11.8, h: 5.65, fill: { color: C.white }, line: { type: 'none' } });

  // Section 1
  s.addShape(pptx.ShapeType.rect, { x: 0.65, y: 1.55, w: 0.18, h: 1.75, fill: { color: C.gold }, line: { type: 'none' } });
  s.addText('What Is This Project?', { x: 0.95, y: 1.68, w: 10, h: 0.4, fontSize: 15, bold: true, color: C.darkGreen });
  const intro1 = [
    'A website that allows customers to book banquet halls online — anytime, anywhere.',
    'The hotel administrator can manage all bookings from a separate admin panel.',
    'Built specifically for Camilla Banquet Hotel, Kurunegala, Sri Lanka.',
  ];
  intro1.forEach((b, i) => {
    s.addText([
      { text: '◆  ', options: { color: C.gold, fontSize: 10, bold: true } },
      { text: b,    options: { color: C.bodyGray, fontSize: 13 } },
    ], { x: 0.95, y: 2.13 + i * 0.42, w: 11.2, h: 0.38 });
  });

  // Divider
  s.addShape(pptx.ShapeType.rect, { x: 0.95, y: 3.6, w: 11.1, h: 0.035, fill: { color: C.offWhite }, line: { type: 'none' } });

  // Section 2
  s.addShape(pptx.ShapeType.rect, { x: 0.65, y: 3.7, w: 0.18, h: 1.75, fill: { color: C.midGreen }, line: { type: 'none' } });
  s.addText('Why Is This System Needed?', { x: 0.95, y: 3.78, w: 10, h: 0.4, fontSize: 15, bold: true, color: C.darkGreen });
  const intro2 = [
    'People prefer to book things online rather than visiting in person or calling.',
    'Hotels struggle to manage many bookings on paper — mistakes happen easily.',
    'A digital system saves time, reduces errors, and improves the customer experience.',
  ];
  intro2.forEach((b, i) => {
    s.addText([
      { text: '◆  ', options: { color: C.midGreen, fontSize: 10, bold: true } },
      { text: b,    options: { color: C.bodyGray, fontSize: 13 } },
    ], { x: 0.95, y: 4.25 + i * 0.42, w: 11.2, h: 0.38 });
  });

  // Bottom accent
  s.addShape(pptx.ShapeType.rect, { x: 0.65, y: 7.1, w: 11.8, h: 0.25, fill: { color: C.darkGreen }, line: { type: 'none' } });
  s.addText('🎯  Camilla Banquet Hotel — Kurunegala, Sri Lanka', {
    x: 0.65, y: 7.1, w: 11.8, h: 0.25,
    fontSize: 9, bold: true, color: C.gold, align: 'center', valign: 'middle',
  });
}

// ══════════════════════════════════════════════════════════
// SLIDE 3 — PROBLEM STATEMENT
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bgRect(s); leftAccentBar(s);
  darkHeader(s, 'SLIDE  03 / 07', 'Problem Statement');

  // Two problem columns
  const cols = [
    {
      x: 0.65, title: '📋  The Old Manual Way',
      color: C.darkGreen,
      bullets: [
        'Customers phone or visit the hotel just to check availability',
        'Staff write bookings on paper or in a register book',
        'No easy way to know which hall is free on which date',
      ],
    },
    {
      x: 6.85, title: '⚠️  Problems This Causes',
      color: '7C2020',
      bullets: [
        'Two customers get booked for the same hall on the same day',
        'Booking records get lost, mixed up, or hard to find later',
        'Customers feel frustrated — no transparency or updates',
      ],
    },
  ];

  cols.forEach(col => {
    s.addShape(pptx.ShapeType.rect, { x: col.x, y: 1.58, w: 5.9, h: 3.35, fill: { color: C.white }, line: { type: 'none' } });
    s.addShape(pptx.ShapeType.rect, { x: col.x, y: 1.58, w: 5.9, h: 0.58, fill: { color: col.color }, line: { type: 'none' } });
    s.addText(col.title, { x: col.x + 0.18, y: 1.63, w: 5.5, h: 0.48, fontSize: 13, bold: true, color: C.white, valign: 'middle' });
    col.bullets.forEach((b, i) => {
      s.addText([
        { text: '◆  ', options: { color: C.gold, fontSize: 10, bold: true } },
        { text: b, options: { color: C.bodyGray, fontSize: 12.5 } },
      ], { x: col.x + 0.2, y: 2.28 + i * 0.53, w: 5.5, h: 0.48 });
    });
  });

  // Impact panel
  s.addShape(pptx.ShapeType.rect, { x: 0.65, y: 5.15, w: 12.1, h: 1.6, fill: { color: C.darkGreen }, line: { type: 'none' } });
  s.addShape(pptx.ShapeType.rect, { x: 0.65, y: 5.15, w: 0.22, h: 1.6, fill: { color: C.gold }, line: { type: 'none' } });
  s.addText('💡  The Core Problem', { x: 1.0, y: 5.25, w: 11.3, h: 0.42, fontSize: 14, bold: true, color: C.gold });
  s.addText(
    'There is no easy digital way for a customer to check which hall is free, choose a suitable package, and confirm a booking — without physically visiting the hotel or making a phone call. This leads to confusion, lost business, and poor customer experience.',
    { x: 1.0, y: 5.68, w: 11.3, h: 0.95, fontSize: 12, color: C.white }
  );
}

// ══════════════════════════════════════════════════════════
// SLIDE 4 — PROPOSED SOLUTION
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bgRect(s); leftAccentBar(s);
  darkHeader(s, 'SLIDE  04 / 07', 'Proposed Solution');

  const solutions = [
    { icon: '🌐', title: 'Online\nBooking Portal', desc: 'Customers can browse halls, select a date and a package, and submit a booking request — anytime, from any device.', color: C.darkGreen },
    { icon: '🔐', title: 'Secure\nLogin System', desc: 'Every customer creates an account. Their bookings, history, and status updates are saved privately under their profile.', color: C.midGreen },
    { icon: '🛠️', title: 'Admin\nControl Panel', desc: 'Hotel staff log in to a dedicated admin area. They can approve or reject bookings, and manage halls in real time.', color: '1E3A5F' },
  ];

  solutions.forEach((sol, i) => {
    const x = 0.7 + i * 4.15;
    // Card
    s.addShape(pptx.ShapeType.rect, { x, y: 1.6, w: 3.95, h: 4.5, fill: { color: C.white }, line: { type: 'none' } });
    // Header
    s.addShape(pptx.ShapeType.rect, { x, y: 1.6, w: 3.95, h: 1.1, fill: { color: sol.color }, line: { type: 'none' } });
    s.addText(sol.icon, { x, y: 1.62, w: 1.0, h: 1.06, fontSize: 36, align: 'center', valign: 'middle' });
    s.addText(sol.title, { x: x + 0.95, y: 1.65, w: 2.85, h: 1.0, fontSize: 14, bold: true, color: C.white, valign: 'middle' });
    // Body
    s.addText(sol.desc, { x: x + 0.18, y: 2.82, w: 3.6, h: 2.6, fontSize: 13, color: C.bodyGray });
    // Number badge
    s.addShape(pptx.ShapeType.ellipse, { x: x + 1.7, y: 5.72, w: 0.5, h: 0.5, fill: { color: C.gold }, line: { type: 'none' } });
    s.addText(`${i + 1}`, { x: x + 1.7, y: 5.72, w: 0.5, h: 0.5, fontSize: 14, bold: true, color: C.darkGreen, align: 'center', valign: 'middle' });
  });

  // Result banner
  s.addShape(pptx.ShapeType.rect, { x: 0.65, y: 6.4, w: 12.1, h: 0.82, fill: { color: C.gold }, line: { type: 'none' } });
  s.addText('✅   Result: Faster bookings, zero confusion, and full control for the hotel — all in one system.', {
    x: 0.65, y: 6.4, w: 12.1, h: 0.82,
    fontSize: 14, bold: true, color: C.darkGreen, align: 'center', valign: 'middle',
  });
}

// ══════════════════════════════════════════════════════════
// SLIDE 5 — MAIN FEATURES
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bgRect(s); leftAccentBar(s);
  darkHeader(s, 'SLIDE  05 / 07', 'Main Features');

  const features = [
    { icon: '👤', title: 'Register & Login',     desc: 'Create an account and log in securely. Your session is saved automatically.' },
    { icon: '🏛️', title: 'Browse Halls',          desc: 'View all available banquet halls with photos, capacity, and pricing details.' },
    { icon: '📅', title: 'Make a Booking',        desc: 'Select a hall, choose a date, pick a package, and submit your booking request.' },
    { icon: '✅', title: 'Admin Approvals',       desc: 'Admin reviews each request and approves or rejects it. Status updates instantly.' },
    { icon: '🛠️', title: 'Hall Management',       desc: 'Admin can add new halls, edit existing ones, or remove halls from the system.' },
    { icon: '📊', title: 'Customer Dashboard',    desc: 'Customers can view all their bookings and check the latest status at any time.' },
  ];

  features.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.65 + col * 4.15;
    const y = 1.58 + row * 2.0;

    s.addShape(pptx.ShapeType.rect, { x, y, w: 3.95, h: 1.8, fill: { color: C.white }, line: { type: 'none' } });
    // Left colored strip
    s.addShape(pptx.ShapeType.rect, { x, y, w: 0.6, h: 1.8, fill: { color: C.darkGreen }, line: { type: 'none' } });
    // Icon
    s.addText(f.icon, { x, y: y + 0.5, w: 0.6, h: 0.72, fontSize: 22, align: 'center' });
    // Title
    s.addText(f.title, { x: x + 0.7, y: y + 0.2, w: 3.1, h: 0.42, fontSize: 13, bold: true, color: C.darkGreen });
    // Desc
    s.addText(f.desc, { x: x + 0.7, y: y + 0.64, w: 3.1, h: 0.95, fontSize: 11.5, color: C.bodyGray });
  });

  // Gold footer line
  s.addShape(pptx.ShapeType.rect, { x: 0.65, y: 7.25, w: 12.1, h: 0.1, fill: { color: C.gold }, line: { type: 'none' } });
}

// ══════════════════════════════════════════════════════════
// SLIDE 6 — HOW IT WORKS (FLOW)
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bgRect(s); leftAccentBar(s);
  darkHeader(s, 'SLIDE  06 / 07', 'How the System Works');

  const steps = [
    { n: '1', icon: '👤', top: 'Customer\nRegisters',   sub: 'Sign up free' },
    { n: '2', icon: '🏛️', top: 'Chooses\na Hall',       sub: 'Browse halls' },
    { n: '3', icon: '📅', top: 'Picks Date\n& Package',  sub: 'Select options' },
    { n: '4', icon: '📝', top: 'Submits\nBooking',       sub: 'Send request' },
    { n: '5', icon: '🔍', top: 'Admin\nReviews',         sub: 'Admin checks' },
    { n: '6', icon: '✅', top: 'Booking\nConfirmed',     sub: 'Customer notified' },
  ];

  const stepW = 1.72;
  const startX = 0.7;
  const stepGap = 0.27;

  steps.forEach((step, i) => {
    const x = startX + i * (stepW + stepGap);

    // Circle
    s.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.36, y: 1.75, w: 1.0, h: 1.0,
      fill: { color: C.darkGreen }, line: { type: 'none' },
    });
    s.addText(step.icon, { x: x + 0.36, y: 1.77, w: 1.0, h: 0.96, fontSize: 26, align: 'center', valign: 'middle' });

    // Number badge
    s.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.62, y: 1.54, w: 0.4, h: 0.4,
      fill: { color: C.gold }, line: { type: 'none' },
    });
    s.addText(step.n, { x: x + 0.62, y: 1.54, w: 0.4, h: 0.4, fontSize: 11, bold: true, color: C.darkGreen, align: 'center', valign: 'middle' });

    // Step label
    s.addText(step.top, { x, y: 2.82, w: stepW, h: 0.65, fontSize: 11, bold: true, color: C.darkGreen, align: 'center' });

    // Sub-label box
    s.addShape(pptx.ShapeType.rect, { x, y: 3.52, w: stepW, h: 0.42, fill: { color: C.paleGreen }, line: { type: 'none' } });
    s.addText(step.sub, { x, y: 3.52, w: stepW, h: 0.42, fontSize: 10, color: C.midGreen, align: 'center', valign: 'middle' });

    // Arrow between steps
    if (i < steps.length - 1) {
      s.addText('→', {
        x: x + stepW + 0.04, y: 2.0, w: stepGap + 0.04, h: 0.55,
        fontSize: 20, bold: true, color: C.gold, align: 'center',
      });
    }
  });

  // Connecting line under circles
  s.addShape(pptx.ShapeType.rect, {
    x: 1.0, y: 2.22, w: 11.4, h: 0.05,
    fill: { color: C.gold }, line: { type: 'none' },
  });

  // Info panel
  s.addShape(pptx.ShapeType.rect, { x: 0.65, y: 4.15, w: 12.1, h: 2.9, fill: { color: C.darkGreen }, line: { type: 'none' } });
  s.addShape(pptx.ShapeType.rect, { x: 0.65, y: 4.15, w: 0.22, h: 2.9, fill: { color: C.gold }, line: { type: 'none' } });

  s.addText('⚡  Key Highlights', { x: 1.05, y: 4.28, w: 5, h: 0.42, fontSize: 13, bold: true, color: C.gold });

  const highlights = [
    '📵  No phone calls needed — customers do everything online.',
    '🔒  Double-booking is automatically prevented by the system.',
    '🔄  When admin approves a booking, the customer\'s page updates instantly.',
    '📋  Admin sees ALL bookings in one organised table — easy to manage.',
  ];
  highlights.forEach((h, i) => {
    s.addText(h, { x: 1.05, y: 4.78 + i * 0.5, w: 11.3, h: 0.44, fontSize: 12.5, color: C.white });
  });
}

// ══════════════════════════════════════════════════════════
// SLIDE 7 — CONCLUSION
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();

  // Full dark bg
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: C.darkGreen }, line: { type: 'none' } });
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.5, h: 7.5, fill: { color: C.darkBar }, line: { type: 'none' } });
  // Right panel
  s.addShape(pptx.ShapeType.rect, { x: 9.1, y: 0, w: 4.23, h: 7.5, fill: { color: C.midGreen }, line: { type: 'none' } });
  s.addShape(pptx.ShapeType.rect, { x: 9.05, y: 0, w: 0.07, h: 7.5, fill: { color: C.gold }, line: { type: 'none' } });

  // Decorative circles
  const circles7 = [
    { x: 9.8, y: 0.3, size: 1.9, color: '055C40' },
    { x: 11.0, y: 2.5, size: 1.3, color: '033D2A' },
    { x: 9.6, y: 4.2, size: 1.0, color: '067048' },
    { x: 11.3, y: 5.3, size: 1.6, color: '044F37' },
  ];
  circles7.forEach(c => {
    s.addShape(pptx.ShapeType.ellipse, { x: c.x, y: c.y, w: c.size, h: c.size, fill: { color: c.color }, line: { type: 'none' } });
  });
  s.addText('🏁', { x: 10.0, y: 3.0, w: 2.0, h: 1.4, fontSize: 60, align: 'center' });

  // Slide tag
  s.addShape(pptx.ShapeType.rect, { x: 0.75, y: 0.18, w: 2.1, h: 0.28, fill: { color: C.gold }, line: { type: 'none' } });
  s.addText('SLIDE  07 / 07', { x: 0.75, y: 0.18, w: 2.1, h: 0.28, fontSize: 8, bold: true, color: C.darkGreen, align: 'center', valign: 'middle' });

  // Title
  s.addText('Conclusion', { x: 0.75, y: 0.55, w: 8, h: 0.72, fontSize: 36, bold: true, color: C.white });
  s.addShape(pptx.ShapeType.rect, { x: 0.75, y: 1.35, w: 5.5, h: 0.06, fill: { color: C.gold }, line: { type: 'none' } });

  // What we built
  s.addText('✅  What We Have Built So Far', { x: 0.75, y: 1.52, w: 8, h: 0.42, fontSize: 13, bold: true, color: C.gold });
  const built = [
    'Secure user registration and login system',
    'Browse and view available banquet halls online',
    'Online booking form with hall, date, and package selection',
    'Admin panel to approve, reject, and manage all bookings',
    'Admin hall management — add, edit, and delete halls',
    'Customer dashboard to track booking status in real time',
  ];
  built.forEach((b, i) => {
    s.addText([
      { text: '◆  ', options: { color: C.gold, fontSize: 10, bold: true } },
      { text: b, options: { color: C.white, fontSize: 12 } },
    ], { x: 0.75, y: 2.0 + i * 0.42, w: 8.0, h: 0.38 });
  });

  // Divider
  s.addShape(pptx.ShapeType.rect, { x: 0.75, y: 4.6, w: 8.0, h: 0.04, fill: { color: '2D5A47' }, line: { type: 'none' } });

  // Future
  s.addText('🚀  Planned for Future Phases', { x: 0.75, y: 4.72, w: 8, h: 0.42, fontSize: 13, bold: true, color: C.lightGold });
  const future = [
    'Online payment system integration',
    'Automatic email and SMS notifications',
    'Advanced analytics and reports for management',
  ];
  future.forEach((b, i) => {
    s.addText([
      { text: '◆  ', options: { color: C.lightGold, fontSize: 10, bold: true } },
      { text: b, options: { color: C.white, fontSize: 12 } },
    ], { x: 0.75, y: 5.22 + i * 0.42, w: 8.0, h: 0.38 });
  });

  // Thank you banner
  s.addShape(pptx.ShapeType.rect, { x: 0.75, y: 6.62, w: 8.0, h: 0.68, fill: { color: C.gold }, line: { type: 'none' } });
  s.addText('Thank You for Listening  🙏', {
    x: 0.75, y: 6.62, w: 8.0, h: 0.68,
    fontSize: 17, bold: true, color: C.darkGreen, align: 'center', valign: 'middle',
  });
}

// ── Save ────────────────────────────────────────────────
const outPath = 'C:/Users/Safiya/Desktop/HallBooking_Presentation.pptx';
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log(`✅  Saved → ${outPath}`);
});
