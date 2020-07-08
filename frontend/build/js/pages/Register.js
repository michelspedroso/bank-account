import Page from './../utils/Page';
import userService from './../services/user'

class RegisterPage extends Page {
    binds() {
        $('.register-box  button#submit').on('click', this.handleSignup.bind(this));
    }

    async handleSignup(event) {
        event.preventDefault();

        const payload = {
            username: $('input#username').val(),
            password: $('input#password').val(),
            firstName: $('input#firstName').val(),
            lastName: $('input#lastName').val(),
        };

        console.log('PAYLOAD:', payload);

        try {
            const response = await userService.signup(payload);
            const { accessToken, userId } = response.data;
            this.setAuth(accessToken, userId);
            window.location.href = '/dashboard.html';
        } catch (err) {
            alert(err);
        }
    }
};

export default new RegisterPage();