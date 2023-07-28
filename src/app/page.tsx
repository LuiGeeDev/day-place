"use client";

import dayjs from "dayjs";
import { useEffect, useRef } from "react";

export default function Home() {
  const imageInput = useRef<HTMLInputElement>(null);
  const today = dayjs().format("M월 D일");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => console.log(pos),
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
  }, []);

  async function handleChangeImage() {
    if (!imageInput.current?.files) {
      return;
    }

    const uploadedImage = imageInput.current.files[0];
    // showLoading
    // save it to image cloud
    const response = await fetch("/image", {
      method: "POST",
      body: uploadedImage,
    });
    console.log(await response.json());
    // get image url
    // save backend with current position, time
  }

  return (
    <main>
      <p>오늘은 {today}</p>
      <p>오늘을 기억할 사진을 올려보세요.</p>
      <label htmlFor="image">사진 올리기</label>
      <input
        id="image"
        ref={imageInput}
        type="file"
        accept="image/*"
        onChange={handleChangeImage}
      />
    </main>
  );
}
