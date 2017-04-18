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
  // console.log('SUCCESS');
  // console.log(json);
  return json.data;
}

async function getPostLikeCount(postId, pageAccessToken) {
  var response = await fetch('https://graph.facebook.com/' +
      postId +
      '/likes?summary=true&access_token=' +
      pageAccessToken, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  var json = await response.json();
  if (json==null || json.summary==null) {
    console.log('ERROR:', json);
    return Promise.reject();
  }
  var count = json.summary.total_count;
  console.log(count);
  // console.log('SUCCESS');
  // console.log(json);
  return count;
}

function getPostLikeCountPromise(postId, pageAccessToken) {
  return new Promise(function(resolve, reject) {
    fetch('https://graph.facebook.com/' +
        postId +
        '/likes?summary=true&access_token=' +
        pageAccessToken, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if (json==null || json.summary==null) return Promise.reject(json);

      var count = json.summary.total_count;
      // console.log(count);
      resolve(count);
    })
    .catch(function(err) {
      console.log('ERROR:', err);
      reject(err);
    });
  });
}

function getTotalLikesCount(list, pageAccessToken) {
  return new Promise(function(resolve, reject) {
    console.log('getTotalLikesCount');
    var promises = [];
    for (var post of list) {
      promises.push(getPostLikeCountPromise(post.id, pageAccessToken))
    }

    Promise.all(promises)
    .then(function(counts) {
      console.log('weeeeee');
      console.log(counts);
      totalCount = counts.reduce((total, value)=> {return total+value}, 0);
      console.log(totalCount);
      resolve(totalCount);
    })
    .catch(function(err) {
      console.log(err);
      reject(err);
    })
  })
}

export { getListOfPosts, getPostLikeCount, getTotalLikesCount }
