import React, { Component } from 'react';

import _ from 'lodash';
import axios from 'axios';

import './SmartHealth.css';

export default class SmartHealth extends Component {
    state = {
        name: '',
        gender: '',
        birthDate: '',
        loading: 0
    };

    sandboxConfig = {
        method:  'get',
        baseURL: 'https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca',
        responseType: 'json+fhir'
    };

    handleIdSearch() {
        if (!_.isEmpty(this.idSearch.value)) {
            this.setState({loading: 1});
            _.delay(() => {
                this.getPatient(this.idSearch.value).then(patient => {
                  this.setState({
                    name: this._extract.name(patient),
                    gender: this._extract.gender(patient),
                    birthDate: this._extract.birthDate(patient),
                    loading: 2
                  });
                });
            }, 1500);
        } else {
            this.setState({
                name: '',
                gender: '',
                birthDate: '',
                loading: 0
            });
        }
    }

    async getPatient(id) {
        let customConfig = {
            url: 'Patient',
            params: {
                _id: id
            }
        };

        return await this.callFhirServer(customConfig);
    }

    async callFhirServer(customConfig) {
        let result;
        let config = _.assign({}, this.sandboxConfig, customConfig);

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

    _extract = {
        name: result => {
            let given = _.get(result, 'entry[0].resource.name[0].given[0]');
            let family = _.get(result, 'entry[0].resource.name[0].family[0]');

            return `${given} ${family}`;
        },
        gender: result => {
            return _.get(result, 'entry[0].resource.gender')
        },
        birthDate: result => {
            return _.get(result, 'entry[0].resource.birthDate')
        }
    }

  render() {
    let {name, gender, birthDate, loading} = this.state;

    return (
      <div>
        <p>Enter patient ID:</p>
        <p>(example: 4342009)</p>
        <input ref={input => this.idSearch = input}
               onChange={e => this.handleIdSearch()}
        />
        {loading === 1 && <div>
            <p>Loading...</p>
        </div>}
        {loading === 2 && <div>
            <p>{name}</p>
            <p>{gender}</p>
            <p>{birthDate}</p>
        </div>}
      </div>
    );
  }
}
