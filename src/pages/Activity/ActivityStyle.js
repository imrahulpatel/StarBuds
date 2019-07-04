import { Dimensions } from "react-native";
import { Colors } from "./../../theme";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const margin30 = screenWidth >= 414 && screenHeight >= 736 ? 30 : 20;
const margin12 = screenWidth >= 414 && screenHeight >= 736 ? 12 : 12;
const padding14 = screenWidth >= 414 && screenHeight >= 736 ? 14 : 14;
import { isIPhoneX } from '../../services/CommonFunctions';

export const ActivityStyle = {
  iconImage: {
		height: 24,
		width: 24,
		borderRadius: 12,
		borderColor: Colors.primary
	},
	iconBorderWidth: {
		borderWidth: 2
  },
  container: {
    flex: 1,
		backgroundColor: 'white',
		borderTopColor: "rgba(255, 255, 255, 0.11)",
		borderTopWidth: 0.7,
	},
	listRow: {
		flex: 1,
		flexDirection: 'row',
		// paddingVertical: padding14,
	},
	listrowLeft: {
		flex: 0.15,
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: margin30/2
	},
	listBottomBorderContainer: {
		flex: 0.85,
		flexDirection: 'row',
		// paddingBottom: 15,
		borderBottomWidth: 0.7,
		borderBottomColor: 'white',
		marginLeft: margin12,
	},
	middle: {
		flex: 0.7,
		justifyContent: 'center',
		marginRight: margin12,
		marginVertical: margin12,
	},
	listRowRight: {
		flex: 0.3,
		justifyContent: 'center',
		alignItems: 'flex-end',
		marginRight: margin30
	},
	singleProfileImageInList: {
		height: 43.2,
		width: 43.2,
		borderRadius: 21.6,
	},
	usernameInList: {
		fontFamily: 'SourceSansPro-Regular',
		fontSize: 14,
		letterSpacing: 0,
		color: Colors.black,
	},
	textInList: {
		fontFamily: 'OpenSans-Bold',
		fontSize: 12,
		lineHeight:19,
		letterSpacing: 0,
		color: 'rgb(118, 129, 150)',
	},
	postImage: {
		height: 52.7,
		width: 52.7,
	},
	sepratorStyle: {
		height: 1,
		width: "100%",
		backgroundColor: "rgba(255, 255, 255, 0.09)",
		marginLeft: screenWidth / 0.85
	},
	followButtonFollowing: {
		height: 30,
		width: screenWidth >= 414 && screenHeight >= 736 ? 105 : screenWidth >= 360 && screenHeight >= 736 ? 100 : 80,
		backgroundColor: 'rgb(224,226,231)',
		borderRadius:5, 
		alignSelf: 'flex-end'
	},
	followButton: {
		height: 30,
		width: screenWidth >= 414 && screenHeight >= 736 ? 105 : screenWidth >= 360 && screenHeight >= 736 ? 100 : 80,
		backgroundColor: 'rgb(126,211,33)',
		borderRadius:5, 
		alignSelf: 'flex-end'
	},
	followButtonText: {
		fontSize: screenWidth >= 414 && screenHeight >= 736 ? 14.1 : 12,
		color: 'rgb(255, 255, 255)',
		textAlign: 'center',
		lineHeight:19,
		fontFamily: 'OpenSans-Bold',
		letterSpacing: 0
	},
	followButtonTextFollowing: {
		color : 'rgb(13,14,21)',
		fontSize: screenWidth >= 414 && screenHeight >= 736 ? 14.1 : 12,
		lineHeight:19,
		textAlign: 'center',
		fontFamily: 'OpenSans-Bold',
		letterSpacing: 0
	},
	noDataContainer: {
		height: isIPhoneX() ? screenHeight - 170 : screenHeight-95,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
	},
	noDataTextHeader: {
		fontFamily: "SourceSansPro-Bold",
		fontSize: 24,
		letterSpacing: 1,
		textAlign: "center",
		color: 'white',
		marginTop: 30,
		backgroundColor : Colors.clearTransparent
	},
	noDataText: {
		fontFamily: "SourceSansPro-Regular",
		fontSize: 14,
		letterSpacing: 0.6,
		textAlign: "center",
		color: 'white',
		marginTop: 20,
		marginHorizontal: 75,
		lineHeight:20,
		width : '80%',
		alignSelf : 'center',
		backgroundColor : Colors.clearTransparent
	},
	noActivityImage: {
		marginTop : 200,
		height: 72,
		width: 72,
		tintColor : 'white',
		alignItems : 'center',
		alignSelf : 'center'

	},
	followButtonWrapper: {
		flexDirection: 'row',
		height: 30,
		justifyContent: 'center',
		alignItems: 'center'
	},
};
