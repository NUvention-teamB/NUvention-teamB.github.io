import { RNS3 } from 'react-native-aws3';

async function uploadPhoto(uri) {
  if (uri == null) {
    return null;
  }
  var random = Math.floor(Math.random() * (30000000000 - 10000000 + 1)) + 10000000;
  var name = globalPageId+random.toString()+'.jpeg';

  let file = {
    // `uri` can also be a file system path (i.e. file://)
    uri: uri,
    name: name,
    type: "image/jpeg"
  }

  let options = {
    bucket: "teamb-photos",
    region: "us-east-1",
    accessKey: "AKIAJQIOU7GJXFIBMVXQ",
    secretKey: "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",
    successActionStatus: 201
  }

  RNS3.put(file, options).then(response => {
    console.log(response);
    if (response.status !== 201) throw new Error("Failed to upload image to S3");
  });

  return "https://teamb-photos.s3.amazonaws.com/" + name;
}

export { uploadPhoto }
