const ACCESS_TOKEN = 'accessToken';

class Page {
  constructor() {
    this.checkAuth();
    this.init();
    this.binds();
  }

  checkAuth() {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const { href } = window.location;

    if (href.includes('login') || href.includes('register')) {
      this.removeAtuh();
      return;
    }

    if (!token) {
      window.location.href = '/login.html';
    }
  }

  setAuth(accessToken) {
    localStorage.setItem(ACCESS_TOKEN, `Bearer ${accessToken}`);
  }

  getAuth() {
    localStorage.getItem(ACCESS_TOKEN);
  }

  removeAtuh() {
    localStorage.removeItem(ACCESS_TOKEN);
  }

  init() {

  }

  binds() {

  }
}

export default Page;
