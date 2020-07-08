function host(path) {
  return `http://localhost:33000${path}`;
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