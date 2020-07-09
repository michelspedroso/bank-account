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
            console.error(err)
        }
    }

    async applyTransfer() {
        const value = $('input#dashboard-deposit-value').val();
        const toAccountNumber = $('#dashboard-transfer-to-account').val();
        const fromAccountNumber = $('#dashboard-transfer-from-account').val();
        
        try {
            await accountService.applyTransfer({ value, toAccountNumber, fromAccountNumber });
            window.location.href = 'dashboard.html';
        } catch (err) {
            alert(err.responseJSON.message);
        }
    }

};

export default new TransferPage();