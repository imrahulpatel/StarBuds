/**
 * @file index.js
 * 
 * Simple js based offline placeholder for react native unitl defaultSource support 
 * is added to android
 */ 
import React, { Component, PropTypes } from 'react';
import {
	Animated,
    View,
	Image
} from 'react-native'; 
export default class OfflinePlaceholder extends Component{
    constructor(props){
        super(props);
        this.state = {
             thumbnailOpacity: new Animated.Value(0),
             imageLoaded:false
        }
    }
    onLoad(){
        // console.log("on load called");
       this.setState({imageLoaded:true});
        Animated.timing(this.state.thumbnailOpacity,{
            toValue: 0,
            duration : 250
        }).start()
    }
    onThumbnailLoad(){
        // console.log("on thumbnail load called")
        if(!this.state.imageLoaded){
        Animated.timing(this.state.thumbnailOpacity,{
            toValue: 1,
            duration: 150
        }).start();
        }
    }
    render(){
        return (
            <View
            key={'parentImageView'}
            width={this.props.style.width}
            height={this.props.style.height}
            backgroundColor={'#ffffff'}
            >    
                <Animated.Image
                   key = {this.props.imageKey+'image'}
                   resizeMode={this.props.resizeMode}
                   style = {[
                       {
                           position: 'absolute'
                       },
                       this.props.style
                   ]}
                   source = {this.props.source}
                   onLoad = {(event)=>this.onLoad(event)}
                />
                <Animated.Image 
                 resizeMode={this.props.thumbnailresizeMode}
                 key={this.props.imageKey+'thumbnail'}
                 style={[
                     {
                         opacity: this.state.thumbnailOpacity
                     },
                     this.props.style
                 ]}
                 source={this.props.thumbnail}
                 onLoad={(event) => this.onThumbnailLoad(event)}
                 />
            </View>
        )
    }
}

OfflinePlaceholder.propTypes = {
    source:PropTypes.any,
    resizeMode:PropTypes.string,
    thumbnail:PropTypes.any,
    thumbnailresizeMode:PropTypes.string
}