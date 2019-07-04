import { Dimensions } from 'react-native';
import { Colors } from './../../theme/Colors';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const FindFacebookFriendStyle = {
	pageContainer: {
		flex: 1,
		backgroundColor: Colors.black,
		flexDirection: 'column',
		alignItems: 'center'
	},
	imageContainer: {
    height: screenHeight,
    width: screenWidth,
    backgroundColor: Colors.white,
  },
	group1: {
		marginTop: (screenWidth >= 414 && screenHeight >= 736) ? (screenHeight / 6) : (screenHeight / 5) ,
		alignItems: 'center'

	},
	group2: {
		marginTop: 60
	},
	group3: {
		marginTop: 32,
		width : 250,
		alignSelf: "center"
	},
	group4: {
		position: 'absolute',
		bottom: 30,
		alignItems: 'center',
		alignSelf: "flex-end",
		paddingRight : 30
	},
	headerImage: {
		height: 81.3,
		width: 81.3
	},
	titleStyle: {
		fontSize: 20.1,
		color: Colors.white,
		letterSpacing: 1,
		textAlign: 'center',
		fontWeight: 'bold',
		lineHeight: 31,
		paddingLeft: (screenWidth >= 414 && screenHeight >= 736) ? 40 : 20,
		paddingRight: (screenWidth >= 414 && screenHeight >= 736) ? 40 : 20,
		paddingBottom: 5,
		fontFamily: 'ProximaNova-Bold',
		backgroundColor : Colors.clearTransparent
	},
	textStyle: {
		fontSize: 16,
		color: Colors.white,
		textAlign: 'center',
		lineHeight: 21,
		letterSpacing: 0.8,
		paddingLeft: (screenWidth >= 414 && screenHeight >= 736) ? 25 : 20,
		paddingRight: (screenWidth >= 414 && screenHeight >= 736) ? 25 : 20,
		fontFamily: 'ProximaNova-Light',
		backgroundColor : Colors.clearTransparent

	},
	buttonText: {
		color: Colors.white,
		fontSize: 16,
		// lineHeight: 25,
		letterSpacing: 0.8,
		paddingTop: 4,
		paddingBottom: 4,
		paddingLeft: 10,
		paddingRight: 10,
		fontFamily: 'ProximaNova-Bold'
	},
	skipText: {
		//fontSize: 12,
		color: Colors.white,
		textAlign: 'center',
		// lineHeight: 21,
		// letterSpacing: 0.6,
		// fontFamily: 'ProximaNova-Regular',
		backgroundColor : Colors.clearTransparent
	}
};
