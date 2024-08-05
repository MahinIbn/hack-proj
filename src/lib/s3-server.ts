import { S3 } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import os from "os";

export async function downloadFromS3(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = new S3({
        region: "eu-west-1",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
      });
      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
      };

      const obj = await s3.getObject(params);
      const tmpDir = os.tmpdir();
      const file_name = path.join(tmpDir, `mahin${Date.now().toString()}.pdf`);

      if (obj.Body instanceof require("stream").Readable) {
        // Ensure the directory exists
        fs.mkdirSync(path.dirname(file_name), { recursive: true });

        const file = fs.createWriteStream(file_name);
        file.on("open", function (fd) {
          // @ts-ignore
          obj.Body?.pipe(file).on("finish", () => {
            return resolve(file_name);
          });
        });

        file.on("error", (err) => {
          console.error("Error writing file:", err);
          reject(err);
        });
      } else {
        reject(new Error("Downloaded object is not a readable stream"));
      }
    } catch (error) {
      console.error("Error in downloadFromS3:", error);
      reject(error);
    }
  });
}