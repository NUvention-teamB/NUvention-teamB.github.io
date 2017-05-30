async function getPageID(fbLoginToken) {
  var response = await fetch('https://graph.facebook.com/me/accounts?access_token=' + fbLoginToken);
  var json = await response.json();
  pageId = json.data[0].id;
  // console.log('pageId:' + pageId);
  return pageId;
}

async function getPages(fbLoginToken) {
  var response = await fetch('https://graph.facebook.com/me/accounts?access_token=' + fbLoginToken);
  var json = await response.json();
  return json.data;
}

async function getPageAccessToken(pageId, fbLoginToken) {
  var response = await fetch('https://graph.facebook.com/' +
      pageId +
      '?fields=access_token' +
      '&access_token=' +
      fbLoginToken);
  var json = await response.json();
  pageAccessToken = json['access_token'];
  // console.log('pageAccessToken:', pageAccessToken);
  return pageAccessToken;
}

async function pagePost(pageId, pageAccessToken, postText, link) {
  var body = {};
  body.message = postText;
  body.link = link;

  console.log(body);

  var urlPart = '&message='+postText;
  if (link != null) {
    urlPart += '&picture='+link+'&link='+link
  }

  var response = await fetch('https://graph.facebook.com/' +
      pageId +
      '/feed?access_token=' +
      pageAccessToken+urlPart, {
    method: 'Post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify({body})
  });
  var json = await response.json();
  // console.log('SUCCESS');
  console.log(json);
  return json;
}

async function scheduledPagePost(pageId, pageAccessToken, postText, link, publishTime) {
  console.log(publishTime);
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
      link: link,
      scheduled_publish_time: publishTime.getTime()/1000,
      published: "false",
    })
  });
  var json = await response.json();
  console.log('SUCCESS');
  console.log(json);
  return json;
}

export { getPageID, getPageAccessToken, pagePost, scheduledPagePost, getPages }
