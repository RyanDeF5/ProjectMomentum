export class AnimationEngine {
  constructor() {
    // We store these as arrays so we can loop through them easily
    this.animatedBoxes = document.querySelectorAll(".animatedBox");
    this.animatedTopContainers = document.querySelectorAll(".animatedContainer");
  }

  // NOTE, NOT ALL BOX ANIMATIONS HAPPEN AT ONCE IN ASPHALT 9 

  RevealPage(pageElement) {

    this.animatedTopContainers.forEach((topContainer) => {
      if (this.isParentOf(pageElement, topContainer)) {
        topContainer.style.opacity = 1;
      }
    });

    // 1. Move the boxes out of view
    this.animatedBoxes.forEach((box) => {
      if (this.isParentOf(pageElement, box)) {
        // Logic for sliding out based on direction
        if (box.classList.contains("right")) {
          box.classList.add("is-hidden-to-right");
        } else {
          box.classList.add("is-hidden");
        }
        box.classList.remove("is-visible");
      }
    });
  }

  HidePage(pageElement) {
    // 1. Instantly make the container visible (but boxes are still covering text)
    

    // 2. Slide the boxes away to reveal the content
    setTimeout(() => {
      this.animatedBoxes.forEach((box) => {
        if (this.isParentOf(pageElement, box)) {
          if (box.classList.contains("is-hidden-to-right"))
            box.classList.add("is-visible-from-right");
          else
            box.classList.add("is-visible");
          box.classList.remove("is-hidden", "is-hidden-to-right");
        }
      });
    }, 100);

    // 2. Fade out the whole container after the boxes cover the text
    setTimeout(() => {
      this.animatedTopContainers.forEach((topContainer) => {
        if (this.isParentOf(pageElement, topContainer)) {
          topContainer.style.opacity = 0;
        }
      });
    }, 350);
  }

  isParentOf(pageElement, child) {
    // 1. If pageElement is a string, find the actual element
    if (typeof pageElement === 'string') {
        pageElement = document.getElementById(pageElement);
    }

    // 2. Safety check: if either is missing, or pageElement isn't a real DOM object
    if (!pageElement || !child || !pageElement.contains) {
        console.warn("AnimationEngine: Invalid page element provided", pageElement);
        return false;
    }

    return pageElement.contains(child);
}
}