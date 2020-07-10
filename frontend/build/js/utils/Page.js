const ACCESS_TOKEN = 'accessToken';
const SELECTED_ACCOUNT = 'selectedAccount';

class Page {
  constructor(path) {
    this.loadResource(path);
  }

  checkAuth() {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const { pathname } = window.location;

    const isAccountPages = pathname == '/' || pathname.includes('register');
    if (isAccountPages) {
      this.removeAuth();
      return;
    }

    if (!isAccountPages && !token) {
      window.location.href = '/';
    }
  }

  loadResource(path) {
    const pathName = window.location.pathname.replace(/\/|.html/g, '');
    path = path.replace(/\/|.html/g, '');
    if (pathName == path) {
      this.checkAuth();
      this.beforeInit();
      this.init();
      this.binds();
    }
  }

  setAuth(accessToken) {
    localStorage.setItem(ACCESS_TOKEN, `Bearer ${accessToken}`);
  }

  getAuth() {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  removeAuth() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(SELECTED_ACCOUNT);
  }

  setSelectedAccount(account) {
    localStorage.setItem(SELECTED_ACCOUNT, account);
  }

  getSelectedAccount() {
    return localStorage.getItem(SELECTED_ACCOUNT);
  }

  beforeInit() {

  }

  init() {

  }

  binds() {

  }
}

export default Page;
