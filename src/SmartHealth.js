import React, { Component } from 'react';

import _ from 'lodash';

import {getPatient, getConditions} from './services/fhir_service';

import './SmartHealth.css';

export default class SmartHealth extends Component {
    state = {
        name: '',
        gender: '',
        birthDate: '',
        conditions: [],
        loading: 0
    };

    handleIdSearch() {
        if (!_.isEmpty(this.idSearch.value)) {
            this.setState({loading: 1});
            _.delay(async () => {
                let patient = await getPatient(this.idSearch.value);
                let conditions = await getConditions(this.idSearch.value);

                this.setState({
                    name: this._extract.name(patient),
                    gender: this._extract.gender(patient),
                    birthDate: this._extract.birthDate(patient),
                    conditions: conditions.entry,
                    loading: 2
                });
            }, 1500);
        } else {
            this.setState({
                name: '',
                gender: '',
                birthDate: '',
                conditions: [],
                loading: 0
            });
        }
    }

    _extract = {
        name: result => {
            let given = _.get(result, 'entry[0].resource.name[0].given[0]');
            let family = _.get(result, 'entry[0].resource.name[0].family[0]');

            return `${given} ${family}`
        },
        gender: result => {
            return _.get(result, 'entry[0].resource.gender');
        },
        birthDate: result => {
            return _.get(result, 'entry[0].resource.birthDate');
        }
    }

  render() {
    let {name, gender, birthDate, conditions, loading} = this.state;

    const getMoreInfo = text => {
        return `https://www.ncbi.nlm.nih.gov/pubmed/?term=${text}`;
    }

    return (
      <div className="SmartHealth">
            <p>Enter patient ID:</p>
            <p>(example: 4342009)</p>
            <input ref={input => this.idSearch = input}
                   onChange={e => this.handleIdSearch()}
                   className="idSearchInput"
            />
            {loading === 1 && <div className="patientInfo">
                <p>Loading...</p>
            </div>}
            {loading === 2 && <div className="patientInfo">
                <p>{name}</p>
                <p>{_.startCase(gender)}</p>
                <p>{birthDate}</p>

                <table>
                    <thead>
                        <tr>
                            <th className="narrowCell">Date</th>
                            <th>Condition</th>
                            <th className="narrowCell">More Info</th>
                        </tr>
                    </thead>
                    <tbody>
                    {conditions.map((condition, index) => 
                        <tr key={index}>
                            <td className="narrowCell">{condition.resource.dateRecorded}</td>
                            <td>{condition.resource.code.text}</td>
                            <td className="narrowCell"><a href={getMoreInfo(condition.resource.code.text)}
                                   target="_blank">PubMed</a>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>}
      </div>
    );
  }
}
