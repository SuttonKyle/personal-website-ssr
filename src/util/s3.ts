import AWS from "aws-sdk"
import { flow, pipe, Effect } from "effect";
import * as O from "effect/Option";
import * as A from "effect/Array";
import * as E from "effect/Either";
const albumBucketName = "kylesutton-personal-website-photos";

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

const getExtension = (s: string) => {
  const parts = s.split(".");
  return parts[parts.length - 1] ?? "";
}

const acceptedExtensions = new Set(["jpg", "jpeg", "png", "webp"]);

export const viewAlbum = (albumName: string) => pipe(
  `${encodeURIComponent(albumName)}/`,
  albumPhotosKey => Effect.async<string[], string>(resume => {
    s3.listObjects({ Prefix: albumPhotosKey, Bucket: albumBucketName }, flow(
      processResp,
      E.match({
        onLeft: err => resume(Effect.fail(err.message)),
        onRight: data => pipe(
          data.Contents ?? [],
          A.filterMap(photo => pipe(
            O.fromNullable(photo.Key),
            O.filter(k => k.replace(albumPhotosKey, "") !== "" && acceptedExtensions.has(getExtension(k).toLowerCase())),
            O.map(key => `${s3.endpoint.href}${albumBucketName}/${encodeURIComponent(key)}`)
          )),
          a => resume(Effect.succeed(a))
        )
      })
    ))
  })
);