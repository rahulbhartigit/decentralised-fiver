"use client";

import { Appbar } from "@/components/Appbar";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { use, useEffect, useState } from "react";

async function getTaskDetails(taskId: string) {
  const response = await axios.get(
    `${BACKEND_URL}/v1/user/task?taskId=${taskId}`,
    {
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("token") ||
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc1Njg0NTQzOH0.DGc9AZz2nFVXOwLWw5KtF4mO7qSkKaf0WicwrMxDE4Q"
        }`,
      },
    }
  );
  console.log(response.data);
  return response.data;
}

export default function Page({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = use(params);

  const [result, setResult] = useState<
    Record<
      string,
      {
        count: number;
        option: {
          imageUrl: string;
        };
      }
    >
  >({});
  const [taskDetails, setTaskDetails] = useState<{
    title?: string;
    options?: { id: number; imageUrl: string }[];
  }>({});
  useEffect(() => {
    getTaskDetails(taskId).then((data) => {
      console.log(data.result[taskId]);
      setResult(data.result);
      setTaskDetails(data.taskDetails);
    });
  }, [taskId]);

  return (
    <div>
      <div></div>
      <Appbar />
      <div className="text-2xl pt-20 flex justify-center">
        {taskDetails.title}
      </div>
      <div className="flex justify-center pt-8">
        {Object.keys(result || {}).map((taskId) => (
          <Task
            imageUrl={result[taskId].option.imageUrl}
            votes={result[taskId].count}
            key={Date.now()}
          />
        ))}
      </div>
    </div>
  );
}
function Task({ imageUrl, votes }: { imageUrl: string; votes: number }) {
  return (
    <div>
      <img className={"p-2 w-96 rounded-md"} src={imageUrl} />
      <div className="flex justify-center">{votes}</div>
      {/* //add a graph */}
    </div>
  );
}
