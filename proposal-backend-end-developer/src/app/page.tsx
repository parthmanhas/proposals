"use client";

import { useState } from "react";

export default function Home() {
  const [htmlContent, setHtmlContent] = useState("");
  const [thumbnailImg, setThumbnailImg] = useState("");

  const generateThumbnail = async () => {
    const response = await fetch('/api/thumbnail', {
      method: 'POST',
      body: JSON.stringify({
        html: htmlContent
      })
    })
    const { thumbnail } = await response.json();
    setThumbnailImg(thumbnail);
  }

  return (
    <main className="flex min-h-screen w-screen flex-col items-center space-y-4 p-5">
      <textarea className="w-[500px] h-[250px]" placeholder="Enter html content to generate thumbnail" onChange={(e) => setHtmlContent(e.target.value)} value={htmlContent} />
      <button onClick={generateThumbnail}>Generate</button>
      <img src={`data:image/png;base64,${thumbnailImg}`} alt="" />
    </main>
  );
}
