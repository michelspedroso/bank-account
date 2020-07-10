import Page from './../utils/Page';
import userService from './../services/user'

class RegisterPage extends Page {
    constructor(){
        super('register');
    }

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
        if (!payload.username || !payload.password || !payload.firstName || !payload.lastName) {
            $(document).Toasts('create', {
                title: 'Error',
                body: 'Invalid parameters',
                autohide: true,
                icon: 'fas fa-exclamation-triangle',
                delay: 3000
            });
            return;
        }
        try {
            const response = await userService.signup(payload);
            const { accessToken, userId } = response;
            this.setAuth(accessToken, userId);
            window.location.href = '/dashboard.html';
        } catch (err) {
            alert(err.responseJSON.message);
        }
    }
};

export default new RegisterPage();