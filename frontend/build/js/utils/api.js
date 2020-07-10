function host(path) {
  return `https://warren.utopic.tech/api${path}`;
}

async function request(url, type = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: host(url),
      type,
      data,
      headers: {'Authorization': localStorage.getItem('accessToken')}
    })
      .done(data => resolve(data))
      .fail(err => reject(err))
  });

}

export default request;