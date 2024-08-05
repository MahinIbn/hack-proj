import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  const s3Client = new S3Client({
    region: "eu-west-1",
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
    },
  });

  const file_key =
    "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
    Key: file_key,
    Body: file,
  };

  try {
    console.log("Sending PutObjectCommand");
    await s3Client.send(new PutObjectCommand(params));
    console.log("S3 upload successful");
    return {
      file_key,
      file_name: file.name,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-west-1.amazonaws.com/${file_key}`;
  return url;
}