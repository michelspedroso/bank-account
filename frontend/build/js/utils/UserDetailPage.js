import Page from './Page';
import userService from '../services/user';

class UserDetailPage extends Page {
    constructor(path) {
        super(path);
    }

    async beforeInit() {
        const user = await this.getDetail();
        if (user.accounts.length) {
            const [account] = user.accounts;
            if (this.handleSelectAccount) {
                await this.handleSelectAccount({ target: { value: `${account.cc}@${account.formattedBalance}` } });
            }
        }
        this.init();
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
                return;
            }
        }
    }

    populateFields(user) {
        $('#dashboard-name').text(`${user.firstName} ${user.lastName}`);
        $('#dashboard-username').text(user.username);
        if (user.accounts.length) {
            $('#dashboard-cpf-label').text(user.accounts[0].cpf);
        }
        $('#dashboard-balance').text('-');
        $('#dashboard-account-number').text('-');
        $('#dashboard-account-transactions').text(0);
    }

    populateAccountDropdown(accounts) {
        const options = accounts.map((account, index) => {
            console.log(this.getSelectedAccount())
            let selected = this.getSelectedAccount() || false;
            if (selected && selected == account.cc) {
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
}

export default UserDetailPage;
