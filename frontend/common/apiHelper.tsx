var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');

import apiConfig from './apiConfig';

class ApiHelper{
    
    getAccountSummary = async () => {
        const acctSum = await this.fetch(apiConfig.account.summary, {
            method: 'GET',
            headers: myHeaders
        });

        const acctTxn = await this.fetch(apiConfig.account.history, {
            method: 'GET',
            headers: myHeaders
        });

        acctSum.forEach(x => {
            let accountNumber = x.accountNumber;
            let txnAmt = acctTxn.filter(y => (y.accountNumber == accountNumber)).map(y => parseInt(y.txnAmount,10)).reduce((a,b) => a+b, 0);
            x.accountBalance = parseInt(x.accountBalance) + txnAmt;
        });

        return acctSum;
    }

    getAccountTransaction = async (item) => {
        let accountNumber = item.accountNumber;
        let url = apiConfig.account.history + "accountNumber="+accountNumber;

        const json = await this.fetch(url, {
            method: 'GET',
            headers: myHeaders
        });
        return json;
    }

    getATMBranchs = async () => {
        let url = apiConfig.common.atmBranchs

        const json = await this.fetch(url, {
            method: 'GET',
            headers: myHeaders
        });
        return json;
    }

    proceedQuickCash = async (item) => {
        let url = apiConfig.quickCash.instruction;

        const json = await this.fetch(url, {
            method: 'GET',
            headers: myHeaders
        });
        return json;
    }

    getUserInfo = async (accessToken) => {
        let url = apiConfig.google.userinfo.replace("%ACCESS_TOKEN%", accessToken);

        const json = await this.fetch(url, {
            method: 'GET',
        });
        return json;
    }

    fetch = async (url, options) => {
        console.log(`Request  : ${url}`)
        const response = await fetch(url, options);
        const json = await response.json();
        // console.log(`Response : ${JSON.stringify(json, null, 2)}`);
        return json;
    }
}

let apiHelper = new ApiHelper();
export default apiHelper;
