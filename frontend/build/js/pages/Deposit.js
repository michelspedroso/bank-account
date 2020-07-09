import Page from '../utils/Page';
import accountService from '../services/account';

class DepositPage extends Page {
    init() {
        this.handlePopulateAccounts();
    }

    binds() {
        $('.deposit button#submit').on('click', this.applyDeposit.bind(this));
        // $("#dashboard-deposit-value").mask('##.##0,00', { reverse: true});
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
        let value = $('input#dashboard-deposit-value').val();
        value = parseInt(value.replace(/(,|\.)/g,'') || 0);
        const toAccountNumber = $('#dashboard-deposit-options').val();

        try {
            await accountService.applyDeposit({ value, toAccountNumber });
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

    handleValue(event) {
        console.log(event.target.value)
        // $("#dashboard-deposit-value").val(value);
    }
};

export default new DepositPage();