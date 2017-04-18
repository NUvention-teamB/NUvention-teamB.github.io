async function getPageID(fbLoginToken) {
  var response = await fetch('https://graph.facebook.com/me/accounts?access_token=' + fbLoginToken);
  var json = await response.json();
  pageId = json.data[0].id;
  console.log('pageId:' + pageId);
  return pageId;
}

async function getPageAccessToken(pageId, fbLoginToken) {
  var response = await fetch('https://graph.facebook.com/' +
      pageId +
      '?fields=access_token' +
      '&access_token=' +
      fbLoginToken);
  var json = await response.json();
  pageAccessToken = json['access_token'];
  console.log('pageAccessToken:', pageAccessToken);
  return pageAccessToken;
}

async function pagePost(pageId, pageAccessToken, postText) {
  var response = await fetch('https://graph.facebook.com/' +
      pageId +
      '/feed?access_token=' +
      pageAccessToken, {
    method: 'Post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: postText,
      link: "https://teamb-photos.s3.amazonaws.com/image.jpeg"
    })
  });
  var json = await response.json();
  console.log('SUCCESS');
  console.log(json);
  return json;
}

async function scheduledPagePost(pageId, pageAccessToken, postText, publishTime) {
  var response = await fetch('https://graph.facebook.com/' +
      pageId +
      '/feed?access_token=' +
      pageAccessToken, {
    method: 'Post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: postText,
      link: "https://teamb-photos.s3.amazonaws.com/image.jpeg",
      scheduled_publish_time: publishTime,
      published: "false",
    })
  });
  var json = await response.json();
  console.log('SUCCESS');
  console.log(json);
  return json;
}

export { getPageID, getPageAccessToken, pagePost }
