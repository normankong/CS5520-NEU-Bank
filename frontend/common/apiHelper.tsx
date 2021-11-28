var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');

import apiConfig from './apiConfig';

class ApiHelper {

    getAccountSummary = async (user) => {
        let owner = user.email;
        console.log(owner)
        let acctSumURL = apiConfig.account.summary
        let acctTxnURL = apiConfig.account.history
        console.log(user);
        let acctSum = await this.fetch(acctSumURL, {
            method: 'GET',
            headers: myHeaders
        });

        acctSum = acctSum.filter(x => x.Owner == owner);
        // acctSum = acctSum.concat(acctSum);

        let acctTxn = await this.fetch(acctTxnURL, {
            method: 'GET',
            headers: myHeaders
        });
        acctTxn = acctTxn.filter(x => x.Owner == owner);

        acctSum.forEach(x => {
            let accountNumber = x.accountNumber;
            let txnAmt = acctTxn.filter(y => (y.accountNumber == accountNumber)).map(y => parseInt(y.txnAmount, 10)).reduce((a, b) => a + b, 0);
            x.accountBalance = parseInt(x.accountBalance) + txnAmt;
        });

        return acctSum;
    }

    getAccountTransaction = async (user, item) => {
        let owner = user.email;
        let accountNumber = item.accountNumber;
        let acctTxnURL = apiConfig.account.history;

        let json = await this.fetch(acctTxnURL, {
            method: 'GET',
            headers: myHeaders
        });

        json = json.filter(x => x.Owner == owner).filter(x => x.accountNumber == accountNumber)

        return json;
    }

    getATMBranchs = async () => {
        let url = apiConfig.common.atmBranchs

        let json = await this.fetch(url, {
            method: 'GET',
            headers: myHeaders
        });

        json = json.map(x => {
            return {
                latlng: {
                    latitude: parseFloat(x.latitude),
                    longitude: parseFloat(x.longitude)
                },
                title: x.title,
                desc: x.desc,
                url: x.url
            }
        });

        // console.log(JSON.stringify(json, null, 4));

        return json;
    }

    proceedQuickCash = async (user, token, item) => {
        let url = apiConfig.quickCash.instruction;

        console.log(user);
        console.log(token);
        console.log(item);

        let now = new Date();
        let txnDate = now.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        })

        let reqBody = {
            apiToken: apiConfig.API_TOKEN,
            token: token,
            amount: item.amount,
            txnDate: txnDate,
            accountNumber: item.accountNumber,
            email: user.email,
            data: item.qrCode
        }

        console.log(JSON.stringify(reqBody, null, 2));

        const json = await this.fetch(url, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(reqBody)
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
        // console.log(`Response : `, response);
        return json;
    }
}

let apiHelper = new ApiHelper();
export default apiHelper;
