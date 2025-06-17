const slider = document.querySelector('.slider');
        const items = document.querySelectorAll('.slider .item');
        const toggleBtn = document.getElementById('toggle-btn');
        const imageText = document.getElementById('image-text');
        const textTitle = document.getElementById('text-title');
        const textDescription = document.getElementById('text-description');

        const total = items.length;
        const anglePerItem = 360 / total;

        let isPlaying = true;
        let currentRotation = 0;
        let isAnimating = false;
        let activeItemIndex = -1;

        // Function to get approximate current rotation during animation
        function getCurrentRotationApprox() {
            if (isPlaying) {
                // Estimate based on animation time and speed
                const animationDuration = 20000; // 20 seconds
                const startTime = performance.now() - (performance.now() % animationDuration);
                const elapsed = performance.now() - startTime;
                const progress = (elapsed / animationDuration) % 1;
                return progress * 360;
            }
            return currentRotation;
        }

        // Function to normalize angle to 0-360 range
        function normalizeAngle(angle) {
            return ((angle % 360) + 360) % 360;
        }

        // Function to find shortest rotation path
        function getShortestRotation(from, to) {
            const diff = normalizeAngle(to - from);
            if (diff > 180) {
                return from - (360 - diff);
            } else {
                return from + diff;
            }
        }

        // Function to show text
        function showText(title, description) {
            if (textTitle && textDescription && imageText) { // Null check
                textTitle.textContent = title;
                textDescription.textContent = description;
                setTimeout(() => {
                    imageText.classList.add('show');
                }, 800); // Show text after rotation completes
            }
        }

        // Function to hide text
        function hideText() {
            if (imageText) { // Null check
                imageText.classList.remove('show');
            }
        }

        // Function to set active item
        function setActiveItem(index) {
            // Remove active class from all items
            items.forEach(item => item.classList.remove('active'));
            
            // Add active class to current item
            if (index >= 0 && index < items.length) {
                items[index].classList.add('active');
                activeItemIndex = index;
            } else {
                activeItemIndex = -1;
            }
        }

        // Pause/Play toggle
        if (toggleBtn && slider) { // Null check
            toggleBtn.addEventListener('click', () => {
                if (isAnimating) return; // Don't allow toggle during click animation

                if (isPlaying) {
                    currentRotation = getCurrentRotationApprox();
                    slider.style.animation = 'none';
                    slider.style.transform = `perspective(1000px) rotateX(-10deg) rotateY(${currentRotation}deg)`;
                    toggleBtn.textContent = 'Play';
                } else {
                    // Hide text and remove active state when resuming
                    hideText();
                    setActiveItem(-1);
                    // Resume animation from current position
                    slider.style.animation = `spin 20s linear infinite`;
                    slider.style.animationDelay = `-${(currentRotation / 360) * 20}s`;
                    toggleBtn.textContent = 'Pause';
                }
                isPlaying = !isPlaying;
            });
        }

        // Rotate selected image to front on click with smooth animation
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (isAnimating) return; // Prevent multiple clicks during animation
                if (!slider) return; // Null check for slider

                isAnimating = true;

                // Hide any existing text
                hideText();

                // Pause the animation and get current position
                if (isPlaying) {
                    currentRotation = getCurrentRotationApprox();
                    isPlaying = false;
                    slider.style.animation = 'none';
                    slider.style.transform = `perspective(1000px) rotateX(-10deg) rotateY(${currentRotation}deg)`;
                    if (toggleBtn) toggleBtn.textContent = 'Play';
                }

                
                setTimeout(() => {
                    const targetAngle = -index * anglePerItem;
                    const shortestAngle = getShortestRotation(currentRotation, targetAngle);

                    slider.style.transform = `perspective(1000px) rotateX(-10deg) rotateY(${shortestAngle}deg)`;
                    currentRotation = normalizeAngle(shortestAngle);
                    setActiveItem(index);

                    const title = item.getAttribute('data-title');
                    const description = item.getAttribute('data-description');
                    showText(title, description);

                    setTimeout(() => {
                        isAnimating = false;
                    }, 800); 
                }, 50);
            });
        });

//-----------------the main----------------------
const svg = document.getElementById('svg');
        const container = document.querySelector('.svg');
        let ticking = false;
        let isHovering = false;

        function updateRotation() {
            if (!isHovering) {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = scrollTop / maxScroll;
                const rotation = scrollPercent * 360;
                
                if (svg) { 
                    svg.style.transform = `rotate(${rotation}deg)`;
                }
            }
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateRotation);
                ticking = true;
            }
        }

        if (container) { 
            container.addEventListener('mouseenter', () => { isHovering = true; });
            container.addEventListener('mouseleave', () => {
                isHovering = false;
                requestTick();
            });
        }
        
        window.addEventListener('scroll', requestTick);

        // --------scroll text-------------
        let scrollDownCount = 0;
        let isSecondVisible = false;
        const h1_1 = document.getElementById('h-1');
        const h1_2 = document.getElementById('h-2');

        if(h1_1 && h1_2){
            window.addEventListener('wheel', (e) => {
                const direction = Math.sign(e.deltaY);
                if (!isSecondVisible && direction > 0) {
                    scrollDownCount++;
                    if (scrollDownCount >= 2) {
                        h1_1.style.opacity = 0;
                        h1_2.style.opacity = 1;
                        isSecondVisible = true;
                        scrollDownCount = 0;
                    }
                } else if (isSecondVisible && direction < 0) {
                    h1_1.style.opacity = 1;
                    h1_2.style.opacity = 0;
                    isSecondVisible = false;
                    scrollDownCount = 0;
                }
            });
        }

    // --------------p text----------------
    let scrollDDownCount = 0;
    let isSecondVVisible = false;
    const p_1 = document.getElementById('p-1');
    const p_2 = document.getElementById('p-2');

    if(p_1 && p_2){
        window.addEventListener('wheel', (e) => {
            const dirrection = Math.sign(e.deltaY);
            if (!isSecondVVisible && dirrection > 0) {
                scrollDDownCount++;
                if (scrollDDownCount >= 2) {
                    p_1.style.opacity = 0.5;
                    p_2.style.opacity = 1;
                    isSecondVVisible = true;
                    scrollDDownCount = 0;
                }
            } else if (isSecondVVisible && dirrection < 0) {
                p_1.style.opacity = 1;
                p_2.style.opacity = 0.5;
                isSecondVVisible = false;
                scrollDDownCount = 0;
            }
        });
    }

  // ----------------dj9  -----------------------
  // Corrected and robust navbar visibility logic:
  const bottomNavBarElement = document.getElementById('bottomFixedNavbarElement');
  const topScrollTrackingElement = document.getElementById('hiddeElement');

  function handleBottomNavbarVisibility() {
      if (!topScrollTrackingElement) {
          // console.error('Debug: topScrollTrackingElement (id: hiddeElement) not found for navbar logic!');
          return; 
      }
      if (!bottomNavBarElement) {
          // console.error('Debug: bottomNavBarElement (id: bottomFixedNavbarElement) not found for navbar logic!');
          return;
      }

      const topSectionRect = topScrollTrackingElement.getBoundingClientRect();
      // console.log('Debug: nav-bar2 visibility check. Element "hiddeElement" topSectionRect.bottom =', topSectionRect.bottom);

      if (topSectionRect.bottom < 0) {
          // console.log('Debug: Condition met (topSectionRect.bottom < 0). Adding "show" class to nav-bar2.');
          bottomNavBarElement.classList.add('show');
      } else {
          // console.log('Debug: Condition NOT met (topSectionRect.bottom >= 0). Removing "show" class from nav-bar2.');
          bottomNavBarElement.classList.remove('show');
      }
  }

  window.addEventListener('scroll', handleBottomNavbarVisibility);

  // Initial check in case the page is already scrolled down or if the hiddeElement is immediately out of view.
  // Ensures correct state on load.
  try {
      handleBottomNavbarVisibility();
  } catch (e) {
      console.error("Error during initial call to handleBottomNavbarVisibility:", e);
  }

 // --------------------------------- new sec -------------------------------

 const scroll = document.getElementById('testimonialsScroll');
        const grid = document.getElementById('testimonialsGrid');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const cards = Array.from(grid.children); // Get all card elements
        const gap = 24; // Defined in CSS

        let isDown = false;
        let startX;
        let scrollLeft;

        // Mouse drag functionality
        scroll.addEventListener('mousedown', (e) => {
            isDown = true;
            scroll.style.cursor = 'grabbing';
            startX = e.pageX - scroll.offsetLeft;
            scrollLeft = scroll.scrollLeft;
            // IMPORTANT: Do NOT set scroll-behavior to 'auto' here.
            // Let the browser's native scroll-behavior (smooth) handle the drag.
        });

        scroll.addEventListener('mouseleave', () => {
            isDown = false;
            scroll.style.cursor = 'grab';
        });

        scroll.addEventListener('mouseup', () => {
            isDown = false;
            scroll.style.cursor = 'grab';
            // The browser's native scroll-snap will handle the final snap animation.
        });

        scroll.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scroll.offsetLeft;
            const walk = (x - startX) * 2;
            scroll.scrollLeft = scrollLeft - walk;
            // The browser's scroll-snap-type will interact with this direct scroll manipulation
            // to provide the desired "animated" feel during the drag and the snap at the end.
        });

        // Touch functionality for mobile
        scroll.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - scroll.offsetLeft;
            scrollLeft = scroll.scrollLeft;
            // IMPORTANT: Do NOT set scroll-behavior to 'auto' here.
        });

        scroll.addEventListener('touchmove', (e) => {
            if (!startX && e.touches.length === 0) return;
            const x = e.touches[0].pageX - scroll.offsetLeft;
            const walk = (x - startX) * 2;
            scroll.scrollLeft = scrollLeft - walk;
        });

        scroll.addEventListener('touchend', () => {
            startX = null; // Reset startX
            // The browser's native scroll-snap will handle the final snap animation.
        });


        // Navigation buttons
        prevBtn.addEventListener('click', () => {
            // Find the closest snap position to the left
            const currentScrollLeft = scroll.scrollLeft;
            const cardWidth = cards[0].offsetWidth;
            let cardsPerView;
            if (window.innerWidth <= 768) {
                cardsPerView = 1;
            } else if (window.innerWidth <= 1200) {
                cardsPerView = 2;
            } else {
                cardsPerView = 3;
            }
            const groupWidth = (cardWidth * cardsPerView) + (gap * (cardsPerView - 1));

            // Calculate the target scroll position for the previous group
            // We want to snap to the start of the previous full group
            const currentGroupIndex = Math.floor(currentScrollLeft / groupWidth);
            const targetScrollLeft = currentGroupIndex * groupWidth;

            // If we are already perfectly aligned, go back one more group
            // Else, align to the current group start if partially scrolled past it
            const scrollTarget = (currentScrollLeft > targetScrollLeft + 10) ? targetScrollLeft : targetScrollLeft - groupWidth; // Add tolerance for fractional scrolls

            scroll.scrollTo({
                left: Math.max(0, scrollTarget), // Ensure we don't scroll past 0
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            // Find the closest snap position to the right
            const currentScrollLeft = scroll.scrollLeft;
            const cardWidth = cards[0].offsetWidth;
            let cardsPerView;
            if (window.innerWidth <= 768) {
                cardsPerView = 1;
            } else if (window.innerWidth <= 1200) {
                cardsPerView = 2;
            } else {
                cardsPerView = 3;
            }
            const groupWidth = (cardWidth * cardsPerView) + (gap * (cardsPerView - 1));

            // Calculate the target scroll position for the next group
            // We want to snap to the start of the next full group
            const currentGroupIndex = Math.round(currentScrollLeft / groupWidth);
            const targetScrollLeft = (currentGroupIndex + 1) * groupWidth;

            scroll.scrollTo({
                left: targetScrollLeft,
                behavior: 'smooth'
            });
        });

        // Update button states
        function updateButtonStates() {
            // Give a small tolerance for floating point inaccuracies
            const scrollTolerance = 5;
            prevBtn.disabled = scroll.scrollLeft <= scrollTolerance;
            nextBtn.disabled = scroll.scrollLeft >= (scroll.scrollWidth - scroll.clientWidth - scrollTolerance);
        }

        scroll.addEventListener('scroll', updateButtonStates);
        window.addEventListener('resize', () => {
            // On resize, we want to ensure it snaps to a valid group based on new card widths
            // Find the current nearest group and snap to it
            const cardWidth = cards[0].offsetWidth;
            let cardsPerView;
            if (window.innerWidth <= 768) {
                cardsPerView = 1;
            } else if (window.innerWidth <= 1200) {
                cardsPerView = 2;
            } else {
                cardsPerView = 3;
            }
            const groupWidth = (cardWidth * cardsPerView) + (gap * (cardsPerView - 1));
            const currentScrollLeft = scroll.scrollLeft;
            const currentGroupIndex = Math.round(currentScrollLeft / groupWidth);
            const targetScrollLeft = currentGroupIndex * groupWidth;

            scroll.scrollTo({
                left: targetScrollLeft,
                behavior: 'smooth'
            });

            updateButtonStates();
        });
        updateButtonStates(); // Initial state

        // Prevent text selection during drag
        scroll.addEventListener('selectstart', (e) => {
            if (isDown) e.preventDefault();
        });