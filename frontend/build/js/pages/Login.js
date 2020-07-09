import Page from './../utils/Page';
import userService from './../services/user'

class LoginPage extends Page {
    constructor(){
        super('/');
    }
    binds() {
      $('.login-box button#submit').on('click', this.handleSignIn.bind(this));
    }

    async handleSignIn(event) {
        event.preventDefault();

        const payload = {
            username: $('input#username').val(),
            password: $('input#password').val()
        };

        try {
            const response = await userService.signin(payload);
            const { accessToken, userId } = response;
            this.setAuth(accessToken, userId);
            window.location.href = '/dashboard.html';
        } catch (err) {
            console.error(err);
            if (err.responseJSON && err.responseJSON.message) {
                $(document).Toasts('create', {
                    title: 'Error',
                    body: err.responseJSON.message,
                    autohide: true,
                    icon: 'fas fa-exclamation-triangle',
                    delay: 3000
                  });
            }
        }
    }
};

export default new LoginPage();
