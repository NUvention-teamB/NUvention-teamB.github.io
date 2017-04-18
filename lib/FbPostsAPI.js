async function getListOfPosts(pageId, pageAccessToken) {
  var response = await fetch('https://graph.facebook.com/' +
      pageId +
      '/posts?access_token=' +
      pageAccessToken, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });
  var json = await response.json();
  console.log('SUCCESS');
  console.log(json);
  return json;
}

export { getListOfPosts }
