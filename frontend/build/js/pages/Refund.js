import Page from '../utils/Page';
import userService from '../services/user'
import recordService from '../services/record'
import accountService from '../services/account';

class RefundPage extends Page {
    init() {
        this.handlePopulateAccounts();
    }

    binds() {
        $('.refund button#submit').on('click', this.applyDeposit.bind(this));
    }

    async handlePopulateAccounts(event) {
        try {
            const accounts = await accountService.getAccounts();
            const items = accounts.map(account => `<option value="${account.cc}">${account.cc}</option>`);

            items.unshift(`<option selected disabled>Select one</option>`);
            $('#dashboard-deposit-options').html(items.join(''));
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

    async applyDeposit() {
        let value = $('input#dashboard-refund-value').val();
        value = parseInt(value.replace(/(,|\.)/g,'') || 0);
        const toAccountNumber = $('#dashboard-deposit-options').val();
        
        try {
            await accountService.applyRefund({ value, toAccountNumber });
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

export default new RefundPage();