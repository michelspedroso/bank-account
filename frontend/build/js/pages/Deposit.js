import Page from '../utils/Page';
import userService from '../services/user'
import recordService from '../services/record'
import accountService from '../services/account';

class DepositPage extends Page {
    init() {
        this.handlePopulateAccounts();
    }

    binds() {
        $('.deposit button#submit').on('click', this.applyDeposit.bind(this));
        $("#dashboard-deposit-value").on('change', this.handleValue.bind(this));
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
            await accountService.applyDeposit({ value, toAccountNumber });
            window.location.href = 'dashboard.html';
        } catch (err) {
            alert(err.responseJSON.message);
        }
    }

    handleValue(event) {
        console.log(event.target.value)
        value += parseInt(event.target.value) / 100;
        console.log(value);
        $("#dashboard-deposit-value").val(value);
    }
};

export default new DepositPage();