import React, { Component } from "react";
import { Dimensions } from 'react-native';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  DeviceEventEmitter,
  ActivityIndicator,
  ImageBackground
} from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardAwareListView
} from "react-native-keyboard-aware-scrollview";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import { Card, CardSection, Button } from "../../components";
import { LoginStyle } from "./LoginStyle";
import { Colors, Images, Styles } from "../../theme";
import Input from "../../components/Input/Input";
import {
  apiCall,
  facebookLogin,
  registerFacebookLogin
} from "./../../services/AuthService";
import {
  getCurrentLocation,
  fetchNearByLocation
} from "./../../services/LocationService";
import {
  storeUser,
  storeToken,
  saveData,
  getData
} from "./../../services/StorageService";
import { registerPushToken } from "./../../services/PushNotificationService";
import { setUserData, setToken, updateLoading } from "../../actions";
import { alert } from "./../../services/AlertsService";
import { navigateTo } from '../../services/CommonFunctions';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      email_error: "",
      password_error: "",
      disableLoginWithFacebook: false,
      disableLogin: false,
      loadingFacebookLogin: false,
      loadingEmailLogin: false,
    };
    this.focusNextField = this.focusNextField.bind(this);
    this.inputs = {};
  }

  focusNextField(id) {
    this.inputs[id].focus();
  }

  //handle input change on fields
  handleChange(name, value) {
    // if (value != '') {
    //   this.setState({
    //     [error_name]: ''
    //   })
    // } else {
    //   this.setState({
    //     [error_name]: `${fieldName} is required`
    //   })
    // }
    this.setState({
      [name]: value
    });
  }

  validation(name, fieldName, value) {
    if (value == "") {
      this.setState({
        [name]: `${fieldName} is required`
      });
    } else {
      this.setState({
        [name]: ""
      });
    }
  }

  // Login With Facebook
  loginWithFacebook() {
    this.setState({ loadingFacebookLogin: true, disableLoginWithFacebook: true }, () => {
      this.props.navigation.setParams({ disableBack: true });
      facebookLogin()
        .then(facebookResponse => {
          this.props.navigation.setParams({ disableBack: true });
          saveData("facebookFriends", facebookResponse.friends);
          registerFacebookLogin({
            socialId: facebookResponse.socialId,
            isSocialLoggedIn: true,
            provider: "facebook",
            profileImageUrl: facebookResponse.profileImageUrl,
            isFullDetail: false,
            thumbnail: facebookResponse.profileImageUrl
          })
            .then(response => {
              storeUser(response);
              this.props.setUserData(response.user);
              this.props.setToken(response.token);
              getData("deviceToken").then(deviceToken => {
                registerPushToken(
                  deviceToken.token,
                  deviceToken.os,
                  response.user,
                  response.token
                );
              });
              this.setState({ loadingFacebookLogin: false, disableLoginWithFacebook: false }, () => {
                this.props.navigation.setParams({ disableBack: false });
                getCurrentLocation().then(currentLocation => {
                  fetchNearByLocation(currentLocation);
                });
                navigateTo(this.props.navigation, 'mainStack')
                // To test discover buddies
                // navigateTo(this.props.navigation, 'DiscoverBuddies', {
                //   friends: [],
                //   connected: false
                // });
              });
            })
            .catch(error => {
              this.setState({ loadingFacebookLogin: false, disableLoginWithFacebook: false }, () => {
                this.props.navigation.setParams({ disableBack: false });
                if (error == "Please send all the details.") {
                  // go to Signup with facebook page
                  navigateTo(this.props.navigation, 'SignUpWithFacebook', facebookResponse)
                } else {
                  alert("Login Failed", error);
                }
              });
            });
        })
        .catch(error => {
          this.setState({ loadingFacebookLogin: false, disableLoginWithFacebook: false }, () => {
            this.props.navigation.setParams({ disableBack: false });
            //alert("Login Failed", error);
          });
        });
    });
  }

  // Login with Email
  loginWithEmail = () => {
    this.setState({ loadingEmailLogin: true }, () => {
      if (this.state.email == "" && this.state.password == "") {
        this.setState({
          email_error: "Username or email required.",
          password_error: "Password is required.",
          loadingEmailLogin: false
        });
      } else if (this.state.email == "" && this.state.password != "") {
        this.setState({
          email_error: "Username or email required.",
          password_error: "",
          loadingEmailLogin: false
        });
      } else if (this.state.email != "" && this.state.password == "") {
        this.setState({
          email_error: "",
          password_error: "Username or email required.",
          loadingEmailLogin: false
        });
      } else {
        this.setState({ disableLogin: true }, () => {
          this.props.navigation.setParams({ disableBack: true });
          let loginData = {
            name: this.state.email,
            password: this.state.password
          };
          apiCall("users/signin", loginData).then(
            response => {
              storeUser(response.result);
              this.props.setUserData(response.result.user);
              this.props.setToken(response.result.token);
              getData("deviceToken").then(deviceToken => {
                registerPushToken(
                  deviceToken.token,
                  deviceToken.os,
                  response.result.user,
                  response.result.token
                );
              });
              this.props.navigation.setParams({ disableBack: false });
              getCurrentLocation().then(currentLocation => {
                fetchNearByLocation(currentLocation);
              });
              this.setState({ loadingEmailLogin: false, disableLogin: false }, () => {
                navigateTo(this.props.navigation, 'mainStack')
              });
            },
            error => {
              this.setState({ loadingEmailLogin: false, disableLogin: false }, () => {
                this.props.navigation.setParams({ disableBack: false });
                setTimeout(() => {
                  if (error.message) {
                    alert("Login Failed", error.message);
                  } else {
                    //alert("Login Failed", "Someting want to wrong please try again.");
                  }
                });
              });
            }
          );
        })
      }
    });
  };



  renderOrText() {
    return (
      <CardSection>
        <Text style={LoginStyle.orText}>or log in with</Text>
      </CardSection>
    );
  }

  renderForgotPassword() {
    return (
      <CardSection style={{ paddingTop: 15 }}>
        <Text
          style={LoginStyle.orText}
          onPress={() => {
            navigateTo(this.props.navigation, 'ForgotPassword')
          }}
        >
          Forgot your password?
        </Text>
      </CardSection>
    );
  }

  render() {
    return (

      <Card>
        <KeyboardAwareScrollView
          contentContainerStyle={LoginStyle.wrapper}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps={"always"}
          extraHeight={500}
          getTextInputRefs={() => {
            return [this.username, this.password];
          }}
          innerRef={ref => {
            this.scroll = ref;
          }}
        >


          <CardSection style={{ alignItems: "stretch" }} contentContainerStyle={LoginStyle.wrapper}>
            <Input
              icon="mail"
              placeholder="Email"
              onChangeText={email => this.handleChange("email", email)}
              style={{
                backgroundColor: this.state.email_error
                  ? Colors.errorBackgroundColor
                  : Colors.transparent,
                borderBottomColor: Colors.white,
                borderBottomWidth: 1,
                marginRight: 10,
                marginLeft: 10,
              }}
              value={this.state.email}
              keyboardType="email-address"
              customIconStyle={{ width: 15, height: 15.7 }}
              inputRef={r => {
                this.username = r;
              }}
              returnKeyType="next"
              onSubmitEditing={event => {
                this.password.focus();
              }}
              onFocus={() => { }}
            />
            {this.state.email_error ? (
              <Text style={LoginStyle.errorText}>{this.state.email_error}</Text>
            ) : null}
          </CardSection>
          <CardSection style={{ alignItems: "stretch", marginTop: 2 }}>
            <Input
              icon="password"
              secureTextEntry
              placeholder="Password"
              onChangeText={password => this.handleChange("password", password)}
              style={{
                backgroundColor: this.state.password_error
                  ? Colors.errorBackgroundColor
                  : Colors.transparent,
                borderBottomColor: Colors.white,
                borderBottomWidth: 1,
                marginRight: 10,
                marginLeft: 10,
              }}
              value={this.state.password}
              customIconStyle={{ width: 12, height: 15.3 }}
              inputRef={r => {
                this.password = r;
              }}
              returnKeyType="go"
              onSubmitEditing={this.loginWithEmail}
            />
            {this.state.password_error ? (
              <Text style={LoginStyle.errorText}>
                {this.state.password_error}
              </Text>
            ) : null}
          </CardSection>

          <CardSection style={LoginStyle.btnTextContainer}>
            <Button
              disabled={this.state.disableLogin || this.state.disableLoginWithFacebook}
              onPress={this.loginWithEmail}
              style={{ backgroundColor: Colors.white, width: 130, borderRadius: 5 }}
            >
              <Text style={LoginStyle.btnText}>LOGIN</Text>
            </Button>
            {this.state.loadingEmailLogin && (
              <ActivityIndicator
                animating
                size="small"
                style={{
                  position: "absolute",
                  top: 32,
                  right: 10,
                }}
                color={Colors.black}
              />
            )}
          </CardSection>
          {this.renderForgotPassword()}
          {this.renderOrText()}
          {/* {this.renderFacebookLogin()} */}
        </KeyboardAwareScrollView>
      </Card>
    );
  }
  renderFacebookLogin() {
    return (
      <CardSection style={LoginStyle.loingFbTextBtnContainer}>
        <Button
          disabled={this.state.disableLoginWithFacebook || this.state.disableLogin}
          onPress={this.loginWithFacebook.bind(this)}
          style={{ backgroundColor: Colors.secondary, borderRadius: 5 }}
          underlayColor={"#155fac"}
        >
          <Text style={LoginStyle.loingFbText}>LOG IN WITH FACEBOOK</Text>
        </Button>
        {this.state.loadingFacebookLogin && (
          <ActivityIndicator
            animating
            size="small"
            style={{
              position: "absolute",
              top: 70,
              right: 10,
            }}
            color={Colors.black}
          />
        )}
      </CardSection>
    );
  }

}



const backAction = NavigationActions.back({
  key: null
});

//  Login.navigationOptions = ({ navigation }) => ({

//   headerTitleStyle: Styles.headerTitleStyle,
//   headerStyle: Styles.headerStyle,
//   headerLeft: (
//     <TouchableOpacity
//       onPress={() => {
//         //if(!navigation.state.params.disableBack){
//         DeviceEventEmitter.emit("backToGetStart", true);
//         navigation.dispatch(backAction);
//         //}
//       }}
//       style={Styles.headerLeftContainer}
//       activeOpacity={0.5}
//     >
//       <Image
//         source={Images.backButton}
//         style={[Styles.headerLeftImage, { height: 15, width: 8 }]}
//       />
//     </TouchableOpacity>
//   ),
//   headerRight: <Text />
//  });
const mapStateToProps = ({ authReducer }) => {
  const { userData, loading, token } = authReducer;
  return { userData, loading, token };
};
export default connect(mapStateToProps, {
  setUserData,
  setToken,
  updateLoading
})(Login);
