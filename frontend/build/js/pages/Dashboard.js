import Page from './../utils/Page';
import userService from './../services/user'
import recordService from './../services/record'
import record from './../services/record';

class DashboardPage extends Page {
    init() {
        this.getDetail();
    }

    binds() {
        $('#dashboard-menu-accounts').change(this.handleSelectAccount);
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
        if(extract.type === 'deposit' || !extract.fromAccount) {
            return 'success';
        }
        return 'danger';
    }

    async handleSelectAccount(event) {
        const cc = event.target.value;
        try {
            const extracts = await recordService.getExtracts({ cc });
            const _this = this;
            const items = extracts.map(extract => {
                const arrowStyle = extract.type === 'deposit' || !extract.fromAccount ? 'success' : 'danger';
                return `
                <td>${extract.type}</td>
                <td><small class="text-${arrowStyle} mr-1"><i class="fas fa-arrow-up"></i></small> ${extract.formatedValue}</td>
                <td>123123213123-31231</td>`;
            });
            $('#dashboard-table').html(items.join('\n'));
        } catch (err) {
            console.error(err)
        }
    }

    populateFields(user) {
        $('#dashboard-name').text(`${user.firstName} ${user.lastName}`);
        $('#dashboard-username').text(user.username);
        $('#dashboard-balance').text('-');
    }

    populateAccountDropdown(accounts) {
        const options = accounts.map(account => {
            return `<option value="${account.cc}">
                    ${account.type}
                </option>`;
        });
        options.unshift(`<option value="none">Select account</option>`)
        $('#dashboard-menu-accounts').html(options.join(''));
    }
};

export default new DashboardPage();