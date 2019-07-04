# react-native-offline-placeholder
Simple react native component to add offline placeholder capability to react native Image component  
Requires react-native >= 0.40.0

## Add it to your project:
Run ``` npm install --save react-native-offline-placeholder```

## Usage
```
import ProgressiveImage from 'react-native-offline-placeholder';

...
<ProgressiveImage 
    imageKey={"some_unique_key"} 
    source={{uri: item.imageurl}} 
    resizeMode={'stretch'} 
    thumbnailresizeMode={'cover'} 
    thumbnail={require("../../images/placeholder.png")} 
    style={{width:100,height:100,padding:4,alignSelf:'center'}}
    />
            
```

The usage is similar to react-native Image component except that we pass thumbnail prop for specifying offline image location in the app along with thumbnailResizeMode

## Problem statement
The basic need for developing this module was felt when I was trying to create Image component in one of my recent projects and realized that defaultSource property in react-native image component was only available in ios and my application mainly targeted android users.Most of the existing modules had an issue that if placeholder image was loaded after base image then placeholder would appear on top of main image sometimes.

You can find entire source code explained in the following article just in case you are curious:
[Technoetics article](http://technoetics.in/adding-image-placeholders-react-native-the-right-way/)

Feel free to fork the project and open any issues if you come across any problems or would like to add any features.

Last but not the least if you use the module in any of your projects then kindly star it on github to show your appreciation :D
