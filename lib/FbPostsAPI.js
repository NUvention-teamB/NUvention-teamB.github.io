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
  statistics.posts = await getStatisticsOnLastPosts(dataByWeek.posts, pageAccessToken);
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
  var thisWeekPromises = [];
  var pastWeekPromises = [];
  for (var post of dataByWeek.thisWeek) {
    // console.log(post);
    thisWeekPromises.push(getPostStatistics(post, pageAccessToken))
  }
  for (var post of dataByWeek.pastWeek) {
    // console.log(post);
    pastWeekPromises.push(getPostStatistics(post, pageAccessToken))
  }
  //
  var thisWeekStatistics = await Promise.all(thisWeekPromises);
  var pastWeekStatistics = await Promise.all(pastWeekPromises);

  function summation(acc, post) {
    // console.log('acc:',acc);
    // console.log(post);
    acc.likes+=post.likes;
    acc.reactions+=post.reactions;
    acc.comments+=post.comments;
    return acc;
  }

  var thisWeekSummary = thisWeekStatistics.reduce(summation, {'likes': 0, 'reactions': 0, 'comments': 0});
  var pastWeekSummary = pastWeekStatistics.reduce(summation, {'likes': 0, 'reactions': 0, 'comments': 0});

  var statistics = {
    'thisWeek': thisWeekStatistics,
    'thisWeekSummary': thisWeekSummary,
    'pastWeek': pastWeekStatistics,
    'pastWeekSummary': pastWeekSummary
  }

  // console.log('statistics', statistics)
  return statistics;
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
    console.log('getTotalLikesCount');
    var promises = [];
    for (var post of list) {
      promises.push(getPostLikesCountPromise(post.id, pageAccessToken));
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
      console.log('ERROR getting likes count:', err);
      reject(err);
      // resolve(0);
    })
  })
}

function splitByWeek(list) {
  // console.log(list)
  var now = new Date();
  var beginningOfWeek = new Date(now.getTime() - (now.getDay() * 24*60*60*1000))
  // console.log(beginningOfWeek.toDateString())
  var beginningOfPastWeek = new Date(beginningOfWeek.getTime() - (7 * 24*60*60*1000))
  // console.log(beginningOfPastWeek.toDateString())

  var thisWeek = [];
  var pastWeek = [];
  var history = [];

  list.sort(function(a,b) {
    if (a.created_time && b.created_time) return b.created_time-a.created_time;
    else return 0
  });
  // console.log(list);
  for (var post of list) {
    var date = new Date(post.created_time*1000);
    var time = date.getTime();
    if (time>beginningOfWeek) thisWeek.push(post);
    else if (time>beginningOfPastWeek) pastWeek.push(post);
    else history.push(post);
  }

  // console.log('thisWeek:', thisWeek);
  // console.log('pastWeek:', pastWeek);
  // console.log('history:', history);

  return {
    'thisWeek': thisWeek,
    'pastWeek': pastWeek,
    'history': history,
    'posts': list.slice(0,3)
  }
}

export { getListOfPosts, getTotalLikesCount }
