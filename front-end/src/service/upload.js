import api from "./api";

function unwrap(res) {
  return res?.data?.result ?? null;
}

export async function uploadClubImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  // api.js sets default Content-Type to application/json; remove it so the browser sets
  // multipart/form-data with the correct boundary.
  const res = await api.post("/files/upload", formData, {
    transformRequest: [
      (data, headers) => {
        if (headers && headers["Content-Type"]) delete headers["Content-Type"];
        if (headers && headers["content-type"]) delete headers["content-type"];
        return data;
      },
      ...(api.defaults.transformRequest || []),
    ],
  });
  return unwrap(res);
}
