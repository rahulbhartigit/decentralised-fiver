"use client";
import { BACKEND_URL, CLOUDFRONT_URL } from "@/utils";
import { useState } from "react";
import axios from "axios";
export function UploadImage({
  onImageAdded,
  image,
}: {
  onImageAdded: (image: string) => void;
  image?: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/v1/user/presignedUrl`, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") ||
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1Njg0NTQzOH0.DGc9AZz2nFVXOwLWw5KtF4mO7qSkKaf0WicwrMxDE4Q"
          }`,
        },
      });
      const presignedUrl = response.data.preSignedUrl;
      console.log(presignedUrl);
      const formData = new FormData();
      console.log(response.data.fields);
      formData.set("bucket", response.data.fields["bucket"]);
      formData.set("X-Amz-Algorithm", response.data.fields["X-Amz-Algorithm"]);
      formData.set(
        "X-Amz-Credential",
        response.data.fields["X-Amz-Credential"]
      );
      formData.set("X-Amz-Date", response.data.fields["X-Amz-Date"]);
      formData.set("key", response.data.fields["key"]);
      formData.set("Policy", response.data.fields["Policy"]);
      formData.set("X-Amz-Signature", response.data.fields["X-Amz-Signature"]);

      formData.append("file", file);

      const awsResponse = await axios.post(presignedUrl, formData);

      console.log(awsResponse);

      onImageAdded(`${CLOUDFRONT_URL}/${response.data.fields["key"]}`);
    } catch (e) {
      console.log(e);
    }
    setUploading(false);
  }
  if (image) {
    return <img className={"p-2 w-96 rounded"} src={image} />;
  }
  return (
    <div>
      <div className="w-40 h-40 rounded border text-2xl cursor-pointer">
        <div className="h-full flex justify-center flex-col relative w-full">
          <div className="h-full flex justify-center w-full pt-16 text-4xl ">
            {uploading ? (
              <div className="text-sm">Loading...</div>
            ) : (
              <>
                +
                <input
                  type="file"
                  style={{
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  onChange={onFileSelect}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
