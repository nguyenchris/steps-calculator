
import React, { useState } from 'react'
import {
  convertMilesToKilometers,
  convertStepsPerMileToStepsPerKm,
  stepsPerMileRunning,
  stepsPerMileWalking,
} from '../service';

import PacesDropdown from '../pacesDropdown/pacesDropdown.js';
import numFormat from '../../utils/numFormat';
import './calculator.scss';

const errors = [
  {
    name: 'feet',
    isActive: false,
  },
  {
    name: 'inches',
    isActive: false,
  }
]

function Calculator() {
  const [gender, setGender] = useState('Female');
  const [feet, setFootTotal] = useState('');
  const [inches, setInchTotal] = useState('');
  const [isImperial, setMetric] = useState(true);
  const [pace, setSelectedPace] = useState(20);
  const [steps, setStepTotal] = useState('');
  const [totalStepsPer, setTotalStepsPer] = useState(0);
  const [totalStepsPerDisplay, setTotalStepsPerDisplay] = useState('')
  const [totalDistance, setTotalDistance] = useState(0);
  const [errs, setErrors] = useState(errors);

  const calculate = (event) => {
    event.preventDefault();
    if (validateForm()) {
      return;
    }
    
    const stepsPer = calculateStepsPerMile();

    if (isImperial) {
      setTotalStepsPer(stepsPer);
      setTotalStepsPerDisplay('Mile');
    } else {
      setTotalStepsPer(convertStepsPerMileToStepsPerKm(stepsPer));
      setTotalStepsPerDisplay('km');
    }

    if (steps) {
      setTotalDistance(calculateDistanceFromSteps(stepsPer));
    } else {
      setTotalDistance(0);
    }

  }

  const validateForm = () => {
    let hasErrors = false;
    const updatedErrors = errs.map(_err => {
      const { name } = _err;
      if (name === 'feet') {
        if (feet === '') {
          _err.isActive = true;
          hasErrors = true;
        } else {
          _err.isActive = false;
        }
      }

      if (name === 'inches') {
        if (inches === '') {
          _err.isActive = true;
          hasErrors = true;
        } else {
          _err.isActive = false;
        }
      }
      return _err;
    })
    setErrors(updatedErrors);

    return hasErrors;
  }

  const updateHeight = ({ target }) => {
    const id = target.id;
    let value = parseInt(target.value);
    if (isNaN(value)) {
      value = '';
    }
    if (id === 'feet') {
      setFootTotal(value);
    }
    if (id === 'inches') {
      setInchTotal(value);
    }
  }

  const updatePace = (value) => {
    setSelectedPace(value)
  }

  const updateGender = (event) => {
    event.preventDefault();
    if (gender === 'Female') {
      return setGender('Male');
    }
    setGender('Female');
  }

  const updateMetrics = (event) => {
    event.preventDefault();
    setMetric(!isImperial);
  }

  const formatSteps = () => {
    const steps = document.getElementById('steps').value
    const filteredSteps = steps.replace(/,/g, '')
    return parseInt(filteredSteps);
  }

  const updateSteps = ({ target }) => {
    const value = target.value.trim();
    const formattedSteps = formatSteps();

    if ((value !== '' && !formattedSteps) || value === '') {
      return setStepTotal('');
    }

    setStepTotal(numFormat(formattedSteps));
  }

  const calculateStepsPer10k = () => {
    if (!totalStepsPer) return 0;

    return parseFloat(10000 / totalStepsPer).toFixed(2);
  }

  const calculateStepsPerMile = () => {
    const runningPace = 12;
    let stepsPerMile = 0;
    if (pace <= runningPace) {
      stepsPerMile = stepsPerMileRunning(feet, inches, pace)
    } else {
      stepsPerMile = stepsPerMileWalking(feet, inches, pace, gender)
    }
    return stepsPerMile;
  }

  const calculateDistanceFromSteps = (stepsPerMile) => {
    let distance = parseFloat(formatSteps() / stepsPerMile);

    if (!isImperial) {
      distance = convertMilesToKilometers(distance);
    }

    return distance.toFixed(2);
  }

  return (
    <>
      <div className="step-to-distance__title">
        <h3>Steps to Distance Calculator</h3>
      </div>
      <form className="step-distance__calculator" onSubmit={calculate}>

        <div className="input-group">
          <div className="input-group__label">
            <label htmlFor="gender">Gender</label>
          </div>
          <div className="select-options-pill">
            <ul onClick={updateGender}>
              <li className={`${gender === 'Female' ? 'active' : ''}`}><label htmlFor="female">Female</label></li>
              <li className={`${gender === 'Male' ? 'active' : ''}`}><label htmlFor="male">Male</label></li>
              <div className={`toggle-slide ${gender === 'Female' ? 'left' : 'right'}`}></div>
            </ul>
          </div>
        </div>

        <div className="input-group">
          <div className="input-group__label">
            <label htmlFor="height">Height</label>
          </div>
          <div className="input-group-inline">
            <div className="input-text-field">
              <div className="input-text-field__container">
                <input
                  type="text"
                  id="feet"
                  value={feet}
                  maxLength="1"
                  name="height"
                  onChange={updateHeight}
                />
                <label className="input-text-field__label" htmlFor="feet">Feet</label>
              </div>
              {errs[0].isActive && <span className="err-msg">Please enter your height in feet.</span>}
            </div>
            <div className="input-text-field">
              <div className="input-text-field__container">
                <input
                  type="text"
                  id="inches"
                  value={inches}
                  maxLength="2"
                  name="height"
                  onChange={updateHeight}
                />
                <label className="input-text-field__label" htmlFor="feet">Inches</label>
              </div>
              {errs[1].isActive && <span className="err-msg">Please enter your height in inches.</span>}
            </div>
          </div>
        </div>

        <div className="input-group">
          <div className="input-group__label">
            <label htmlFor="pace">Pace</label>
          </div>
          <PacesDropdown isImperial={isImperial} updatePace={updatePace} pace={pace} />
        </div>


        <div className="input-group">
          <div className="input-group-inline">
            <div className="input-text-field">
              <div className="input-group__label">
                <label htmlFor="steps">Steps</label>
              </div>
              <div className="input-text-field__container">
                <input
                  type="text"
                  id="steps"
                  value={steps}
                  name="steps"
                  onChange={updateSteps}
                />
              </div>
            </div>
            <div className="input-text-field">
              <div className="input-group__label">
                <label htmlFor="units">Units</label>
              </div>
              <div className="select-options-pill">
                <ul onClick={updateMetrics}>
                  <li className={`${isImperial ? 'active' : ''}`}><label htmlFor="miles">Miles</label></li>
                  <li className={`${!isImperial ? 'active' : ''}`}><label htmlFor="kms">KMs</label></li>
                  <div className={`toggle-slide ${isImperial ? 'left' : 'right'}`}></div>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <button className="submit-button" type="submit">Calculate</button>
      </form>

      {totalStepsPer ? <div className="results">
        <div className="results__container">
          <div className="results__box">
            <span className="results__header">{totalStepsPerDisplay}s per 10,000 Steps</span>
            <span className="results__result">{calculateStepsPer10k(totalStepsPer)} {totalStepsPerDisplay.toLowerCase()}s</span>
          </div>
          <div className="results__box">
            <span className="results__header">Steps Per {totalStepsPerDisplay}</span>
            <span className="results__result">{totalStepsPer} steps</span>
          </div>
          {totalDistance ? <div className="results__box">
            <span className="results__header">Distance</span>
            <span className="results__result">{totalDistance} {totalStepsPerDisplay.toLowerCase()}s</span>
          </div> : null}
        </div>
      </div> : null}
    </>
  )
}

export default Calculator
