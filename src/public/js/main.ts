const backdrop: HTMLDivElement | null = document.querySelector('.backdrop');
const sideDrawer: HTMLElement | null = document.querySelector('.mobile-nav');
const menuToggle: HTMLButtonElement | null =
  document.querySelector('#side-menu-toggle');

if (backdrop && sideDrawer && menuToggle) {
  function backdropClickHandler() {
    backdrop!.style.display = 'none';
    sideDrawer!.classList.remove('open');
  }

  function menuToggleClickHandler() {
    backdrop!.style.display = 'block';
    sideDrawer!.classList.add('open');
  }

  backdrop.addEventListener('click', backdropClickHandler);
  menuToggle.addEventListener('click', menuToggleClickHandler);
} else {
  console.error('One or more elements were not found!');
}
