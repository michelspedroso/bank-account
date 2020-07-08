import Page from './../utils/Page';
import userService from './../services/user'

class LoginPage extends Page {
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
            console.log(userService)
            const response = await userService.signin(payload);
            const { accessToken } = response.data;
            this.setAuth(accessToken);
            window.location.href = '/dashboard.html';
        } catch (err) {
            alert(err);
        }
    }
};

export default new LoginPage();
