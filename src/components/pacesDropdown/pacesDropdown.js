import React from 'react'

import ReactDropdown from './dropdown';
import './pacesDropdown.scss';

const IMPERIAL_PACES = [
  {
    label: 'Slow walk (3 mph)',
    value: 20,
  },
  {
    label: 'Brisk walk (4 mph)',
    value: 15,
  },
  {
    label: 'Jog (5 mph)',
    value: 12,
  },
  {
    label: 'Run (6 mph)',
    value: 10,
  },
  {
    label: 'Fast run (7.5 mph)',
    value: 8,
  },
  {
    label: 'Very fast run (10 mph)',
    value: 6,
  },
]

const METRIC_PACES = [
  {
    label: 'Slow walk (4.8 kph)',
    value: 20,
  },
  {
    label: 'Brisk walk (6.4 kph)',
    value: 15,
  },
  {
    label: 'Jog (8 kph)',
    value: 12,
  },
  {
    label: 'Run (9.7 kph)',
    value: 10,
  },
  {
    label: 'Fast run (12.1 kph)',
    value: 8,
  },
  {
    label: 'Very fast run (16.1 kph)',
    value: 6,
  },
]

function Paces(props) {
  const { isImperial, updatePace, pace } = props

  const paces = isImperial ? IMPERIAL_PACES : METRIC_PACES

  const updateSelectedItem = ({value}) => {
    updatePace(value);
  }

  return (
    <>
      <ReactDropdown
        value={paces.find(_pace => _pace.value === pace)}
        options={paces}
        onChange={(e) => updateSelectedItem(e)}
        className="Select-dropdown"
        menuClassName="Select-dropdown__menu"
      />
    </>
  )
}

export default Paces
