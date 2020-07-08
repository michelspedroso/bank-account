import Page from './../utils/Page';
import userService from './../services/user'
import recordService from './../services/record'
import record from './../services/record';

class DashboardPage extends Page {
    init() {
        this.getDetail();
    }

    binds() {
        // $('.dropdown-item dashboard-dropdown-item').on('click', this.handleSelectAccount.bind(this));
        // $('ul li').forEach(element => element.addEventListener('click', this.handleSelectAccount.bind(this)));
        // $('#dashboard-menu-accounts')[0].addEventListener("click", function(e) {
        //     if (e.target && e.target.matches("li.nav-item")) {
        //       e.target.className = "foo"; // new class name here
        //       alert("clicked " + e.target.innerText);
        //     }
        //   });
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

    async handleSelectAccount(event) {
        const cc = event.target.value;
        try {
            const extracts = await recordService.getExtracts({ cc });
            const items = extracts.map(extract => {
                return `
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                `
            });
            $('#dashboard-table').html(items.join(''));
        } catch (err) {

        }
    }

    populateFields(user) {
        $('#dashboard-name').text(`${user.firstName} ${user.lastName}`);
        $('#dashboard-username').text(user.username);
        $('#dashboard-balance').text(user.accounts.length ? user.accounts[0].formattedBalance : 'R$ 0,00');
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