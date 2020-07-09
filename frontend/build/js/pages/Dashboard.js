import Page from './../utils/Page';
import userService from './../services/user'
import recordService from './../services/record'
import accountService from './../services/account';

class DashboardPage extends Page {
    async init() {
        const user = await this.getDetail();
        if (user.accounts.length) {
            const [account] = user.accounts;
            await this.handleSelectAccount({ target: { value: `${account.cc}@${account.formattedBalance}` }});
        }
    }

    binds() {
        $('#dashboard-menu-accounts').change(this.handleSelectAccount);
        $('#dashboard-create-account').on('click', this.handleCreateAccount.bind(this));
        $('#dashboard-apply-deposit').on('click', this.handleApplyDeposit.bind(this));
        $('#dashboard-apply-refund').on('click', this.handleApplyRefund.bind(this));
        $('#dashboard-apply-transfer').on('click', this.handleApplyTransfer.bind(this));
        $('#dashboard').on('click', this.handleDashboard.bind(this));
        $('#dashboard-logout').on('click', this.handleLogout.bind(this));
    }

    handleLogout() {
        this.removeAtuh();
        window.location.href = '/';
    }

    async getDetail() {
        try {
            this.user = await userService.getDetail();
            this.populateFields(this.user);
            this.populateAccountDropdown(this.user.accounts);
            return this.user;
        } catch (err) {
            this.checkAuth();
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

    switchArrowStyle(extract) {
        if (extract.type === 'deposit' || !extract.fromAccount) {
            return 'success';
        }
        return 'danger';
    }

    handleDashboard(event) {
        window.location.href = '/dashboard.html';
    }

    handleCreateAccount(event) {
        window.location.href = 'open-account.html';
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

    async handleSelectAccount(event) {
        const [cc, formattedBalance] = event.target.value.split('@');
        $('#dashboard-account-number').text(cc);
        $('#dashboard-balance').text(formattedBalance);
        try {
            const extracts = await recordService.getExtracts({ cc });
            $('#dashboard-account-transactions').text(extracts.length || 0);
            const items = extracts.map(extract => {
                const arrowStyle = extract.type == 'deposit' ? 'success' : 'danger';
                return `
                <tr>
                <td>${extract.type}</td>
                <td><small class="text-${arrowStyle} mr-1"><i class="fas fa-arrow-${arrowStyle === 'success' ? 'up' : 'down'}"></i></small> ${extract.formatedValue}</td>
                <td>${new Date(extract.createdAt).toLocaleString()}</td>
                <td>123123213123-31231</td>
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
            }

        }
    }

    populateFields(user) {
        $('#dashboard-name').text(`${user.firstName} ${user.lastName}`);
        $('#dashboard-username').text(user.username);
        $('#dashboard-balance').text('-');
        $('#dashboard-account-number').text('-');
        $('#dashboard-account-transactions').text(0);
    }

    populateAccountDropdown(accounts) {
        const options = accounts.map((account, index) => {
            let selected = '';
            if (index === 0) {
                selected = 'selected';
            }
            return `<option ${selected} value="${account.cc}@${account.formattedBalance}">
                    ${account.type}
                </option>`;
        });
        if (!options.length) {
            options.unshift(`<option value="none">Select account</option>`);
        }
        $('#dashboard-menu-accounts').html(options.join(''));
    }
};

export default new DashboardPage();