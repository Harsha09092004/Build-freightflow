// ============================================================
// FreightFlow — App Entry Point
// ============================================================

(function() {
  // Initialize the router when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Handle canvas resize for charts
    window.addEventListener('resize', debounce(() => {
      const page = Router.currentPage;
      if (page && Pages[page]) {
        const content = document.getElementById('pageContent');
        if (content) Pages[page](content);
      }
    }, 300));

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#exportDropdown')) {
        document.getElementById('exportMenu')?.classList.add('hidden');
      }
    });

    // Initialize router
    Router.init();
  });

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // Simulate real-time data updates (notifications badge)
  setInterval(() => {
    const dot = document.querySelector('.notif-dot');
    if (dot) dot.style.display = dot.style.display === 'none' ? 'block' : 'block';
  }, 30000);
})();
