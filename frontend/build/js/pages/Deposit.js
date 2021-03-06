import UserDetailPage from '../utils/UserDetailPage';
import accountService from '../services/account';
import recordService from '../services/record';

class DepositPage extends UserDetailPage {
    constructor(){
        super('deposit');
    }

    init() {
        this.handlePopulateAccountsDeposit();
    }

    binds() {
        $('.deposit button#submit').on('click', this.applyDeposit.bind(this));
        $('#dashboard-menu-accounts').on('change', this.handleSelectAccount.bind(this));
        $('#dashboard-create-account').on('click', this.handleCreateAccount.bind(this));
        $('#dashboard-apply-deposit').on('click', this.handleApplyDeposit.bind(this));
        $('#dashboard-apply-refund').on('click', this.handleApplyRefund.bind(this));
        $('#dashboard-apply-transfer').on('click', this.handleApplyTransfer.bind(this));
        $('#dashboard').on('click', this.handleDashboard.bind(this));
    }

    handleDashboard(event) {
        window.location.href = 'dashboard.html';
    }

    handleCreateAccount(event) {
        window.location.href = 'account.html';
    }

    handleApplyDeposit(event) {
        window.location.href = 'deposit.html';
    }

    handleApplyRefund(event) {
        window.location.href = 'refund.html';
    }

    handleApplyTransfer(event) {
        window.location.href = 'transfer.html';
    }

    async handlePopulateAccountsDeposit(event) {
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
                  return;
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
                  return;
            }
        }
    }

    populateMainInformations(cc, formattedBalance) {
        $('#dashboard-account-number').text(cc);
        $('#dashboard-balance').text(formattedBalance);
    }

    async handleSelectAccount(event) {
        const [cc, formattedBalance] = event.target.value.split('@');
        this.setSelectedAccount(cc);
        this.populateMainInformations(cc, formattedBalance);
        try {
            const extracts = await recordService.getExtracts({ cc });
            $('#dashboard-account-transactions').text(extracts.length || 0);
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
                return;
            }
        }
    }
};

export default new DepositPage();