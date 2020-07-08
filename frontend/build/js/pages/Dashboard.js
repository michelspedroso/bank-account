import Page from './../utils/Page';
import userService from './../services/user'
import recordService from './../services/record'
import accountService from './../services/account';

class DashboardPage extends Page {
    init() {
        this.getDetail();
    }

    binds() {
        $('#dashboard-menu-accounts').change(this.handleSelectAccount);
        $('#dashboard-create-account').on('click', this.handleCreateAccount.bind(this));
        $('#dashboard-apply-deposit').on('click', this.handleApplyDeposit.bind(this));
        $('#dashboard-apply-refund').on('click', this.handleApplyRefund.bind(this));
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
        } catch (e) {
            this.checkAuth();
        }
    }

    switchArrowStyle(extract) {
        if (extract.type === 'deposit' || !extract.fromAccount) {
            return 'success';
        }
        return 'danger';
    }

    async handleCreateAccount(event) {
        window.location.href = 'open-account.html';
    }

    async handleApplyDeposit(event) {
        window.location.href = 'apply-deposit.html';
    }

    async handleApplyRefund(event) {
        window.location.href = 'apply-refund.html';
    }

    async handleSelectAccount(event) {
        const [cc, formatedBalance] = event.target.value.split('@');
        $('#dashboard-account-number').text(cc);
        $('#dashboard-balance').text(formatedBalance);
        try {
            const extracts = await recordService.getExtracts({ cc });
            const items = extracts.map(extract => {
                const arrowStyle = extract.type === 'deposit' || !extract.fromAccount ? 'success' : 'danger';
                return `
                <tr>
                <td>${extract.type}</td>
                <td><small class="text-${arrowStyle} mr-1"><i class="fas fa-arrow-up"></i></small> ${extract.formatedValue}</td>
                <td>123123213123-31231</td>
                </tr>`;
            });
            $('#dashboard-table').html(items.join());
        } catch (err) {
            console.error(err.message)
        }
    }

    populateFields(user) {
        $('#dashboard-name').text(`${user.firstName} ${user.lastName}`);
        $('#dashboard-username').text(user.username);
        $('#dashboard-balance').text('-');
        $('#dashboard-account-number').text('-');
    }

    populateAccountDropdown(accounts) {
        const options = accounts.map((account, index) => {
            let selected = '';
            if(index ===0){
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