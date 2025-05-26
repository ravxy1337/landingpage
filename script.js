// Navigation functionality
const navLinks = document.querySelectorAll(".nav-link")
const sections = document.querySelectorAll(".page-section")

function showSection(targetId) {
  sections.forEach((section) => {
    section.classList.remove("active")
  })

  const targetSection = document.getElementById(targetId)
  if (targetSection) {
    targetSection.classList.add("active")
  }

  navLinks.forEach((link) => {
    link.classList.remove("active")
  })

  const activeLink = document.querySelector(`[href="/${targetId}"]`)
  if (activeLink) {
    activeLink.classList.add("active")
  }

  history.pushState(null, "", `/${targetId}`)
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const targetId = link.getAttribute("href").substring(1)
    showSection(targetId)
  })
})

window.addEventListener("popstate", () => {
  const path = window.location.pathname.substring(1) || "about"
  showSection(path)
})

document.addEventListener("DOMContentLoaded", () => {
  const initialPath = window.location.pathname.substring(1) || "about"
  showSection(initialPath)
})

// Mobile menu functionality
const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
const navLinksContainer = document.querySelector(".nav-links")

mobileMenuBtn.addEventListener("click", () => {
  navLinksContainer.classList.toggle("show")
  const icon = mobileMenuBtn.querySelector("i")
  icon.classList.toggle("fa-bars")
  icon.classList.toggle("fa-times")
})

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinksContainer.classList.remove("show")
    const icon = mobileMenuBtn.querySelector("i")
    icon.classList.add("fa-bars")
    icon.classList.remove("fa-times")
  })
})

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  if (window.scrollY > 50) {
    header.style.background = "rgba(15, 15, 35, 0.95)"
    header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)"
  } else {
    header.style.background = "rgba(15, 15, 35, 0.85)"
    header.style.boxShadow = "none"
  }
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const targetId = this.getAttribute("href").substring(1)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      })
    }
  })
})

// Enhanced Testimonials Slider - WITH JSON LOADING
let currentSlide = 0
let slides = []
let testiList
let totalSlides = 0
let isTransitioning = false

function loadTestimonies() {
  console.log("Loading testimonies from JSON...")

  testiList = document.getElementById("testiList")
  if (!testiList) {
    console.log("Error: Element #testiList not found")
    return
  }

  // Try to fetch from JSON first
  fetch("testimonies.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
    .then((data) => {
      console.log("JSON data loaded successfully:", data)
      createSlidesFromData(data)
    })
    .catch((error) => {
      console.error("Error loading testimonies.json:", error)
      console.log("Using fallback data...")
      createFallbackTestimonies()
    })
}

function createSlidesFromData(data) {
  console.log("Creating slides from JSON data...")

  // Clear existing content
  testiList.innerHTML = ""

  // Create slides from JSON data
  data.forEach((testi, index) => {
    const testiItem = document.createElement("div")
    testiItem.className = "testi-item"
    testiItem.innerHTML = `
      <img src="assets/${testi.image}" alt="Invoice ${testi.id}" class="testi-invoice" 
           onerror="this.src='/placeholder.svg?height=500&width=350&text=Invoice+${testi.id}';">
      <p class="testi-detail">${testi.product} - ${testi.date}</p>
    `
    testiList.appendChild(testiItem)
  })

  slides = document.querySelectorAll(".testi-item")
  totalSlides = data.length
  currentSlide = 0

  console.log("Slides created from JSON:", slides.length)
  initializeSlider()
}

function createFallbackTestimonies() {
  console.log("Creating fallback testimonies...")

  const fallbackData = [
    {
      id: 1,
      product: "Free Fire 5 Diamond",
      date: "Sabtu, 24 Mei 2025",
    },
    {
      id: 2,
      product: "Pulsa Rp 50.000",
      date: "Minggu, 25 Mei 2025",
    },
    {
      id: 3,
      product: "Voucher Data 5GB",
      date: "Senin, 26 Mei 2025",
    },
    {
      id: 4,
      product: "Mobile Legends 50 Diamond",
      date: "Senin, 26 Mei 2025",
    },
  ]

  // Clear existing content
  testiList.innerHTML = ""

  // Create slides from fallback data
  fallbackData.forEach((testi, index) => {
    const testiItem = document.createElement("div")
    testiItem.className = "testi-item"
    testiItem.innerHTML = `
      <img src="/placeholder.svg?height=500&width=350&text=Invoice+${testi.id}" alt="Invoice ${testi.id}" class="testi-invoice">
      <p class="testi-detail">${testi.product} - ${testi.date}</p>
    `
    testiList.appendChild(testiItem)
  })

  slides = document.querySelectorAll(".testi-item")
  totalSlides = fallbackData.length
  currentSlide = 0

  console.log("Fallback slides created:", slides.length)
  initializeSlider()
}

function initializeSlider() {
  if (!testiList || !slides.length) {
    console.log("Cannot initialize slider - missing elements")
    return
  }

  console.log("Initializing slider with", totalSlides, "slides")

  // Set initial position
  testiList.style.transition = "none"
  testiList.style.transform = `translateX(0%)`

  // Force reflow
  testiList.offsetHeight

  // Re-enable transitions
  setTimeout(() => {
    testiList.style.transition = "transform 0.5s ease-in-out"
  }, 50)

  createDots()
  updateDots()
  setupButtons()
}

function createDots() {
  const dotsContainer = document.getElementById("sliderDots")
  if (!dotsContainer) return

  dotsContainer.innerHTML = ""

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("div")
    dot.className = "dot"
    dot.addEventListener("click", () => {
      console.log("Dot clicked:", i)
      goToSlide(i)
    })
    dotsContainer.appendChild(dot)
  }
}

function updateDots() {
  const dots = document.querySelectorAll(".dot")
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide)
  })
}

function setupButtons() {
  const prevBtn = document.querySelector(".prev-btn")
  const nextBtn = document.querySelector(".next-btn")

  if (prevBtn) {
    prevBtn.onclick = () => {
      console.log("Previous button clicked")
      moveSlide(-1)
    }
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      console.log("Next button clicked")
      moveSlide(1)
    }
  }
}

function moveSlide(direction) {
  if (!slides.length || isTransitioning) {
    console.log("Cannot move slide - transitioning or no slides")
    return
  }

  console.log("Moving slide:", direction, "Current:", currentSlide)

  isTransitioning = true

  // Calculate new slide
  let newSlide = currentSlide + direction

  // Handle wrap around
  if (newSlide < 0) {
    newSlide = totalSlides - 1
  } else if (newSlide >= totalSlides) {
    newSlide = 0
  }

  currentSlide = newSlide
  console.log("New slide:", currentSlide)

  // Apply transform
  const offset = -currentSlide * 100
  testiList.style.transform = `translateX(${offset}%)`

  updateDots()

  // Reset transition flag
  setTimeout(() => {
    isTransitioning = false
    console.log("Transition complete")
  }, 500)
}

function goToSlide(slideIndex) {
  if (!slides.length || isTransitioning || slideIndex === currentSlide) return

  console.log("Going to slide:", slideIndex)

  isTransitioning = true
  currentSlide = slideIndex

  const offset = -currentSlide * 100
  testiList.style.transform = `translateX(${offset}%)`

  updateDots()

  setTimeout(() => {
    isTransitioning = false
  }, 500)
}

// Make functions global
window.moveSlide = moveSlide
window.goToSlide = goToSlide

// Keyboard navigation for slider
function handleKeyboardNavigation(e) {
  if (!document.getElementById("testi")?.classList.contains("active")) return

  if (e.key === "ArrowLeft") {
    e.preventDefault()
    moveSlide(-1)
  } else if (e.key === "ArrowRight") {
    e.preventDefault()
    moveSlide(1)
  }
}

// Touch/swipe support for mobile
let touchStartX = 0
let touchEndX = 0
let isSwiping = false

function handleTouchStart(e) {
  if (!document.getElementById("testi")?.classList.contains("active")) return

  touchStartX = e.changedTouches[0].screenX
  isSwiping = true
}

function handleTouchEnd(e) {
  if (!document.getElementById("testi")?.classList.contains("active") || !isSwiping) return

  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
  isSwiping = false
}

function handleSwipe() {
  const swipeThreshold = 50
  const diff = touchStartX - touchEndX

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      moveSlide(1) // Swipe left - next slide
    } else {
      moveSlide(-1) // Swipe right - previous slide
    }
  }
}

// Setup event listeners
document.addEventListener("keydown", handleKeyboardNavigation)
document.addEventListener("touchstart", handleTouchStart, { passive: true })
document.addEventListener("touchend", handleTouchEnd, { passive: true })

// Dashboard functionality
function updateDashboardMetrics() {
  // Simulate real-time data updates
  const progressBars = document.querySelectorAll(".progress-fill")
  const chartBars = document.querySelectorAll(".chart-bar")

  // Update progress bars with random values
  progressBars.forEach((bar) => {
    const randomValue = Math.floor(Math.random() * 40) + 30 // 30-70%
    bar.style.width = `${randomValue}%`
  })

  // Update chart bars with random heights
  chartBars.forEach((bar) => {
    const randomHeight = Math.floor(Math.random() * 60) + 20 // 20-80%
    bar.style.height = `${randomHeight}%`
  })

  // Update last update time
  const lastUpdateElement = document.getElementById("lastUpdate")
  if (lastUpdateElement) {
    const now = new Date()
    lastUpdateElement.textContent = now.toLocaleTimeString()
  }
}

// FAQ functionality
document.addEventListener("DOMContentLoaded", () => {
  loadTestimonies()

  // Update dashboard metrics every 5 seconds
  setInterval(updateDashboardMetrics, 5000)

  const faqQuestions = document.querySelectorAll(".faq-question")
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling
      const icon = question.querySelector(".faq-icon")
      answer.classList.toggle("active")
      icon.classList.toggle("active")
    })
  })
})
