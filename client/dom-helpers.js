const show = (sel, content) => {
  const el = document.querySelector(sel);
  if (el) {
    el.classList.remove('hidden');
    if (content) {
      el.innerHTML = content;
    }
  } 
};

const showAll = sel => {
  [].map.call(document.querySelectorAll(sel), function(el) { 
    el.classList.remove('hidden');
  });
};

const hide = sel => {
  document.querySelector(sel).classList.add('hidden');
};

const disableiOS10Pinch = () => {
  // Disable double-tap zooming on iOS 10
  document.documentElement.addEventListener('touchend', function (event) {
    event.preventDefault();
  }, false);
};

module.exports = {
  show,
  showAll,
  hide,
  disableiOS10Pinch
};
