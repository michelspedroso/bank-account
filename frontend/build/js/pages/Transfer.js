import Page from '../utils/Page';
import userService from '../services/user'
import recordService from '../services/record'
import accountService from '../services/account';

class TransferPage extends Page {
    init() {
        this.handlePopulateAccounts();
    }

    binds() {
        $('.transfer button#submit').on('click', this.applyTransfer.bind(this));
    }

    async handlePopulateAccounts(event) {
        try {
            const accounts = await accountService.getAccounts();
            const items = accounts.map(account => `<option value="${account.cc}">${account.cc}</option>`);

            items.unshift(`<option selected disabled>Select one</option>`);
            $('#dashboard-transfer-from-account').html(items.join(''));
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

    async applyTransfer() {
        let value = $('input#dashboard-deposit-value').val();
        value = parseInt(value.replace(/(,|\.)/g,'') || 0);
        const toAccountNumber = $('#dashboard-transfer-to-account').val();
        const fromAccountNumber = $('#dashboard-transfer-from-account').val();
        
        try {
            await accountService.applyTransfer({ value, toAccountNumber, fromAccountNumber });
            window.location.href = 'dashboard.html';
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

export default new TransferPage();