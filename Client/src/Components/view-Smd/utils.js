export function debounce(fn) {
    let timeout;
    return function (...args) {
      if (timeout) clearTimeout(timeout);
  
      timeout = setTimeout(() => {
        fn(...args);
      }, 300);
    };
  }
  