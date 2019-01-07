import React from 'react'
import { View, Platform } from 'react-native'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { createBottomTabNavigator, createMaterialTopTabNavigator, createAppContainer } from 'react-navigation'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import AddEntry from './components/AddEntry'
import History from './components/History'
import reducer from './reducers'
import middleware from './middleware'
import { purple, white } from './utils/colors'

const store = createStore(reducer, middleware)

const TabsConfig = {
  History: {
    screen: History,
    navigationOptions: {
      tabBarLabel: 'History',
      //tabBarIcon: ({ tintColor }) => <Ionicons name='plus-square' size={30} color={tintColor} />,
    },
  },
  AddEntry: {
    screen: AddEntry,
    navigationOptions: {
      tabBarLabel: 'Add Entry',
      //tabBarIcon: ({ tintColor }) => <FontAwesome name='plus-square' size={30} color={tintColor} />,
    },
  },
}
const TabsOptions = {
  tabBarOptions: {
    activeTintColor: Platform.OS === 'ios' ? purple : white,
  },
  style: {
    height: 56,
    backgroundColor: Platform.OS === 'ios' ? white : purple,
    shadowColor: 'rgba(0, 0, 0, 0.24)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    shadowOpacity: 1,
  },
}

// const Tabs = Platform.OS === 'ios'
//   ? createBottomTabNavigator(TabsConfig, TabsOptions)
//   : createMaterialTopTabNavigator(TabsConfig, TabsOptions)
const Tabs = createMaterialTopTabNavigator(TabsConfig, TabsOptions)

const TabsContainer = createAppContainer(Tabs)

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <View style={{height: 20}} />
          <TabsContainer />
        </View>
      </Provider>
    )
  }
}

export default App
