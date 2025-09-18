let currentIndex = 0;
let images = document.querySelectorAll(".gallery img");
let modal = document.getElementById("myModal");
let modalImg = document.getElementById("modalImage");
let editBtn = document.getElementById("editBtn");
let autoBtn = document.getElementById("autoBtn");
let autoInterval = null;

// Open Modal on click
images.forEach((img, index) => {
  img.addEventListener("click", () => {
    const visible = getVisibleImages();
    currentIndex = visible.indexOf(img);
    openModal();
  });
});

function openModal() {
  modal.style.display = "block";
  showImage();
}

function closeModal() {
  modal.style.display = "none";
  stopAutoNext();
}

function showImage() {
  const visible = getVisibleImages();
  if (visible.length === 0) return;
  if (currentIndex >= visible.length) currentIndex = 0;
  if (currentIndex < 0) currentIndex = visible.length - 1;

  const thumb = visible[currentIndex];
  modalImg.src = thumb.src;

  // Sync modal filter with thumbnail state
  if (thumb.classList.contains("bw")) {
    modalImg.classList.add("bw");
  } else {
    modalImg.classList.remove("bw");
  }
}

function changeImage(step) {
  const visible = getVisibleImages();
  if (visible.length === 0) return;
  currentIndex = (currentIndex + step + visible.length) % visible.length;
  showImage();
}

// Auto Next
function toggleAutoNext() {
  if (autoInterval) {
    stopAutoNext();
  } else {
    autoInterval = setInterval(() => {
      changeImage(1);
    }, 3000);
    autoBtn.textContent = "Stop Auto Next";
  }
}

function stopAutoNext() {
  clearInterval(autoInterval);
  autoInterval = null;
  autoBtn.textContent = "Start Auto Next";
}

// Toggle edit options
function toggleEditOptions() {
  let opts = document.getElementById("editOptions");
  opts.style.display = opts.style.display === "none" ? "flex" : "none";
}

// Apply black & white or normal
function applyBW(type) {
  if (type === "bw") {
    modalImg.classList.add("bw");
  } else {
    modalImg.classList.remove("bw");
  }
  // Update thumbnail also
  syncEditToThumbnail();
}

// Reflect current edit to thumbnail
function syncEditToThumbnail() {
  const visible = getVisibleImages();
  if (visible.length === 0) return;
  const thumb = visible[currentIndex];
  if (!thumb) return;
  if (modalImg.classList.contains("bw")) {
    thumb.classList.add("bw");
  } else {
    thumb.classList.remove("bw");
  }
}

// Save buttons banane ka function
function showSaveOptions(editedImg) {
  const oldOpts = document.querySelector(".save-options");
  if (oldOpts) oldOpts.remove();

  const saveOptions = document.createElement("div");
  saveOptions.classList.add("save-options");

  // Save to Gallery Button
  const saveToGalleryBtn = document.createElement("button");
  saveToGalleryBtn.innerText = "Save to Gallery";
  saveToGalleryBtn.onclick = function () {
    const visible = getVisibleImages();
    const thumb = visible[currentIndex];
    if (thumb) {
      thumb.src = editedImg.src;
      if (editedImg.classList.contains("bw")) {
        thumb.classList.add("bw");
      } else {
        thumb.classList.remove("bw");
      }
    }
    alert("Image saved to gallery!");
    saveOptions.remove();
    closeModal();
  };

  // Save to System Button
  const saveToSystemBtn = document.createElement("button");
  saveToSystemBtn.innerText = "Save to System";
  saveToSystemBtn.onclick = function () {
    const link = document.createElement("a");
    link.href = editedImg.src;
    link.download = "edited-image.png"; 
    link.click();
    saveOptions.remove();
  };

  saveOptions.appendChild(saveToGalleryBtn);
  saveOptions.appendChild(saveToSystemBtn);

  document.body.appendChild(saveOptions);
}

// Save current modal image
async function saveCurrent() {
  syncEditToThumbnail(); 
  showSaveOptions(modalImg); 
}

// Helper: get currently visible images
function getVisibleImages() {
  return Array.from(document.querySelectorAll(".gallery img")).filter(
    (img) => !img.classList.contains("hidden")
  );
}

// Filter Images by Category
function filterImages(category) {
  const allImages = document.querySelectorAll(".gallery img");
  allImages.forEach((img) => {
    const match = category === "all" || img.dataset.category === category;
    img.classList.toggle("hidden", !match);
  });

  // Reset modal navigation
  const visible = getVisibleImages();
  currentIndex = 0;
  if (modal.style.display === "block" && visible.length > 0) {
    showImage();
  }
}
