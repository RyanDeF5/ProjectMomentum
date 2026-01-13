export class AnimationEngine {
  constructor() {
    this.animatedBoxes = document.querySelectorAll(".animatedBox");
    this.animatedContainers = document.querySelectorAll(".animatedBoxTop");
    this.animatedTopContainers = document.querySelectorAll(".animatedContainer");
  }

  // This method "turns on" the reveal animation
  boxOn() {
    setTimeout(() => {
      this.animatedTopContainers.forEach((topContainer) => {
      topContainer.style.opacity = 0;
    });
    }, 700);
    // Reveal the container
    this.animatedContainers.forEach((container) => {
      container.classList.remove("close");
      container.classList.add("open");
    });

    // Slide the boxes after a short delay
    setTimeout(() => {
      this.animatedBoxes.forEach((box) => {
        box.classList.remove("is-hidden");
        box.classList.add("is-visible");
      });
    }, 100);
  }

  // This method covers the text back up (The "Exit" swoosh)
  boxOff() {
    // Prepare container for hiding
    this.animatedContainers.forEach((container) => {
      container.classList.remove("open");
      container.classList.add("close");
      });

    // Slide the boxes back after a short delay
    setTimeout(() => {
      this.animatedBoxes.forEach((box) => {
      box.classList.remove("is-visible");
      box.classList.add("is-hidden");
    });
    }, 100);

    setTimeout(() => {
      this.animatedTopContainers.forEach((topContainer) => {
      topContainer.style.opacity = 1;
    });
    }, 0);
  }
}
