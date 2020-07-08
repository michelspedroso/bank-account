import Page from './../utils/Page';
import userService from './../services/user'
import recordService from './../services/record'
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
            const items = accounts.map(account => `<option value="${account}">${account}</option>`);

            items.unshift(`<option selected disabled>Select one</option>`);
            $('#dashboard-accounts-options').html(items.join(''));
        } catch (err) {
            console.error(err)
        }
    }

    async createAccount() {
        const cpf = $('input#dashboard-cpf').val();
        const type = $('#dashboard-accounts-options').val();
        try {
            await accountService.createAccount({ cpf, type });
            window.location.href = 'dashboard.html'
        } catch(err) {
            alert(err.responseJSON.message);
        }
    }

};

export default new OpenAccountPage();