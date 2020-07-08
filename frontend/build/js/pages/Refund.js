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
            console.error(err)
        }
    }

    async applyDeposit() {
        const value = $('input#dashboard-deposit-value').val();
        const toAccountNumber = $('#dashboard-deposit-options').val();
        
        try {
            await accountService.applyRefund({ value, toAccountNumber });
            window.location.href = 'dashboard.html';
        } catch (err) {
            alert(err.responseJSON.message);
        }
    }

};

export default new RefundPage();