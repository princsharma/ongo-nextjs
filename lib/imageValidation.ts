let faceapi: any = null;

let modelsLoaded = false;

export async function loadModels() {
  if (modelsLoaded) return;

  faceapi = await import("@vladmandic/face-api");

  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

  modelsLoaded = true;
}

export async function validateImageFile(file: File) {
  if (typeof window === "undefined") {
    return { valid: false, reason: "Client only" };
  }

  await loadModels();

  const img = await fileToCanvas(file);

  const detections = await faceapi.detectAllFaces(
    img,
    new faceapi.TinyFaceDetectorOptions({
      inputSize: 512,
      scoreThreshold: 0.25, // 🔥 lower = more sensitive
    })
  );

  // ❌ No face
  if (detections.length === 0) {
    return { valid: false, reason: "No person detected" };
  }

  // ❌ Multiple people
  if (detections.length > 1) {
    return { valid: false, reason: "Multiple people detected" };
  }

  // ✅ Full body approximation
  const faceBox = detections[0].box;
  const ratio = faceBox.height / img.height;

  if (ratio >  0.35) {
    return { valid: false, reason: "Too close. Show full body" };
  }

  return { valid: true };
}

// resize helper
function fileToCanvas(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");

      const MAX_WIDTH = 512;
      const scale = MAX_WIDTH / img.width;

      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      resolve(canvas);
    };
  });
}