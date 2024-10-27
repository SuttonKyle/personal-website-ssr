import AWS from "aws-sdk"
import { flow, pipe } from "effect";
import * as O from "effect/Option";
import * as A from "effect/Array";
import * as E from "effect/Either";
const albumBucketName = "kylesutton-personal-website-photos";

// Initialize the Amazon Cognito credentials provider
AWS.config.region = "us-east-1";
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "us-east-1:244a0ef2-327c-4cef-84f2-2957176e1c48",
});

export const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: albumBucketName },
});

type ListObjectsResp = E.Either<AWS.S3.ListObjectsOutput, AWS.AWSError>

const processResp = (err: AWS.AWSError, data: AWS.S3.ListObjectsOutput): ListObjectsResp => err ? E.left(err) : E.right(data);

export const listAlbums = (onError: (msg: string) => void, onSuccess: (albums: string[]) => void) =>
  s3.listObjects({ Delimiter: "/", Bucket: albumBucketName }, flow(
    processResp,
    E.match({
      onLeft: err => onError(err.message),
      onRight: data => pipe(
        data.CommonPrefixes ?? [],
        A.filterMap(commonPrefix => pipe(
          O.fromNullable(commonPrefix.Prefix),
          O.map(p => decodeURIComponent(p.replace("/", "")))
        )),
        onSuccess,
      )
    })
  ));

const getExtension = (s: string) => {
  const parts = s.split(".");
  return parts[parts.length - 1] ?? "";
}

const acceptedExtensions = new Set(["jpg", "jpeg", "png", "webp"]);

export const viewAlbum = (albumName: string) => (onError: (msg: string) => void, onSuccess: (photos: string[]) => void) => {
  const albumPhotosKey = `${encodeURIComponent(albumName)}/`;
  s3.listObjects({ Prefix: albumPhotosKey, Bucket: albumBucketName }, flow(
    processResp,
    E.match({
      onLeft: err => onError(err.message),
      onRight: data => {
        const bucketUrl = `${s3.endpoint.href}${albumBucketName}/`;
        pipe(
          data.Contents ?? [],
          A.filterMap(photo => pipe(
            O.fromNullable(photo.Key),
            O.filter(k => k.replace(albumPhotosKey, "") !== "" && acceptedExtensions.has(getExtension(k).toLowerCase())),
            O.map(key => `${bucketUrl}${encodeURIComponent(key)}`)
          )),
          onSuccess
        )
      }
    }
    )));
}

export const requestAlbum = async (albumName: string) => {
  const albumPhotosKey = `${encodeURIComponent(albumName)}/`;
  const promise = await s3.listObjects({ Prefix: albumPhotosKey, Bucket: albumBucketName }).promise();
  const promiseResp = promise.Contents?.map(p => p.Key ?? "");
  console.log(promiseResp);
  return promiseResp;
}