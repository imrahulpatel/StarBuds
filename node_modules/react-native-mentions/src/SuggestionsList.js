import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  Animated,
  TextInput,
  FlatList,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';
// import ParsedText from 'react-native-parsed-text';

export default class SuggestionsList extends Component {
  constructor() {
    super();
    this.state = {
      textInputHeight: "",
      isTrackingStarted: false,
      suggestionRowHeight: new Animated.Value(0),
      currentTrigger: "",
      currentTriggerIndex: -1
    }
    this.isTrackingStarted = false;
    this.previousChar = " ";
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.inputValue) {
      this.resetTextbox();
    } else if(this.props.inputValue !== nextProps.inputValue) {
      this.onChangeText(nextProps.inputValue);
    } else if (this.isTrackingStarted && !nextProps.horizontal && nextProps.suggestionsData[this.state.currentTriggerIndex] && nextProps.suggestionsData[this.state.currentTriggerIndex].length !== 0) {
      const numOfRows = nextProps.MaxVisibleRowCount >= nextProps.suggestionsData[this.state.currentTriggerIndex] ? nextProps.suggestionsData[this.state.currentTriggerIndex].length : nextProps.MaxVisibleRowCount;
      const height = numOfRows * nextProps.suggestionRowHeight;
      this.openSuggestionsPanel(height);
    }
  }

  startTracking(trigger) {
    this.isTrackingStarted = true;
    this.openSuggestionsPanel();
    this.setState({
      isTrackingStarted: true,
      currentTrigger: trigger,
      currentTriggerIndex: this.props.trigger.indexOf(trigger)
    })
  }

  stopTracking() {
    this.isTrackingStarted = false;
    this.closeSuggestionsPanel();
    this.setState({
      isTrackingStarted: false,
      currentTrigger: "",
      currentTriggerIndex: -1
    })
  }

  openSuggestionsPanel(height) {
    Animated.timing(this.state.suggestionRowHeight, {
      toValue: height ? height : this.props.suggestionRowHeight,
      duration: 100,
    }).start();
  }

  closeSuggestionsPanel() {
    Animated.timing(this.state.suggestionRowHeight, {
      toValue: 0,
      duration: 100,
    }).start();
  }

  updateSuggestions(lastKeyword, trigger) {
    const triggerIndex = this.state.currentTriggerIndex
    if (triggerIndex > -1) {
      this.props.triggerCallback[triggerIndex](lastKeyword);
    }
  }

  identifyKeyword(val) {
    if (this.isTrackingStarted) {
      const trigger = this.state.currentTrigger
      const boundary = this.props.triggerLocation === 'new-word-only' ? 'B' : '';
      const pattern = new RegExp(`\\${boundary}${trigger}[A-Za-z0-9_-]+|\\${boundary}${trigger}`, `gi`);
      const keywordArray = val.match(pattern);
      if (keywordArray && !!keywordArray.length) {
        this.state.currentTrigger = trigger
        const lastKeyword = keywordArray[keywordArray.length - 1];
        this.updateSuggestions(lastKeyword, trigger);
      }
    }
  }

  onChangeText(val) {
    const lastChar = val.substr(val.length - 1);
    const wordBoundry = (this.props.triggerLocation === 'new-word-only') ? this.previousChar.trim().length === 0 : true;
    if (this.props.trigger.indexOf(lastChar) > -1 && wordBoundry) {
      this.startTracking(lastChar);
    } else if (lastChar === ' ' && this.state.isTrackingStarted || val === "") {
      this.stopTracking();
    }
    this.previousChar = lastChar;
    this.identifyKeyword(val);
  }

  resetTextbox() {
    this.previousChar = " ";
    this.stopTracking();
    this.setState({ textInputHeight: this.props.textInputMinHeight });
  }

  render() {
    return (
      <Animated.View style={[{ ...this.props.suggestionsPanelStyle }, { height: this.state.suggestionRowHeight }]}>
        <FlatList
          keyboardShouldPersistTaps={"always"}
          horizontal={this.props.horizontal}
          ListEmptyComponent={this.props.loadingComponent}
          enableEmptySections={true}
          data={this.props.suggestionsData[this.state.currentTriggerIndex]}
          keyExtractor={this.props.keyExtractor}
          renderItem={(rowData) => { return this.props.renderSuggestionsRow[this.state.currentTriggerIndex](rowData, this.stopTracking.bind(this)) }}
        />
      </Animated.View>
    )
  }
}

SuggestionsList.propTypes = {
  suggestionsPanelStyle: ViewPropTypes.style,
  loadingComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
  ]),
  trigger: PropTypes.array.isRequired,
  triggerLocation: PropTypes.oneOf(['new-word-only', 'anywhere']).isRequired,
  inputValue: PropTypes.string.isRequired,
  triggerCallback: PropTypes.array.isRequired,
  renderSuggestionsRow: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func,
    PropTypes.element,
  ]).isRequired,
  suggestionsData: PropTypes.array.isRequired,
  keyExtractor: PropTypes.func.isRequired,
  horizontal: PropTypes.bool,
  suggestionRowHeight: PropTypes.number.isRequired,
  MaxVisibleRowCount: function(props, propName, componentName) {
    if(!props.horizontal && !props.MaxVisibleRowCount) {
      return new Error(
        `Prop 'MaxVisibleRowCount' is required if horizontal is set to false.`
      );
    }
  },
  hasChanged: PropTypes.bool.isRequired
};

SuggestionsList.defaultProps = {
  suggestionsPanelStyle: { backgroundColor: 'rgba(100,100,100,0.1)' },
  loadingComponent: () => <Text>Loading...</Text>,
  horizontal: false,
  hasChanged: false
}
