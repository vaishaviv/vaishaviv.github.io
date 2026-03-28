const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalMetaGrid = document.getElementById("modal-meta-grid");
const modalCompany = document.getElementById("modal-company");
const modalSkills = document.getElementById("modal-skills");
const modalTimeline = document.getElementById("modal-timeline");
const modalNarrative = document.getElementById("modal-narrative");
const modalMetaFeaturesWrap = document.getElementById("modal-meta-features-wrap");
const modalMetaFeatures = document.getElementById("modal-meta-features");
const modalDetailSections = document.getElementById("modal-detail-sections");
const modalOverview = document.getElementById("modal-overview");
const modalRole = document.getElementById("modal-role");
const modalTech = document.getElementById("modal-tech");
const modalFeatures = document.getElementById("modal-features");
const modalLearned = document.getElementById("modal-learned");
const modalChallenges = document.getElementById("modal-challenges");
const modalImageMedia = document.getElementById("modal-image-media");
const modalVideoMedia = document.getElementById("modal-video-media");
const modalLink = document.getElementById("modal-link");
const modalSecondaryLink = document.getElementById("modal-secondary-link");
const closeButton = document.getElementById("modal-close");
const triggers = document.querySelectorAll(".project-trigger");

function fillList(target, items) {
  target.innerHTML = "";
  if (!items || items.length === 0) {
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    target.appendChild(li);
  });
}

function openModal(data) {
  const useMetaLayout = data.layout === "meta";
  const hasMetaFeatures = data.metafeatures && data.metafeatures.length > 0;

  modalTitle.textContent = data.title;
  modalMetaGrid.hidden = !useMetaLayout;
  modalNarrative.hidden = !useMetaLayout;
  modalMetaFeaturesWrap.hidden = !(useMetaLayout && hasMetaFeatures);
  modalDetailSections.hidden = useMetaLayout;

  modalCompany.textContent = data.company || "";
  modalSkills.textContent = data.skills || "";
  modalTimeline.textContent = data.timeline || "";
  modalNarrative.textContent = data.narrative || "";
  fillList(modalMetaFeatures, hasMetaFeatures ? data.metafeatures : []);

  modalOverview.textContent = data.overview || "Project details coming soon.";
  modalRole.textContent = data.role ? `My Role: ${data.role}` : "";
  modalTech.textContent = `Tech Stack: ${data.tech}`;
  fillList(modalFeatures, data.features && data.features.length > 0 ? data.features : ["Feature details coming soon."]);
  fillList(modalLearned, data.learned && data.learned.length > 0 ? data.learned : ["Learning notes coming soon."]);
  fillList(modalChallenges, data.challenges && data.challenges.length > 0 ? data.challenges : ["Challenges and fixes coming soon."]);

  modalImageMedia.classList.remove("has-media");
  modalVideoMedia.classList.remove("has-media");
  modalImageMedia.innerHTML = "";
  modalVideoMedia.innerHTML = "";

  if (data.slides) {
    modalImageMedia.classList.add("has-media");
    const slideObject = document.createElement("object");
    const slideUrl = `${data.slides}#view=FitH&zoom=page-width&pagemode=none`;
    slideObject.data = slideUrl;
    slideObject.type = "application/pdf";
    slideObject.className = "modal-project-slides";
    slideObject.setAttribute("aria-label", data.slidestitle || `${data.title} slides`);

    const fallback = document.createElement("div");
    fallback.className = "slides-fallback";
    fallback.innerHTML = `
      <p>Slides preview is blocked in this viewer.</p>
      <a href="${data.slides}" target="_blank" rel="noopener noreferrer">Open Slides</a>
    `;
    slideObject.appendChild(fallback);
    modalImageMedia.appendChild(slideObject);
  } else if (data.image) {
    modalImageMedia.classList.add("has-media");
    const img = document.createElement("img");
    img.src = data.image;
    img.alt = data.imagealt || `${data.title} image`;
    img.className = "modal-project-image";
    if (data.imageclickable) {
      const imageLink = document.createElement("a");
      imageLink.href = data.image;
      imageLink.target = "_blank";
      imageLink.rel = "noopener noreferrer";
      imageLink.className = "modal-project-image-link";
      imageLink.title = "Open image in full size";
      imageLink.appendChild(img);
      modalImageMedia.appendChild(imageLink);
    } else {
      modalImageMedia.appendChild(img);
    }
  }

  if (data.video) {
    modalVideoMedia.classList.add("has-media");
    const video = document.createElement("video");
    video.src = data.video;
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.className = "modal-project-video";
    video.setAttribute("aria-label", data.videoalt || `${data.title} video`);
    modalVideoMedia.appendChild(video);
  }

  const hasImageMedia = Boolean(data.slides || data.image);
  const hasVideoMedia = Boolean(data.video);
  modalImageMedia.hidden = !hasImageMedia;
  modalVideoMedia.hidden = !hasVideoMedia;

  if (data.hidelink || !data.link) {
    modalLink.hidden = true;
    modalLink.href = "#";
    modalLink.textContent = "View Repository";
  } else {
    modalLink.hidden = false;
    modalLink.href = data.link;
    modalLink.textContent = data.linklabel || "View Repository";
  }
  if (data.secondarylink) {
    modalSecondaryLink.hidden = false;
    modalSecondaryLink.href = data.secondarylink;
    modalSecondaryLink.textContent = data.secondarylinklabel || "View More";
  } else {
    modalSecondaryLink.hidden = true;
    modalSecondaryLink.href = "#";
    modalSecondaryLink.textContent = "Secondary Link";
  }

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const activeVideo = modalVideoMedia.querySelector("video");
  if (activeVideo) {
    activeVideo.pause();
    activeVideo.currentTime = 0;
  }
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

triggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openModal({
      title: trigger.dataset.title,
      layout: trigger.dataset.layout,
      company: trigger.dataset.company,
      skills: trigger.dataset.skills,
      timeline: trigger.dataset.timeline,
      narrative: trigger.dataset.narrative,
      metafeatures: (trigger.dataset.metafeatures || "").split("||").filter(Boolean),
      overview: trigger.dataset.overview || trigger.dataset.description,
      role: trigger.dataset.role,
      tech: trigger.dataset.tech,
      features: (trigger.dataset.features || "").split("||").filter(Boolean),
      learned: (trigger.dataset.learned || "").split("||").filter(Boolean),
      challenges: (trigger.dataset.challenges || "").split("||").filter(Boolean),
      link: trigger.dataset.link,
      linklabel: trigger.dataset.linklabel,
      hidelink: trigger.dataset.hidelink === "true",
      secondarylink: trigger.dataset.secondarylink,
      secondarylinklabel: trigger.dataset.secondarylinklabel,
      image: trigger.dataset.image,
      imagealt: trigger.dataset.imagealt,
      imageclickable: trigger.dataset.imageclickable === "true",
      slides: trigger.dataset.slides,
      slidestitle: trigger.dataset.slidestitle,
      video: trigger.dataset.video,
      videoalt: trigger.dataset.videoalt,
    });
  });
});

closeButton.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target.dataset.close === "true") {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("show")) {
    closeModal();
  }
});
