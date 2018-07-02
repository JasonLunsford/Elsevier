import React, {Component} from 'react';

import _ from 'lodash';
import axios from 'axios';

export default class FhirService extends Component {
    sandboxConfig = {
        method:  'get',
        baseURL: 'https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca',
        responseType: 'json+fhir'
    };

    async getPatient(id) {
        let config = _.assign({}, this.sandboxConfig, {
            url: 'Patient',
            params: {
                _id: id
            }
        });

        let result = await axios(config);

        return {
            name: this._extract.name(result),
            gender: this._extract.gender(result),
            birthDate: this._extract.gender(result)
        }

    }

    _extract = {
        name: result => {
            let given = _.get(result, 'name.given[0]');
            let family = _.get(result, 'name.family[0]');

            return `${given} ${family}`;
        },
        gender: result => {
            return _.get(result, 'gender')
        },
        birthDate: result => {
            return _.get(result, 'birthDate')
        }
    }
}