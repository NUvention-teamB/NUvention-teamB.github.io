import dateformat from 'dateformat'

async function getListOfPosts(pageId, pageAccessToken) {
  var response = await fetch('https://graph.facebook.com/' +
      pageId +
      '/posts?date_format=U&access_token=' +
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
  var list = json.data;
  var dataByWeek = splitByWeek(list);
  // console.log(dataByWeek);
  var statistics = await getStatistics(dataByWeek, pageAccessToken);
  statistics.posts = await getStatisticsOnLastPosts(dataByWeek.savedPosts, pageAccessToken);
  // console.log(statistics)
  return statistics;
  // return list;
}

async function getStatisticsOnLastPosts(posts, pageAccessToken) {
  var promises = [];
  for (var i=0; i<posts.length; i++) {
    var post = posts[i];
    // console.log(post);
    promises.push(getPostStatistics(post, pageAccessToken))
  }

  var postStatistics = await Promise.all(promises);

  for (var i=0; i<posts.length; i++) {
    posts[i].statistics = postStatistics[i];
  }

  // console.log('statistics', statistics)
  return posts;
}

async function getStatistics(dataByWeek, pageAccessToken) {
  // console.log('getStatistics!!!!')
  var postsByWeek = dataByWeek.postsByWeek;
  var statsByWeek = [];
  for (var i=0; i<postsByWeek.length; i++) {
    var weekPromises = [];
    var weekPosts = postsByWeek[i];
    for (var post of weekPosts) {
      weekPromises.push(getPostStatistics(post, pageAccessToken));
    }
    weekStats = await Promise.all(weekPromises);
    statsByWeek[i] = weekStats.reduce(summation, {'likes': 0, 'reactions': 0, 'comments': 0});
  }

  // console.log(statsByWeek);

  function summation(acc, post) {
    acc.likes+=post.likes;
    acc.reactions+=post.reactions;
    acc.comments+=post.comments;
    return acc;
  }

  var bestWeek = {'likes': 0, 'reactions': 0, 'comments': 0};
  for (var stats of statsByWeek) {
    for (var type in stats) {
      if (stats[type]>bestWeek[type]) bestWeek[type] = stats[type];
    }
  }

  return {
    statsByWeek: statsByWeek,
    bestWeek: bestWeek
  }
}

function getPostStatistics(post, pageAccessToken) {
  return new Promise(function(resolve, reject) {
    var promises = [];
    promises.push(getPostLikesCountPromise(post.id, pageAccessToken));
    promises.push(getPostReactionsCountPromise(post.id, pageAccessToken));
    promises.push(getPostCommentsCountPromise(post.id, pageAccessToken));

    Promise.all(promises)
    .then(function(values) {
      var summary = {
        'likes': values[0],
        'reactions': values[1],
        'comments': values[2]
      }
      resolve(summary);
    })
    .catch(function(err) {
      console.log(err);
      resolve({
        'likes': 0,
        'reactions': 0,
        'comments': 0
      })
    })
  })
}


function getPostLikesCountPromise(postId, pageAccessToken) {
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
      console.log('ERROR getting likes count:', err);
      // reject(err);
      resolve(0);
    });
  });
}

function getPostReactionsCountPromise(postId, pageAccessToken) {
  return new Promise(function(resolve, reject) {
    fetch('https://graph.facebook.com/' +
        postId +
        '/reactions?summary=true&access_token=' +
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
      console.log('ERROR getting reactions count:', err);
      // reject(err);
      resolve(0);
    });
  });
}

function getPostCommentsCountPromise(postId, pageAccessToken) {
  return new Promise(function(resolve, reject) {
    fetch('https://graph.facebook.com/' +
        postId +
        '/comments?access_token=' +
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
      if (json==null || json.data==null) return Promise.reject(json);

      var count = json.data.length;
      // console.log(count);
      resolve(count);
    })
    .catch(function(err) {
      console.log('ERROR getting comments count:', err);
      // reject(err);
      resolve(0);
    });
  });
}

function getTotalLikesCount(list, pageAccessToken) {
  return new Promise(function(resolve, reject) {
    // console.log('getTotalLikesCount');
    var promises = [];
    for (var post of list) {
      promises.push(getPostLikesCountPromise(post.id, pageAccessToken));
    }

    Promise.all(promises)
    .then(function(counts) {
      // console.log('weeeeee');
      // console.log(counts);
      totalCount = counts.reduce((total, value)=> {return total+value}, 0);
      // console.log(totalCount);
      resolve(totalCount);
    })
    .catch(function(err) {
      console.log('ERROR getting likes count:', err);
      reject(err);
      // resolve(0);
    })
  })
}

function splitByWeek(list) {
  // console.log(list)
  var now = new Date();
  var beginningOfThisWeek = new Date(now.getTime() - (now.getDay() * 24*60*60*1000))
  // console.log(beginningOfWeek.toDateString())
  var beginningOfPastWeek = new Date(beginningOfThisWeek.getTime() - (7 * 24*60*60*1000))
  // console.log(beginningOfPastWeek.toDateString())

  var thisWeek = [];
  var pastWeek = [];
  var history = [];

  list.sort(function(a,b) {
    if (a.created_time && b.created_time) return a.created_time-b.created_time;
    else return 0;
  });

  var savedPosts = list.slice(0, 5);

  var postsByWeek = [];

  while (list.length>0) {
    var post = list.pop();
    var date = new Date(post.created_time*1000);
    var postTime = date.getTime();
    var index = 0;
    if (postsByWeek[index]==null) postsByWeek[index] = [];
    var beginningOfWeek = beginningOfThisWeek;
    while (beginningOfWeek.getTime()>postTime) {
      index += 1;
      if (postsByWeek[index]==null) postsByWeek[index] = [];
      beginningOfWeek = new Date(beginningOfWeek.getTime() - index*(7 * 24*60*60*1000));
    }

    postsByWeek[index].push(post);
  }

  for (var i=0; i<postsByWeek.length; i++) {
    if (postsByWeek[i]==null) postsByWeek[index]=[];
  }

  // console.log(postsByWeek);

  return {
    'postsByWeek': postsByWeek,
    'savedPosts': savedPosts
  }
}

export { getListOfPosts, getTotalLikesCount }
