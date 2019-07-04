import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,ImageBackground,
  ActivityIndicator
} from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardAwareListView
} from "react-native-keyboard-aware-scrollview";
import { connect } from "react-redux";
import { TabNavigator, NavigationActions } from "react-navigation";
import DatePicker from "react-native-datepicker";
import Picker from "react-native-picker";
import Moment from "moment";

import { Card, CardSection, Button, CustomPicker } from "../../components";
import Input from "../../components/Input/Input";
import { SignUpStyle } from "./SignUpStyle";
import { Images, Colors, Styles } from "../../theme";
import {
  apiCall,
  facebookLogin,
  registerFacebookLogin
} from "./../../services/AuthService";
import {
  getCurrentLocation,
  fetchNearByLocation
} from "./../../services/LocationService";
import { alert } from "./../../services/AlertsService";
import {
  storeUser,
  storeToken,
  saveData
} from "./../../services/StorageService";
import { navigateTo } from '../../services/CommonFunctions';
import { setUserData, setToken, updateLoading } from "../../actions";
import { Dimensions } from 'react-native';

var pickerStatus = 0;

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      username: "",
      dateofbirth: "", //Aug-16-2017
      gender: "Gender",
      // name: "Riya",
      // email: "rupalpatel0008+b@gmail.com",
      // password: "Simform.123",
      // username: "rupal_b",
      // dateofbirth: "Aug-01-1995", //Aug-16-2017
      // gender: "Female",
      socialId: "",
      profileImageUrl: "",
      loading: false,
      email_error: "",
      password_error: "",
      username_error: "",
      name_error: "",
      dateofbirth_error: "",
      gender_error: "",
      disableLoginWithFacebook: false
    };
  }

  //handle input change on fields
  handleChange(name, error_name, fieldName, value) {
    
    this.setState({
      [name]: value
    });
  }

  //validation of input field
  // validation(name, fieldName, value) {
  //   if (value == '') {
  //     this.setState({
  //       [name]: `${fieldName} is required.`
  //     })
  //   } else {
  //     this.setState({
  //       [name]: ''
  //     })
  //   }
  // }

  openPicker(selectedGender) {
    let genderData = ["Male", "Female"];

    if (pickerStatus != 1) {
      Picker.init({
        pickerData: genderData,
        selectedValue: [selectedGender],
        pickerConfirmBtnText: "Select",
        pickerConfirmBtnColor: [255, 255, 255, 1],
        pickerCancelBtnText: "Cancel",
        pickerCancelBtnColor: [255, 255, 255, 1],
        pickerTitleText: "Gender",
        pickerTitleColor: [255, 255, 255, 1],
        pickerToolBarBg: [0, 0, 0, 1],
        onPickerConfirm: data => {
          if (data[0] == "Gender") {
            this.handleChange("gender", "gender_error", "Gender", "Male");
          } else {
            this.handleChange("gender", "gender_error", "Gender", data[0]);
          }
          pickerStatus = 0;
        },
        onPickerCancel: data => {
          pickerStatus = 0;
        }
      });
      Picker.show();
      pickerStatus = 1;
    } else {
    }
  }

  // Login With Facebook
  loginWithFacebook() {
    this.setState({ disableLoginWithFacebook: true });
    setTimeout(() => {
      this.setState({ disableLoginWithFacebook: false });
    }, 2500);
    //this.props.updateLoading(true);
    this.setState({
      loadingFacebook: true
    });
    setTimeout(() => {
      facebookLogin().then(
        facebookResponse => {
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
              this.setState({
                loadingFacebook: false
              });
              getCurrentLocation().then(currentLocation => {
                fetchNearByLocation(currentLocation);
              });
              navigateTo(this.props.navigation, 'mainStack');
            })
            .catch(error => {
              if (error == "Please send all the details.") {
                this.setState({
                  loadingFacebook: false
                });
                // go to Signup with facebook page
                navigateTo(this.props.navigation, 'SignUpWithFacebook', facebookResponse);
              } else {
                //this.props.updateLoading(false);
                this.setState({
                  loadingFacebook: false
                });
                setTimeout(() => {
                  alert("Signup Failed", error);
                }, 100);
              }
            });
        },
        error => {
          //this.props.updateLoading(false);
          this.setState({
            loadingFacebook: false
          });
          setTimeout(() => {
            alert("Signup Failed", error);
          }, 100);
        }
      );
    });
  }

  signupWithEmail() {
    let signupParams = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
      dob: this.state.dateofbirth,
      gender: this.state.gender == "Female" ? 2 : 1,
      name: this.state.name,
      provider: "local",
      isSocialLoggedIn: false,
      isOfficial: false
    };
    var emailRegEx = /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var passwordRegEx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\./\/-]).{6,}$/;
    if (
      this.state.email == "" ||
      this.state.username == "" ||
      this.state.password == "" ||
      this.state.dob == "" ||
      this.state.name == ""
    ) {
      const fieldsArr = [
        "name",
        "email",
        "password",
        "dateofbirth",
        "username"
      ];
      const fieldsArrCaps = [
        "Name",
        "Email",
        "Password",
        "Birthday",
        "Username"
      ];
      for (let i = 0; i < fieldsArr.length; i++) {
        let error_name = fieldsArr[i] + "_error";
        this.setState({
          [error_name]: ""
        });
        if (this.state[fieldsArr[i]] == "") {
          this.setState({
            [error_name]: `${fieldsArrCaps[i]} is required.`
          });
        }
      }
      // if (this.state.gender == "Gender") {
      //   debugger
      //   this.setState({
      //     gender_error: "Gender is required."
      //   });
      // }
    } 
    else if(emailRegEx.test(this.state.email) == false) {
      this.setState({ email_error: 'Incorrect email address.' });
    } else if(passwordRegEx.test(this.state.password) == false) {
      this.setState({password_error: 'Password must have one uppercase, one lowercase, one special character and one digit. And its minimum length must be 6 characters.'});
    } else {
      this.props.updateLoading(true);
      apiCall("users/signup", signupParams)
        .then(response => {
          this.props.updateLoading(false);
          navigateTo(this.props.navigation, 'ConfirmEmail', signupParams);
        })
        .catch(error => {
          this.props.updateLoading(false);
          setTimeout(() => {
            if (error.message) {
              alert("Signup Failed", error.message);
            } else {
              // alert("Signup Failed", "Failed to do signup with Satrbuds!");
            }
          });
        });
    }
  }
  goToLogin(navigation) {
    navigateTo(this.props.navigation, 'Login');
  }

  renderSignUp() {
    return (
      <CardSection>
        <Text style={SignUpStyle.LoginText}>SIGN UP</Text>
      </CardSection>
    );
  }

  renderLogin() {
    return(
    <TouchableOpacity style={SignUpStyle.signUpButton} activeOpacity={0.5}
    onPress={() =>                
    this.goToLogin()
    } backgroundColor = {Colors.clearTransparent}>
    <Text style={SignUpStyle.baseText}>Already have an account? <Text style= {{fontSize: 14,color : Colors.greenNew,	textDecorationLine: 'underline',
}}>Login</Text></Text>
    </TouchableOpacity>
    );
  }

  rednerFooter() {
    return (
      <CardSection
        style={{ marginTop: 30, width : screenWidth * 0.95, alignSelf : 'center' }}
      >
        <Text style={SignUpStyle.orText}>
          By signing up, you agree to Starbuds Terms and conditions of Use and Privacy Policy. You are also verifying you are 21 years of age or order.
          {/* </Text> */}          {/* <Text style={SignUpStyle.termsText}>  */}
        </Text>
      </CardSection>
    );
  }

  renderFacebookLogin() {
    return (
      <View>
        <CardSection style={SignUpStyle.loingFbTextContainer}>
          <Button
            disabled={this.state.disableLoginWithFacebook || this.props.loading}
            onPress={this.loginWithFacebook.bind(this)}
            style={{ backgroundColor: Colors.secondary }}
            underlayColor={"#155fac"}
          >
            <Text style={SignUpStyle.loingFbText}>SIGN UP WITH FACEBOOK</Text>
          </Button>
          {this.state.loadingFacebook && (
            <ActivityIndicator
              animating
              size="small"
              style={{
                flex: 1,
                position: "absolute",
                bottom: 15,
                right: 10
              }}
              color={Colors.black}
            />
          )}
        </CardSection>
        <CardSection>
          <Text style={SignUpStyle.orText}>or with e-mail</Text>
        </CardSection>
      </View>
    );
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
           backgroundColor: Colors.transparent,
    flexDirection: 'column',
    alignItems: 'center'
        }}
      >
      <ImageBackground
          style={SignUpStyle.imageContainer}
          source={Images.background_image}
        >
        <KeyboardAwareScrollView
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps={"never"}
          scrollEnabled={false}
          getTextInputRefs={() => {
            return [this.email, this.password, this.username, this.name];
            //this.birthofdate,
            //this.gender
          }}
        >
          {this.renderSignUp()}
          {/* {this.renderFacebookLogin()} */}
          <View>
            {/* Name */}
            <CardSection style={{ alignItems: "center", marginTop : 20 }}>
              <Input
                icon="username"
                placeholder="Full  Name"
                onChangeText={name =>
                  this.handleChange("name", "name_error", "Name", name)
                }
                value={this.state.name}
                style={{
                  backgroundColor: this.state.name_error
                    ? Colors.errorBackgroundColor
                    : Colors.clearTransparent,
                    borderBottomWidth: 0.5,
                    borderBottomColor: Colors.white,
                    width : '85%'
                }}
                customIconStyle={{ width: 20, height: 20 , tintColor : 'white'}}
                autoCapitalize={"words"}
                inputRef={r => {
                  this.name = r;
                }}
                returnKeyType="next"
                onSubmitEditing={event => {
                  this.username.focus();
                }}
              />
              {this.state.name_error ? (
                <Text style={SignUpStyle.errorText}>
                  {this.state.name_error}
                </Text>
              ) : null}
            </CardSection>
            {/* username */}
            <CardSection style={{ alignItems: "center", marginTop: 10 }}>
              <Input
                icon="username"
                placeholder="Username"
                onChangeText={username =>
                  this.handleChange(
                    "username",
                    "username_error",
                    "Username",
                    username
                  )
                }
                value={this.state.username}
                style={{
                  backgroundColor: this.state.username_error
                    ? Colors.errorBackgroundColor
                    : Colors.clearTransparent,
                    borderBottomWidth: 0.5,
                    borderBottomColor: Colors.white,
                    width : '85%'
                }}
                customIconStyle={{ width: 20, height: 20, tintColor : 'white' }}
                inputRef={r => {
                  this.username = r;
                }}
                returnKeyType="next"
                onSubmitEditing={event => {
                  this.password.focus();
                }}
              />
              {this.state.username_error ? (
                <Text style={SignUpStyle.errorText}>
                  {this.state.username_error}
                </Text>
              ) : null}
            </CardSection>
            {/* password */}
            <CardSection style={{ alignItems: "center", marginTop: 10 }}>
              <Input
                icon="password"
                secureTextEntry
                placeholder="Password"
                onChangeText={password =>
                  this.handleChange(
                    "password",
                    "password_error",
                    "Password",
                    password
                  )
                }
                value={this.state.password}
                style={{
                  backgroundColor: this.state.password_error
                    ? Colors.errorBackgroundColor
                    : Colors.clearTransparent,
                    borderBottomWidth: 0.5,
                    borderBottomColor: Colors.white,
                    width : '85%'
                }}
                customIconStyle={{ width: 20, height: 20, tintColor : 'white' }}
                inputRef={r => {
                  this.password = r;
                }}
                returnKeyType="next"
                onSubmitEditing={event => {
                  this.email.focus();
                }}
              />
              {this.state.password_error ? (
                <Text style={SignUpStyle.errorText}>
                  {this.state.password_error}
                </Text>
              ) : null}
            </CardSection>
            {/* email */}
            <CardSection style={{ alignItems: "center", marginTop: 10 }}>
              <Input
                icon="email"
                placeholder="Email"
                onChangeText={email =>
                  this.handleChange("email", "email_error", "Email", email)
                }
                value={this.state.email}
                style={{
                  backgroundColor: this.state.email_error
                    ? Colors.errorBackgroundColor
                    : Colors.clearTransparent,
                    borderBottomWidth: 0.5,
                    borderBottomColor: Colors.white,
                    width : '85%'
                }}
                keyboardType="email-address"
                customIconStyle={{ width: 20, height: 20, tintColor : 'white' }}
                inputRef={r => {
                  this.email = r;
                }}
                returnKeyType="next"
                onSubmitEditing={event => {
                  this.datePicker.onPressDate();
                }}
              />
              {this.state.email_error ? (
                <Text style={SignUpStyle.errorText}>
                  {this.state.email_error}
                </Text>
              ) : null}
            </CardSection>
            {/* dateOfBirth */}
            <CardSection style={{ alignItems: "center", marginTop: 10 }}>
              <DatePicker
                style={[
                  SignUpStyle.datePickerStyle,
                  {
                    backgroundColor: this.state.dateofbirth_error
                      ? Colors.errorBackgroundColor
                      : Colors.clearTransparent,
                      borderBottomWidth: 0.5,
                      borderBottomColor: Colors.white,
                      width : '85%'
                  }
                ]}
                mode="date"
                date={this.state.dateofbirth}
                format="MMM-DD-YYYY"
                maxDate={Moment().format("MMM-DD-YYYY")}
                confirmBtnText="DONE"
                cancelBtnText=""
                placeholder="  Birthday"
                iconSource={Images.calender}
                customStyles={SignUpStyle.datePickerCustomStyle}
                onDateChange={date => {
                  this.handleChange(
                    "dateofbirth",
                    "dateofbirth_error",
                    "Date",
                    date
                  );
                }}
                
                ref={picker => {
                  this.datePicker = picker;
                }}
              />
              {this.state.dateofbirth_error ? (
                <Text style={SignUpStyle.errorText}>
                  {this.state.dateofbirth_error}
                </Text>
              ) : null}
            </CardSection>
            {/* gender */}
            {/* <CardSection style={{ alignItems: "center", marginTop: 2 }}>
              <View
                style={[
                  SignUpStyle.genderContainerStyle,
                  {
                    backgroundColor: this.state.gender_error
                      ? Colors.errorBackgroundColor
                      : Colors.clearTransparent,
                      borderBottomWidth: 0.5,
                      borderBottomColor: Colors.white,
                      width : '85%'
                  }
                ]}
              >
                <Image source={Images.username} style={SignUpStyle.iconStyle2} />
                <Text
                  style={[SignUpStyle.genderText, { color: genderColor }]}
                  onPress={() => this.openPicker(this.state.gender)}
                >
                  {this.state.gender}
                </Text>
              </View>
              {this.state.gender_error ? (
                <Text style={SignUpStyle.errorText}>
                  {this.state.gender_error}
                </Text>
              ) : null}
            </CardSection> */}

            <CardSection  style={{ paddingLeft: 50, paddingRight: 50, paddingTop: 15,		alignSelf: 'center'}}>
              <Button
                disabled={this.props.loading || this.state.loadingFacebook}
                onPress={() => {
                  this.signupWithEmail();
                }}
                style={{ backgroundColor: Colors.white, width: 130, borderRadius: 5 }}
                >
                <Text style={SignUpStyle.btnText}>SIGN UP</Text>
              </Button>
              {this.props.loading && (
                <ActivityIndicator
                  animating
                  size="small"
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                    position: "absolute",
                    top: "33%",
                    right: 10
                  }}
                  color={Colors.white}
                />
              )}
            </CardSection>
          </View>
          {this.renderLogin()}
          {this.rednerFooter()}

        </KeyboardAwareScrollView>
        </ImageBackground>
      </View>
    );
  }
}

const backAction = NavigationActions.back({
  key: null
});

SignUp.navigationOptions = ({ navigation }) => ({
  title: "SIGN UP",
  headerTitleStyle: Styles.headerTitleStyle,
  headerStyle: Styles.headerStyle,
  headerLeft: (
    <TouchableOpacity
      onPress={() => {
        DeviceEventEmitter.emit("backToGetStart", true);
        navigation.dispatch(backAction);
      }}
      style={Styles.headerLeftContainer}
      activeOpacity={0.5}
    >
      <Image
        source={Images.backButton}
        style={[Styles.headerLeftImage, { height: 15, width: 8 }]}
      />
    </TouchableOpacity>
  ),
  headerRight: <Text />
});

const mapStateToProps = ({ authReducer }) => {
  const { userData, loading, token } = authReducer;
  return { userData, loading, token };
};
export default connect(mapStateToProps, {
  setUserData,
  setToken,
  updateLoading
})(SignUp);
