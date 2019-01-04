import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { connect } from 'react-redux'
import DateHeader from './DateHeader'
import TextButton from './TextButton'
import UdaciSlider from './UdaciSlider'
import UdaciSteppers from './UdaciSteppers'
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helpers'
import { submitEntry, removeEntry } from '../utils/api'
import { addEntry } from '../actions'

function SubmitBtn({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
    >
      <Text>SUBMIT</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  }

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric)

    this.setState((state) => {
      const count = state[metric] + step

      return {
        ...state,
        [metric]: count > max ? max : count,
      }
    })
  }

  decrement = (metric) => {
    this.setState((state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step

      return {
        ...state,
        [metric]: count < 0 ? 0 : count,
      }
    })
  }

  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value,
    }))
  }

  submit = () => {
    const key = timeToString()
    const entry = this.state
    const { dispatch } = this.props

    dispatch(addEntry({
      [key]: entry,
    }))

    this.setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    }))

    // Navigate to Home

    submitEntry({ entry, key })

    // Clear local notification
  }

  reset = () => {
    const key = timeToString()
    const { dispatch } = this.props

    dispatch(addEntry({
      [key]: getDailyReminderValue(),
    }))

    this.setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    }))

    // Navigate to Home

    removeEntry(key)

    // Clear local notification 
  }

  render() {
    const metaInfo = getMetricMetaInfo()

    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons name='md-happy' size={100} />
          <Text>You already logged your information for today.</Text>
          <TextButton onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }

    return (
      <View>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map(key => {
          const { getIcon, type, ...rest } = metaInfo[key]
          const value = this.state[key]

          return (
            <View key={key}>
              {getIcon()}
              {type === 'slider'
                ? <UdaciSlider
                    value={value}
                    onChange={(value) => this.slide(key, value)}
                    {...rest}
                  />
                : <UdaciSteppers
                    value={value}
                    onIncrement={() => this.increment(key)}
                    onDecrement={() => this.decrement(key)}
                    {...rest}
                  />
              }
            </View>
          )
        })}
        <SubmitBtn onPress={this.submit} />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const key = timeToString()

  return {
    alreadyLogged: state && state[key] && !state[key].today,
  }
}

export default connect(mapStateToProps)(AddEntry)
