import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ToastAndroid,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions} from "react-native";
import {Picker} from "@react-native-picker/picker";
import { Button } from "react-native-paper";
import storage from "@react-native-firebase/storage";
import * as ImagePicker from "expo-image-picker";
const {width} = Dimensions.get("screen")
const Upload = () => {
  const [Pic, setPic] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [productPrice, setProductPrice] = useState("");
  const [productCharity, setProductCharity] = useState("");
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const setToastMsg = (msg) => {
    ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
  };

  const removeImage = () => {
    setPic(null);
    setToastMsg("Image Removed");
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setPic(result.uri);
    }
  };
  //to upload the image to firebase
  const submitPost = async () => {

    const uploadUri = Pic;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
     const task= storage().ref(filename).putFile(uploadUri);
//add timestamp to file name
     const extension = filename.split('.').pop(); 
     const name = filename.split('.').slice(0, -1).join('.');
     filename = name + Date.now() + '.' + extension;

     setUploading(true);
     setTransferred(0);

//set transferred state
     task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });


try{
  await task;
  setUploading(false);
  Alert.alert('Image uploaded', 'Your image is uploaded to cloud storage successfully!!');
}catch(e){
  console.log(e);
  
}
setPic(null);
  }
  {/*const NameAlert = (price,charity) =>
  Alert.alert(
    "Product Price Confirmation",
    "Is " +price+ " Correct Product Price",
    "Product Charity Confirmation",
    "Is " +charity+ " Correct Product Charity Price", 
    
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () =>({
            price: productPrice,
            charity: productCharity,
          }),
      },
    ]
  );*/}
 const submit = () => {
    {/*if ( productPrice && productCharity) {
      NameAlert(productPrice);
      NameAlert(productCharity);
    } else {
     alert("All fields are mandatory");
    }*/}
    alert("Your Data is Saved successfully");
  };

  return (
    <View style={styles.mainContainer}>
      {/* <View style={styles.Image}>
        <TouchableHighlight
          style={styles.buttonText}
          onPress={pickImage}
          underlayColor="black"
        >
          <Avatar.Image
            size={100}
            source={{ "../assets/furniture.jpg;base64,": Pic }}
          />
        </TouchableHighlight>
       
      </View> */}
      

      <View
        style={{
          borderWidth: 1,
          width: 135,
          height: 135,
          borderRadius: 135,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: Pic }}
          style={{ width: 135, height: 135, borderRadius: 135, borderWidth: 1 }}
        />
      </View>
      <View style={styles.content}>
        <Button mode="contained" onPress={pickImage}>
          Pick Image
        </Button>
        <Button
          mode="contained"
          style={{ marginLeft: 23 }}
          onPress={removeImage}
        >
          Remove Image
        </Button>
      </View>
      <View>
        <Text style={styles.labels}>Enter Product Price</Text>
        <TextInput  style={styles.inputStyle} 
        value={productPrice}
          onChangeText={(Data) => setProductPrice(Data)}
        />
      </View>
      <View>
        <Text style={styles.labels}>Enter Charity Percentage in %</Text>
        <TextInput  style={styles.inputStyle}
        value={productCharity}
          onChangeText={(Data) => setProductCharity(Data)}
        />
      </View>
  
        <Text  style={styles.labels}>Choose NGO</Text>
        <Picker  style={styles.picker}
  selectedValue={selectedLanguage}
  onValueChange={(itemValue, itemIndex) =>
    setSelectedLanguage(itemValue)
  }>
  <Picker.Item label="Shahid Afridi Foundation" value="SAF" />
  <Picker.Item label="Aman Foundation" value="am" />
  <Picker.Item label="Bilqees Sarwar Foundation" value="bsf" />
  <Picker.Item label="Agha Khan Foundation" value="akf" />
  <Picker.Item label="Dar-ul-Aman" value="dua" />
</Picker>
<View>
        {uploading ? (
          <View style={styles.StatusWrapper}>
            <Text>{transferred} % Completed!</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) :(
<TouchableOpacity style={styles.buttonStyle} onPress={submitPost}>
        <Text style={styles.buttonText}>SAVE</Text>
      </TouchableOpacity>
        )}
</View>
       
</View>
    
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 30,
    textAlign: "center",
  },
  Image: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
    flexDirection: "row",
  },
  inputStyle: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 1,
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  StatusWrapper:{
    justifyContent: "center",
    alignItems: "center",
  },
  labels: {
    fontSize: 14,
    color: "#7d7d7d",
    marginTop: 10,
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  picker:{
    width:300,
    height:50,
    borderColor:"rgba(0,0,0,0.3)",
    borderWidth:2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 7,

    borderRadius: 10,
    overflow: "hidden",
  },
  buttonStyle: {
    width: width * 0.8,
    height: 45,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
export default Upload;