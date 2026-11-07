/* ==========================================================================
   THREE YEARS OF US - 3RD ANNIVERSARY INTERACTIVE SCRIPT
   ========================================================================== */

// =========================================================================
// CONFIGURATION: Relationship Settings & Slideshow Photos
// =========================================================================

/**
 * 1. Relationship Start Date
 * Set your anniversary / relationship start date here.
 * Format: new Date(YEAR, MONTH_INDEX, DAY)
 * Note: JavaScript months are 0-indexed:
 *   0 = Jan, 1 = Feb, 2 = Mar, 3 = Apr, 4 = May, 5 = Jun,
 *   6 = Jul, 7 = Aug, 8 = Sep, 9 = Oct, 10 = Nov, 11 = Dec
 * Example: October 1, 2023 -> new Date(2023, 9, 1)
 */
const START_DATE = new Date(2023, 9, 1);

/**
 * 2. Hero Photo Slideshow Images
 * List of photo paths to feature in the central hero crossfade slideshow.
 * Add, remove, or reorder photo paths as desired.
 */
const HERO_PHOTOS = [
  'assets/anniversary_selfie.jpg',
  'assets/photo2.jpg',
  'assets/gateway_rooftop_garden1.jpg',
  'assets/anniversary_walk.jpg',
  'assets/photo9.jpg',
  'assets/gateway_photobooth_2024.jpg',
  'assets/photo1.jpg',
  'assets/anniversary_roses.jpg'
];

// Slideshow rotation speed in milliseconds (3.5 seconds)
const SLIDESHOW_INTERVAL = 3500;

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Dynamic Monthsarry Title & Navbar Branding
     -------------------------------------------------------------------------- */

  /**
   * Calculates total completed months between START_DATE and today's date.
   * Accurately takes day-of-month and month-end variations into account.
   */
  function getCompletedMonths(startDate, currentDate = new Date()) {
    const start = new Date(startDate);
    const now = new Date(currentDate);

    let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());

    // If current day is before start day, the current month has not completed yet
    if (now.getDate() < start.getDate()) {
      const lastDayOfNowMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const isNowMonthEnd = now.getDate() === lastDayOfNowMonth;
      const isStartDayExceedingMonthEnd = start.getDate() > lastDayOfNowMonth;

      if (!(isNowMonthEnd && isStartDayExceedingMonthEnd)) {
        months--;
      }
    }

    return Math.max(0, months);
  }

  /**
   * Formats a number with its proper English ordinal suffix (1st, 2nd, 3rd, 4th, 33rd...)
   */
  function getOrdinalSuffix(n) {
    const remainder10 = n % 10;
    const remainder100 = n % 100;

    // Numbers ending in 11, 12, 13 use 'th' (e.g. 11th, 12th, 13th, 111th, 112th)
    if (remainder100 >= 11 && remainder100 <= 13) {
      return `${n}th`;
    }

    switch (remainder10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  }

  /**
   * Updates hero title, navbar text, badge, and document title dynamically.
   */
  function updateDynamicTitles() {
    const completedMonths = getCompletedMonths(START_DATE);
    const ordinalMonths = getOrdinalSuffix(completedMonths);

    // Navbar Logo Branding: "Happy [N]th Monthsarry Bebbu!"
    const navLogo = document.getElementById('nav-logo');
    if (navLogo) {
      navLogo.innerHTML = `Happy ${ordinalMonths} <span>Monthsarry Bebbu!</span>`;
    }

    // Main <h1> Hero Title: "Happy [N]th monthsarry bebbu!"
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
      heroTitle.innerHTML = `Happy ${ordinalMonths} <span class="gradient-text">monthsarry bebbu!</span>`;
    }

    // Hero Badge ("X Months of Endless Love")
    const badgeText = document.getElementById('hero-badge-text');
    if (badgeText) {
      badgeText.textContent = `${completedMonths} Months of Endless Love`;
    }

    // Document Title
    document.title = `Happy ${ordinalMonths} monthsarry bebbu!`;
  }

  updateDynamicTitles();

  /* --------------------------------------------------------------------------
     2. Middle Photo Crossfade Slideshow
     -------------------------------------------------------------------------- */
  function initHeroSlideshow() {
    const container = document.getElementById('hero-slideshow-container');
    const frame = document.getElementById('hero-slideshow-frame');
    if (!container || !Array.isArray(HERO_PHOTOS) || HERO_PHOTOS.length === 0) return;

    // Render image elements from HERO_PHOTOS array
    container.innerHTML = '';
    const slides = [];

    HERO_PHOTOS.forEach((src, idx) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Couple Memory ${idx + 1}`;
      img.className = `hero-portrait-img hero-slide ${idx === 0 ? 'active' : ''}`;
      img.loading = idx === 0 ? 'eager' : 'lazy';
      container.appendChild(img);
      slides.push(img);
    });

    if (slides.length <= 1) return;

    let currentIndex = 0;
    let autoSlideTimer = null;

    function goToNextSlide() {
      const prevIndex = currentIndex;
      currentIndex = (currentIndex + 1) % slides.length;

      // Reset previous classes
      slides.forEach(slide => slide.classList.remove('previous'));

      // Keep previous slide visible underneath while current slide fades in
      slides[prevIndex].classList.remove('active');
      slides[prevIndex].classList.add('previous');

      // Fade in new active slide
      slides[currentIndex].classList.add('active');
    }

    function startTimer() {
      stopTimer();
      autoSlideTimer = setInterval(goToNextSlide, SLIDESHOW_INTERVAL);
    }

    function stopTimer() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    }

    // Advance immediately on container click & restart timer
    const clickTarget = frame || container;
    clickTarget.addEventListener('click', () => {
      goToNextSlide();
      startTimer();
    });

    // Keyboard accessibility (Space or Enter advances)
    clickTarget.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToNextSlide();
        startTimer();
      }
    });

    // Start auto slideshow
    startTimer();
  }

  initHeroSlideshow();

  /* --------------------------------------------------------------------------
     3. Live Anniversary Counter
     -------------------------------------------------------------------------- */
  function updateAnniversaryTimer() {
    const now = new Date();
    const diff = Math.max(0, now - START_DATE);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24) + (days * 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60) + (hours * 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const daysEl = document.getElementById('days-count');
    const hoursEl = document.getElementById('hours-count');
    const minutesEl = document.getElementById('minutes-count');
    const secondsEl = document.getElementById('seconds-count');

    if (daysEl) daysEl.textContent = days.toLocaleString();
    if (hoursEl) hoursEl.textContent = hours.toLocaleString();
    if (minutesEl) minutesEl.textContent = minutes.toLocaleString();
    if (secondsEl) secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateAnniversaryTimer();
  setInterval(updateAnniversaryTimer, 1000);

  /* --------------------------------------------------------------------------
     4. Navbar Scrolled State & Active Link Highlighting
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
     5. Scroll Reveal Animations (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* --------------------------------------------------------------------------
     6. Interactive Calendar & Multi-Photo Album Engine (33 Months)
     -------------------------------------------------------------------------- */
  const monthsData = [
    // Year 1 (Oct 2023 - Sep 2024)
    {
      id: '2023-10', monthName: 'October', year: 2023, yearCategory: 'year1', monthNum: 1, daysInMonth: 31, startDay: 0,
      photos: [
      ]
    },
    {
      id: '2023-11', monthName: 'November', year: 2023, yearCategory: 'year1', monthNum: 2, daysInMonth: 30, startDay: 3,
      photos: [
      ]
    },
    {
      id: '2023-12', monthName: 'December', year: 2023, yearCategory: 'year1', monthNum: 3, daysInMonth: 31, startDay: 5,
      photos: [
        { id: 41, src: 'assets/photo4.jpg', date: 'December 13, 2023', day: 13, title: 'Mr. DIY Stroll', location: '📍 Mr. DIY Store', caption: 'Mr. DIY stroll memories walking through the store aisles together.' },
        { id: 42, src: 'assets/photo5.jpg', date: 'December 13, 2023', day: 13, title: 'Mr. DIY Stroll Selfies', location: '📍 Mr. DIY Store', caption: 'Browsing around and taking cute selfies during our Mr. DIY stroll.' },
        { id: 43, src: 'assets/birthday_collage_2023.png', date: 'December 24, 2023', day: 24, title: 'Happiest Birthday Bebbu!', location: '📍 Birthday Celebration', caption: 'Her first birthday together with us—a collage of happy faces and warm birthday wishes!' }
      ]
    },
    {
      id: '2024-01', monthName: 'January', year: 2024, yearCategory: 'year1', monthNum: 4, daysInMonth: 31, startDay: 1,
      photos: [
        { id: 5, src: 'assets/photo9.jpg', date: 'January 1, 2024', day: 1, title: 'New Year Silly Faces', location: '📍 Home Hangout', caption: 'Welcoming the new year with cute glasses and silly pose selfies!' }
      ]
    },
    {
      id: '2024-02', monthName: 'February', year: 2024, yearCategory: 'year1', monthNum: 5, daysInMonth: 29, startDay: 4,
      photos: [
      ]
    },
    {
      id: '2024-03', monthName: 'March', year: 2024, yearCategory: 'year1', monthNum: 6, daysInMonth: 31, startDay: 5,
      photos: [
      ]
    },
    {
      id: '2024-04', monthName: 'April', year: 2024, yearCategory: 'year1', monthNum: 7, daysInMonth: 30, startDay: 1,
      photos: [
        { id: 2, src: 'assets/photo2.jpg', date: 'April 6, 2024', day: 6, title: 'Sweet Cuddle Moments', location: '📍 Cozy Hugs', caption: 'Holding you tight and smiling together—my favorite place in the world.' }
      ]
    },
    {
      id: '2024-05', monthName: 'May', year: 2024, yearCategory: 'year1', monthNum: 8, daysInMonth: 31, startDay: 3,
      photos: [
        { id: 91, src: 'assets/photo6.jpg', date: 'May 13, 2024', day: 13, title: 'Birthday Meetup Date', location: '📍 Birthday Meetup Date', caption: 'Meeting up on May 13, 2024 to celebrate my birthday together!' },
        { id: 92, src: 'assets/photo7.jpg', date: 'May 13, 2024', day: 13, title: 'Birthday Celebration Moments', location: '📍 Birthday Meetup Date', caption: 'Special birthday date filled with smiles, warm moments, and endless love.' }
      ]
    },
    {
      id: '2024-06', monthName: 'June', year: 2024, yearCategory: 'year1', monthNum: 9, daysInMonth: 30, startDay: 6,
      photos: [
        { id: 101, src: 'assets/photo11.jpg', date: 'June 3, 2024', day: 3, title: 'June Outdoor Outing', location: '📍 Outdoor Stroll', caption: 'Capturing bright summer smiles together.' },
        { id: 102, src: 'assets/photo12.jpg', date: 'June 3, 2024', day: 3, title: 'Bridge Trail Thumbs Up', location: '📍 Mountain Bridge Trail', caption: 'Adventure day outdoors walking along the scenic river trail.' },
        { id: 103, src: 'assets/photo15.jpg', date: 'June 3, 2024', day: 3, title: 'Summer Hangout Memories', location: '📍 Cozy Hangout', caption: 'Relaxing together during sweet summer moments.' }
      ]
    },
    {
      id: '2024-07', monthName: 'July', year: 2024, yearCategory: 'year1', monthNum: 10, daysInMonth: 31, startDay: 1,
      photos: [
      ]
    },
    {
      id: '2024-08', monthName: 'August', year: 2024, yearCategory: 'year1', monthNum: 11, daysInMonth: 31, startDay: 4,
      photos: [
      ]
    },
    {
      id: '2024-09', monthName: 'September', year: 2024, yearCategory: 'year1', monthNum: 12, daysInMonth: 30, startDay: 0,
      photos: [
        { id: 141, src: 'assets/photo13.jpg', date: 'September 1, 2024', day: 1, title: 'Red Cushion Lounge Selfies', location: '📍 Home Cozy Chill', caption: 'Relaxing behind the cozy red cushion with silly tongue out faces!' },
        { id: 142, src: 'assets/photo14.jpg', date: 'September 1, 2024', day: 1, title: 'Couch Kissy Face Shenanigans', location: '📍 Home Cozy Chill', caption: 'Group selfie shenanigans with kissy faces and nonstop giggles.' },
        { id: 143, src: 'assets/photo16.jpg', date: 'September 1, 2024', day: 1, title: 'Cute Pressed Lips Selfie', location: '📍 Home Cozy Chill', caption: 'Your cute little pressed lips expression that I adore so much!' }
      ]
    },

    // Year 2 (Oct 2024 - Sep 2025)
    {
      id: '2024-10', monthName: 'October', year: 2024, yearCategory: 'year2', monthNum: 13, daysInMonth: 31, startDay: 2,
      photos: [
        { id: 15, src: 'assets/anniversary_selfie.jpg', date: 'October 1, 2024', day: 1, title: '1st Anniversary Date Selfie', location: '📍 Anniversary Dinner Date', caption: 'Capturing our happy smiles together on our special 1st Anniversary date!' },
        { id: 151, src: 'assets/anniversary_roses.jpg', date: 'October 1, 2024', day: 1, title: 'Handmade Blue Satin Roses Bouquet', location: '📍 1st Anniversary Gift', caption: 'A gorgeous bouquet of sparkling blue satin roses given to celebrate our 1st year of love.' },
        { id: 152, src: 'assets/anniversary_walk.jpg', date: 'October 1, 2024', day: 1, title: 'Evening Stroll Under Fairy Lights', location: '📍 Night Promenade', caption: 'Walking under warm glowing lights together on our anniversary night.' }
      ]
    },
    {
      id: '2024-11', monthName: 'November', year: 2024, yearCategory: 'year2', monthNum: 14, daysInMonth: 30, startDay: 5,
      photos: [
        { id: 16, src: 'assets/photo17.jpg', date: 'November 18, 2024', day: 18, title: 'Museum Exhibit Pictures', location: '📍 Glass Display Gallery', caption: 'Snapping pictures of intricate crafts and glass showcases.' }
      ]
    },
    {
      id: '2024-12', monthName: 'December', year: 2024, yearCategory: 'year2', monthNum: 15, daysInMonth: 31, startDay: 0,
      photos: [
        { id: 171, src: 'assets/gateway_rooftop_garden1.jpg', date: 'December 24, 2024', day: 24, title: 'Birthday Date at Rooftop Garden', location: '📍 Gateway Mall Cubao, Rooftop Garden', caption: 'Celebrating her special birthday at Gateway Mall Cubao rooftop garden surrounded by greenery!' },
        { id: 172, src: 'assets/gateway_rooftop_garden2.jpg', date: 'December 24, 2024', day: 24, title: 'Peace Signs & Silly Faces', location: '📍 Gateway Mall Cubao, Rooftop Garden', caption: 'Throwing peace signs and making cute silly expressions together in the garden.' },
        { id: 173, src: 'assets/gateway_rooftop_garden3.jpg', date: 'December 24, 2024', day: 24, title: 'Cute Garden Selfie Poses', location: '📍 Gateway Mall Cubao, Rooftop Garden', caption: 'Sweet chin-resting pose with warm smiles during her birthday celebration date.' },
        { id: 174, src: 'assets/gateway_photobooth_2024.jpg', date: 'December 24, 2024', day: 24, title: 'Korean Photobooth Photo Strip (인생네컷)', location: '📍 Korean Photobooth Studio, Cubao', caption: 'Taking cute photo booth strips with shark headbands, funny glasses, and big heart poses!' }
      ]
    },
    {
      id: '2025-01', monthName: 'January', year: 2025, yearCategory: 'year2', monthNum: 16, daysInMonth: 31, startDay: 3,
      photos: [
        { id: 18, src: 'assets/photo18.jpg', date: 'January 14, 2025', day: 14, title: 'White Bow & Museum Strolls', location: '📍 Art Exhibit', caption: 'Walking beside glass jars filled with history.' }
      ]
    },
    {
      id: '2025-02', monthName: 'February', year: 2025, yearCategory: 'year2', monthNum: 17, daysInMonth: 28, startDay: 6,
      photos: [
        { id: 19, src: 'assets/photo8.jpg', date: 'February 14, 2025', day: 14, title: 'Valentine’s Cuddle Session', location: '📍 Home Hugs', caption: 'Resting on my chest with the funniest cute scrunchy face!' },
        { id: 191, src: 'assets/valentines_date_2025.png', date: 'February 14, 2025', day: 14, title: 'Valentine’s Date & Roses', location: '📍 Valentine’s Date', caption: 'A quick but full of memories date—food, purple roses, chocolates, and endless love!' }
      ]
    },
    {
      id: '2025-03', monthName: 'March', year: 2025, yearCategory: 'year2', monthNum: 18, daysInMonth: 31, startDay: 6,
      photos: [
        { id: 20, src: 'assets/photo19.jpg', date: 'March 22, 2025', day: 22, title: 'Ancient Artifacts Tour', location: '📍 History Hall', caption: 'Exploring dimly lit ancient sculpture rooms.' }
      ]
    },
    {
      id: '2025-04', monthName: 'April', year: 2025, yearCategory: 'year2', monthNum: 19, daysInMonth: 30, startDay: 2,
      photos: [
        { id: 21, src: 'assets/photo1.jpg', date: 'April 12, 2025', day: 12, title: 'Afternoon Mall Stroll', location: '📍 Plaza Walk', caption: 'Walking hand in hand through busy mall hallways.' }
      ]
    },
    {
      id: '2025-05', monthName: 'May', year: 2025, yearCategory: 'year2', monthNum: 20, daysInMonth: 31, startDay: 4,
      photos: [
        { id: 22, src: 'assets/photo5.jpg', date: 'May 18, 2025', day: 18, title: 'May Store Walk', location: '📍 Shopping Aisle', caption: 'Browsing through colorful water bottles and tumblers.' }
      ]
    },
    {
      id: '2025-06', monthName: 'June', year: 2025, yearCategory: 'year2', monthNum: 21, daysInMonth: 30, startDay: 0,
      photos: [

      ]
    },
    {
      id: '2025-07', monthName: 'July', year: 2025, yearCategory: 'year2', monthNum: 22, daysInMonth: 31, startDay: 2,
      photos: [
        { id: 23, src: 'assets/photo17.jpg', date: 'July 1, 2025', day: 1, title: 'Artifacts Gallery', location: '📍 National Museum of Natural History', caption: 'Browsing through colorful water bottles and tumblers.' },
        { id: 231, src: 'assets/photo18.jpg', date: 'July 1, 2025', day: 1, title: 'Artifacts Gallery', location: '📍 National Museum of Natural History', caption: 'Browsing through colorful water bottles and tumblers.' },
        { id: 232, src: 'assets/photo19.jpg', date: 'July 1, 2025', day: 1, title: 'Artifacts Gallery', location: '📍National Museum of Natural History', caption: 'Browsing through colorful water bottles and tumblers.' },
        { id: 233, src: 'assets/photo20.jpg', date: 'July 1, 2025', day: 1, title: 'Artifacts Gallery', location: '📍National Museum of Natural History', caption: 'Enjoying a cool evening walk along the water.' }
      ]
    },
    {
      id: '2025-08', monthName: 'August', year: 2025, yearCategory: 'year2', monthNum: 23, daysInMonth: 31, startDay: 5,
      photos: [
        { id: 25, src: 'assets/photo17.jpg', date: 'August 9, 2025', day: 9, title: 'Museum Exhibit Photos', location: '📍 Cultural Display', caption: 'Capturing unique historic artifacts with your phone.' }
      ]
    },
    {
      id: '2025-09', monthName: 'September', year: 2025, yearCategory: 'year2', monthNum: 24, daysInMonth: 30, startDay: 1,
      photos: [
        { id: 26, src: 'assets/photo3.jpg', date: 'September 14, 2025', day: 14, title: '2 Years Journey', location: '📍 Mall Walkway', caption: 'Celebrating 24 full months together!' }
      ]
    },

    // Year 3 (Oct 2025 - Jun 2026 / 33 Months)
    {
      id: '2025-10', monthName: 'October', year: 2025, yearCategory: 'year3', monthNum: 25, daysInMonth: 31, startDay: 3,
      photos: [
        { id: 271, src: 'assets/arroceros_forest_canopy.jpg', date: 'October 5, 2025', day: 5, title: 'Arroceros Forest Park Walkway', location: '📍 Arroceros Forest Park, Manila', caption: 'Walking along the lush green elevated wooden trail on our late 2nd Anniversary celebration.' },
        { id: 272, src: 'assets/arroceros_stairs_him.jpg', date: 'October 5, 2025', day: 5, title: '2nd Anniversary Date at Arroceros', location: '📍 Arroceros Forest Park, Manila', caption: 'Sitting on the wooden staircase surrounded by peaceful forest trees during our late 2nd anniversary date.' },
        { id: 273, src: 'assets/arroceros_stairs_her_side.jpg', date: 'October 5, 2025', day: 5, title: 'Forest Park Moments', location: '📍 Arroceros Forest Park, Manila', caption: 'Looking out into the green canopy, enjoying a serene anniversary afternoon together.' },
        { id: 274, src: 'assets/arroceros_stairs_her_candid.jpg', date: 'October 5, 2025', day: 5, title: 'Candid Forest Park Portrait', location: '📍 Arroceros Forest Park, Manila', caption: 'A sweet candid moment sitting on the wooden stairs in the heart of Manila’s urban forest.' },
        { id: 275, src: 'assets/arroceros_stairs_her_smile.jpg', date: 'October 5, 2025', day: 5, title: 'Warm Anniversary Smile', location: '📍 Arroceros Forest Park, Manila', caption: 'Your beautiful smile captured on the wooden staircase, celebrating 2 full years of love.' },
        { id: 276, src: 'assets/arroceros_stairs_her_tongue.jpg', date: 'October 5, 2025', day: 5, title: 'Playful Staircase Tongue-Out Pose', location: '📍 Arroceros Forest Park, Manila', caption: 'Silly and cute moment on the wooden staircase during our anniversary date!' },
        { id: 277, src: 'assets/arroceros_stairs_her_gentle.jpg', date: 'October 5, 2025', day: 5, title: 'Gentle Smile on the Stairs', location: '📍 Arroceros Forest Park, Manila', caption: 'Your gentle gaze sitting comfortably on the forest park stairs.' },
        { id: 278, src: 'assets/arroceros_railing_her_smile.jpg', date: 'October 5, 2025', day: 5, title: 'Railing Portrait by the Trees', location: '📍 Arroceros Forest Park, Manila', caption: 'Leaning on the wooden railing surrounded by beautiful green leaves.' },
        { id: 279, src: 'assets/arroceros_stairs_her_pose.jpg', date: 'October 5, 2025', day: 5, title: 'Stairway Forest Portrait', location: '📍 Arroceros Forest Park, Manila', caption: 'Relaxing on the stairs, soaking in the natural peaceful breeze.' },
        { id: 280, src: 'assets/arroceros_railing_her_tongue.jpg', date: 'October 5, 2025', day: 5, title: 'Silly Railing Pose', location: '📍 Arroceros Forest Park, Manila', caption: 'Making cute silly faces by the forest railing that always brighten my day!' },
        { id: 281, src: 'assets/arroceros_tiesa_tree.jpg', date: 'October 5, 2025', day: 5, title: 'TIESA Tree Tag Sign', location: '📍 Arroceros Forest Park, Manila', caption: 'A cool tree tag sign hanging in the forest park during our anniversary stroll.' },
        { id: 282, src: 'assets/kkv_sponges_wall.jpg', date: 'October 5, 2025', day: 5, title: 'Colorful Beauty Sponges Wall', location: '📍 KKV, Gateway Mall 2', caption: 'Admiring the aesthetic wall filled with colorful pastel beauty blender sponges at KKV!' },
        { id: 283, src: 'assets/kkv_topdown_mirror_selfie.jpg', date: 'October 5, 2025', day: 5, title: 'Top-Down KKV Mirror Selfie', location: '📍 KKV, Gateway Mall 2', caption: 'Taking a silly top-down mirror selfie above the snack aisles at KKV Gateway Mall 2.' },
        { id: 284, src: 'assets/kkv_store_mirror_selfie.jpg', date: 'October 5, 2025', day: 5, title: 'KKV Store Mirror Selfie', location: '📍 KKV, Gateway Mall 2', caption: 'Posing together in front of yellow KKV display frames with plushies and cute outfits!' }
      ]
    },
    {
      id: '2025-11', monthName: 'November', year: 2025, yearCategory: 'year3', monthNum: 26, daysInMonth: 30, startDay: 6,
      photos: [
        { id: 28, src: 'assets/photo18.jpg', date: 'November 10, 2025', day: 10, title: 'Museum Stroll & Ribbon', location: '📍 Art Exhibit', caption: 'Capturing your elegance in white ribbon bows.' }
      ]
    },
    {
      id: '2025-12', monthName: 'December', year: 2025, yearCategory: 'year3', monthNum: 27, daysInMonth: 31, startDay: 1,
      photos: [
        { id: 291, src: 'assets/birthday_21st_collage.png', date: 'December 24, 2025', day: 24, title: 'Happy 21st Birthday Dra-Este Bebbu!', location: '📍 21st Birthday Celebration', caption: 'Celebrating her 21st birthday with a beautiful photo collage—campus strolls, sunny smiles, and graduation vibes!' },
        { id: 292, src: 'assets/boat_lifevest.png', date: 'December 24, 2025', day: 24, title: 'Sunset Boat Ride Adventure', location: '📍 Boat on the Water', caption: 'Peace sign and kissy face on a boat at sunset—wearing a life vest and living the adventure!' },
        { id: 29, src: 'assets/photo16.jpg', date: 'December 25, 2025', day: 25, title: 'Cozy Holiday Selfies', location: '📍 Home Warmth', caption: 'Taking cute festive selfies with silly expressions.' }
      ]
    },
    {
      id: '2026-01', monthName: 'January', year: 2026, yearCategory: 'year3', monthNum: 28, daysInMonth: 31, startDay: 4,
      photos: [
        { id: 30, src: 'assets/photo20.jpg', date: 'January 1, 2026', day: 1, title: 'New Year Museum Date', location: '📍 Crimson Gallery', caption: 'Starting the new year with culture, history, and hand-in-hand strolls.' }
      ]
    },
    {
      id: '2026-02', monthName: 'February', year: 2026, yearCategory: 'year3', monthNum: 29, daysInMonth: 28, startDay: 0,
      photos: [
        { id: 31, src: 'assets/photo1.jpg', date: 'February 14, 2026', day: 14, title: 'Sweet Valentine Date', location: '📍 Red Ribbon Mall', caption: 'Valentine date filled with smiles and sweet cake.' }
      ]
    },
    {
      id: '2026-03', monthName: 'March', year: 2026, yearCategory: 'year3', monthNum: 30, daysInMonth: 31, startDay: 0,
      photos: [
        { id: 32, src: 'assets/photo19.jpg', date: 'March 18, 2026', day: 18, title: 'Ancient Artifacts Tour', location: '📍 Sculpture Room', caption: 'Admiring historical treasures in dim gallery lights.' }
      ]
    },
    {
      id: '2026-04', monthName: 'April', year: 2026, yearCategory: 'year3', monthNum: 31, daysInMonth: 30, startDay: 3,
      photos: [
        { id: 33, src: 'assets/photo17.jpg', date: 'April 22, 2026', day: 22, title: 'Museum Photo Capture', location: '📍 Cultural Display Case', caption: 'Taking photos of historical relics and artifacts.' }
      ]
    },
    {
      id: '2026-05', monthName: 'May', year: 2026, yearCategory: 'year3', monthNum: 32, daysInMonth: 31, startDay: 5,
      photos: [
        { id: 34, src: 'assets/photo9.jpg', date: 'May 16, 2026', day: 16, title: 'Sweet Indoor Couple Selfie', location: '📍 Cozy Hours', caption: 'Glasses, smiles, and leaning on each other.' }
      ]
    },
    {
      id: '2026-06', monthName: 'June', year: 2026, yearCategory: 'year3', monthNum: 33, daysInMonth: 30, startDay: 1,
      photos: [
        { id: 35, src: 'assets/photo2.jpg', date: 'June 24, 2026', day: 24, title: 'Happy 33rd Monthsarry Bebbu!', location: '📍 Endless Love', caption: '33 Months of laughter, growth, and unconditional affection. Happy Monthsarry Bebbu!' }
      ]
    }
  ];

  // DOM Elements
  const calendarContainer = document.getElementById('calendar-view-container');
  const gridContainer = document.getElementById('grid-view-container');
  const btnCalendarView = document.getElementById('btn-calendar-view');
  const btnGridView = document.getElementById('btn-grid-view');
  const filterBtns = document.querySelectorAll('.filter-btn');

  const calendarModal = document.getElementById('calendar-album-modal');
  const calendarModalClose = document.getElementById('calendar-modal-close');
  const albumBadge = document.getElementById('album-badge');
  const albumTitle = document.getElementById('album-title');
  const albumSubtitle = document.getElementById('album-subtitle');
  const albumPhotosGrid = document.getElementById('album-photos-grid');

  let currentViewMode = 'calendar';
  let currentActiveFilter = 'all';

  // Master Flattened Memory Array for Lightbox
  let allFlattenedPhotos = [];
  monthsData.forEach(m => {
    m.photos.forEach(p => {
      allFlattenedPhotos.push({
        src: p.src,
        alt: p.title,
        title: p.title,
        desc: `${p.date} • ${p.location}\n${p.caption}`
      });
    });
  });

  // Render Calendar Grid
  function renderCalendarView(filterCategory) {
    if (!calendarContainer) return;
    calendarContainer.innerHTML = '';

    const filteredMonths = monthsData.filter(m => {
      if (filterCategory === 'all') return true;
      return m.yearCategory === filterCategory;
    });

    filteredMonths.forEach(m => {
      const card = document.createElement('div');
      card.className = 'month-calendar-card reveal active';

      // Map day memories
      const memoryDaysMap = {};
      m.photos.forEach(p => {
        memoryDaysMap[p.day] = p;
      });

      // Build Calendar Grid HTML
      let daysHtml = '';
      // Empty padding days
      for (let i = 0; i < m.startDay; i++) {
        daysHtml += `<div class="cal-day empty"></div>`;
      }
      // Days of the month
      for (let d = 1; d <= m.daysInMonth; d++) {
        const memory = memoryDaysMap[d];
        if (memory) {
          daysHtml += `
            <div class="cal-day has-memory" data-month-id="${m.id}" data-day="${d}" title="${memory.title} (${memory.date})">
              <span>${d}</span>
              <span class="cal-heart">💖</span>
            </div>
          `;
        } else {
          daysHtml += `<div class="cal-day"><span>${d}</span></div>`;
        }
      }

      const totalPhotos = m.photos.length;
      const yearLabel = m.yearCategory === 'year1' ? 'Year 1' : (m.yearCategory === 'year2' ? 'Year 2' : 'Year 3');

      card.innerHTML = `
        <div class="month-header">
          <div class="month-title-group">
            <h3 class="month-name">${m.monthName} ${m.year}</h3>
            <span class="month-year-sub">${yearLabel} • Month ${m.monthNum}</span>
          </div>
          <button class="month-photo-badge" data-month-id="${m.id}">
            📷 ${totalPhotos} ${totalPhotos === 1 ? 'Photo' : 'Photos'}
          </button>
        </div>

        <div class="cal-days-header">
          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
        </div>

        <div class="cal-days-grid">
          ${daysHtml}
        </div>

        <div class="month-card-footer">
          <span class="month-memory-desc">${m.photos[0] ? m.photos[0].title : 'Memory Recorded'}</span>
          <button class="month-open-btn" data-month-id="${m.id}">
            Open Album →
          </button>
        </div>
      `;

      calendarContainer.appendChild(card);
    });

    // Attach Click Events to Calendar Cells & Badges
    calendarContainer.querySelectorAll('.has-memory, .month-photo-badge, .month-open-btn').forEach(el => {
      el.addEventListener('click', (e) => {
        const monthId = el.getAttribute('data-month-id');
        const selectedMonth = monthsData.find(m => m.id === monthId);
        if (selectedMonth) {
          openCalendarAlbumModal(selectedMonth);
        }
      });
    });
  }

  // Render Grid View
  function renderGridView(filterCategory) {
    if (!gridContainer) return;
    gridContainer.innerHTML = '';

    const filteredMonths = monthsData.filter(m => {
      if (filterCategory === 'all') return true;
      return m.yearCategory === filterCategory;
    });

    let globalPhotoIndex = 0;
    filteredMonths.forEach(m => {
      m.photos.forEach(p => {
        const currentIndex = allFlattenedPhotos.findIndex(item => item.title === p.title && item.src === p.src);
        const card = document.createElement('div');
        card.className = 'memory-card reveal active';
        card.setAttribute('data-category', m.yearCategory);

        const yearTag = m.yearCategory === 'year1' ? 'Year 1 • The Beginning' : (m.yearCategory === 'year2' ? 'Year 2 • Growing Together' : 'Year 3 • Forever & Always');

        card.innerHTML = `
          <div class="memory-img-wrapper" onclick="openLightboxFromIndex(${currentIndex >= 0 ? currentIndex : 0})">
            <img src="${p.src}" alt="${p.title}" class="memory-img">
            <span class="memory-date-badge">${p.date}</span>
            <div class="img-overlay">
              <span class="zoom-badge">🔍 Click to Expand</span>
            </div>
          </div>
          <div class="memory-content">
            <span class="memory-tag">${yearTag}</span>
            <h3 class="memory-title">${p.title}</h3>
            <p class="memory-desc">${p.caption}</p>
            <div class="memory-footer">
              <span class="memory-location">${p.location}</span>
              <span class="memory-index">Month ${m.monthNum} / 33</span>
            </div>
          </div>
        `;
        gridContainer.appendChild(card);
      });
    });
  }

  // Open Calendar Album Modal
  function openCalendarAlbumModal(monthObj) {
    if (!calendarModal) return;

    const yearLabel = monthObj.yearCategory === 'year1' ? 'Year 1' : (monthObj.yearCategory === 'year2' ? 'Year 2' : 'Year 3');
    albumBadge.textContent = `${yearLabel} • Month ${monthObj.monthNum} of 33`;
    albumTitle.textContent = `${monthObj.monthName} ${monthObj.year} Photo Album`;
    albumSubtitle.textContent = `Showing ${monthObj.photos.length} captured moment${monthObj.photos.length > 1 ? 's' : ''} from ${monthObj.monthName} ${monthObj.year}. Click any picture to view full-screen lightbox.`;

    albumPhotosGrid.innerHTML = '';

    monthObj.photos.forEach(p => {
      const globalIndex = allFlattenedPhotos.findIndex(item => item.title === p.title && item.src === p.src);

      const photoCard = document.createElement('div');
      photoCard.className = 'album-photo-card';
      photoCard.innerHTML = `
        <div class="album-photo-img-wrapper">
          <img src="${p.src}" alt="${p.title}" class="album-photo-img">
          <span class="album-photo-date">${p.date}</span>
        </div>
        <div class="album-photo-details">
          <h4 class="album-photo-title">${p.title}</h4>
          <p class="album-photo-caption">${p.caption}</p>
          <span class="album-photo-location">${p.location}</span>
        </div>
      `;

      photoCard.addEventListener('click', () => {
        closeCalendarAlbumModal();
        openLightboxFromIndex(globalIndex >= 0 ? globalIndex : 0);
      });

      albumPhotosGrid.appendChild(photoCard);
    });

    calendarModal.classList.add('active');
    calendarModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCalendarAlbumModal() {
    if (!calendarModal) return;
    calendarModal.classList.remove('active');
    calendarModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  }

  if (calendarModalClose) {
    calendarModalClose.addEventListener('click', closeCalendarAlbumModal);
  }
  if (calendarModal) {
    calendarModal.addEventListener('click', (e) => {
      if (e.target === calendarModal) closeCalendarAlbumModal();
    });
  }

  // View Switcher (Calendar vs Grid)
  if (btnCalendarView && btnGridView) {
    btnCalendarView.addEventListener('click', () => {
      btnCalendarView.classList.add('active');
      btnGridView.classList.remove('active');
      currentViewMode = 'calendar';
      calendarContainer.classList.remove('hidden');
      gridContainer.classList.add('hidden');
    });

    btnGridView.addEventListener('click', () => {
      btnGridView.classList.add('active');
      btnCalendarView.classList.remove('active');
      currentViewMode = 'grid';
      gridContainer.classList.remove('hidden');
      calendarContainer.classList.add('hidden');
    });
  }

  // Filter Tabs
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentActiveFilter = btn.getAttribute('data-filter');

      renderCalendarView(currentActiveFilter);
      renderGridView(currentActiveFilter);
    });
  });

  // Initial Render of Calendar and Grid Views
  renderCalendarView('all');
  renderGridView('all');

  /* --------------------------------------------------------------------------
     7. High-Resolution Lightbox Modal Engine with Smooth Crisp Zoom
     -------------------------------------------------------------------------- */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxTargetImg = document.getElementById('lightbox-target-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const lightboxPrevBtn = document.getElementById('lightbox-prev');
  const lightboxNextBtn = document.getElementById('lightbox-next');
  const zoomInBtn = document.getElementById('lightbox-zoom-in');
  const zoomOutBtn = document.getElementById('lightbox-zoom-out');
  const zoomResetBtn = document.getElementById('lightbox-zoom-reset');

  let currentGalleryIndex = 0;
  let currentZoomScale = 1;

  window.openLightboxFromIndex = function (index) {
    if (index < 0 || index >= allFlattenedPhotos.length) return;
    currentGalleryIndex = index;
    currentZoomScale = 1;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.openLightbox = window.openLightboxFromIndex;

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    currentZoomScale = 1;
    applyImageZoom();
  }

  function updateLightboxContent() {
    const data = allFlattenedPhotos[currentGalleryIndex];
    if (!data) return;

    lightboxTargetImg.src = data.src;
    lightboxTargetImg.alt = data.title;
    lightboxTitle.textContent = data.title;
    lightboxDesc.textContent = data.desc;
    lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${allFlattenedPhotos.length}`;

    currentZoomScale = 1;
    applyImageZoom();
  }

  function applyImageZoom() {
    lightboxTargetImg.style.transform = `scale(${currentZoomScale}) translateZ(0)`;
  }

  function navigateLightbox(dir) {
    currentGalleryIndex = (currentGalleryIndex + dir + allFlattenedPhotos.length) % allFlattenedPhotos.length;
    updateLightboxContent();
  }

  function zoomIn() {
    if (currentZoomScale < 2.5) {
      currentZoomScale += 0.25;
      applyImageZoom();
    }
  }

  function zoomOut() {
    if (currentZoomScale > 0.75) {
      currentZoomScale -= 0.25;
      applyImageZoom();
    }
  }

  function resetZoom() {
    currentZoomScale = 1;
    applyImageZoom();
  }

  // Event Listeners for Lightbox
  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', () => navigateLightbox(-1));
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', () => navigateLightbox(1));
  if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
  if (zoomResetBtn) zoomResetBtn.addEventListener('click', resetZoom);

  // Close lightbox on backdrop click
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-stage')) {
        closeLightbox();
      }
    });
  }

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
    if (e.key === '+' || e.key === '=') zoomIn();
    if (e.key === '-') zoomOut();
  });

  /* --------------------------------------------------------------------------
     8. Ed Sheeran - "Perfect" Romantic Music Player Engine
     -------------------------------------------------------------------------- */
  const musicBtn = document.getElementById('music-btn');
  const musicBtnText = document.getElementById('music-btn-text');
  const soundWave = document.getElementById('sound-wave');
  const bgAudio = document.getElementById('bg-music');

  let audioCtx = null;
  let isPlayingMusic = false;
  let synthInterval = null;
  let usingSynthFallback = false;

  // Ed Sheeran - "Perfect" 12/8 Ballad Progression (G - Em - C - D)
  const perfectChords = [
    [196.00, 246.94, 293.66, 392.00], // G major
    [164.81, 196.00, 246.94, 329.63], // E minor
    [130.81, 164.81, 196.00, 261.63], // C major
    [146.83, 185.00, 220.00, 293.66]  // D major
  ];

  // "Perfect" Main Melody Notes (Frequencies in Hz)
  const perfectMelody = [
    392.00, 392.00, 440.00, 493.88, 392.00, 392.00, 369.99, 329.63,
    392.00, 392.00, 440.00, 493.88, 523.25, 493.88, 440.00, 392.00,
    493.88, 523.25, 587.33, 587.33, 523.25, 493.88, 440.00, 392.00
  ];

  function playPerfectSynthMeasure(step) {
    if (!audioCtx || !isPlayingMusic) return;

    const chord = perfectChords[step % perfectChords.length];
    const melodyNote = perfectMelody[step % perfectMelody.length];
    const now = audioCtx.currentTime;

    // Play 12/8 Arpeggiated Guitar Strum
    chord.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.035, now + i * 0.18 + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + i * 0.18);
      osc.stop(now + 4.0);
    });

    // Play Gentle Lead Melody Note ("Perfect" Vocal Line)
    if (melodyNote) {
      const mOsc = audioCtx.createOscillator();
      const mGain = audioCtx.createGain();

      mOsc.type = 'triangle';
      mOsc.frequency.setValueAtTime(melodyNote, now + 0.4);

      mGain.gain.setValueAtTime(0.001, now + 0.4);
      mGain.gain.linearRampToValueAtTime(0.045, now + 0.6);
      mGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      mOsc.connect(mGain);
      mGain.connect(audioCtx.destination);

      mOsc.start(now + 0.4);
      mOsc.stop(now + 2.6);
    }
  }

  function startSynthEngine() {
    usingSynthFallback = true;
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    let step = 0;
    playPerfectSynthMeasure(step);
    synthInterval = setInterval(() => {
      step++;
      playPerfectSynthMeasure(step);
    }, 4000);
  }

  function toggleMusic() {
    isPlayingMusic = !isPlayingMusic;

    if (isPlayingMusic) {
      musicBtnText.textContent = 'Pause "Perfect"';
      soundWave.classList.add('playing');

      if (bgAudio) {
        bgAudio.play().then(() => {
          usingSynthFallback = false;
        }).catch(err => {
          // Fallback to Ed Sheeran - Perfect Web Audio Synthesizer
          startSynthEngine();
        });
      } else {
        startSynthEngine();
      }
    } else {
      musicBtnText.textContent = 'Play "Perfect"';
      soundWave.classList.remove('playing');
      if (bgAudio) {
        bgAudio.pause();
      }
      if (synthInterval) {
        clearInterval(synthInterval);
        synthInterval = null;
      }
    }
  }

  if (musicBtn) musicBtn.addEventListener('click', toggleMusic);

  /* --------------------------------------------------------------------------
     9. Floating Rose Petals / Hearts Background Canvas Engine
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 28;

    class Petal {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height;
        this.size = Math.random() * 8 + 6;
        this.speedY = Math.random() * 1.2 + 0.6;
        this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 1.5;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.color = Math.random() > 0.4 ? 'rgba(232, 165, 152, ' : 'rgba(212, 163, 115, ';
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.01) * 0.8 + this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.beginPath();
        ctx.fillStyle = this.color + this.opacity + ')';
        // Draw soft petal / oval
        ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Petal());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* --------------------------------------------------------------------------
     10. Footer Heart Explosion Button
     -------------------------------------------------------------------------- */
  const heartBtn = document.getElementById('heart-burst-btn');
  if (heartBtn) {
    heartBtn.addEventListener('click', (e) => {
      const rect = heartBtn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      for (let i = 0; i < 16; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'fixed';
        heart.style.left = `${centerX}px`;
        heart.style.top = `${centerY}px`;
        heart.style.fontSize = `${Math.random() * 1.5 + 1}rem`;
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.transition = 'transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s linear';

        document.body.appendChild(heart);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 120 + 40;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity - 60;

        requestAnimationFrame(() => {
          heart.style.transform = `translate(${tx}px, ${ty}px) scale(1.4)`;
          heart.style.opacity = '0';
        });

        setTimeout(() => {
          heart.remove();
        }, 1000);
      }
    });
  }

});
