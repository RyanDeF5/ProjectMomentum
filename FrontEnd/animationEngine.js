export class AnimationEngine {
  constructor() {
    // We store these as arrays so we can loop through them easily
    this.animatedBoxes = document.querySelectorAll(".animatedBox");
    this.animatedCloaks = document.querySelectorAll(".animatedCloak");
    this.animatedTopContainers = document.querySelectorAll(".animatedContainer");
    this.topBar = document.getElementById("topBarCover");
    
  }

  // NOTE, NOT ALL BOX ANIMATIONS HAPPEN AT ONCE IN ASPHALT 9 

  RevealPage(pageElement) {

    // this.animatedTopContainers.forEach((topContainer) => {
    //   if (this.isParentOf(pageElement, topContainer)) {
    //     topContainer.style.opacity = 1;
    //   }
    // });

    // 1. Move the boxes out of view
    this.animatedBoxes.forEach((box) => {
      if (this.isParentOf(pageElement, box)) {
        // Logic for sliding out based on direction
        box.classList.remove("is-hidden", "is-hidden-to-right", "reveal");
        if (box.classList.contains("right")) {
          box.classList.add("is-hidden-to-right");
        } else {
          box.classList.add("is-hidden");
        }
        box.style.transition = "transform 0.4s ease-in";
        box.classList.remove("is-visible");
      }
    });

    this.animatedCloaks.forEach((cloak) => {
      if (this.isParentOf(pageElement, cloak)) {
        cloak.classList.remove('hide', 'hideRight', 'reveal');
        cloak.style.transition = 'clip-path 1s ease';
        cloak.classList.add('hideRight');
        cloak.getBoundingClientRect();
        cloak.classList.remove('hideRight');
        cloak.classList.add('reveal');
        cloak.style.transition = "clip-path 0.2s ease"

        if (cloak.classList.contains("topdown")){
          cloak.classList.add('hideBottom');
          cloak.getBoundingClientRect();
          cloak.classList.remove('hideBottom');
          cloak.classList.add('reveal');
          cloak.style.transition = "clip-path 0.5s ease"
        }
      }
    });

    this.topBar.classList.remove('curtainClose')
    // this.topBar.style.opacity = 0;
    // setTimeout(() => {
    //   this.topBar.style.opacity = 1;
    // }, 700)

  }

  HidePage(pageElement) {
    // 1. Instantly make the container visible (but boxes are still covering text)
    

    // 2. Slide the boxes away to reveal the content
    setTimeout(() => {
      this.animatedBoxes.forEach((box) => {
        if (this.isParentOf(pageElement, box)) {
          let randomNumber = Math.floor(Math.random() * 100) + 1;
          box.classList.remove("is-hidden", "is-hidden-to-right", "reveal");
          setTimeout(() => {
            box.classList.add("is-visible");
          }, randomNumber)
          box.style.transition = "transform 0.1s ease-in";
        }
      });
    }, 100);


    setTimeout(() => {
      this.animatedCloaks.forEach((cloak) => {
      if (this.isParentOf(pageElement, cloak)) {
        cloak.classList.remove('hide', 'reveal', 'hideRight');
        cloak.getBoundingClientRect();
        if (cloak.classList.contains("topdown")){cloak.classList.add('hideBottom');}
        else {cloak.classList.add('hide');}
        cloak.style.transition = "clip-path 0.3s ease"
      }
     });
    }, 200)

    this.topBar.classList.add('curtainClose')
    // this.topBar.style.opacity = 0;
    // setTimeout(() => {
    //   this.topBar.style.opacity = 1;
    // }, 700)

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