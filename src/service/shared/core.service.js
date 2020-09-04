const formDataConfig = {
  headers: {
    "Content-Type": undefined
  }
};

function processFormDataWithImage(payload, image) {
  let formData = new FormData();
  formData.append(
    "payload",
    new Blob([JSON.stringify(payload)], {type: "application/json"})
  );
  if (image) {
    formData.append("image", image.raw);
  } else {
    formData.append("image", null);
  }
  return formData;
}

const CoreService = {
  formDataConfig: formDataConfig,
  processFormDataWithImage: processFormDataWithImage,
};

export default CoreService;
