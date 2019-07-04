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

export default class MentionsTextInput extends Component {
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

  componentWillMount() {
    this.setState({
      textInputHeight: this.props.textInputMinHeight
    })
  }

  onChangeText(val) {
    this.props.onChangeText(val); // pass changed text back
  }

  render() {
    return (
      <TextInput
        {...this.props}
        value={this.props.inputValue}
        onContentSizeChange={(event) => {
          this.setState({
            textInputHeight: this.props.textInputMinHeight >= event.nativeEvent.contentSize.height ? this.props.textInputMinHeight : event.nativeEvent.contentSize.height + 10,
          });
        }}
        ref={component => this._textInput = component}
        onChangeText={this.onChangeText.bind(this)}
        multiline={true}
        style={[{ ...this.props.textInputStyle }, { height: Math.min(this.props.textInputMaxHeight, this.state.textInputHeight) }]}
        placeholder={this.props.placeholder ? this.props.placeholder : 'Write a comment...'}
      />
    )
  }
}

MentionsTextInput.propTypes = {
  textInputStyle: TextInput.propTypes.style,
  textInputMinHeight: PropTypes.number,
  textInputMaxHeight: PropTypes.number,
  inputValue: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
};

MentionsTextInput.defaultProps = {
  textInputStyle: { borderColor: '#ebebeb', borderWidth: 1, fontSize: 15 },
  textInputMinHeight: 30,
  textInputMaxHeight: 80,
}
