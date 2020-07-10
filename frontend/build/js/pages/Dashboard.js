import UserDetailPage from './../utils/UserDetailPage';
import userService from './../services/user'
import recordService from './../services/record'
import accountService from './../services/account';

class DashboardPage extends UserDetailPage {
    constructor() {
        super('dashboard');
    }

    init() {
    }

    binds() {
        $('#dashboard-menu-accounts').on('change', this.handleSelectAccount.bind(this));
        $('#dashboard-create-account').on('click', this.handleCreateAccount.bind(this));
        $('#dashboard-apply-deposit').on('click', this.handleApplyDeposit.bind(this));
        $('#dashboard-apply-refund').on('click', this.handleApplyRefund.bind(this));
        $('#dashboard-apply-transfer').on('click', this.handleApplyTransfer.bind(this));
        $('#dashboard').on('click', this.handleDashboard.bind(this));
        $('#dashboard-logout').on('click', this.handleLogout.bind(this));
    }

    handleLogout() {
        this.removeAuth();
        window.location.href = '/';
    }

    switchArrowStyle(extract) {
        if (extract.type === 'deposit' || !extract.fromAccount) {
            return 'success';
        }
        return 'danger';
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
            const items = extracts.map(extract => {
                const arrowStyle = (extract.type == 'deposit' || extract.type == 'transfer-received') ? 'success' : 'danger';
                return `
                <tr>
                <td>${extract.type}</td>
                <td><small class="text-${arrowStyle} mr-1"><i class="fas fa-arrow-${arrowStyle === 'success' ? 'up' : 'down'}"></i></small> ${extract.formatedValue}</td>
                <td>${new Date(extract.createdAt).toLocaleString()}</td>
                <td>${extract.transaction.id}</td>
                </tr>`;
            });
            $('#dashboard-table').html(items.join());
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

export default new DashboardPage();