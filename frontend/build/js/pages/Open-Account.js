import Page from './../utils/Page';
import userService from './../services/user'
import accountService from './../services/account';

class OpenAccountPage extends Page {
    init() {
        this.handleCreateAccount();
    }

    binds() {
        $('.create-account button#submit').on('click', this.createAccount.bind(this));
    }
    
    async handleCreateAccount(event) {
        try {
            const accounts = await accountService.getAccountTypes();
            const user = await userService.getDetail();
            const account = user.accounts.length ? user.accounts[0] : false;
            if (account) {
                const cpf = account.cpf;
                $('#dashboard-cpf').prop('disabled', true).val(cpf);
            }
            const items = accounts.map(account => `<option value="${account}">${account}</option>`);

            items.unshift(`<option selected disabled>Select one</option>`);
            $('#dashboard-accounts-options').html(items.join(''));
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

    async createAccount() {
        let cpf = $('input#dashboard-cpf').val();
        cpf = parseInt(cpf.replace(/(,|\.)/g,'') || 0);
        const type = $('#dashboard-accounts-options').val();
        try {
            await accountService.createAccount({ cpf, type });
            window.location.href = 'dashboard.html'
        } catch(err) {
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

export default new OpenAccountPage();