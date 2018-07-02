import _ from 'lodash';
import axios from 'axios';

const sandboxConfig = {
    method:  'get',
    baseURL: 'https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca',
    responseType: 'json+fhir'
};

export const getPatient = async id => {
    let customConfig = {
        url: 'Patient',
        params: {
            _id: id
        }
    };

    return await callFhirServer(customConfig);
}

export const getConditions = async id => {
    let customConfig = {
        url: 'Condition',
        params: {
            patient: id
        }
    };

    return await callFhirServer(customConfig);
}

const callFhirServer = async customConfig => {
    let result;
    let config = _.assign({}, sandboxConfig, customConfig);

    try {
        result = await axios(config);
    } catch (error) {
        throw error;
    }

    if (result.status === 200) {
        return result.data;
    } else {
        throw new Error(`Payload failure. Status code: ${result.status}`);
    }
}
