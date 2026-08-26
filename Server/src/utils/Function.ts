import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

import dotenv from "dotenv";
import { Request } from "express";
dotenv.config();

const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsRegion = process.env.AWS_REGION;
const awsBucket = process.env.S3_BUCKET_NAME;

if (!awsAccessKeyId || !awsSecretAccessKey || !awsRegion || !awsBucket) {
  throw new Error("Missing required AWS configuration environment variables");
}

const awsConfig = {
  accessKeyId: awsAccessKeyId,
  secretAccessKey: awsSecretAccessKey,
  region: awsRegion,
  bucket: awsBucket,
};

const s3 = new S3Client({
  region: awsConfig.region,
  credentials: {
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
  },
});

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export interface AwsConfigEnv {
	accessKeyId: string;
	secretAccessKey: string;
	region: string;
	bucket: string;
}

export interface SignUrlRequestBody {
	fileName: string;
	fileType?: string;
	folderType: string;
}

export interface SanitizedUploadInput {
	folderType: string;
	fileName: string;
	fileType: string;
}

export interface GetSignedUrlRequestBody {
	key: string;
	downloadFileName?: string;
}

export interface UploadFileRequestBody {
	buffer: Buffer;
	fileName: string;
	fileType: string;
	folderType: string;
}

export interface UploadFileResponse {
	url: string;
	key: string;
	fileName: string;
	fileType: string;
}

export interface DeleteImageRequestBody {
	fileUrl?: string;
	key?: string;
}

export interface UpdateImageRequestBody {
	folderType: string;
	oldFileUrl?: string;
	oldKey?: string;
}

const isSafeS3Key = (key: string): boolean => {
  return Boolean(key) && !key.includes("..") && !key.startsWith("/") && !key.startsWith("\\");
};

export const deleteFile = async (fileUrl: string) => {
  if (!fileUrl) {
    console.warn("No file URL provided for deletion");
    return;
  }

  const bucket = process.env.S3_BUCKET_NAME;
  const key = extractKeyFromUrl(fileUrl);

  if (!bucket) {
    console.warn("S3 bucket is not configured, skipping S3 delete.");
    return;
  }

  if (key) {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
  } else {
    console.warn("Invalid file key extracted, skipping S3 delete.");
  }
};

export const extractKeyFromUrl = (url: string) => {
  if (!url || typeof url !== "string") {
    console.error("Invalid URL passed to extractKeyFromUrl:", url);
    return null;
  }

  if (!url.includes(".com/")) {
    return url;
  }

  const parts = url.split(".com/");
  return parts.length > 1 ? parts[1] : null;
};

export function sanitizeInput(folderType: string, fileName: string, fileType?: string): SanitizedUploadInput {
  // Normalize folder path
  folderType = folderType.replace(/\\/g, '/').trim();

  // Remove invalid characters from folderType
  folderType = folderType.replace(/[^a-zA-Z0-9/_-]/g, '');

  // Remove invalid characters from fileName
  fileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '').trim();

  // Infer fileType if empty
  if (!fileType && fileName.includes('.')) {
    fileType = fileName.split('.').pop() || '';
  }

  if (!fileType) {
    fileType = 'application/octet-stream';
  }

  return { folderType, fileName, fileType };
}

export const uploadFileToS3 = async ({
  buffer,
  fileName,
  fileType,
  folderType,
}: UploadFileRequestBody): Promise<UploadFileResponse> => {
  if (!buffer || !fileName || !fileType || !folderType) {
    throw new Error("buffer, fileName, fileType and folderType are required");
  }

  const sanitized = sanitizeInput(folderType, fileName, fileType);
  const normalizedFolderType = sanitized.folderType;
  const normalizedFileName = sanitized.fileName;
  const normalizedFileType = sanitized.fileType;
  const ext = normalizedFileName.includes(".") ? normalizedFileName.split(".").pop() || "bin" : "bin";
  const safeName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const key = `${normalizedFolderType.replace(/\s+/g, "_")}/${safeName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: awsConfig.bucket,
      Key: key,
      Body: buffer,
      ContentType: normalizedFileType,
      ACL: "private",
    }),
  );

  const uploadedFileUrl = `https://${awsConfig.bucket}.s3.${awsConfig.region}.amazonaws.com/${key}`;

  return {
    url: uploadedFileUrl,
    key,
    fileName: normalizedFileName,
    fileType: normalizedFileType,
  };
};

export const create_sign_url = async ({
  fileName,
  fileType,
  folderType,
}: SignUrlRequestBody) => {
  if (!fileName || !folderType || !fileType) {
    throw new Error("fileName, fileType and folderType are required");
  }

  if (!allowedTypes.includes(fileType)) {
    throw new Error("Invalid file type");
  }

  const sanitized = sanitizeInput(folderType, fileName, fileType);
  const normalizedFolderType = sanitized.folderType;
  const normalizedFileName = sanitized.fileName;
  const normalizedFileType = sanitized.fileType;

  const ext = normalizedFileName.includes(".") ? normalizedFileName.split(".").pop() || "bin" : "bin";
  const safeName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const key = `${normalizedFolderType.replace(/\s+/g, "_")}/${safeName}`;

  const presignedUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: awsConfig.bucket,
      Key: key,
      ContentType: normalizedFileType,
      ACL: "private",
    }),
    {
      expiresIn: 3600,
    },
  );

  return {
    url: presignedUrl,
    fields: {},
    key,
  };
};

export const Get_Signed_Url = async ({ key, downloadFileName }: GetSignedUrlRequestBody) => {
  if (!key) {
    throw new Error("key is required");
  }

  if (!isSafeS3Key(key)) {
    throw new Error("Invalid key format");
  }

  const signedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: awsConfig.bucket,
      Key: key,
      ...(downloadFileName
        ? {
            ResponseContentDisposition: `attachment; filename="${downloadFileName}"`,
          }
        : {}),
    }),
    {
      expiresIn: 3600,
    },
  );

  return { url: signedUrl };
};

export const getUploadedFile = (req: Request) => {
  const files = req.files as
    | {
        file?: Express.Multer.File[];
        image?: Express.Multer.File[];
      }
    | undefined;

  return files?.image?.[0] ?? files?.file?.[0] ?? req.file ?? null;
};

export const getMultipleUploadedFiles = (req: Request): Express.Multer.File[] => {
  const files = req.files as Express.Multer.File[] ;

  return files;
};

export const Get_Signed_url = Get_Signed_Url;