"use client";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UploadImage } from "./UploadImage";

export const Upload = () => {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [txSignature, setTxSignature] = useState("");
  const router = useRouter();

  async function onSubmit() {
    const response = await axios.post(
      `${BACKEND_URL}/v1/user/task`,
      {
        options: images.map((image) => ({
          imageUrl: image,
        })),
        title,
        payment_signature: txSignature,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      }
    );
    router.push(`/task/${response.data.id}`);
  }
  return (
    <div className="flex justify-center">
      <div className="max-w-screen-lg w-full">
        <div className="text-2xl text-left pt-20 w-full pl-4">
          Create a task
        </div>
        <label className="pl-4 block mt-2 text-md font-medium text-gray-900 text-black">
          Task details
        </label>

        <input
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          type="text"
          id="first_name"
          className="ml-4 mt-1 bg-gray-50 border border-gray-300 text0gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="What is your task?"
          required
        />

        <label className="pl-4 block mt-8 text-md font-medium text-gray-900 text-black">
          Add Images
        </label>
        <div className="flex justify-center pt-4 max-w-screen-lg">
          {images.map((image, idx) => (
            <UploadImage
              image={image}
              key={idx}
              onImageAdded={(imageUrl) => {
                setImages((i) => [...i, imageUrl]);
              }}
            />
          ))}
        </div>
        <div className="ml-4 pt-2 flex justify-center">
          <UploadImage
            onImageAdded={(imageUrl) => {
              setImages((i) => [...i, imageUrl]);
            }}
          />
        </div>
      </div>
    </div>
  );
};
