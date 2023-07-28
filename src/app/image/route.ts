import { NextResponse } from "next/server";

import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: "dw3yfn7hd",
  api_key: "114179971996428",
  api_secret: "1H6rBkJixIckS1JG9sa9YaYtSZI",
});

export async function POST(request: Request) {
  if (!request.body) {
    return NextResponse.error();
  }

  return await uploadStream(request.body);
}

function uploadStream(body: ReadableStream) {
  return new Promise(async (resolve, reject) => {
    const cloudinaryStream = cloudinary.uploader.upload_stream(
      {},
      function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(NextResponse.json(result));
        }
      }
    );

    const image = await streamToUint8Array(body);
    streamifier.createReadStream(image).pipe(cloudinaryStream);
  });
}

async function streamToUint8Array(
  readableStream: ReadableStream
): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];

  const reader = readableStream.getReader();
  return new Promise((resolve, reject) => {
    function read() {
      reader
        .read()
        .then(({ done, value }) => {
          if (done) {
            resolve(Uint8Array.from(Buffer.concat(chunks)));
          } else {
            chunks.push(value);
            read();
          }
        })
        .catch((err) => {
          reject(err);
        });
    }

    read();
  });
}
