/**
 * Carousel Initializer
 * 
 * This module handles both the service carousel and image carousel.
 * It can be called multiple times (on page load and after PJAX transitions)
 * 
 * Usage:
 * - InitializeCarousels(); // Call on page load
 * - Call again after PJAX transition in initComponents()
 */

function InitializeCarousels() {
  // Initialize Service Card Carousel
  initServiceCarousel();
  
  // Initialize Mission/Image Carousel
  initImageCarousel();
}

/**
 * SERVICE CARD CAROUSEL
 * Handles the service cards carousel with drag/touch support
 */
function initServiceCarousel() {
  const track = document.querySelector('.carousel-track');
  
  // Guard: only initialize if carousel exists on this page
  if (!track) return;
  
  const firstCard = track.querySelector('.card');
  if (!firstCard) return;

  // Clear any existing event listeners by preventing duplicate initialization
  if (track.dataset.initialized === 'true') {
    return;
  }
  
  track.dataset.initialized = 'true';

  // Variables
  let widthBounding = firstCard.getBoundingClientRect().width;
  let trackwidth = track.getBoundingClientRect().width;
  let gap = trackwidth - (widthBounding * 2);
  let cardScroll = widthBounding + gap;

  let isAnimating = false;
  let autoPlay;
  let isDragging = false;
  let dragStartX = 0;
  let dragCurrentX = 0;
  let dragOffset = 0;
  let currentPosition = 0;

  // Handle window resize
  const handleResize = () => {
    widthBounding = firstCard.getBoundingClientRect().width;
    trackwidth = track.getBoundingClientRect().width;
    gap = trackwidth - (widthBounding * 2);
    cardScroll = widthBounding + gap;
    track.style.transform = 'translateX(0)';
  };

  // Move to next slide
  function moveNext() {
    if (isAnimating || isDragging) return;
    isAnimating = true;

    track.style.transition = 'transform 0.5s ease-in-out';
    currentPosition -= cardScroll;
    track.style.transform = `translateX(${currentPosition}px)`;

    const onTransitionEnd = () => {
      track.removeEventListener('transitionend', onTransitionEnd);
      
      track.style.transition = 'none';
      const firstCard = track.firstElementChild.cloneNode(true);
      track.removeChild(track.firstElementChild);
      track.appendChild(firstCard);
      
      currentPosition = 0;
      track.style.transform = 'translateX(0)';
      track.offsetHeight; 
      track.style.transition = 'transform 0.5s ease-in-out';
      
      isAnimating = false;
    };

    track.addEventListener('transitionend', onTransitionEnd);
  }

  // Move to previous slide
  function movePrev() {
    if (isAnimating || isDragging) return;
    isAnimating = true;

    track.style.transition = 'none';
    const lastCard = track.lastElementChild.cloneNode(true);
    track.removeChild(track.lastElementChild);
    track.insertBefore(lastCard, track.firstElementChild);
    
    currentPosition = -cardScroll;
    track.style.transform = `translateX(${currentPosition}px)`;
    track.offsetHeight;
    
    track.style.transition = 'transform 0.5s ease-in-out';
    currentPosition = 0;
    track.style.transform = `translateX(${currentPosition}px)`;
    
    const onTransitionEnd = () => {
      track.removeEventListener('transitionend', onTransitionEnd);
      isAnimating = false;
    };
    
    track.addEventListener('transitionend', onTransitionEnd);
  }

  // Start auto-play
  function startAutoPlay() {
    autoPlay = setInterval(moveNext, 3000);
  }

  // Stop auto-play
  function stopAutoPlay() {
    clearInterval(autoPlay);
  }

  // Start the carousel
  startAutoPlay();

  // Pause when page hidden, resume when visible
  const handleVisibilityChange = () => {
    document.hidden ? stopAutoPlay() : startAutoPlay();
  };

  // ========== MOUSE DRAG EVENTS ==========
  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging = true;
    dragStartX = e.clientX;
    dragCurrentX = e.clientX;
    dragOffset = 0;
    stopAutoPlay();
    track.style.cursor = 'grabbing';
    track.style.transition = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    dragCurrentX = e.clientX;
    dragOffset = dragCurrentX - dragStartX;
    track.style.transform = `translateX(${currentPosition + dragOffset}px)`;
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    
    isDragging = false;
    track.style.cursor = 'grab';
    track.style.transition = 'transform 0.3s ease-in-out';
    
    const threshold = widthBounding * 0.3;
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        movePrev();
      } else {
        moveNext();
      }
    } else {
      track.style.transform = `translateX(${currentPosition}px)`;
    }
    
    dragOffset = 0;
    
    setTimeout(() => {
      if (!isDragging) {
        startAutoPlay();
      }
    }, 2000);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      isDragging = false;
      track.style.cursor = 'grab';
      track.style.transition = 'transform 0.3s ease-in-out';
      track.style.transform = `translateX(${currentPosition}px)`;
      startAutoPlay();
    }
  };

  // ========== TOUCH EVENTS ==========
  const handleTouchStart = (e) => {
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    dragCurrentX = e.touches[0].clientX;
    dragOffset = 0;
    stopAutoPlay();
    track.style.transition = 'none';
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    dragCurrentX = e.touches[0].clientX;
    dragOffset = dragCurrentX - dragStartX;
    
    const maxDrag = widthBounding;
    dragOffset = Math.max(-maxDrag, Math.min(maxDrag, dragOffset));
    
    track.style.transform = `translateX(${currentPosition + dragOffset}px)`;
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    isDragging = false;
    track.style.transition = 'transform 0.3s ease-in-out';
    
    const threshold = widthBounding * 0.25;
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        movePrev();
      } else {
        moveNext();
      }
    } else {
      track.style.transform = `translateX(${currentPosition}px)`;
    }
    
    dragOffset = 0;
    
    setTimeout(() => {
      if (!isDragging) {
        startAutoPlay();
      }
    }, 1000);
  };

  // ========== ATTACH EVENT LISTENERS ==========
  track.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  track.addEventListener('mouseleave', handleMouseLeave);

  track.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchmove', handleTouchMove);
  document.addEventListener('touchend', handleTouchEnd);

  window.addEventListener('resize', handleResize);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // ========== CLEANUP FUNCTION ==========
  // Store cleanup function for potential future use
  track.carouselCleanup = () => {
    stopAutoPlay();
    track.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    track.removeEventListener('mouseleave', handleMouseLeave);
    track.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    track.dataset.initialized = 'false';
  };
}

/**
 * MISSION/IMAGE CAROUSEL
 * Handles the mission image carousel auto-play
 */
function initImageCarousel() {
  const imageTrack = document.querySelector('.image-carousel-track');
  
  if (!imageTrack) return;
  
  const imageCon = imageTrack.querySelector('.image-con');
  if (!imageCon) return;

  // Guard: prevent re-initialization
  if (imageTrack.dataset.initialized === 'true') {
    return;
  }
  
  imageTrack.dataset.initialized = 'true';

  let imageWidth = imageCon.getBoundingClientRect().width;
  let imageTrackWidth = imageTrack.getBoundingClientRect().width;
  let imageScroll = imageWidth;

  let isImageAnimating = false;
  let imageAutoPlay;

  function moveImageNext() {
    if (isImageAnimating) return;
    isImageAnimating = true;

    imageTrack.style.transition = 'transform 0.8s ease-in-out';
    imageTrack.style.transform = `translateX(-${imageScroll}px)`;

    const onImageTransitionEnd = () => {
      imageTrack.removeEventListener('transitionend', onImageTransitionEnd);

      imageTrack.style.transition = 'none';
      imageTrack.appendChild(imageTrack.firstElementChild);
      imageTrack.style.transform = 'translateX(0)';
      imageTrack.offsetHeight;
      imageTrack.style.transition = 'transform 0.8s ease-in-out';

      isImageAnimating = false;
    };

    imageTrack.addEventListener('transitionend', onImageTransitionEnd);
  }

  function startImageAutoPlay() {
    imageAutoPlay = setInterval(moveImageNext, 3000);
  }

  function stopImageAutoPlay() {
    clearInterval(imageAutoPlay);
  }

  const handleResize = () => {
    imageWidth = imageCon.getBoundingClientRect().width;
    imageTrackWidth = imageTrack.getBoundingClientRect().width;
    imageScroll = imageWidth;
  };

  const handleVisibilityChange = () => {
    document.hidden ? stopImageAutoPlay() : startImageAutoPlay();
  };

  startImageAutoPlay();

  window.addEventListener('resize', handleResize);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Cleanup function
  imageTrack.carouselCleanup = () => {
    stopImageAutoPlay();
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    imageTrack.dataset.initialized = 'false';
  };
}



// last

   