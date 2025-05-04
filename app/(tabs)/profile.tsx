import {StyleSheet, Text, View} from "react-native";
import {Colors} from "@/constants/Colors";
import {stylesheet} from "@/src/styles/unistyles";


export default function ProfilePage() {


    return (

        <View style={stylesheet.container}>
            <Text style={{color: Colors.light.text}}>Это страница профиля</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

    }
})