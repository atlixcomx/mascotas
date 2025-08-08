// Cliente de UploadThing para usar en el servidor
export async function uploadToUploadThing(file: File) {
  const formData = new FormData();
  formData.append("files", file);

  const response = await fetch("/api/uploadthing", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  const data = await response.json();
  return data;
}