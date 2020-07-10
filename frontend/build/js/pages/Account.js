import UserDetailPage from './../utils/UserDetailPage';
import userService from '../services/user'
import accountService from '../services/account';
import recordService from './../services/record';
import { formatCPF } from './../utils/index';

class OpenAccountPage extends UserDetailPage {
    constructor() {
        super('account');
    }

    init() {
        this.handleCreateAccount();
    }

    binds() {
        $('.create-account button#submit').on('click', this.createAccount.bind(this));
        $('.account#dashboard-menu-accounts').on('change', this.handleSelectAccount.bind(this));
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


    async handleCreateAccount(event) {
        try {
            const accounts = await accountService.getAccountTypes();
            const user = await userService.getDetail();
            const account = user.accounts.length ? user.accounts[0] : false;
            if (account) {
                const cpf = account.cpf;
                $('#dashboard-cpf-label').prop('disabled', true).val(formatCPF(cpf));
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
                return;
            }
        }
    }

    async createAccount() {
        let cpf = $('input#dashboard-cpf').val();
        cpf = cpf.replace(/(,|\.)/g, '') || 0;
        const type = $('#dashboard-accounts-options').val();
        if (!type || !cpf) {
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
            await accountService.createAccount({ cpf, type });
            window.location.href = 'dashboard.html'
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

export default new OpenAccountPage();