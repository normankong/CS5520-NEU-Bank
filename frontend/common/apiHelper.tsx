var myHeaders = new Headers();
myHeaders.set('Accept', 'application/json');
myHeaders.set('Content-Type', 'application/json');
myHeaders.set('Cache-Control', 'no-cache');

import apiConfig from './apiConfig';

class ApiHelper{
    
    getAccountSummary = async () => {
        let url = apiConfig.account.summary;
        const json = await this.fetch(url, {
            method: 'GET',
            headers: myHeaders
        });
        return json;
    }

    getAccountTransaction = async (item) => {
        let accountNumber = item.accountNumber;
        let url = apiConfig.account.history + "?accountNumber="+accountNumber;

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
